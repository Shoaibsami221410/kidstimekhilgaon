# Next.js & API Security Audit Report

**Application:** Kids Time Khilgaon  
**Architecture:** Next.js 16.2.7 App Router  
**Date:** November 14, 2026  
**Auditor:** Senior Application Security & Next.js Architecture Team  

---

## 1. Scope & Component Summary

| Component | Path | Inspection Status | Security Evaluation |
|---|---|---|---|
| **Route Handler (Seeding)** | `src/app/api/seed/route.ts` | Inspected | **HIGH RISK** (Unauthenticated database upserts) |
| **Server Action (Revalidation)** | `src/app/actions.ts` | Inspected | **LOW RISK** (Cache revalidation only, safe) |
| **Middleware / Proxy** | `src/proxy.ts` -> `src/lib/supabase/middleware.ts` | Inspected | **MEDIUM RISK** (Role verification relies on untrusted metadata before DB check) |
| **Next.js Config** | `next.config.ts` | Inspected | **HIGH RISK** (Missing security headers, wildcard image patterns) |
| **Supabase SSR Server Client** | `src/lib/supabase/server.ts` | Inspected | **PASS** (Correct HTTP cookie handling via `@supabase/ssr`) |

---

## 2. API Security Analysis

### A. Broken Access Control & IDOR (Insecure Direct Object Reference)
1. **Frontend-Only Authorization vs Server-Side Enforcement:**
   - In Next.js client pages (e.g. `src/app/dashboard/users/page.tsx`, `src/app/dashboard/events/page.tsx`), data is fetched directly using the browser Supabase client:
     ```typescript
     const { data } = await supabase.from('users').select('*');
     ```
   - If an attacker bypasses the client UI (for instance, by crafting direct REST API calls using Postman or Python with an authenticated JWT token), the server-side Next.js route is bypassed completely. Therefore, **authorization MUST be enforced at the Supabase database/RLS layer**, not merely via UI redirects or hiding sidebar links.
2. **Parent Dashboard Multi-Tenant Scoping:**
   - In `src/app/parent/page.tsx`:
     ```typescript
     const { data: students } = await supabase.from('students').select('id, first_name').eq('parent_id', user.id);
     ```
   - While the UI correctly passes `.eq('parent_id', user.id)`, the underlying RLS policy in `supabase/fix_rls.sql` permits `SELECT TO authenticated USING (true)`. A malicious authenticated parent could remove the query filter and retrieve student profiles belonging to other parents.

---

### B. Unauthenticated Seeding Endpoint (`/api/seed`)
- **Location:** `src/app/api/seed/route.ts`
- **Method:** `GET`
- **Finding:**
  The route accepts unauthenticated public requests and triggers upserts of 6 demo courses and 6 assignments into Supabase:
  ```typescript
  export async function GET(request: Request) {
    const supabase = createClient(supabaseUrl, supabaseKey);
    await supabase.from('courses').upsert(demoCourses);
    await supabase.from('assignments').upsert(demoAssignments);
    return NextResponse.json({ success: true, ... });
  }
  ```
- **Remediation:**
  Protect the route with a secret environment variable or restrict execution to non-production environments:
  ```typescript
  if (process.env.NODE_ENV === 'production') {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.INTERNAL_SEED_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }
  ```

---

### C. Server Actions Security (`src/app/actions.ts`)
- **Code Inspection:**
  ```typescript
  'use server'
  import { revalidatePath } from 'next/cache'

  export async function clearSiteCache() {
    revalidatePath('/', 'layout')
    revalidatePath('/(public)', 'layout')
  }
  ```
- **Analysis:**
  The server action triggers Next.js cache purging.
- **CSRF Consideration:** Next.js Server Actions have built-in CSRF protection via POST-based action IDs and matching Host/Origin request headers.
- **Access Control:** `clearSiteCache` is currently callable without role verification. While it only triggers revalidation (non-destructive), it is recommended to restrict cache clearing to administrators:
  ```typescript
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  ```

---

### D. Middleware / Proxy Route Protection (`src/proxy.ts`)
- **Inspection of `src/lib/supabase/middleware.ts`:**
  - Route protection properly enforces authentication on `/dashboard/*`, `/parent/*`, `/lms/*`, and `/admissions/*`.
  - Unauthenticated requests are redirected to `/login`.
  - Authenticated non-admins attempting to access `/dashboard` are redirected to `/parent`.
- **Role Verification Observation:**
  Line 38 initially reads:
  ```typescript
  let role = user?.user_metadata?.role;
  ```
  While it subsequently attempts to fetch the authoritative role from `public.users`, if `user_metadata` contains a spoofed role, it may be trusted before fallback.
- **Recommendation:** Always read the user role strictly from the verified database record in `public.users` or from secure custom claims set by the service role.

---

### E. HTTP Security Headers
- **Assessment:** `next.config.ts` does not emit security headers.
- **Recommended Configuration:**
  ```typescript
  const nextConfig: NextConfig = {
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            { key: 'X-DNS-Prefetch-Control', value: 'on' },
            { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
            { key: 'X-Frame-Options', value: 'DENY' },
            { key: 'X-Content-Type-Options', value: 'nosniff' },
            { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
            { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
          ]
        }
      ]
    }
  };
  ```

---

### F. Injection & Cross-Site Scripting (XSS)
- **SQL Injection:**
  - The project exclusively utilizes the Supabase PostgREST client (`supabase.from(...).select(...)`) with parameterized filters (`.eq()`, `.in()`).
  - No raw string concatenation in SQL queries exists in application code.
- **Cross-Site Scripting (XSS):**
  - Next.js React JSX automatically encodes variables by default.
  - The TipTap rich text editor in `src/components/rich-text-editor.tsx` parses HTML. Ensure that any HTML saved into `page_content` is sanitized using `DOMPurify` before rendering on client pages.
