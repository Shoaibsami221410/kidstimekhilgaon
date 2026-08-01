-- Update Event RSVPs table to support public registrations
-- Run this in your Supabase SQL Editor

-- 1. Make user_id optional since public visitors won't have an account
ALTER TABLE public.event_rsvps ALTER COLUMN user_id DROP NOT NULL;

-- 2. Drop the unique constraint so multiple public users can register for the same event
ALTER TABLE public.event_rsvps DROP CONSTRAINT IF EXISTS event_rsvps_event_id_user_id_key;

-- 3. Add the form fields to store public registration data
ALTER TABLE public.event_rsvps 
ADD COLUMN IF NOT EXISTS parent_name TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS student_name TEXT,
ADD COLUMN IF NOT EXISTS student_age INTEGER;
