# AI Coding Agent Security & Quality Directives

> [!IMPORTANT]
> All AI coding assistants, agents, and automated tools working on this codebase MUST strictly adhere to the following security rules and engineering standards.

---

## 1. Core Security & Credential Rules
1. **Never Expose API Keys or Private Credentials:**
   - Never commit API keys, database connection strings, passwords, or private tokens to the repository.
   - Never output raw secret values into terminal logs, markdown reports, or artifacts.
2. **Never Put Private Credentials in Frontend Code:**
   - Any secret prefixed without `NEXT_PUBLIC_` (such as `SUPABASE_SERVICE_ROLE_KEY` or payment gateway secrets) must NEVER be referenced in client components (`"use client"`).
   - Only expose public anon keys (`NEXT_PUBLIC_SUPABASE_ANON_KEY`) in client code.

---

## 2. Authentication & Authorization Directives
3. **Never Bypass Authentication:**
   - Do not remove or comment out authentication middleware, proxy guards, or session checks.
   - Do not assume hiding frontend buttons or links provides security; all permissions MUST be enforced on the server side and at the database layer.
4. **Never Disable Row Level Security (RLS) to Fix Database Issues:**
   - If a database query fails due to RLS, author an explicit, least-privilege policy.
   - NEVER execute `ALTER TABLE ... DISABLE ROW LEVEL SECURITY;`.
5. **Never Weaken Authorization to Make Tests Pass:**
   - Do not replace secure RLS checks with `USING (true)` or `WITH CHECK (true)` merely to facilitate test execution.
   - Tests requiring administrative actions must use authentic mocked admin sessions or service-role test fixtures.
6. **Never Suppress Security Warnings Without Justification:**
   - Do not add `eslint-disable` or suppress security checks without explicit documentation of why the exception is safe.
7. **Never Delete Security Checks:**
   - Preserving defensive code is mandatory. Do not delete route guards, input sanitizers, or permission checks during refactoring.

---

## 3. Database Safety & Change Control
8. **Never Make Destructive Database Changes Without Approval:**
   - Do not drop tables, truncate collections, or delete production records without explicit written user approval.
9. **Never Automatically Modify Production Security Policies:**
   - Provide proposed SQL policy modifications as documented migration scripts and request explicit confirmation from the human engineer before applying them to production databases.

---

## 4. Input Validation & Defense-in-Depth
10. **Validate All External Inputs:**
    - Always validate route parameters, request bodies, and form inputs using robust schemas (e.g. Zod).
    - Sanitize user-generated HTML content with DOMPurify before rendering.
11. **Enforce Server-Side Authorization:**
    - Every API route handler and mutating Server Action must independently verify the user's identity and permissions.

---

## 5. Testing & Quality Requirements
12. **Write Tests for New Functionality:**
    - New UI components must include corresponding Vitest tests.
    - New application workflows must include Playwright E2E tests.
13. **Run Relevant Quality and Security Checks After Modifications:**
    - Before declaring a coding task complete, run:
      - `npm run audit:quality` (ESLint + TypeScript compilation)
      - `npm run audit:security` (Security & secret scanner)
      - `npm run test` (Unit test suite)
    - Confirm zero errors and zero regressions.
