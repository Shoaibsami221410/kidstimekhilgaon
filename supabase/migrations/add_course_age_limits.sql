-- Add program_type and age limits to courses
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS program_type TEXT DEFAULT 'all';
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS min_age INTEGER;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS max_age INTEGER;

-- Set Junior Courses (Age 4-7)
UPDATE public.courses 
SET program_type = 'junior', min_age = 4, max_age = 7 
WHERE id IN (
  'c1111111-1111-1111-1111-111111111111', -- Art & Craft
  'c5555555-5555-5555-5555-555555555555'  -- Creative Writing
);

-- Set Senior Courses (Age 8-12)
UPDATE public.courses 
SET program_type = 'senior', min_age = 8, max_age = 12 
WHERE id IN (
  'c2222222-2222-2222-2222-222222222222', -- Spoken English
  'c3333333-3333-3333-3333-333333333333'  -- Mental Math
);

-- Set All Age Courses
UPDATE public.courses 
SET program_type = 'all', min_age = 5, max_age = 15 
WHERE id IN (
  'c4444444-4444-4444-4444-444444444444', -- Little Scientists
  'c6666666-6666-6666-6666-666666666666'  -- Coding
);
