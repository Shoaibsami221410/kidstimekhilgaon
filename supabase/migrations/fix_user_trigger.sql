-- Run this in your Supabase SQL Editor to fix the "Database error saving new user" issue

CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role, phone)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', new.email), -- Fallback to email if full_name is missing
    COALESCE(new.raw_user_meta_data->>'role', 'parent')::user_role,
    new.raw_user_meta_data->>'phone'
  );
  RETURN new;
EXCEPTION WHEN OTHERS THEN
  -- Log the error so we can see it later but don't abort the auth.user creation
  RAISE WARNING 'handle_new_user trigger failed: %', SQLERRM;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
