# LEX SUPERMUS — Architecture Overview

> This document describes the high-level architecture, communication patterns, security model, and deployment strategy for the LEX SUPERMUS platform.

---

## Table of Contents

- [System Overview](#system-overview)
- [Architecture Diagram](#architecture-diagram)
- [Service Descriptions](#service-descriptions)
- [Communication Patterns](#communication-patterns)
- [Security Architecture](#security-architecture)
- [Database Strategy](#database-strategy)
- [Deployment Architecture](#deployment-architecture)

---

## System Overview

LEX SUPERMUS is built on a **microservices architecture** where each bounded context in the legal domain is encapsulated in its own independently deployable service. This approach provides:

- **Independent scaling** — Scale advocate-service during peak case filing hours without affecting student-service.
- **Technology flexibility** — Each service can evolve its internal stack independently.
- **Fault isolation** — A failure in one service does not cascade across the platform.
- **Team autonomy** — Separate teams can own, develop, and deploy services on independent release cycles.

The platform follows the **API-first** design principle. All service interfaces are defined as REST contracts before implementation, ensuring consistency and enabling parallel frontend/backend development.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENTS                                    │
│                   (Browsers, Mobile Apps, API Consumers)                 │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │ HTTPS
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        NGINX REVERSE PROXY                              │
│                                                                         │
│   • TLS termination          • Rate limiting                            │
│   • Static asset serving     • Load balancing                           │
│   • Route-based proxying     • CORS headers                             │
│                                                                         │
│   Routes:                                                               │
│     /                    → frontend:3000                                 │
│     /api/students/**     → student-service:8081                         │
│     /api/advocates/**    → advocate-service:8082                        │
│     /api/clients/**      → client-service:8083                          │
│     /api/bar-council/**  → advocate-service:8082                        │
│     /api/courses/**      → student-service:8081                         │
│     /api/consultations/**→ client-service:8083                          │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
          ▼                    ▼                    ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│  STUDENT SERVICE │ │ ADVOCATE SERVICE │ │  CLIENT SERVICE  │
│     (Port 8081)  │ │   (Port 8082)   │ │   (Port 8083)    │
│                  │ │                  │ │                  │
│ • User mgmt     │ │ • User mgmt     │ │ • User mgmt      │
│ • Student       │ │ • Advocate       │ │ • Client         │
│   profiles      │ │   profiles      │ │   profiles       │
│ • Courses &     │ │ • Bar Council   │ │ • Consultations  │
│   enrollment    │ │   verification  │ │ • Case requests  │
│ • Moot courts   │ │ • Case mgmt    │ │ • Reviews        │
│ • Internships   │ │ • Client        │ │ • Bookings       │
│ • Resources     │ │   assignments   │ │                  │
│                  │ │ • Documents     │ │                  │
└────────┬─────────┘ └────────┬────────┘ └────────┬─────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│  lex_student DB  │ │ lex_advocate DB  │ │  lex_client DB   │
│   (Schema)       │ │   (Schema)       │ │   (Schema)       │
└──────────────────┘ └──────────────────┘ └──────────────────┘
                    PostgreSQL 16 Instance

          ┌────────────────────────────────────────┐
          │          PLANNED SERVICES              │
          │                                        │
          │  ┌──────────────┐  ┌────────────────┐  │
          │  │Legal Library │  │   AI Service   │  │
          │  │  (Port 8084) │  │  (Port 8085)   │  │
          │  │              │  │                │  │
          │  │ • Case law   │  │ • Legal        │  │
          │  │ • Statutes   │  │   research     │  │
          │  │ • Citations  │  │ • Doc analysis │  │
          │  │ • Full-text  │  │ • Contract     │  │
          │  │   search     │  │   review       │  │
          │  └──────────────┘  └────────────────┘  │
          └────────────────────────────────────────┘
```

---

## Service Descriptions

### Student Service (Port 8081)

The Student Service manages the entire lifecycle of law students on the platform.

| Responsibility           | Description                                                    |
| ------------------------ | -------------------------------------------------------------- |
| **User Management**      | Student registration, authentication, and profile management   |
| **Course Management**    | Browse, enroll, and track progress across legal courses         |
| **Moot Courts**          | Create moot court events; manage participation and results      |
| **Internships**          | List internship opportunities; handle applications and tracking |
| **Resources**            | Upload and access study materials, notes, and reference docs    |

### Advocate Service (Port 8082)

The Advocate Service handles all operations related to legal professionals.

| Responsibility               | Description                                                     |
| ----------------------------- | --------------------------------------------------------------- |
| **User Management**           | Advocate registration, authentication, and profile management   |
| **Bar Council Verification**  | Integration with Bar Council of India for credential validation |
| **Case Management**           | Create, update, and track legal cases through their lifecycle   |
| **Document Management**       | Upload and manage case-related documents                        |
| **Client Assignments**        | Link advocates to clients for specific cases                    |

### Client Service (Port 8083)

The Client Service provides the interface for legal service consumers.

| Responsibility             | Description                                                      |
| -------------------------- | ---------------------------------------------------------------- |
| **User Management**        | Client registration, authentication, and profile management      |
| **Consultations**          | Define consultation slots; manage bookings and payments          |
| **Case Requests**          | Submit new case requests matched to appropriate advocates        |
| **Reviews & Ratings**      | Rate and review advocates after case completion                  |

### Legal Library Service (Port 8084) — *Skeleton implemented*

Full-text searchable repository of case law, statutes, legal commentaries, and academic papers.

| Responsibility             | Description                                                      |
| -------------------------- | ---------------------------------------------------------------- |
| **Corpus Search**          | `GET /api/library/search?q=…` — demo index today, PostgreSQL/full-text search with corpus ingestion next |
| **Source Metadata**        | Track source, citation and amendment history for each record     |

> Results must come from authoritative sources (India Code, court repositories) before being treated as current law.

### AI Service (Port 8085) — *Skeleton implemented*

AI-powered legal research assistant and career guidance.

| Responsibility             | Description                                                      |
| -------------------------- | ---------------------------------------------------------------- |
| **Career AI / Legal AI**   | `POST /api/ai/chat` — powers the AI Intelligence Workspace (`/ai`) |
| **Mandatory disclaimer**   | Every reply carries: *"Please independently verify legal information."* |

> Demo responses until a model provider is configured (`ai.provider`). AI output never replaces a qualified advocate.

---

## Communication Patterns

### Synchronous Communication (REST)

All service-to-service communication currently uses **synchronous REST calls** over HTTP/JSON. Each service exposes a well-defined REST API (see [API Contracts](api-contracts.md)).

```
Client Browser  ──HTTP──▶  Nginx  ──HTTP──▶  Service  ──JDBC──▶  Database
```

**Design principles:**
- All APIs follow RESTful conventions (resource-oriented URLs, standard HTTP methods).
- JSON is the sole data interchange format.
- API versioning is handled via URL path (`/api/v1/...`) for future migrations.

### Asynchronous Communication (Planned)

Future iterations will introduce **event-driven communication** for cross-service operations:

| Event                     | Producer          | Consumer(s)                |
| ------------------------- | ----------------- | -------------------------- |
| `advocate.verified`       | advocate-service  | client-service             |
| `case.status.changed`     | advocate-service  | client-service             |
| `consultation.booked`     | client-service    | advocate-service           |
| `internship.application`  | student-service   | advocate-service (future)  |

The planned message broker is **Apache Kafka** or **RabbitMQ**, selected based on throughput requirements at implementation time.

---

## Security Architecture

### Authentication

LEX SUPERMUS uses **JWT (JSON Web Token)** based authentication:

```
1. Client sends credentials  ──▶  POST /api/auth/login
2. Service validates credentials against DB
3. Service issues signed JWT  ──▶  { token: "eyJhbG..." }
4. Client includes JWT in subsequent requests
   Authorization: Bearer eyJhbG...
5. Service validates JWT signature + expiry on each request
```

**JWT Token Structure:**

```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "role": "STUDENT | ADVOCATE | CLIENT",
  "iat": 1700000000,
  "exp": 1700086400
}
```

### Role-Based Access Control (RBAC)

| Role         | Access Scope                                                  |
| ------------ | ------------------------------------------------------------- |
| `STUDENT`    | Own profile, courses, moot courts, internships, resources     |
| `ADVOCATE`   | Own profile, cases, documents, client assignments             |
| `CLIENT`     | Own profile, consultations, case requests, reviews            |
| `ADMIN`      | Full platform access, user management, system configuration   |

### Security Headers

All responses include:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `Content-Security-Policy: default-src 'self'`

### Password Security

- Passwords hashed with **BCrypt** (cost factor 12).
- Minimum 8 characters, requiring uppercase, lowercase, digit, and special character.
- Account lockout after 5 failed login attempts (15-minute cooldown).

---

## Database Strategy

### Database-per-Service Pattern

Each microservice owns its data and exposes it only through its API. No service directly queries another service's database.

```
┌──────────────────────────────────────────────┐
│              PostgreSQL 16 Instance           │
│                                              │
│  ┌────────────┐ ┌────────────┐ ┌──────────┐  │
│  │lex_student │ │lex_advocate│ │lex_client│  │
│  │            │ │            │ │          │  │
│  │ 9 tables   │ │ 6 tables   │ │ 5 tables │  │
│  └────────────┘ └────────────┘ └──────────┘  │
└──────────────────────────────────────────────┘
```

### Migration Strategy

All schema changes are managed by **Flyway**:

- Migration files follow naming: `V{version}__{description}.sql`
- Migrations are forward-only (no rollbacks in production).
- Each service's migrations live in `src/main/resources/db/migration/`.
- Flyway runs automatically on application startup.

### Data Consistency

- **Within a service:** ACID transactions via PostgreSQL.
- **Across services:** Eventual consistency via the Saga pattern (planned).
- **Referential integrity:** Enforced within each service's schema; cross-service references use UUIDs stored as foreign references (not foreign keys).

---

## Deployment Architecture

### Docker Compose (Development & Staging)

```yaml
# Simplified service topology
services:
  postgres:       # Shared PostgreSQL instance
  student-svc:    # Spring Boot — student-service
  advocate-svc:   # Spring Boot — advocate-service
  client-svc:     # Spring Boot — client-service
  frontend:       # Next.js application
  nginx:          # Reverse proxy & TLS termination
```

### Production Deployment (Target)

```
┌─────────────────────────────────────────────────┐
│                 Cloud Provider                   │
│                                                 │
│  ┌─────────┐    ┌──────────────────────────┐    │
│  │  CDN    │    │   Container Orchestrator  │    │
│  │(Assets) │    │   (Docker Swarm / K8s)    │    │
│  └────┬────┘    │                          │    │
│       │         │  ┌────────┐ ┌────────┐   │    │
│       │         │  │Student │ │Advocate│   │    │
│       │         │  │ ×2     │ │  ×2    │   │    │
│       │         │  └────────┘ └────────┘   │    │
│       │         │  ┌────────┐ ┌────────┐   │    │
│       │         │  │Client  │ │Frontend│   │    │
│       │         │  │ ×2     │ │  ×2    │   │    │
│       │         │  └────────┘ └────────┘   │    │
│       │         └──────────────────────────┘    │
│       │                      │                  │
│       │         ┌────────────▼───────────┐      │
│       │         │   Managed PostgreSQL   │      │
│       │         │   (Primary + Replica)  │      │
│       │         └────────────────────────┘      │
└───────┴─────────────────────────────────────────┘
```

### Health Checks

Each service exposes Spring Boot Actuator health endpoints:

| Endpoint                          | Purpose                    |
| --------------------------------- | -------------------------- |
| `/actuator/health`                | Basic liveness check       |
| `/actuator/health/readiness`      | Readiness probe (DB, etc.) |
| `/actuator/info`                  | Build metadata             |
| `/actuator/prometheus` (planned)  | Metrics for monitoring     |

---

## Design Decisions Log

| Decision                           | Rationale                                                      |
| ---------------------------------- | -------------------------------------------------------------- |
| Microservices over monolith        | Independent scaling per user-type; team autonomy               |
| PostgreSQL over MongoDB            | Relational data with strong consistency requirements           |
| JWT over session-based auth        | Stateless authentication; better microservice compatibility    |
| Flyway over Liquibase              | Simpler SQL-based migrations; team familiarity                 |
| Next.js over plain React           | SSR/SSG for SEO; API routes; built-in routing                  |
| Nginx over API Gateway (for now)   | Simpler initial setup; migrate to Spring Cloud Gateway later   |

---

*Last updated: 2024*
