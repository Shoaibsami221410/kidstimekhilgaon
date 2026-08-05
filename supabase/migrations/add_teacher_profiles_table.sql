-- Create teacher_profiles table that does NOT require a user login
CREATE TABLE IF NOT EXISTS public.teacher_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  image_url TEXT,
  experience TEXT,
  certifications TEXT,
  qualifications TEXT,
  course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.teacher_profiles ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on teacher_profiles"
  ON public.teacher_profiles
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated admins to insert/update/delete
CREATE POLICY "Allow authenticated full access on teacher_profiles"
  ON public.teacher_profiles
  FOR ALL
  TO authenticated
  USING (true);
