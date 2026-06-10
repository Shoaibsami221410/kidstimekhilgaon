-- RUN THIS SCRIPT TO REMOVE ALL DEMO DATA BEFORE GOING TO PRODUCTION

-- 1. Delete Demo Courses
-- Note: Because of 'ON DELETE CASCADE' in the database schema, 
-- deleting these courses will automatically delete all related:
-- - Demo Assignments
-- - Course Enrollments
DELETE FROM public.courses 
WHERE id IN (
  'c1111111-1111-1111-1111-111111111111',
  'c2222222-2222-2222-2222-222222222222',
  'c3333333-3333-3333-3333-333333333333',
  'c4444444-4444-4444-4444-444444444444',
  'c5555555-5555-5555-5555-555555555555',
  'c6666666-6666-6666-6666-666666666666'
);

-- 2. Delete Demo Students
-- Note: This will automatically delete any demo attendance records 
-- linked to this student due to 'ON DELETE CASCADE'.
DELETE FROM public.students 
WHERE first_name = 'Demo' AND last_name = 'Child';
