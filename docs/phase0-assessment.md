# Phase 0 – Repository Assessment

> Master spec Part 2 requires an architecture assessment before major structural changes.
> Scope of inspection: full repo at commit `8cc5c4f` (branch `JUDE-BETTLIN`).

## 1. Existing architecture

| Layer | Technology | Location |
|---|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript + Tailwind + custom CSS (`globals.css`) | `frontend/` |
| Backend | Spring Boot 3.2.5, Java 17, Maven | `services/` |
| Database | PostgreSQL (per-service DBs, Flyway migrations, JPA validate) | each service |
| Docs | Markdown | `docs/` |

## 2. Services inventory

| Service | Port | Contents |
|---|---|---|
| student-service | 8081 | Student domain scaffold |
| advocate-service | 8082 | **Bar Council verification module** (VerificationRequest/Response DTOs, `BarCouncilVerification` entity, `BarCouncilVerificationService`, controller, repository, `VerificationStatus` enum) — review workflow PENDING → VERIFIED/REJECTED/EXPIRED; records submissions, does **not** confirm enrolment with a Bar Council |
| client-service | 8083 | Client domain scaffold |
| legal-library-service | 8084 | Legal library content |
| ai-service | 8085 | AI solutions scaffold (demo responses framed as unverified) |

Conventions found: `com.lexsupermus.<service>` packages, UUID PKs, Lombok builders, Flyway `db/migration`, `application.yml` with `${ENV:default}` config, springdoc OpenAPI at `/api-docs`, CORS from `CORS_ORIGINS` env.

## 3. Existing authentication implementation

- Frontend: `/login` with 3 role cards + Sign In/Sign Up tabs (`AuthPanel.tsx`) — **demo only**, no backend call.
- Backend: **none of the 5 services has user registration/login**. JWT config keys exist in `application.yml` files but no JWT/auth code. → auth implementation must be created (spec: "If the existing repository has no implementation for a particular feature, create it following the existing architecture").
- Existing Bar Council verification engine in advocate-service stays; auth-service will not duplicate it.

## 4. Identified gaps (mapped to spec parts)

| Spec part | Status in repo |
|---|---|
| Part 3–5 registration UI | Old single-panel form; needs landing + role-specific multi-step forms |
| Part 6 verification engine | Advocate Bar Council review module exists; status set smaller than 6.5; no badge logic |
| Part 7 DigiLocker | Not present |
| Part 8 KYC providers | Not present |
| Part 9 admin dashboard | Hidden `/admin` portal page only; no verification queue |
| Part 10 auth & security | Not implemented (only env placeholders) |
| Part 11 database | Only service-domain tables; no users/profiles/verification tables |
| Part 12 APIs | Only bar-council verification endpoint |
| Part 13 pages | Portal placeholders exist (hidden from nav) |
| Part 14 document storage | Not present |
| Part 15 compliance | Demo framing + disclaimer notices present; no consent records |
| Part 17 tests | None |

## 5. Environment / tooling state

- Maven 3.9.11 + Java 21 available (compiles Java 17 target).
- PostgreSQL **not installed locally** → services can compile but not run; runtime testing blocked until DB available (report as blocked, per Part 20 rule 20).
- No secrets committed; all credentials via env vars. `.env.example` documents ports.

## 6. Implementation decisions (following existing architecture)

1. **New `auth-service` (port 8086)** rather than overloading per-service User models — matches microservice pattern already used; avoids duplicating user tables in 5 services.
2. Keep advocate-service's Bar Council module as the professional verification engine (Phase 4 will wire auth-service → advocate-service).
3. Frontend reuses existing theme classes (`panel`, `item`, `pill`, `notice`, `authtab`); new multi-step forms added as separate components; old `AuthPanel` logic replaced but role cards pattern preserved.
4. Migrations, not schema drops. No existing module overwritten.
5. Registration writes real rows (users + role profile) via auth-service; frontend falls back to a clearly labelled demo message only when auth-service is unreachable — no fake success/verification results.
