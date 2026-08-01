-- Fix Row Level Security (RLS) for the Event RSVPs table
-- Run this in your Supabase SQL Editor

ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert an RSVP (public users booking a seat)
DROP POLICY IF EXISTS "Allow public insert on event_rsvps" ON public.event_rsvps;
CREATE POLICY "Allow public insert on event_rsvps" 
ON public.event_rsvps 
FOR INSERT 
WITH CHECK (true);

-- Allow authenticated users to view all RSVPs (admin dashboard)
DROP POLICY IF EXISTS "Allow admins to read event_rsvps" ON public.event_rsvps;
CREATE POLICY "Allow admins to read event_rsvps" 
ON public.event_rsvps 
FOR SELECT 
USING (true);
