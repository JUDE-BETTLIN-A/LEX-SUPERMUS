# LEX SUPERMUS — Prototype → Code Mapping

The single-file interactive walkthrough
(`LEX_SUPERMUS_interactive_walkthrough.html`) has been split into the
project structure below. This document is the index: **which prototype code
lives in which file**.

---

## 1. Global pieces

| Prototype code | File |
| --- | --- |
| `<style>…</style>` (all CSS) | `frontend/src/styles/globals.css` |
| Hero background `url("data:image/jpeg;base64,…")` (758 KB inline) | `frontend/public/hero.jpg` (referenced as `url("/hero.jpg")`) |
| `<header>` + `<nav id="topnav">` | `frontend/src/components/SiteHeader.tsx` |
| `<div class="footer">` | `frontend/src/components/SiteFooter.tsx` |
| `<main>` wrapper | `frontend/src/app/layout.tsx` (root layout) |
| `go(page)` page switcher | Next.js routing — `href` links + `usePathname()` active state |
| `document.getElementById('…')` tab wiring | React `useState` in each portal component |

## 2. Pages (App Router)

| Prototype code | Route | File |
| --- | --- | --- |
| `<section id="home">` (hero, ecosystem cards, feature grid) | `/` | `frontend/src/app/(public)/page.tsx` |
| `<section id="student">` + `studentTab()` | `/student` | `frontend/src/app/student/page.tsx` → `components/portals/StudentPortal.tsx` |
| `<section id="advocate">` + `advTab()` | `/advocate` | `frontend/src/app/advocate/page.tsx` → `components/portals/AdvocatePortal.tsx` |
| `<section id="client">` + `clientTab()` | `/client` | `frontend/src/app/client/page.tsx` → `components/portals/ClientPortal.tsx` |
| `<section id="admin">` + `adminTab()` | `/admin` | `frontend/src/app/admin/page.tsx` → `components/portals/AdminPortal.tsx` |
| `<section id="library">` + `searchLibrary()` | `/library` | `frontend/src/app/(public)/library/page.tsx` |
| `<section id="ai">` + `setAI()` / `sendAI()` | `/ai` | `frontend/src/app/(public)/ai/page.tsx` → `components/AiWorkspace.tsx` |

Shared portal chrome (`<aside class="sidebar">` + `<div class="panel">`):
`frontend/src/components/PortalShell.tsx` — replaces the four duplicated
`…Tab()` sidebar-switcher functions.

## 3. Frontend support files

| File | Purpose |
| --- | --- |
| `frontend/src/lib/navigation.ts` | Top-nav items (replaces `data-page` attributes) |
| `frontend/src/lib/api.ts` | Axios client for the five backend services |
| `frontend/src/types/index.ts` | Shared types (roles, verification status, library results) |

## 4. Backend mapping (demo UI → future API)

The prototype's `alert('Demo: …')` actions become REST calls:

| Prototype demo action | Service | Endpoint |
| --- | --- | --- |
| Bar Council verification submit/review | `advocate-service` (:8082) | `POST /api/bar-council/verifications`, `…/{id}/verify`, `…/{id}/reject` |
| Library search | `legal-library-service` (:8084) | `GET /api/library/search?q=…` |
| Career AI / Legal AI chat | `ai-service` (:8085) | `POST /api/ai/chat` |
| Resume/jobs/applications tabs | `student-service` (:8081) | `/api/students/**`, `/api/courses/**` |
| Lawyer search / issue assistant / documents | `client-service` (:8083) | `/api/clients/**`, `/api/consultations/**` |
| Admin verification queue | `advocate-service` | `GET /api/bar-council/verifications?status=PENDING` |

## 5. Non-negotiable demo framing

Every AI reply and prototype notice keeps the required wording:

- **"Please independently verify legal information."** (appended to each
  reply by `ai-service` and shown by `AiWorkspace`)
- Library results: *"connect authoritative sources … before treating any text
  as current law."*
- Advocate verification: *"No external verification performed."*

Bar Council verification requirements:
`docs/LEX_SUPERMUS_Advocate_Bar_Council_Verification_Module.pdf`
(implemented in `services/advocate-service/.../BarCouncilVerification*`).

## 6. Not done yet (later)

- Docker / docker-compose / nginx (deferred by decision)
- JWT security wiring (controllers take explicit IDs for now)
- Real LLM provider + corpus ingestion behind `ai-service` / `legal-library-service`
