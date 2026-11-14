# Dependency Vulnerability Audit Report

**Application:** Kids Time Khilgaon  
**Package Manager:** npm (Lockfile v3, `package-lock.json`)  
**Audit Timestamp:** November 14, 2026  
**Auditor:** Senior DevSecOps Engineering Team  

---

## 1. Executive Summary

A comprehensive automated dependency security scan was conducted using `npm audit`.

### Summary of Vulnerabilities
| Severity Level | Count | Definition & Action Guideline |
|---|---|---|
| **CRITICAL** | **2** | Actively exploitable remote code execution or complete system compromise. Immediate patching advised. |
| **HIGH** | **16** | Memory exhaustion, authentication bypass, or denial of service in library functions. Targeted updates recommended. |
| **MODERATE** | **40** | Path traversal on specific OS environments, parser bugs, or controlled edge cases. Monitor and update during regular maintenance. |
| **LOW** | **1** | Minor prototype or informational discrepancies with negligible production impact. |
| **TOTAL** | **59** | Evaluated across 821 total dependency trees. |

> [!NOTE]
> Per Critical Operating Rules, **no automatic forced upgrades (`npm audit fix --force`) were executed**, ensuring that existing application packages and framework compatibilities remain stable and non-breaking.

---

## 2. Key High & Critical Vulnerability Breakdown

### 1. Zod - Memory Exhaustion via Oversized Constrained Collections
- **Severity:** **HIGH** (CVSS 7.5 - `CWE-770`)
- **Direct/Transitive:** Direct (`zod@^4.4.3`) & Transitive under `shadcn`
- **Advisory:** [GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5)
- **Vulnerable Range:** `<4.6.6`
- **Technical Description:**
  Zod validators handling deeply nested or oversized collections without explicit length bounds can consume excessive heap memory during parsing, leading to process crash / Denial of Service.
- **Impact in Application:**
  Contact and Admission forms use Zod schemas for input validation. Extremely large input payloads sent by an attacker could degrade Node.js event loop performance.
- **Recommended Remediation:**
  Upgrade `zod` to `>=4.6.6` once tested in staging.

---

### 2. Sharp / libvips / librsvg - Inherited Native Memory Corruptions
- **Severity:** **HIGH** (CVSS - `CWE-1395`, `CWE-122`, `CWE-416`)
- **Direct/Transitive:** Transitive dependency under Next.js image optimization
- **Advisories:** [GHSA-f88m-g3jw-g9cj](https://github.com/advisories/GHSA-f88m-g3jw-g9cj), [GHSA-rgj7-g3m4-5g8c](https://github.com/advisories/GHSA-rgj7-g3m4-5g8c), [GHSA-wq5f-xc86-pv6w](https://github.com/advisories/GHSA-wq5f-xc86-pv6w)
- **Vulnerable Range:** `<0.35.5`
- **Technical Description:**
  Underlying C/C++ libraries in `sharp` (libvips, librsvg) contain heap buffer overflows and use-after-free vulnerabilities when processing crafted malicious SVG or image files.
- **Impact in Application:**
  Processing untrusted user-uploaded images or SVG files through image optimization could trigger memory crashes.
- **Recommended Remediation:**
  Update to Next.js `16.4.x` / latest patch version during scheduled maintenance.

---

### 3. Source-Map-JS - Event Loop Denial of Service
- **Severity:** **HIGH** (CVSS 7.5 - `CWE-1284`)
- **Direct/Transitive:** Transitive dependency under PostCSS
- **Advisory:** [GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q)
- **Vulnerable Range:** `>=1.0.0 <1.2.2`
- **Technical Description:**
  Event loop DoS through indexed source map section offsets during build transformations.
- **Impact in Application:**
  Build-time only. Zero runtime exposure to web visitors.
- **Recommended Remediation:**
  Update PostCSS tools via `npm update source-map-js`.

---

### 4. @modelcontextprotocol/sdk & @hono/node-server
- **Severity:** **HIGH** & **MODERATE**
- **Direct/Transitive:** Transitive dependencies pulled in by CLI utilities (e.g., shadcn CLI tooling)
- **Advisories:** [GHSA-6qxp-vccf-f47h](https://github.com/advisories/GHSA-6qxp-vccf-f47h), [GHSA-22jm-h49p-29qw](https://github.com/advisories/GHSA-22jm-h49p-29qw)
- **Impact in Application:**
  These packages are not used in client runtime or production request handling; they are part of offline development tools.
- **Recommended Remediation:**
  Update `shadcn` CLI to the latest minor version when upgrading dev toolchains.

---

## 3. Remediation Roadmap

1. **Short-Term (Immediate Safe Actions):**
   - Keep GitHub Dependabot enabled (`.github/dependabot.yml` configured).
   - Set up pull request reviews for automated vulnerability alerts.
2. **Medium-Term (Scheduled Sprint):**
   - Increment minor patch versions of `zod` and `sharp` in a dedicated staging branch.
   - Run `npm run test` and `npm run test:e2e` to verify zero regression before merging.
3. **Long-Term Policy:**
   - Execute `npm run audit:dependencies` before every major release.
   - Prohibit committing packages with unreviewed Critical CVEs.
