-- Create the trial_class_requests table
CREATE TABLE IF NOT EXISTS public.trial_class_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
    parent_name TEXT NOT NULL,
    parent_phone TEXT NOT NULL,
    parent_email TEXT,
    child_name TEXT,
    child_age INTEGER,
    status TEXT DEFAULT 'pending', -- pending, contacted, enrolled
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.trial_class_requests ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (anyone can submit a trial class request form)
CREATE POLICY "Allow public insert on trial_class_requests" 
    ON public.trial_class_requests
    FOR INSERT 
    TO public
    WITH CHECK (true);

-- Allow authenticated admins to view/update/delete requests
CREATE POLICY "Allow authenticated full access to trial_class_requests" 
    ON public.trial_class_requests
    FOR ALL 
    TO authenticated
    USING (true);
