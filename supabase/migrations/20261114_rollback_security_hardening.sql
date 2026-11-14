-- =========================================================================
-- MIGRATION: 20261114_rollback_security_hardening.sql
-- DESCRIPTION: Rollback script to revert 20261114_production_security_hardening.sql
-- USAGE: Only execute in the event of unforeseen production compatibility issues
-- =========================================================================

BEGIN;

-- 1. Revert Trigger to legacy implementation
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role, phone)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    COALESCE(new.raw_user_meta_data->>'role', 'student')::user_role,
    new.raw_user_meta_data->>'phone'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Restore previous policies
DROP POLICY IF EXISTS "Courses: Public Read" ON public.courses;
DROP POLICY IF EXISTS "Courses: Admin Full Management" ON public.courses;
CREATE POLICY "Public can view courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Authenticated can manage courses" ON public.courses FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modules: Public Read" ON public.modules;
DROP POLICY IF EXISTS "Modules: Admin Full Management" ON public.modules;
CREATE POLICY "Public can view modules" ON public.modules FOR SELECT USING (true);
CREATE POLICY "Authenticated can manage modules" ON public.modules FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Assignments: Enrolled Students and Staff Can Read" ON public.assignments;
DROP POLICY IF EXISTS "Assignments: Staff Full Management" ON public.assignments;
CREATE POLICY "Authenticated can view assignments" ON public.assignments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can manage assignments" ON public.assignments FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enrollments: Parents Can View Own Children Enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Enrollments: Admin Management" ON public.enrollments;
CREATE POLICY "Authenticated can view enrollments" ON public.enrollments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can manage enrollments" ON public.enrollments FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Students: Parents View Own Students" ON public.students;
DROP POLICY IF EXISTS "Students: Parents Insert Own Students" ON public.students;
DROP POLICY IF EXISTS "Students: Parents Update Own Students" ON public.students;
DROP POLICY IF EXISTS "Students: Admin Delete Students" ON public.students;
CREATE POLICY "Parents can view their students" ON public.students FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Trial Requests: Public Insert" ON public.trial_class_requests;
DROP POLICY IF EXISTS "Trial Requests: Admin Management" ON public.trial_class_requests;
CREATE POLICY "Allow public insert on trial_class_requests" ON public.trial_class_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can manage trial_class_requests" ON public.trial_class_requests FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Teacher Profiles: Public Read" ON public.teacher_profiles;
DROP POLICY IF EXISTS "Teacher Profiles: Admin Management" ON public.teacher_profiles;
CREATE POLICY "Authenticated can manage teacher_profiles" ON public.teacher_profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Events: Public Read" ON public.events;
DROP POLICY IF EXISTS "Events: Admin Management" ON public.events;
CREATE POLICY "Allow public read access on events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Allow public all access on events for admin" ON public.events FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Event RSVPs: Public Insert" ON public.event_rsvps;
DROP POLICY IF EXISTS "Event RSVPs: Admins View and Manage" ON public.event_rsvps;
CREATE POLICY "Allow public insert on event_rsvps" ON public.event_rsvps FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admins to read event_rsvps" ON public.event_rsvps FOR SELECT USING (true);

DROP POLICY IF EXISTS "Page Content: Public Read" ON public.page_content;
DROP POLICY IF EXISTS "Page Content: Admin Management" ON public.page_content;
CREATE POLICY "Public profiles are viewable by everyone." ON public.page_content FOR SELECT USING (true);
CREATE POLICY "Authenticated users can update content." ON public.page_content FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert content." ON public.page_content FOR INSERT WITH CHECK (auth.role() = 'authenticated');

COMMIT;
