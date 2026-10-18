# A R GREEN GARDEN — PRE-DEPLOYMENT VERIFICATION REPORT (DEPLOY_CHECK.md)

**Generated:** 2026-10-18  
**Target Branch:** `dashboard-redesign`  
**Build Environment:** Next.js 16.3.0 (Turbopack) / React 19 / Prisma 6.19.3  

---

## 1. Security & Secrets Audit

| Check | Requirement | Result | Proof / Command Output | Status |
|---|---|---|---|---|
| **.env Tracking** | `.env` must NOT be tracked in git | PASSED | `git ls-files .env` returns empty stdout.<br>`.gitignore` contains line 34: `.env*` | ✅ PASS |
| **JWT_SECRET Hardcoded Fallback** | No `"secret"`, `"fallback"`, or default secret string allowed | PASSED | Searched `src` for `JWT_SECRET`. `src/lib/auth.ts:22` strictly throws:<br>`FATAL SECURITY ERROR: JWT_SECRET environment variable is missing or empty.` Zero fallback matches. | ✅ PASS |
| **JWT Cookie Security Flags** | Auth cookies must have `httpOnly: true`, `sameSite: "lax"`, `secure` | PASSED | Verified across `/api/auth/login`, `/api/auth/register`, `/api/auth/logout`, `/api/auth/logout-all`, and `/api/auth/change-password`. All issue `auth-token` with `httpOnly: true`, `sameSite: "lax"`, and `secure: process.env.NODE_ENV === "production"`. | ✅ PASS |
| **Token Invalidation on Password Change** | Passwords/logout must revoke existing tokens | PASSED | Implemented `tokenVersion` counter on User model. Verified on each request in `getCurrentUser()`. Changing password or calling `/api/auth/logout-all` increments `tokenVersion`, invalidating tokens across other devices immediately. | ✅ PASS |
| **Public Upload Restrictions** | Public upload must have rate limit, magic byte validation, 5MB ceiling | PASSED | Split `/api/upload` (public, 5MB max, magic bytes validation for JPEG/PNG/WEBP, IP rate limit) and `/api/upload/admin` (strictly protected by `requireEditor`). | ✅ PASS |
| **Sensitive Data Exposure on GET** | Public GET endpoints must not expose cost/salaries/passwords | PASSED | `/api/projects`, `/api/employees`, `/api/inventory` conditionally scrub sensitive fields (`internalCost`, `clientPhone`, `salary`, `nidNumber`, `costPrice`, `supplierInfo`) for unauthenticated visitors. | ✅ PASS |

---

## 2. API Routes & Guard Matrix

All 51 API endpoints are audited and mapped below:

