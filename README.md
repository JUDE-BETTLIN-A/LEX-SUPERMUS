# LEX SUPERMUS

> **Your Complete Legal Technology Platform**

[![License: MIT](https://img.shields.io/badge/License-MIT-gold.svg)](LICENSE)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green.svg)](https://spring.io/projects/spring-boot)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)

---

## Overview

**LEX SUPERMUS** is a comprehensive legal technology platform designed to bridge the gap between legal education, professional practice, and client access to justice. The platform serves three primary user groups:

- **Law Students** — Access courses, participate in moot courts, discover internship opportunities, and build their legal careers from day one.
- **Advocates** — Manage cases, verify Bar Council credentials, handle client assignments, and streamline their legal practice.
- **Clients** — Find verified advocates, book consultations, submit case requests, and track legal proceedings with full transparency.

Built on a modern microservices architecture, LEX SUPERMUS delivers a scalable, secure, and maintainable platform that grows with the legal community it serves.

---

## Architecture

LEX SUPERMUS follows a **microservices architecture** pattern, with each domain boundary encapsulated in its own independently deployable service.

```
                         ┌─────────────────────┐
                         │     Nginx Reverse    │
                         │        Proxy         │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
             ┌──────▼──────┐ ┌─────▼──────┐ ┌──────▼──────┐
             │   Next.js   │ │  REST API  │ │  REST API   │
             │  Frontend   │ │  Gateway   │ │  Gateway    │
             │  (Port 3000)│ │            │ │             │
             └──────┬──────┘ └─────┬──────┘ └──────┬──────┘
                    │               │               │
        ┌───────────┼───────┬───────┼───────┬───────┘
        │           │       │       │       │
   ┌────▼────┐ ┌───▼────┐ ┌▼──────┐│  ┌────▼─────┐  ┌──────────┐
   │ Student │ │Advocate│ │Client ││  │  Legal   │  │    AI    │
   │ Service │ │Service │ │Service││  │ Library  │  │ Service  │
   │  :8081  │ │ :8082  │ │ :8083 ││  │ (Soon)   │  │ (Soon)   │
   └────┬────┘ └───┬────┘ └┬──────┘│  └──────────┘  └──────────┘
        │          │       │       │
   ┌────▼────┐ ┌───▼────┐ ┌▼──────┐
   │   DB    │ │   DB   │ │  DB   │
   │ Schema  │ │ Schema │ │Schema │
   └─────────┘ └────────┘ └───────┘
              PostgreSQL Instance
```

### Services Overview

| Service                  | Port | Status       | Description                                              |
| ------------------------ | ---- | ------------ | -------------------------------------------------------- |
| **student-service**      | 8081 | ✅ Active     | Course management, moot courts, internships, resources   |
| **advocate-service**     | 8082 | ✅ Active     | Bar Council verification, case management, assignments   |
| **client-service**       | 8083 | ✅ Active     | Consultations, case requests, advocate reviews           |
| **legal-library-service**| 8084 | ✅ Skeleton   | Legal document repository, case law search, citations    |
| **ai-service**           | 8085 | ✅ Skeleton   | Career AI, legal research AI (demo responses)            |

---

## Tech Stack

| Layer        | Technology                          |
| ------------ | ----------------------------------- |
| **Backend**  | Spring Boot 3.2, Java 17, Maven    |
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS |
| **Database** | PostgreSQL 16, Flyway migrations   |
| **Auth**     | JWT (JSON Web Tokens), Spring Security |
| **Infra**    | Docker, Docker Compose, Nginx      |
| **Testing**  | JUnit 5, Mockito, Jest, Playwright |

---

## Getting Started

### Prerequisites

Ensure the following are installed on your system:

- **Java 17+** — [Download](https://adoptium.net/)
- **Maven 3.9+** — [Download](https://maven.apache.org/download.cgi)
- **Node.js 18+** — [Download](https://nodejs.org/)
- **PostgreSQL 16** — [Download](https://www.postgresql.org/download/)
- **Docker & Docker Compose** (optional) — [Download](https://www.docker.com/)

### Setup Instructions

#### 1. Clone the Repository

```bash
git clone https://github.com/your-org/lex-supermus.git
cd lex-supermus
```

#### 2. Configure Environment Variables

```bash
cp .env.example .env
# Edit .env with your local database credentials and configuration
```

#### 3. Start the Frontend (Development)

```bash
cd frontend
npm install
npm run dev
```

> **Docker / docker-compose:** deferred — will be added later. Until then run
> PostgreSQL and each service manually (see below).

#### 4. Start Manually (Development)

**Database:**

```bash
# Create the databases
psql -U postgres -c "CREATE DATABASE lex_student;"
psql -U postgres -c "CREATE DATABASE lex_advocate;"
psql -U postgres -c "CREATE DATABASE lex_client;"
```

**Backend Services:**

```bash
# Start each service (in separate terminals)
cd services/student-service && mvn spring-boot:run
cd services/advocate-service && mvn spring-boot:run
cd services/client-service && mvn spring-boot:run
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

#### 5. Verify

- Frontend: [http://localhost:3000](http://localhost:3000)
- Student Service: [http://localhost:8081/actuator/health](http://localhost:8081/actuator/health)
- Advocate Service: [http://localhost:8082/actuator/health](http://localhost:8082/actuator/health)
- Client Service: [http://localhost:8083/actuator/health](http://localhost:8083/actuator/health)

---

## Project Structure

```
lex-supermus/
├── frontend/                        # Next.js 14 frontend application
│   ├── src/
│   │   ├── app/                     # App router pages
│   │   │   ├── (public)/            # Landing, /library, /ai
│   │   │   ├── student/             # /student portal
│   │   │   ├── advocate/            # /advocate portal (Bar Council verification)
│   │   │   ├── client/              # /client portal
│   │   │   └── admin/               # /admin console
│   │   ├── components/              # SiteHeader, SiteFooter, PortalShell, portals/, AiWorkspace
│   │   ├── lib/                     # navigation.ts, api.ts (Axios client)
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── types/                   # TypeScript type definitions
│   │   └── styles/                  # globals.css (ported prototype styles)
│   ├── public/hero.jpg              # Hero background (was inline base64)
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── next.config.js
│
├── services/
│   ├── student-service/             # Student domain microservice        (:8081)
│   │   ├── src/main/java/
│   │   ├── src/main/resources/
│   │   │   ├── application.yml
│   │   │   └── db/migration/       # Flyway SQL migrations
│   │   └── pom.xml
│   │
│   ├── advocate-service/            # Advocate domain microservice       (:8082)
│   │   └── ... controller/service/repository/dto  → Bar Council verification
│   │
│   ├── client-service/              # Client domain microservice         (:8083)
│   │
│   ├── legal-library-service/       # Legal corpus search service        (:8084)
│   │
│   └── ai-service/                  # Career AI / Legal AI service       (:8085)
│
├── docs/                            # Project documentation
│   ├── architecture.md
│   ├── er-diagram.md
│   ├── api-contracts.md
│   ├── prototype-mapping.md         # Which prototype code lives in which file
│   └── LEX_SUPERMUS_Advocate_Bar_Council_Verification_Module.pdf
│
├── .env.example                     # Environment variable template
├── .gitignore
├── LICENSE
└── README.md
```

> Docker artifacts (docker-compose.yml, Dockerfiles, nginx) are intentionally
> deferred and will be added later.

---

## Environment Variables

See [`.env.example`](.env.example) for a complete reference of all required environment variables. Key categories:

| Category          | Variables                                                |
| ----------------- | -------------------------------------------------------- |
| **Database**      | `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` |
| **Service Ports** | `STUDENT_SERVICE_PORT`, `ADVOCATE_SERVICE_PORT`, `CLIENT_SERVICE_PORT` |
| **Frontend**      | `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_APP_URL`             |
| **Security**      | `JWT_SECRET`                                             |
| **Integrations**  | `BAR_COUNCIL_API_*`, `SMTP_*`                            |

---

## Documentation

- [Architecture Overview](docs/architecture.md)
- [Entity-Relationship Diagrams](docs/er-diagram.md)
- [API Contracts](docs/api-contracts.md)
- [Prototype → Code Mapping](docs/prototype-mapping.md)

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <strong>LEX SUPERMUS</strong> — Empowering the Legal Community Through Technology
</p>
