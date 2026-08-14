-- This script fixes the RLS policies to allow the Admin (authenticated users) to Add, Update, and Delete records.
-- Run this script in the Supabase SQL Editor.

-- 1. COURSES
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated can manage courses" ON public.courses;
CREATE POLICY "Authenticated can manage courses" ON public.courses FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 2. ASSIGNMENTS
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated can manage assignments" ON public.assignments;
CREATE POLICY "Authenticated can manage assignments" ON public.assignments FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 3. MODULES
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view modules" ON public.modules;
DROP POLICY IF EXISTS "Authenticated can manage modules" ON public.modules;
CREATE POLICY "Public can view modules" ON public.modules FOR SELECT USING (true);
CREATE POLICY "Authenticated can manage modules" ON public.modules FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4. ENROLLMENTS
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated can manage enrollments" ON public.enrollments;
CREATE POLICY "Authenticated can manage enrollments" ON public.enrollments FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 5. TRIAL REQUESTS
ALTER TABLE public.trial_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated can manage trial_requests" ON public.trial_requests;
CREATE POLICY "Authenticated can manage trial_requests" ON public.trial_requests FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 6. TEACHER PROFILES
ALTER TABLE public.teacher_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated can manage teacher_profiles" ON public.teacher_profiles;
CREATE POLICY "Authenticated can manage teacher_profiles" ON public.teacher_profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);
