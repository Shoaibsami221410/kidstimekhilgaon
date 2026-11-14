# Quality Assurance (QA) Standards & Guidelines

**Application:** Kids Time Khilgaon  
**Maintainer:** DevSecOps & QA Engineering Team  

---

## 1. Quality Assurance Philosophy

This project adheres to an **Iterative, Test-Driven DevSecOps framework**. Code merged into the `main` branch must satisfy four non-negotiable quality gates:

1. **Zero TypeScript Errors:** `tsc --noEmit` must complete with exit code 0.
2. **Zero ESLint Errors:** `eslint` must run without breaking syntax or rule errors.
3. **100% Passing Unit & Component Tests:** Vitest test suite must pass completely.
4. **Clean Production Build:** `next build` with Turbopack must compile and prerender all application routes successfully.

---

## 2. Code Quality Commands

| Command | Purpose | When to Run |
|---|---|---|
| `npm run lint` | Runs ESLint across all application source code. | Pre-commit / local dev. |
| `npm run lint:fix` | Automatically fixes autofixable formatting and ESLint issues. | When lint reports fixable errors. |
| `npm run typecheck` | Validates TypeScript types across the codebase with `tsc --noEmit`. | Pre-commit / before pull requests. |
| `npm run audit:quality` | Combined command running ESLint and TypeScript compilation. | During local QA audit. |
| `npm run build` | Compiles optimized Next.js production build with Turbopack. | Prior to production release. |

---

## 3. ESLint & TypeScript Standards

### Key Configuration Directives (`eslint.config.mjs`)
- **Next Core Web Vitals:** Enforces performance rules for images, fonts, and script tags (`@next/next/no-img-element` is surfaced as a performance warning).
- **TypeScript Strictness:** Strict type checking enabled in `tsconfig.json`. Use explicit types for component props and API responses; avoid `any`.
- **Global Ignores:** Build artifacts (`.next/`, `build/`), test reports (`playwright-report/`), and root utility scripts are excluded to keep CI runs deterministic and focused on application runtime code.

---

## 4. Pre-Merge Quality Checklist

Before submitting a Pull Request or pushing to `main`:
- [ ] Run `npm run audit:quality` -> Must exit with code 0.
- [ ] Run `npm run test` -> All 2,392+ unit tests must pass.
- [ ] Run `npm run build` -> Next.js production build must succeed.
- [ ] Run `npm run audit:security` -> Verify no hardcoded secrets or broken policy patterns.
