-- =========================================================================
-- MIGRATION: 20261114_production_security_hardening.sql
-- DESCRIPTION: Comprehensive DevSecOps Hardening Migration
-- AFFECTS: RLS Policies, Auth User Trigger, Storage Objects, RBAC Functions
-- =========================================================================

-- -------------------------------------------------------------------------
-- PART 1: HELPER FUNCTIONS & AUTH TRIGGER
-- (Run this part first to register the security functions in PostgreSQL)
-- -------------------------------------------------------------------------

-- 1.1 Secure Admin Role Checker Function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() 
      AND role::text IN ('admin', 'super_admin')
  );
$$;

-- 1.2 Secure Super Admin Checker Function
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() 
      AND role::text = 'super_admin'
  );
$$;

-- 1.3 Secure Teacher or Admin Checker Function
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() 
      AND role::text IN ('teacher', 'admin', 'super_admin')
  );
$$;

-- 1.4 Fix Auth User Trigger (Prevent Privilege Escalation)
-- All public registrations strictly receive 'parent'. Roles can only be elevated by administrators.
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role, phone)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'Parent User'), 
    'parent'::user_role,
    new.raw_user_meta_data->>'phone'
  )
  ON CONFLICT (id) DO UPDATE 
  SET 
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    phone = COALESCE(EXCLUDED.phone, public.users.phone),
    updated_at = NOW();

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Reattach trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- -------------------------------------------------------------------------
-- PART 2: DROP PERMISSIVE POLICIES & APPLY LEAST-PRIVILEGE RLS
-- -------------------------------------------------------------------------

-- 2.1 Drop old / permissive policies
DROP POLICY IF EXISTS "Authenticated can manage courses" ON public.courses;
DROP POLICY IF EXISTS "Public can view courses" ON public.courses;
DROP POLICY IF EXISTS "Courses: Public Read" ON public.courses;
DROP POLICY IF EXISTS "Courses: Admin Full Management" ON public.courses;

DROP POLICY IF EXISTS "Authenticated can manage assignments" ON public.assignments;
DROP POLICY IF EXISTS "Authenticated can view assignments" ON public.assignments;
DROP POLICY IF EXISTS "Assignments: Enrolled Students and Staff Can Read" ON public.assignments;
DROP POLICY IF EXISTS "Assignments: Staff Full Management" ON public.assignments;

DROP POLICY IF EXISTS "Authenticated can manage modules" ON public.modules;
DROP POLICY IF EXISTS "Public can view modules" ON public.modules;
DROP POLICY IF EXISTS "Modules: Public Read" ON public.modules;
DROP POLICY IF EXISTS "Modules: Admin Full Management" ON public.modules;

DROP POLICY IF EXISTS "Authenticated can manage enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Authenticated can view enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Enrollments: Parents Can View Own Children Enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Enrollments: Admin Management" ON public.enrollments;

DROP POLICY IF EXISTS "Authenticated can manage trial_class_requests" ON public.trial_class_requests;
DROP POLICY IF EXISTS "Allow authenticated full access to trial_class_requests" ON public.trial_class_requests;
DROP POLICY IF EXISTS "Allow public insert on trial_class_requests" ON public.trial_class_requests;
DROP POLICY IF EXISTS "Trial Requests: Public Insert" ON public.trial_class_requests;
DROP POLICY IF EXISTS "Trial Requests: Admin Management" ON public.trial_class_requests;

DROP POLICY IF EXISTS "Authenticated can manage teacher_profiles" ON public.teacher_profiles;
DROP POLICY IF EXISTS "Teacher Profiles: Public Read" ON public.teacher_profiles;
DROP POLICY IF EXISTS "Teacher Profiles: Admin Management" ON public.teacher_profiles;

DROP POLICY IF EXISTS "Allow public all access on events for admin" ON public.events;
DROP POLICY IF EXISTS "Allow public read access on events" ON public.events;
DROP POLICY IF EXISTS "Events: Public Read" ON public.events;
DROP POLICY IF EXISTS "Events: Admin Management" ON public.events;

DROP POLICY IF EXISTS "Allow admins to read event_rsvps" ON public.event_rsvps;
DROP POLICY IF EXISTS "Allow public insert on event_rsvps" ON public.event_rsvps;
DROP POLICY IF EXISTS "Event RSVPs: Public Insert" ON public.event_rsvps;
DROP POLICY IF EXISTS "Event RSVPs: Admins View and Manage" ON public.event_rsvps;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.page_content;
DROP POLICY IF EXISTS "Authenticated users can update content." ON public.page_content;
DROP POLICY IF EXISTS "Authenticated users can insert content." ON public.page_content;
DROP POLICY IF EXISTS "Page Content: Public Read" ON public.page_content;
DROP POLICY IF EXISTS "Page Content: Admin Management" ON public.page_content;

