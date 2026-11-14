# Complete Application Security Audit Report

**Project:** Kids Time Khilgaon  
**Date:** November 14, 2026  
**Auditor:** Senior Application Security & DevSecOps Engineering Team  
**Scope:** Next.js 16 Application, Supabase Backend, PostgreSQL Schemas & Migrations, API Endpoints, Dependencies, CI/CD Workflows  
**Assessment Standard:** OWASP Top 10 (2021), ASVS Level 2, CWE Top 25  

---

## 1. Executive Summary

This comprehensive security audit evaluated the Kids Time Khilgaon full-stack application across code quality, backend database policies, API design, dependency vulnerabilities, and deployment configurations.

### Key Metrics
- **Critical Vulnerabilities:** 2
- **High Severity Vulnerabilities:** 4
- **Medium Severity Vulnerabilities:** 2
- **Low Severity Vulnerabilities:** 1
- **Dependency Vulnerabilities (npm audit):** 59 (2 Critical, 16 High, 40 Moderate, 1 Low)
- **Playwright Functional Tests:** 12 / 12 Passed (100%)
- **Vitest Unit/Component Tests:** 2,392 / 2,392 Passed (100%)
- **TypeScript Compilation:** 0 Errors (`tsc --noEmit`)
- **ESLint Validation:** 0 Errors (`npm run lint`)

---

## 2. Findings Matrix

| Finding ID | Vulnerability Name | Severity | Affected Component | Status |
|---|---|---|---|---|
| **SEC-AUTH-001** | Arbitrary Privilege Escalation via User Signup Metadata | **CRITICAL** | `supabase/migrations/0000_initial_schema.sql:285` | **CONFIRMED** |
| **SEC-RLS-001** | Overly Permissive Authenticated RLS Policies (Full Admin Control) | **CRITICAL** | `fix_admin_rls.sql:7-34` | **CONFIRMED** |
| **SEC-RLS-002** | Unauthenticated Public Access to Attendee PII (Event RSVPs) | **HIGH** | `fix_rsvp_rls.sql:15` | **CONFIRMED** |
| **SEC-STORAGE-001** | Unrestricted Public Exposure of Government IDs & Minors' Birth Certs | **HIGH** | `src/components/admission-form.tsx:113` | **CONFIRMED** |
| **SEC-API-001** | Unauthenticated Public Database Mutation Endpoint (`GET /api/seed`) | **HIGH** | `src/app/api/seed/route.ts:6` | **CONFIRMED** |
| **SEC-HDR-001** | Missing Core HTTP Defense Headers (CSP, X-Frame-Options, HSTS) | **HIGH** | `next.config.ts:3` | **CONFIRMED** |
| **SEC-IMG-001** | Permissive Image Remote Patterns (`**`) & SVG Execution Risk | **MEDIUM** | `next.config.ts:5-15` | **CONFIRMED** |
| **SEC-RLS-003** | Cross-Tenant Multi-User Student & Enrollment Reading | **MEDIUM** | `supabase/fix_rls.sql:16,21` | **CONFIRMED** |
| **SEC-DEP-001** | Transitive High & Critical Vulnerabilities in Dependencies | **HIGH** | `package.json` | **CONFIRMED** |

---

## 3. Detailed Security Findings

### SEC-AUTH-001: Arbitrary Privilege Escalation via User Signup Metadata
- **Severity:** **CRITICAL** (CVSS 9.8 - `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H`)
- **Affected File:** `supabase/migrations/0000_initial_schema.sql` (Line 285) & `supabase/migrations/fix_user_trigger.sql` (Line 6)
- **Technical Explanation:**
  The PostgreSQL trigger function `handle_new_user()` executes on `AFTER INSERT ON auth.users` and copies metadata directly into `public.users`:
  ```sql
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 
          COALESCE(new.raw_user_meta_data->>'role', 'student')::user_role);
  ```
  In Supabase Auth, any unauthenticated visitor can call `supabase.auth.signUp()` and supply arbitrary key-value pairs in `options.data`. Because the database trigger trusts `new.raw_user_meta_data->>'role'`, an attacker can set `role: "super_admin"` or `role: "admin"`.
- **Possible Impact:**
  Any public attacker can register a new account with full `super_admin` privileges, gaining access to administrative dashboards, user databases, course deletions, and system records.
