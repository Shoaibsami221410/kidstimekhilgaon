-- Add Duration and Syllabus to courses table
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS duration TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS syllabus JSONB;

-- Add course_id to teachers table to link a teacher to a course
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL;

-- Example of how to populate Syllabus data:
-- UPDATE public.courses SET syllabus = '[
--   { "week": "Week 1", "title": "Introduction to the Course", "description": "Getting to know the basics and fundamentals." },
--   { "week": "Week 2", "title": "Core Concepts", "description": "Diving deeper into the core subject matter." }
-- ]'::jsonb WHERE id = 'c1111111-1111-1111-1111-111111111111';