DROP POLICY IF EXISTS "Parents can view their students" ON public.students;
DROP POLICY IF EXISTS "Students: Parents View Own Students" ON public.students;
DROP POLICY IF EXISTS "Students: Parents Insert Own Students" ON public.students;
DROP POLICY IF EXISTS "Students: Parents Update Own Students" ON public.students;
DROP POLICY IF EXISTS "Students: Admin Delete Students" ON public.students;

-- 2.2 COURSES: Public read, Admin write
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Courses: Public Read" 
  ON public.courses FOR SELECT 
  USING (true);

CREATE POLICY "Courses: Admin Full Management" 
  ON public.courses FOR ALL TO authenticated 
  USING (public.is_admin()) 
  WITH CHECK (public.is_admin());

-- 2.3 MODULES: Public read, Admin write
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Modules: Public Read" 
  ON public.modules FOR SELECT 
  USING (true);

CREATE POLICY "Modules: Admin Full Management" 
  ON public.modules FOR ALL TO authenticated 
  USING (public.is_admin()) 
  WITH CHECK (public.is_admin());

-- 2.4 ASSIGNMENTS: Enrolled users & staff read, Staff write
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Assignments: Enrolled Students and Staff Can Read" 
  ON public.assignments FOR SELECT TO authenticated
  USING (
    public.is_staff() OR 
    EXISTS (
      SELECT 1 FROM public.enrollments e
      JOIN public.students s ON s.id = e.student_id
      WHERE e.course_id = assignments.course_id 
        AND (s.parent_id = auth.uid() OR s.user_id = auth.uid())
    )
  );

CREATE POLICY "Assignments: Staff Full Management" 
  ON public.assignments FOR ALL TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- 2.5 ENROLLMENTS: Parents see own students, Admins see all
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enrollments: Parents Can View Own Children Enrollments" 
  ON public.enrollments FOR SELECT TO authenticated
  USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.students s
      WHERE s.id = enrollments.student_id 
        AND (s.parent_id = auth.uid() OR s.user_id = auth.uid())
    )
  );

CREATE POLICY "Enrollments: Admin Management" 
  ON public.enrollments FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 2.6 STUDENTS: Parents can view & update own children, Admins see all
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students: Parents View Own Students" 
  ON public.students FOR SELECT TO authenticated
  USING (public.is_admin() OR parent_id = auth.uid() OR user_id = auth.uid());

CREATE POLICY "Students: Parents Insert Own Students" 
  ON public.students FOR INSERT TO authenticated
  WITH CHECK (public.is_admin() OR parent_id = auth.uid());

CREATE POLICY "Students: Parents Update Own Students" 
  ON public.students FOR UPDATE TO authenticated
  USING (public.is_admin() OR parent_id = auth.uid())
  WITH CHECK (public.is_admin() OR parent_id = auth.uid());

CREATE POLICY "Students: Admin Delete Students" 
  ON public.students FOR DELETE TO authenticated
  USING (public.is_admin());

-- 2.7 TRIAL CLASS REQUESTS: Public can insert, Only Admins can view/manage
ALTER TABLE public.trial_class_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Trial Requests: Public Insert" 
  ON public.trial_class_requests FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Trial Requests: Admin Management" 
  ON public.trial_class_requests FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 2.8 TEACHER PROFILES: Public can view, Admins can manage
ALTER TABLE public.teacher_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teacher Profiles: Public Read" 
  ON public.teacher_profiles FOR SELECT 
  USING (true);

CREATE POLICY "Teacher Profiles: Admin Management" 
  ON public.teacher_profiles FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 2.9 EVENTS: Public can view, Admins can manage
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Events: Public Read" 
  ON public.events FOR SELECT 
  USING (true);

CREATE POLICY "Events: Admin Management" 
  ON public.events FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 2.10 EVENT RSVPS: Public can insert, Only Admins can view private attendee PII
ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Event RSVPs: Public Insert" 
  ON public.event_rsvps FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Event RSVPs: Admins View and Manage" 
  ON public.event_rsvps FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 2.11 PAGE CONTENT (CMS): Public can read, Admins can edit
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Page Content: Public Read" 
  ON public.page_content FOR SELECT 
  USING (true);

CREATE POLICY "Page Content: Admin Management" 
  ON public.page_content FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- -------------------------------------------------------------------------
-- PART 3: SECURE ADMISSIONS PRIVATE DOCUMENTS BUCKET
-- -------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public)
VALUES ('admission-private-docs', 'admission-private-docs', false)
ON CONFLICT (id) DO UPDATE SET public = false;

DROP POLICY IF EXISTS "Admissions Docs: Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Admissions Docs: Admin Access" ON storage.objects;

CREATE POLICY "Admissions Docs: Public Upload" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'admission-private-docs');

CREATE POLICY "Admissions Docs: Admin Access" 
  ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'admission-private-docs' AND public.is_admin())
  WITH CHECK (bucket_id = 'admission-private-docs' AND public.is_admin());
