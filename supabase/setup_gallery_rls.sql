-- Enable RLS on galleries
ALTER TABLE public.galleries ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view galleries
DROP POLICY IF EXISTS "Public can view galleries" ON public.galleries;
CREATE POLICY "Public can view galleries" ON public.galleries FOR SELECT USING (true);

-- Allow anyone (or authenticated users) to insert/update/delete galleries 
-- Note: Since this is an admin dashboard currently without strict user roles, we allow ALL for simplicity
DROP POLICY IF EXISTS "Admin can insert galleries" ON public.galleries;
CREATE POLICY "Admin can insert galleries" ON public.galleries FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can update galleries" ON public.galleries;
CREATE POLICY "Admin can update galleries" ON public.galleries FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Admin can delete galleries" ON public.galleries;
CREATE POLICY "Admin can delete galleries" ON public.galleries FOR DELETE USING (true);
