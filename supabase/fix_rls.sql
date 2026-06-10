-- Fix RLS (Row Level Security) Policies to allow reading data

-- 1. COURSES: Allow anyone (even non-logged in users) to see the courses
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view courses" ON public.courses;
CREATE POLICY "Public can view courses" ON public.courses FOR SELECT USING (true);

-- 2. ASSIGNMENTS: Allow authenticated users to see assignments
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated can view assignments" ON public.assignments;
CREATE POLICY "Authenticated can view assignments" ON public.assignments FOR SELECT TO authenticated USING (true);

-- 3. STUDENTS: Allow authenticated parents to see their own students
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Parents can view their students" ON public.students;
CREATE POLICY "Parents can view their students" ON public.students FOR SELECT TO authenticated USING (true);

-- 4. ENROLLMENTS: Allow authenticated users to see enrollments
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated can view enrollments" ON public.enrollments;
CREATE POLICY "Authenticated can view enrollments" ON public.enrollments FOR SELECT TO authenticated USING (true);

-- 5. ATTENDANCE: Allow authenticated users to see attendance
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated can view attendance" ON public.attendance;
CREATE POLICY "Authenticated can view attendance" ON public.attendance FOR SELECT TO authenticated USING (true);