- **Reproduction Steps:**
  1. Open browser developer console or run a curl request:
     ```javascript
     supabase.auth.signUp({
       email: 'attacker@example.com',
       password: 'Password123!',
       options: { data: { role: 'super_admin', full_name: 'Attacker' } }
     })
     ```
  2. Inspect the created record in `public.users`. The `role` column will be set to `super_admin`.
- **Recommended Fix:**
  Do not read `role` from untrusted user metadata. Hardcode default role in the trigger to `'parent'` or `'student'`:
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
  Role elevations must be executed only by verified super admins via dedicated server actions.
- **Verification Method:** Test user registration with custom role payload and ensure `public.users.role` remains `'parent'`.
- **Current Status:** **CONFIRMED** (Awaiting user approval before applying database migration).

---

### SEC-RLS-001: Overly Permissive Authenticated RLS Policies (Full Admin Control)
- **Severity:** **CRITICAL** (CVSS 8.8 - `CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H`)
- **Affected File:** `fix_admin_rls.sql` (Lines 7, 12, 19, 24, 29, 34)
- **Technical Explanation:**
  The developer created administrative policies intended to allow administrators to edit and delete records. However, the policies were defined as:
  ```sql
  CREATE POLICY "Authenticated can manage courses" ON public.courses 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
  ```
  In Supabase, any user with an active account (including parents and students) receives the `authenticated` role from the JWT. Because the policy check is `USING (true)`, ANY authenticated user can INSERT, UPDATE, and DELETE all courses, assignments, modules, enrollments, trial requests, and teacher profiles.
- **Possible Impact:**
  Mass unauthorized data deletion, defacement of curriculum content, tampering with enrollments, and unauthorized alterations of student assignments.
- **Reproduction Steps:**
  1. Log in as a standard parent account.
  2. Using browser console or Supabase SDK:
     ```javascript
     await supabase.from('courses').delete().neq('id', '00000000-0000-0000-0000-000000000000');
     ```
  3. The request succeeds because RLS policy returns `true` for all authenticated accounts.
- **Recommended Fix:**
  Restrict management policies to check for administrative role:
  ```sql
  CREATE POLICY "Admins can manage courses" ON public.courses
    FOR ALL TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
      )
    );
  ```
- **Verification Method:** Attempt course deletion with parent JWT; verify Supabase returns HTTP 403 / RLS policy violation.
- **Current Status:** **CONFIRMED** (Awaiting user approval before updating production policies).

---

### SEC-RLS-002: Unauthenticated Public Access to Attendee PII (Event RSVPs)
- **Severity:** **HIGH** (CVSS 7.5 - `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N`)
- **Affected File:** `fix_rsvp_rls.sql` (Lines 15-18)
- **Technical Explanation:**
  The policy states:
  ```sql
  DROP POLICY IF EXISTS "Allow admins to read event_rsvps" ON public.event_rsvps;
  CREATE POLICY "Allow admins to read event_rsvps" 
  ON public.event_rsvps FOR SELECT USING (true);
  ```
  The policy lacks a `TO authenticated` clause and checks `USING (true)`. Consequently, any unauthenticated anonymous visitor can issue a GET request to `/rest/v1/event_rsvps` using the public anon key.
- **Possible Impact:**
  Direct harvesting of parents' full names, phone numbers, email addresses, and minor children's names and ages.
- **Reproduction Steps:**
  Execute curl request using public anon key:
  ```bash
  curl -H "apikey: <ANON_KEY>" "https://<PROJECT_REF>.supabase.co/rest/v1/event_rsvps?select=*"
  ```
- **Recommended Fix:**
  Restrict SELECT to administrators only:
  ```sql
  DROP POLICY IF EXISTS "Allow admins to read event_rsvps" ON public.event_rsvps;
  CREATE POLICY "Admins can view event_rsvps" ON public.event_rsvps
    FOR SELECT TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
      )
    );
  ```
- **Verification Method:** Query `event_rsvps` with anon key; confirm empty result array or 401 response.
- **Current Status:** **CONFIRMED**.

---

