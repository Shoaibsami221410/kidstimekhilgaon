-- =========================================================================
-- MIGRATION: 20261114_safe_disaster_recovery.sql
-- DESCRIPTION: Safe Disaster Recovery & Emergency Operational Reset
-- OBJECTIVE:
--   Restores maximum functional availability for students, parents, and teachers
--   WITHOUT EVER re-introducing security vulnerabilities
-- =========================================================================

-- 1. SAFE AUTH TRIGGER (DEFENSIVE FAIL-SAFE)
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
    role = public.users.role,
    updated_at = pg_catalog.now();

  RETURN new;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'handle_new_user emergency fallback triggered: %', SQLERRM;
  RETURN new;
END;
$$;

-- 2. SECURE COURSES & MODULES (PUBLIC READ, ADMIN WRITE)
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Courses: Public Read" ON public.courses;
DROP POLICY IF EXISTS "Courses: Admin Full Management" ON public.courses;
CREATE POLICY "Courses: Public Read" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Courses: Admin Full Management" ON public.courses FOR ALL TO authenticated 
  USING (public.is_admin()) WITH CHECK (public.is_admin());

ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Modules: Public Read" ON public.modules;
DROP POLICY IF EXISTS "Modules: Admin Full Management" ON public.modules;
CREATE POLICY "Modules: Public Read" ON public.modules FOR SELECT USING (true);
CREATE POLICY "Modules: Admin Full Management" ON public.modules FOR ALL TO authenticated 
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 3. SECURE ASSIGNMENTS & ENROLLMENTS (PARENTS VIEW OWN, STAFF MANAGE)
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Assignments: Enrolled Students and Staff Can Read" ON public.assignments;
DROP POLICY IF EXISTS "Assignments: Staff Full Management" ON public.assignments;
CREATE POLICY "Assignments: Enrolled Students and Staff Can Read" ON public.assignments FOR SELECT TO authenticated
  USING (
    public.is_staff() OR 
    EXISTS (
      SELECT 1 FROM public.enrollments e
      JOIN public.students s ON s.id = e.student_id
      WHERE e.course_id = assignments.course_id 
        AND (s.parent_id = auth.uid() OR s.user_id = auth.uid())
    )
  );
CREATE POLICY "Assignments: Staff Full Management" ON public.assignments FOR ALL TO authenticated
  USING (public.is_staff()) WITH CHECK (public.is_staff());

ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enrollments: Parents Can View Own Children Enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Enrollments: Admin Management" ON public.enrollments;
CREATE POLICY "Enrollments: Parents Can View Own Children Enrollments" ON public.enrollments FOR SELECT TO authenticated
  USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.students s
      WHERE s.id = enrollments.student_id 
        AND (s.parent_id = auth.uid() OR s.user_id = auth.uid())
    )
  );
CREATE POLICY "Enrollments: Admin Management" ON public.enrollments FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 4. SECURE ADMISSIONS TABLE (PREVENT PII LEAKS)
ALTER TABLE public.admissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admissions: Public Application Submission" ON public.admissions;
DROP POLICY IF EXISTS "Admissions: Admin Select Access" ON public.admissions;
DROP POLICY IF EXISTS "Admissions: Admin Update Access" ON public.admissions;
DROP POLICY IF EXISTS "Admissions: Admin Delete Access" ON public.admissions;

CREATE POLICY "Admissions: Public Application Submission" ON public.admissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admissions: Admin Select Access" ON public.admissions FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admissions: Admin Update Access" ON public.admissions FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admissions: Admin Delete Access" ON public.admissions FOR DELETE TO authenticated USING (public.is_admin());

-- 5. SECURE EVENT RSVPS (PREVENT ATTENDEE SCRAPING)
ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Event RSVPs: Public Insert" ON public.event_rsvps;
DROP POLICY IF EXISTS "Event RSVPs: Staff View and Manage" ON public.event_rsvps;
CREATE POLICY "Event RSVPs: Public Insert" ON public.event_rsvps FOR INSERT WITH CHECK (true);
CREATE POLICY "Event RSVPs: Staff View and Manage" ON public.event_rsvps FOR ALL TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());

-- 6. SECURE STORAGE (PREVENT DOCUMENT SCRAPING)
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

CREATE POLICY "Admissions Docs: Admin Secure Access" 
  ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'admission-private-docs' AND public.is_admin())
  WITH CHECK (bucket_id = 'admission-private-docs' AND public.is_admin());
