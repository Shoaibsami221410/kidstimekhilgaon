-- Run this in the Supabase SQL Editor to add the new columns to the admissions table
ALTER TABLE public.admissions ADD COLUMN IF NOT EXISTS program_type TEXT;
ALTER TABLE public.admissions ADD COLUMN IF NOT EXISTS subjects TEXT[];