| Endpoint | Method(s) | Access Level / Auth Guard | Rate Limiting | Audit Logged |
|---|---|---|---|---|
| `/api/auth/login` | POST | Public | 5 req / 15m (IP) | Failed & Success |
| `/api/auth/register` | POST | Public | 3 req / 1h (IP) | Yes |
| `/api/auth/logout` | POST | Public | - | - |
| `/api/auth/logout-all` | POST | Authenticated (`getCurrentUser`) | - | Yes |
| `/api/auth/change-password` | POST | Authenticated (`getCurrentUser`) | 5 req / 15m (IP) | Yes |
| `/api/auth/me` | GET | Authenticated (`getCurrentUser`) | - | - |
| `/api/admin/users` | GET, POST | `requireAdmin` | - | Yes |
| `/api/admin/users/[id]` | PUT, DELETE | `requireAdmin` | - | Yes |
| `/api/admin/activity-logs` | GET | `requireAdmin` | - | - |
| `/api/admin/backup/export` | GET | `requireAdmin` | - | Yes |
| `/api/admin/overview` | GET | `requireEditor` | - | - |
| `/api/admin/counts` | GET | `requireEditor` | - | - |
| `/api/admin/reviews` | GET | `requireModerator` | - | - |
| `/api/admin/reviews/[id]` | PUT, DELETE | `requireModerator` | - | Yes |
| `/api/settings` | GET, POST | GET: Public / POST: `requireEditor` (studio keys) or `requireAdmin` (core keys) | - | Yes |
| `/api/projects` | GET, POST | GET: Public (filtered) / POST: `requireEditor` | - | Yes |
| `/api/projects/[id]` | GET, PUT, DELETE | GET: Public / PUT, DELETE: `requireEditor` | - | Yes |
| `/api/services` | GET, POST | GET: Public / POST: `requireEditor` | - | Yes |
| `/api/services/[id]` | GET, PUT, DELETE | GET: Public / PUT, DELETE: `requireEditor` | - | Yes |
| `/api/service-cards` | GET, POST | `requireEditor` | - | Yes |
| `/api/service-cards/[id]` | GET, PUT, DELETE | `requireEditor` | - | Yes |
| `/api/invoices` | GET, POST, PUT | `requireEditor` | - | Yes |
| `/api/accounting` | GET, POST | `requireAdmin` | - | Yes |
| `/api/inventory` | GET, POST | GET: Public (safe fields) / POST: `requireAdmin` | - | Yes |
| `/api/employees` | GET, POST, PUT, DELETE | GET: Public (safe fields) / Staff: `requireAdmin` | - | Yes |
| `/api/attendance` | GET, POST | `requireEditor` | - | Yes |
| `/api/assignments` | GET, POST | `requireEditor` | - | Yes |
| `/api/maintenance` | GET, POST, PUT, DELETE | `requireEditor` | - | Yes |
| `/api/plant-health` | GET, POST, PUT | `requireEditor` | - | Yes |
| `/api/quotations` | GET, POST, PUT, DELETE | `requireEditor` | - | Yes |
| `/api/bookings` | GET, POST | GET: `requireModerator` / POST: Public | 5 req / 10m (IP) | Yes |
| `/api/bookings/[id]` | PUT, DELETE | `requireModerator` | - | Yes |
| `/api/consultations` | GET, POST | GET: `requireModerator` / POST: Public | 5 req / 10m (IP) | Yes |
| `/api/tree-doctor` | GET, POST | GET: `requireModerator` / POST: Public | 5 req / 10m (IP) | Yes |
| `/api/design-requests` | GET, POST | GET: `requireEditor` / POST: Public | 5 req / 10m (IP) | Yes |
| `/api/careers` | GET, POST | GET: `requireEditor` / POST: Public | 3 req / 1h (IP) | Yes |
| `/api/careers/[id]` | PUT, DELETE | `requireEditor` | - | Yes |
| `/api/messages` | GET, POST | GET: `requireModerator` / POST: Public | 5 req / 10m (IP) | Yes |
| `/api/messages/[id]` | PUT, DELETE | `requireModerator` | - | Yes |
| `/api/reviews` | GET, POST | GET: Public / POST: Public | 3 req / 10m (IP) | Yes |
| `/api/blogs` | GET, POST | GET: Public / POST: `requireEditor` | - | Yes |
| `/api/blogs/[id]` | GET, PUT, DELETE | GET: Public / PUT, DELETE: `requireEditor` | - | Yes |
| `/api/blogs/[id]/comments` | GET, POST | GET: Public / POST: Public | 5 req / 10m (IP) | Yes |
| `/api/gallery` | GET, POST | GET: Public / POST: `requireEditor` | - | Yes |
| `/api/gallery/[id]` | PUT, DELETE | `requireEditor` | - | Yes |
| `/api/notifications` | GET | `requireModerator` | - | - |
| `/api/cron/reminders` | GET | `CRON_SECRET` Bearer Authorization | - | Yes |
| `/api/payments/sslcommerz/init` | POST | Verified client / Authenticated user | 10 req / 10m (IP) | Yes |
| `/api/payments/sslcommerz/callback` | POST | Public (SSLCommerz IPN verification) | - | Yes |
| `/api/upload` | POST | Public (Image only, 5MB max, magic bytes) | 10 req / 10m (IP) | - |
| `/api/upload/admin` | POST | `requireEditor` | - | Yes |

---

## 3. Brand & External Assets Audit

| Check | Search Pattern | Matches in Code | Result |
|---|---|---|---|
| **External Agency Domains** | `shmadesigns.com`, `shma.` | 0 matches | ✅ CLEAN |
| **Unsplash In Brand / Layout Meta** | `unsplash` in layouts/meta | 0 matches (Hero/layout metadata uses local botanical assets e.g. `/hero_plants.png`) | ✅ CLEAN |
| **Design System Attribution** | "shma" in CSS tokens | Kept strictly as aesthetic design system variable tokens (`--shma-linen`, `--shma-dark`) without external domain references. | ✅ OK |

---

## 4. Code Quality & Performance

| Metric | Measured Value | Standard | Status |
|---|---|---|---|
| **TypeScript Typecheck** | `0 errors` | `npx tsc --noEmit` exit code 0 | ✅ PASS |
| **Production Build** | `0 errors` (All 36 pages generated) | `npm run build` exit code 0 | ✅ PASS |
| **Console Logs in `src`** | `0 matches` | Exactly 0 `console.log` in `src` | ✅ PASS |
| **Touch Target Size** | `>= 44px` on mobile | Responsive audit confirmed across 360px–1440px | ✅ PASS |
| **Sitemap & Robots** | `sitemap.xml`, `robots.txt` | Automatically rendered routes compiled into build | ✅ PASS |
| **Legal Pages Warning Banners** | 3 pages | `[আসল শর্ত বসাতে হবে]` present on Terms, Privacy, Refund | ✅ PASS |

---

## 5. Verification Sign-off

- [x] All 51 API endpoints accounted for with role-based access control.
- [x] Token versioning actively revokes sessions upon credential modification.
- [x] Activity logging records administrative actions with automatic data sanitization.
- [x] Full database export endpoint functional without leaking hash credentials.
- [x] No `console.log` calls present in production source code.
- [x] TypeScript compiler and Next.js production build pass cleanly.
