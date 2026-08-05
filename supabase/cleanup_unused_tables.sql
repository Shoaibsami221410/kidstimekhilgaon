-- Drop unused tables as requested
-- We use CASCADE to automatically drop dependent objects like foreign keys or policies

DROP TABLE IF EXISTS public.submissions CASCADE;
DROP TABLE IF EXISTS public.assignments CASCADE;
DROP TABLE IF EXISTS public.attendance CASCADE;
DROP TABLE IF EXISTS public.admissions CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.invoices CASCADE;
DROP TABLE IF EXISTS public.live_classes CASCADE;

-- Drop enums if they are no longer used anywhere else
DROP TYPE IF EXISTS public.admission_status CASCADE;
DROP TYPE IF EXISTS public.attendance_status CASCADE;
DROP TYPE IF EXISTS public.invoice_status CASCADE;
DROP TYPE IF EXISTS public.payment_method CASCADE;
DROP TYPE IF EXISTS public.live_platform CASCADE;

-- Note: We are keeping Trial Classes (demo_classes, demo_completions, trial_class_requests) as requested.