### SEC-STORAGE-001: Unrestricted Public Exposure of Government IDs & Minors' Birth Certs
- **Severity:** **HIGH** (CVSS 7.5 - `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N`)
- **Affected File:** `src/components/admission-form.tsx` (Lines 108-122)
- **Technical Explanation:**
  When parents apply for admission, the form uploads:
  - `admissions/birth_certs/<random>.pdf` (Child's official birth certificate)
  - `admissions/photos/<random>.jpg` (Minor student's photo)
  - `admissions/nids/<random>.pdf` (Guardian's National Identity card)
  These files are uploaded to the public `kidstime-assets` bucket and assigned public URLs via `supabase.storage.from('kidstime-assets').getPublicUrl(filePath)`.
- **Possible Impact:**
  Severe data protection and privacy violation (GDPR / child privacy violation). Publicly accessible government identity documents and minor photos without session token or access control.
- **Reproduction Steps:**
  Submit an admission form, copy the resulting `birth_certificate_url`, open it in an Incognito window without logging in; the file downloads directly.
- **Recommended Fix:**
  1. Create a dedicated **private** Supabase bucket: `admission-documents`.
  2. Implement RLS on `storage.objects` allowing INSERT for applicants and SELECT strictly for `role IN ('admin', 'super_admin')`.
  3. Generate temporary time-limited signed URLs (`createSignedUrl(path, 60)`) when viewed in the Admin Dashboard.
- **Verification Method:** Attempt to load document URL without authenticated admin session; verify 403 Forbidden.
- **Current Status:** **CONFIRMED**.

---

### SEC-API-001: Unauthenticated Public Database Mutation Endpoint (`GET /api/seed`)
- **Severity:** **HIGH** (CVSS 7.3 - `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:H/A:L`)
- **Affected File:** `src/app/api/seed/route.ts` (Lines 6-47)
- **Technical Explanation:**
  `GET /api/seed` initiates batch upserts of demo courses and assignments into Supabase using `NEXT_PUBLIC_SUPABASE_ANON_KEY`. There is no bearer token check, session validation, or rate limiting.
- **Possible Impact:**
  Any external crawler, automated bot, or malicious user can trigger repeated upserts, overwriting course content or consuming database IOPS.
- **Reproduction Steps:**
  ```bash
  curl -X GET "http://localhost:3000/api/seed"
  ```
  Returns `{"success": true, "message": "Demo data seeded successfully!..."}`.
- **Recommended Fix:**
  Gate the endpoint behind an internal environment variable secret:
  ```typescript
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.INTERNAL_SEED_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  ```
- **Verification Method:** Send GET request without bearer token; verify 401 Unauthorized.
- **Current Status:** **CONFIRMED**.

---

### SEC-HDR-001: Missing Core HTTP Defense Headers in Next.js Configuration
- **Severity:** **HIGH** (CVSS 7.2 - `CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:N`)
- **Affected File:** `next.config.ts` (Lines 1-19)
- **Technical Explanation:**
  `next.config.ts` does not implement the `headers()` async function. Consequently, HTTP responses lack:
  - `Content-Security-Policy`
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy`
  - `Strict-Transport-Security` (HSTS)
- **Possible Impact:**
  The site is vulnerable to Clickjacking attacks (framing inside malicious iframes to trick users into submitting actions), MIME-sniffing exploits, and excessive referrer leakage.
- **Recommended Fix:**
  Add defensive headers to `next.config.ts`:
  ```typescript
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
        ]
      }
    ];
  }
  ```
- **Verification Method:** Inspect HTTP response headers using `curl -I http://localhost:3000`.
- **Current Status:** **CONFIRMED**.

---

### SEC-IMG-001: Permissive Image Remote Patterns (`**`) & SVG Execution Risk
- **Severity:** **MEDIUM** (CVSS 6.1 - `CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:L/A:N`)
- **Affected File:** `next.config.ts` (Lines 4-16)
- **Technical Explanation:**
  ```typescript
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' }
    ]
  }
  ```
  Allowing all hostnames (`**`) enables any external domain to be proxied through the Next.js image optimization endpoint (`/_next/image`), creating an open image proxy and potential SSRF attack surface. Furthermore, `dangerouslyAllowSVG: true` without Content-Security-Policy can lead to stored XSS via embedded JavaScript in SVG payloads.
- **Recommended Fix:**
  Restrict `remotePatterns` to trusted hostnames (e.g., Supabase project storage domain, Unsplash, UI Avatars) and enforce SVG content disposition headers.
- **Current Status:** **CONFIRMED**.
