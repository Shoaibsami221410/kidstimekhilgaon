-- =========================================================================
-- MIGRATION: 20261114_phase4_security_hardening.sql
-- DESCRIPTION: Phase 4 Comprehensive Security Hardening & Pre-Handover Fixes
-- INCLUDES:
--   1. Secure search_path = '' on all SECURITY DEFINER helper functions
--   2. Hardened public.handle_new_user() trigger with schema-qualified types & role preservation
--   3. Strict Row Level Security on public.admissions table (Admin-only SELECT/UPDATE/DELETE)
--   4. Strengthened folder-restricted upload policies on storage.objects (admission-private-docs)
--   5. Alignment of event_rsvps management to public.is_staff() (Teachers + Admins)
-- STATUS: PRODUCTION READY
-- =========================================================================

-- -------------------------------------------------------------------------
-- PART 1: HARDENED SECURITY DEFINER HELPER FUNCTIONS
-- (Fixed search_path = '' eliminates PostgreSQL search path injection vulnerabilities)
-- -------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() 
      AND role::text IN ('admin', 'super_admin')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() 
      AND role::text = 'super_admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() 
      AND role::text IN ('teacher', 'admin', 'super_admin')
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.is_super_admin() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.is_staff() TO authenticated, anon;

-- -------------------------------------------------------------------------
-- PART 2: HARDENED AUTH TRIGGER (RESOLVES SIGNUP 500 & PRIVILEGE ESCALATION)
-- -------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role, phone, created_at, updated_at)
  VALUES (
    new.id, 
    new.email, 
    pg_catalog.coalesce(new.raw_user_meta_data->>'full_name', 'Parent User'), 
    'parent'::public.user_role,
    new.raw_user_meta_data->>'phone',
    pg_catalog.now(),
    pg_catalog.now()
  )
  ON CONFLICT (id) DO UPDATE 
  SET 
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    phone = pg_catalog.coalesce(EXCLUDED.phone, public.users.phone),
    role = public.users.role, -- PRESERVE EXISTING VERIFIED ROLE, NEVER OVERWRITE WITH CLIENT ROLE
    updated_at = pg_catalog.now();

  RETURN new;
END;
$$;

-- Reattach trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- -------------------------------------------------------------------------
-- PART 3: SECURE PUBLIC.ADMISSIONS TABLE (PREVENTS APPLICANT PII LEAKS)
-- -------------------------------------------------------------------------

ALTER TABLE public.admissions ENABLE ROW LEVEL SECURITY;

-- Drop all legacy or overly permissive policies on admissions
DROP POLICY IF EXISTS "Admissions: Public Application Submission" ON public.admissions;
DROP POLICY IF EXISTS "Admissions: Admin Select Access" ON public.admissions;
DROP POLICY IF EXISTS "Admissions: Admin Update Access" ON public.admissions;
DROP POLICY IF EXISTS "Admissions: Admin Delete Access" ON public.admissions;
DROP POLICY IF EXISTS "Admissions: Admin Full Access" ON public.admissions;
DROP POLICY IF EXISTS "Admissions: Public Insert" ON public.admissions;
DROP POLICY IF EXISTS "Allow public insert on admissions" ON public.admissions;
DROP POLICY IF EXISTS "Allow public select on admissions" ON public.admissions;

-- 3.1 Allow prospective parents to submit applications anonymously
CREATE POLICY "Admissions: Public Application Submission" 
  ON public.admissions FOR INSERT 
  WITH CHECK (true);

-- 3.2 Restrict reading applicant PII and identity documents strictly to verified administrators
CREATE POLICY "Admissions: Admin Select Access" 
  ON public.admissions FOR SELECT TO authenticated
  USING (public.is_admin());

-- 3.3 Restrict updating admission status strictly to administrators
CREATE POLICY "Admissions: Admin Update Access" 
  ON public.admissions FOR UPDATE TO authenticated
  USING (public.is_admin()) 
  WITH CHECK (public.is_admin());

-- 3.4 Restrict deleting admission records strictly to administrators
CREATE POLICY "Admissions: Admin Delete Access" 
  ON public.admissions FOR DELETE TO authenticated
  USING (public.is_admin());

-- -------------------------------------------------------------------------
-- PART 4: STRENGTHEN STORAGE POLICIES (ADMISSION-PRIVATE-DOCS)
-- -------------------------------------------------------------------------

-- 4.1 Drop existing storage policies on admission-private-docs
DROP POLICY IF EXISTS "Admissions Docs: Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Admissions Docs: Admin Access" ON storage.objects;
DROP POLICY IF EXISTS "Admissions Docs: Restricted Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Admissions Docs: Admin Secure Access" ON storage.objects;

-- 4.2 Restrict public uploads to strictly validated admission subfolders using clean text prefix matching
CREATE POLICY "Admissions Docs: Restricted Public Upload" 
  ON storage.objects FOR INSERT 
  WITH CHECK (
    bucket_id = 'admission-private-docs'
    AND (
      name LIKE 'admissions/birth_certs/%' OR
      name LIKE 'admissions/photos/%' OR
      name LIKE 'admissions/nids/%'
    )
  );

-- 4.3 Restrict reading, updating, and deleting sensitive documents strictly to verified administrators
CREATE POLICY "Admissions Docs: Admin Secure Access" 
  ON storage.objects FOR ALL TO authenticated
  USING (
    bucket_id = 'admission-private-docs' 
    AND public.is_admin()
  )
  WITH CHECK (
    bucket_id = 'admission-private-docs' 
    AND public.is_admin()
  );

-- -------------------------------------------------------------------------
-- PART 5: ALIGN EVENT RSVPS ROSTER ACCESS (RESOLVE MATRIX CONTRADICTION)
-- -------------------------------------------------------------------------

DROP POLICY IF EXISTS "Event RSVPs: Admins View and Manage" ON public.event_rsvps;
DROP POLICY IF EXISTS "Event RSVPs: Staff View and Manage" ON public.event_rsvps;

CREATE POLICY "Event RSVPs: Staff View and Manage" 
  ON public.event_rsvps FOR ALL TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());
