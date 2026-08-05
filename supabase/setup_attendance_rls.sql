-- Enable RLS
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Allow reading attendance for everyone (or just authenticated users)
CREATE POLICY "Allow authenticated read attendance"
ON public.attendance
FOR SELECT
TO authenticated
USING (true);

-- Allow admins and teachers to insert attendance
CREATE POLICY "Allow insert attendance"
ON public.attendance
FOR INSERT
TO authenticated
WITH CHECK (
  auth.jwt() -> 'user_metadata' ->> 'role' IN ('admin', 'super_admin', 'teacher')
);

-- Allow admins and teachers to update attendance
CREATE POLICY "Allow update attendance"
ON public.attendance
FOR UPDATE
TO authenticated
USING (
  auth.jwt() -> 'user_metadata' ->> 'role' IN ('admin', 'super_admin', 'teacher')
)
WITH CHECK (
  auth.jwt() -> 'user_metadata' ->> 'role' IN ('admin', 'super_admin', 'teacher')
);

-- Allow admins and teachers to delete attendance
CREATE POLICY "Allow delete attendance"
ON public.attendance
FOR DELETE
TO authenticated
USING (
  auth.jwt() -> 'user_metadata' ->> 'role' IN ('admin', 'super_admin', 'teacher')
);
