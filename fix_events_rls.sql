-- Fix Row Level Security (RLS) for the Events table
-- Run this in your Supabase SQL Editor

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view events (for the public website)
DROP POLICY IF EXISTS "Allow public read access on events" ON public.events;
CREATE POLICY "Allow public read access on events" 
ON public.events 
FOR SELECT 
USING (true);

-- Allow anyone to insert, update, and delete events (for the admin dashboard)
-- Note: In a production app, you would restrict this to authenticated admins only.
DROP POLICY IF EXISTS "Allow public all access on events for admin" ON public.events;
CREATE POLICY "Allow public all access on events for admin" 
ON public.events 
FOR ALL 
USING (true) 
WITH CHECK (true);
