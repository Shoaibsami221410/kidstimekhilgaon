-- Add Syllabus and Assigned Teacher columns to courses table
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS syllabus JSONB;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS teacher_id UUID REFERENCES public.teachers(id) ON DELETE SET NULL;

-- Example of how to populate Syllabus data:
-- UPDATE public.courses SET syllabus = '[
--   { "week": "Week 1", "title": "Introduction to the Course", "description": "Getting to know the basics and fundamentals." },
--   { "week": "Week 2", "title": "Core Concepts", "description": "Diving deeper into the core subject matter." },
--   { "week": "Week 3", "title": "Practical Application", "description": "Hands-on projects and assignments." },
--   { "week": "Week 4", "title": "Final Review", "description": "Wrapping up and reviewing all learned materials." }
-- ]'::jsonb WHERE id = 'c1111111-1111-1111-1111-111111111111';
