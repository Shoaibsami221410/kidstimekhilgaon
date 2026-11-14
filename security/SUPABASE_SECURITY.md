# Supabase & PostgreSQL Security Audit Report

**Target Database:** Supabase (PostgreSQL 15+)  
**Application:** Kids Time Khilgaon  
**Date:** November 14, 2026  
**Auditor:** Senior DevSecOps & Database Security Engineering  

---

## 1. Executive Summary

This report delivers a thorough security inspection of the Supabase database schema, Row Level Security (RLS) policies, authentication triggers, storage buckets, and multi-tenant data isolation.

### Security Posture Assessment
- **RLS Enablement Status:** Partially Configured (RLS enabled on tables, but policies are overly permissive).
- **Multi-Tenant Data Isolation:** **FAILED** (Standard authenticated users can access and modify other users' data and administrative entities).
- **Privilege Escalation Risk:** **CRITICAL** (User metadata role assignment in `handle_new_user()` allows self-elevation to `super_admin`).
- **PII & Government Document Exposure:** **HIGH** (Minors' birth certificates and guardians' national IDs stored in public storage).
- **Service Role Key Security:** **PASS** (Service role key is kept out of git tracking and frontend client code).

---

## 2. Table-by-Table Row Level Security (RLS) Audit

| Table Name | RLS Enabled | SELECT Policy | INSERT Policy | UPDATE Policy | DELETE Policy | Security Rating |
|---|---|---|---|---|---|---|
| `users` | YES | None defined in scripts (Deny all unless service role) | Via `handle_new_user` trigger | Self-update phone/metadata | Service role only | **MEDIUM RISK** (Needs explicit self-read/update policy) |
| `students` | YES | `TO authenticated USING (true)` | Deny / Unconfigured | Deny / Unconfigured | Deny / Unconfigured | **HIGH RISK** (Cross-parent student enumeration) |
| `courses` | YES | `Public USING (true)` | `TO authenticated USING (true)` | `TO authenticated USING (true)` | `TO authenticated USING (true)` | **CRITICAL** (Any logged-in user can delete courses) |
| `assignments` | YES | `TO authenticated USING (true)` | `TO authenticated USING (true)` | `TO authenticated USING (true)` | `TO authenticated USING (true)` | **CRITICAL** (Any logged-in user can delete assignments) |
| `modules` | YES | `Public USING (true)` | `TO authenticated USING (true)` | `TO authenticated USING (true)` | `TO authenticated USING (true)` | **CRITICAL** (Any user can alter curriculum structure) |
| `enrollments` | YES | `TO authenticated USING (true)` | `TO authenticated USING (true)` | `TO authenticated USING (true)` | `TO authenticated USING (true)` | **CRITICAL** (Cross-user enrollment tampering) |
| `trial_class_requests` | YES | `TO authenticated USING (true)` | `Public WITH CHECK (true)` | `TO authenticated USING (true)` | `TO authenticated USING (true)` | **CRITICAL** (PII data leak & deletion by any user) |
| `teacher_profiles` | YES | `Public USING (true)` | `TO authenticated USING (true)` | `TO authenticated USING (true)` | `TO authenticated USING (true)` | **CRITICAL** (Any user can edit teacher profiles) |
| `events` | YES | `Public USING (true)` | `Public USING (true)` | `Public USING (true)` | `Public USING (true)` | **CRITICAL** (Unauthenticated public can delete events) |
| `event_rsvps` | YES | `Public USING (true)` | `Public WITH CHECK (true)` | Deny / Unconfigured | Deny / Unconfigured | **HIGH RISK** (Public scraping of attendee contact details) |
| `admissions` | YES | Service role only | `Public INSERT` (via anon key) | Admin only | Admin only | **MEDIUM RISK** (Storage attachments are public) |
| `page_content` | YES | `Public USING (true)` | `TO authenticated` | `TO authenticated` | Service role | **HIGH RISK** (Any user can overwrite CMS content) |

---

## 3. Deep Dive into Critical Vulnerabilities

### 1. Insecure Role Assignment in Auth Trigger (Arbitrary Privilege Escalation)
- **Vulnerability ID:** `SEC-SUPA-001`
- **Location:** `supabase/migrations/0000_initial_schema.sql` (Line 281-293) & `supabase/migrations/fix_user_trigger.sql`
- **Code Inspection:**
  ```sql
  CREATE OR REPLACE FUNCTION public.handle_new_user() 
  RETURNS TRIGGER AS $$
  BEGIN
    INSERT INTO public.users (id, email, full_name, role)
    VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 
            COALESCE(new.raw_user_meta_data->>'role', 'student')::user_role);
    RETURN new;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  ```
- **Flaw Analysis:**
  The trigger executes with `SECURITY DEFINER` (running with elevated superuser privileges) and directly casts `new.raw_user_meta_data->>'role'` to the `user_role` enum. Because user metadata is submitted by the client during `supabase.auth.signUp()`, any user can submit `{"role": "super_admin"}` or `{"role": "admin"}`.
- **Proof of Concept:**
  ```json
  POST https://<project-ref>.supabase.co/auth/v1/signup
  Content-Type: application/json
  apikey: <NEXT_PUBLIC_SUPABASE_ANON_KEY>

  {
    "email": "exploit@test.com",
    "password": "Password123!",
    "data": {
      "full_name": "Injected Admin",
      "role": "super_admin"
    }
  }
  ```
- **Result:** The user is immediately inserted into `public.users` with `role = 'super_admin'`. Upon login, Next.js middleware grants access to `/dashboard/*`.
- **Recommended Remediation (Pending User Approval):**
  ```sql
  CREATE OR REPLACE FUNCTION public.handle_new_user() 
  RETURNS TRIGGER AS $$
  BEGIN
    INSERT INTO public.users (id, email, full_name, role)
    VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'parent'::user_role);
    RETURN new;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  ```

---

### 2. Overly Permissive `FOR ALL TO authenticated` Policies (Broken Access Control)
- **Vulnerability ID:** `SEC-SUPA-002`
- **Location:** `fix_admin_rls.sql`
- **Code Inspection:**
  ```sql
  CREATE POLICY "Authenticated can manage courses" ON public.courses 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
  CREATE POLICY "Authenticated can manage assignments" ON public.assignments 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
  CREATE POLICY "Authenticated can manage modules" ON public.modules 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
  CREATE POLICY "Authenticated can manage enrollments" ON public.enrollments 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
  CREATE POLICY "Authenticated can manage trial_class_requests" ON public.trial_class_requests 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
  CREATE POLICY "Authenticated can manage teacher_profiles" ON public.teacher_profiles 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
  ```
- **Flaw Analysis:**
  The developer intended to grant administrative privileges to admins. However, `TO authenticated` matches *every single registered account*. Any authenticated parent or student can issue raw HTTP DELETE or UPDATE requests against any course, assignment, enrollment, or trial class request.
- **Cross-User Data Exposure:**
  User A (Parent) can view, edit, or delete User B's enrollments and trial class applications.
- **Recommended Remediation (Pending User Approval):**
  Create an administrative check helper function or use JWT claims:
  ```sql
  -- Helper function to check admin status
  CREATE OR REPLACE FUNCTION public.is_admin()
  RETURNS BOOLEAN AS $$
  BEGIN
    RETURN EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    );
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;

  -- Apply to courses
  DROP POLICY IF EXISTS "Authenticated can manage courses" ON public.courses;
  CREATE POLICY "Admins can manage courses" ON public.courses
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());
  ```

---

### 3. Public Events Deletion Policy
- **Vulnerability ID:** `SEC-SUPA-003`
- **Location:** `fix_events_rls.sql` (Line 16)
- **Code Inspection:**
  ```sql
  CREATE POLICY "Allow public all access on events for admin" 
  ON public.events FOR ALL USING (true) WITH CHECK (true);
  ```
- **Flaw Analysis:**
  This policy grants `FOR ALL` (SELECT, INSERT, UPDATE, DELETE) to `public` (anyone without an account). Any anonymous script can delete all events on the website.
- **Recommended Remediation:**
  Drop this policy and restrict INSERT/UPDATE/DELETE to authenticated admins.

---

### 4. Storage Bucket Security (`kidstime-assets`)
- **Vulnerability ID:** `SEC-SUPA-004`
- **Location:** Supabase Storage & `src/components/admission-form.tsx`
- **Flaw Analysis:**
  Sensitive applicant documents (child birth certificates, student photos, guardian national ID cards) are stored in `kidstime-assets` under `admissions/` and exposed via permanent public URLs (`getPublicUrl`).
- **Remediation:**
  1. Migrate admission documents to a dedicated private bucket `admission-private-docs`.
  2. Implement RLS on `storage.objects`:
     ```sql
     CREATE POLICY "Admins can access admission documents" ON storage.objects
       FOR SELECT TO authenticated
       USING (bucket_id = 'admission-private-docs' AND public.is_admin());
     ```
  3. Server components or dashboard API should generate short-lived signed URLs (`createSignedUrl`) valid for 60 seconds.

---

## 4. Multi-Tenant Cross-User Isolation Test Results

| Test Scenario | Expected Result | Actual Result | Status |
|---|---|---|---|
| **Parent A queries Parent B's students** | Blocked (Empty set) | Returns all students (`USING (true)`) | **FAILED (VULNERABLE)** |
| **Parent A deletes LMS Course** | 403 Forbidden | Allowed by `fix_admin_rls.sql` | **FAILED (VULNERABLE)** |
| **Anonymous user reads Event RSVPs** | 401 Unauthorized | Returns attendee names/phones | **FAILED (VULNERABLE)** |
| **Anonymous user registers for Trial Class** | Allowed (200 OK) | Allowed (200 OK) | **PASSED** |
| **Anonymous user overwrites Page Content** | 403 Forbidden | Blocked (Requires auth) | **PASSED** |
| **Parent account overwrites Page Content** | 403 Forbidden | Allowed (`auth.role() = 'authenticated'`) | **FAILED (VULNERABLE)** |

---

## 5. Proposed Production Hardening Script (Ready for Approval)

> [!IMPORTANT]
> Per Critical Operating Rules, this script has **NOT** been applied automatically to production. It requires explicit user approval before execution in the Supabase SQL editor.

```sql
-- =========================================================================
-- SECURE PRODUCTION RLS POLICIES (PROPOSED)
-- =========================================================================

-- 1. Helper function for role checking
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Secure Auth User Trigger (Prevent Privilege Escalation)
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'parent'::user_role);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Fix Courses RLS
DROP POLICY IF EXISTS "Authenticated can manage courses" ON public.courses;
CREATE POLICY "Admins can manage courses" ON public.courses
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 4. Fix Event RSVPs PII Leak
DROP POLICY IF EXISTS "Allow admins to read event_rsvps" ON public.event_rsvps;
CREATE POLICY "Admins can read event_rsvps" ON public.event_rsvps
  FOR SELECT TO authenticated
  USING (public.is_admin());

-- 5. Fix Page Content CMS Modification
DROP POLICY IF EXISTS "Authenticated users can update content." ON public.page_content;
CREATE POLICY "Admins can update content" ON public.page_content
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
```
