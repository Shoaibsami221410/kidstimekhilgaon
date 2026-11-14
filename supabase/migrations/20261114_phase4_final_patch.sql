-- =========================================================================
-- MIGRATION: 20261114_phase4_final_patch.sql
-- DESCRIPTION: Phase 4 Final Hardening & PII Protection Patch
-- 1. Dynamically drops ALL existing policies on public.admissions to eliminate
--    any hidden legacy permissive policies (e.g. "Enable read access for all users")
-- 2. Enforces strict Admin-Only SELECT on public.admissions while keeping public INSERT
-- 3. Hardens handle_new_user() with SET search_path = public, auth and resilient error catching
-- =========================================================================

-- 1. SECURE PUBLIC.ADMISSIONS TABLE (DYNAMIC DROP OF ALL POLICIES)
ALTER TABLE public.admissions ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'admissions'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.admissions', pol.policyname);
    END LOOP;
END $$;

-- 1.1 Allow anonymous & authenticated applicants to submit applications
CREATE POLICY "Admissions: Public Application Submission" 
  ON public.admissions FOR INSERT 
  WITH CHECK (true);

-- 1.2 Restrict reading applicant personal data strictly to verified administrators
CREATE POLICY "Admissions: Admin Select Access" 
  ON public.admissions FOR SELECT TO authenticated
  USING (public.is_admin());

-- 1.3 Restrict updating admission status strictly to administrators
CREATE POLICY "Admissions: Admin Update Access" 
  ON public.admissions FOR UPDATE TO authenticated
  USING (public.is_admin()) 
  WITH CHECK (public.is_admin());

-- 1.4 Restrict deleting admission records strictly to administrators
CREATE POLICY "Admissions: Admin Delete Access" 
  ON public.admissions FOR DELETE TO authenticated
  USING (public.is_admin());

-- 2. HARDEN AUTH USER TRIGGER (RESILIENT REGISTRATION & ROLE TAMPERING PROTECTION)
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public, auth
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role, phone)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'Parent User'), 
    'parent'::public.user_role,
    new.raw_user_meta_data->>'phone'
  )
  ON CONFLICT (id) DO UPDATE 
  SET 
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    phone = COALESCE(EXCLUDED.phone, public.users.phone),
    role = public.users.role, -- PRESERVE EXISTING VERIFIED ROLE, NEVER OVERWRITE WITH CLIENT ROLE
    updated_at = NOW();

  RETURN new;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'handle_new_user trigger error: %', SQLERRM;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
