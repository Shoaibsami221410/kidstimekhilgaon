-- Upgrade Events Schema for Registration Limits
-- Run this in your Supabase SQL Editor

-- 1. Add new columns to control registration
ALTER TABLE public.events
ADD COLUMN IF NOT EXISTS is_registration_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS registration_deadline TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS max_seats INTEGER;

-- 2. Create a secure RPC function so the public website can count RSVPs
-- SECURITY DEFINER allows the function to bypass RLS, so public users can count
-- how many seats are taken without being able to see who registered.
CREATE OR REPLACE FUNCTION get_event_rsvp_counts()
RETURNS TABLE (event_id UUID, rsvp_count BIGINT)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT event_id, COUNT(*) as rsvp_count 
  FROM public.event_rsvps 
  GROUP BY event_id;
$$;
