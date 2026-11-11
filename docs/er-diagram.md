# LEX SUPERMUS — Entity-Relationship Documentation

> This document defines the database entities, their fields, data types, and relationships for each microservice in the LEX SUPERMUS platform.

---

## Table of Contents

- [Student Service Entities](#student-service-entities)
- [Advocate Service Entities](#advocate-service-entities)
- [Client Service Entities](#client-service-entities)
- [Cross-Service References](#cross-service-references)

---

## Student Service Entities

### ER Diagram

```
┌──────────────┐       ┌──────────────────┐       ┌────────────────┐
│     User     │       │  StudentProfile  │       │    Course      │
│──────────────│       │──────────────────│       │────────────────│
│ PK id        │──1:1─▶│ PK id            │       │ PK id          │
│    email     │       │ FK user_id       │       │    title       │
│    password  │       │    university    │       │    description │
│    role      │       │    enrollment_no │       │    instructor  │
│    created_at│       │    year_of_study │       │    duration_hrs│
│    updated_at│       │    specialization│       │    level       │
└──────────────┘       │    bio           │       │    created_at  │
                       │    avatar_url    │       └───────┬────────┘
                       └──────────────────┘               │
                                                          │
                       ┌──────────────────┐               │
                       │ CourseEnrollment  │               │
                       │──────────────────│               │
                       │ PK id            │               │
                       │ FK student_id    │◀──────────────┘
                       │ FK course_id     │
                       │    status        │
                       │    progress_pct  │
                       │    enrolled_at   │
                       │    completed_at  │
                       └──────────────────┘

┌──────────────┐       ┌─────────────────────────┐
│  MootCourt   │       │ MootCourtParticipation  │
│──────────────│       │─────────────────────────│
│ PK id        │──1:N─▶│ PK id                   │
│    title     │       │ FK moot_court_id        │
│    date      │       │ FK student_id           │
│    location  │       │    role                 │
│    organizer │       │    team_name            │
│    status    │       │    result               │
│    max_teams │       │    registered_at        │
│    created_at│       └─────────────────────────┘
└──────────────┘

┌──────────────┐       ┌──────────────────────────┐
│  Internship  │       │  InternshipApplication   │
│──────────────│       │──────────────────────────│
│ PK id        │──1:N─▶│ PK id                    │
│    title     │       │ FK internship_id         │
│    org_name  │       │ FK student_id            │
│    location  │       │    cover_letter          │
│    duration  │       │    resume_url            │
│    stipend   │       │    status                │
│    deadline  │       │    applied_at            │
│    created_at│       │    reviewed_at           │
└──────────────┘       └──────────────────────────┘

┌──────────────┐
│   Resource   │
│──────────────│
│ PK id        │
│ FK uploaded_by│
│    title     │
│    type      │
│    file_url  │
│    category  │
│    created_at│
└──────────────┘
```

### Entity Details

#### User

| Column       | Type           | Constraints                 | Description                    |
| ------------ | -------------- | --------------------------- | ------------------------------ |
| `id`         | `UUID`         | PK, auto-generated          | Unique user identifier         |
| `email`      | `VARCHAR(255)` | UNIQUE, NOT NULL             | User email address             |
| `password`   | `VARCHAR(255)` | NOT NULL                     | BCrypt hashed password         |
| `first_name` | `VARCHAR(100)` | NOT NULL                     | User's first name              |
| `last_name`  | `VARCHAR(100)` | NOT NULL                     | User's last name               |
| `phone`      | `VARCHAR(20)`  | UNIQUE                       | Phone number                   |
| `role`       | `VARCHAR(20)`  | NOT NULL, DEFAULT 'STUDENT'  | User role enum                 |
| `is_active`  | `BOOLEAN`      | NOT NULL, DEFAULT true       | Account active status          |
| `created_at` | `TIMESTAMP`    | NOT NULL, DEFAULT now()      | Record creation timestamp      |
| `updated_at` | `TIMESTAMP`    | NOT NULL, DEFAULT now()      | Last update timestamp          |

#### StudentProfile

| Column           | Type           | Constraints            | Description                       |
| ---------------- | -------------- | ---------------------- | --------------------------------- |
| `id`             | `UUID`         | PK, auto-generated     | Unique profile identifier         |
| `user_id`        | `UUID`         | FK → User.id, UNIQUE   | Owning user reference             |
| `university`     | `VARCHAR(255)` | NOT NULL               | Law school / university name      |
| `enrollment_no`  | `VARCHAR(50)`  | UNIQUE                 | University enrollment number      |
| `year_of_study`  | `INTEGER`      | NOT NULL               | Current year (1–5)                |
| `specialization` | `VARCHAR(100)` |                        | Area of legal specialization      |
| `bio`            | `TEXT`         |                        | Student biography                 |
| `avatar_url`     | `VARCHAR(500)` |                        | Profile picture URL               |
| `cgpa`           | `DECIMAL(3,2)` |                        | Current CGPA                      |
| `created_at`     | `TIMESTAMP`    | NOT NULL, DEFAULT now()| Record creation timestamp         |
| `updated_at`     | `TIMESTAMP`    | NOT NULL, DEFAULT now()| Last update timestamp             |

#### Course

| Column          | Type           | Constraints             | Description                   |
| --------------- | -------------- | ----------------------- | ----------------------------- |
| `id`            | `UUID`         | PK, auto-generated      | Unique course identifier      |
| `title`         | `VARCHAR(255)` | NOT NULL                 | Course title                  |
| `description`   | `TEXT`         |                          | Detailed course description   |
| `instructor`    | `VARCHAR(200)` | NOT NULL                 | Instructor name               |
| `duration_hours`| `INTEGER`      | NOT NULL                 | Total course duration (hours) |
| `level`         | `VARCHAR(20)`  | NOT NULL                 | BEGINNER, INTERMEDIATE, ADVANCED |
| `category`      | `VARCHAR(100)` |                          | Course category               |
| `thumbnail_url` | `VARCHAR(500)` |                          | Course thumbnail image        |
| `is_published`  | `BOOLEAN`      | NOT NULL, DEFAULT false  | Publication status            |
| `created_at`    | `TIMESTAMP`    | NOT NULL, DEFAULT now()  | Record creation timestamp     |
| `updated_at`    | `TIMESTAMP`    | NOT NULL, DEFAULT now()  | Last update timestamp         |

#### CourseEnrollment

| Column         | Type           | Constraints                         | Description                    |
| -------------- | -------------- | ----------------------------------- | ------------------------------ |
| `id`           | `UUID`         | PK, auto-generated                  | Unique enrollment identifier   |
| `student_id`   | `UUID`         | FK → StudentProfile.id, NOT NULL    | Enrolled student               |
| `course_id`    | `UUID`         | FK → Course.id, NOT NULL            | Target course                  |
| `status`       | `VARCHAR(20)`  | NOT NULL, DEFAULT 'ENROLLED'        | ENROLLED, IN_PROGRESS, COMPLETED, DROPPED |
| `progress_pct` | `INTEGER`      | NOT NULL, DEFAULT 0                 | Completion percentage (0–100)  |
| `enrolled_at`  | `TIMESTAMP`    | NOT NULL, DEFAULT now()             | Enrollment timestamp           |
| `completed_at` | `TIMESTAMP`    |                                      | Completion timestamp           |

> **Unique constraint:** `(student_id, course_id)` — a student cannot enroll in the same course twice.

#### MootCourt

| Column       | Type           | Constraints             | Description                    |
| ------------ | -------------- | ----------------------- | ------------------------------ |
| `id`         | `UUID`         | PK, auto-generated      | Unique moot court identifier   |
| `title`      | `VARCHAR(255)` | NOT NULL                 | Event title                    |
| `description`| `TEXT`         |                          | Event description              |
| `date`       | `DATE`         | NOT NULL                 | Event date                     |
| `location`   | `VARCHAR(255)` | NOT NULL                 | Venue location                 |
| `organizer`  | `VARCHAR(200)` | NOT NULL                 | Organizing institution         |
| `status`     | `VARCHAR(20)`  | NOT NULL, DEFAULT 'UPCOMING' | UPCOMING, ONGOING, COMPLETED, CANCELLED |
| `max_teams`  | `INTEGER`      | NOT NULL                 | Maximum number of teams        |
| `rules_url`  | `VARCHAR(500)` |                          | Link to competition rules      |
| `created_at` | `TIMESTAMP`    | NOT NULL, DEFAULT now()  | Record creation timestamp      |

#### MootCourtParticipation

| Column          | Type           | Constraints                        | Description                       |
| --------------- | -------------- | ---------------------------------- | --------------------------------- |
| `id`            | `UUID`         | PK, auto-generated                 | Unique participation identifier   |
| `moot_court_id` | `UUID`         | FK → MootCourt.id, NOT NULL        | Target moot court                 |
| `student_id`    | `UUID`         | FK → StudentProfile.id, NOT NULL   | Participating student             |
| `role`          | `VARCHAR(50)`  | NOT NULL                            | SPEAKER, RESEARCHER, MEMORIAL_WRITER |
| `team_name`     | `VARCHAR(100)` |                                     | Team name                         |
| `result`        | `VARCHAR(20)`  |                                     | WINNER, RUNNER_UP, PARTICIPANT    |
| `registered_at` | `TIMESTAMP`    | NOT NULL, DEFAULT now()             | Registration timestamp            |

#### Internship

| Column       | Type            | Constraints              | Description                      |
| ------------ | --------------- | ------------------------ | -------------------------------- |
| `id`         | `UUID`          | PK, auto-generated       | Unique internship identifier     |
| `title`      | `VARCHAR(255)`  | NOT NULL                  | Internship title                 |
| `org_name`   | `VARCHAR(255)`  | NOT NULL                  | Organization name                |
| `description`| `TEXT`          |                           | Detailed description             |
| `location`   | `VARCHAR(255)`  | NOT NULL                  | Location (or "Remote")           |
| `duration`   | `VARCHAR(50)`   | NOT NULL                  | Duration (e.g., "3 months")      |
| `stipend`    | `DECIMAL(10,2)` |                           | Monthly stipend amount           |
| `deadline`   | `DATE`          | NOT NULL                  | Application deadline             |
| `is_active`  | `BOOLEAN`       | NOT NULL, DEFAULT true    | Listing active status            |
| `created_at` | `TIMESTAMP`     | NOT NULL, DEFAULT now()   | Record creation timestamp        |

#### InternshipApplication

| Column          | Type           | Constraints                       | Description                       |
| --------------- | -------------- | --------------------------------- | --------------------------------- |
| `id`            | `UUID`         | PK, auto-generated                | Unique application identifier     |
| `internship_id` | `UUID`         | FK → Internship.id, NOT NULL      | Target internship                 |
| `student_id`    | `UUID`         | FK → StudentProfile.id, NOT NULL  | Applying student                  |
| `cover_letter`  | `TEXT`         |                                    | Application cover letter          |
| `resume_url`    | `VARCHAR(500)` |                                    | Resume file URL                   |
| `status`        | `VARCHAR(20)`  | NOT NULL, DEFAULT 'PENDING'       | PENDING, SHORTLISTED, ACCEPTED, REJECTED |
| `applied_at`    | `TIMESTAMP`    | NOT NULL, DEFAULT now()           | Application timestamp             |
| `reviewed_at`   | `TIMESTAMP`    |                                    | Review timestamp                  |

#### Resource

| Column        | Type           | Constraints                        | Description                    |
| ------------- | -------------- | ---------------------------------- | ------------------------------ |
| `id`          | `UUID`         | PK, auto-generated                 | Unique resource identifier     |
| `uploaded_by` | `UUID`         | FK → StudentProfile.id, NOT NULL   | Uploader reference             |
| `title`       | `VARCHAR(255)` | NOT NULL                            | Resource title                 |
| `description` | `TEXT`         |                                     | Resource description           |
| `type`        | `VARCHAR(30)`  | NOT NULL                            | PDF, VIDEO, DOCUMENT, LINK    |
| `file_url`    | `VARCHAR(500)` | NOT NULL                            | File or link URL               |
| `category`    | `VARCHAR(100)` |                                     | Subject category               |
| `download_count`| `INTEGER`    | NOT NULL, DEFAULT 0                 | Total downloads                |
| `created_at`  | `TIMESTAMP`    | NOT NULL, DEFAULT now()             | Record creation timestamp      |

---

## Advocate Service Entities

### ER Diagram

```
┌──────────────┐       ┌────────────────────┐       ┌────────────────────────┐
│     User     │       │  AdvocateProfile   │       │ BarCouncilVerification │
│──────────────│       │────────────────────│       │────────────────────────│
│ PK id        │──1:1─▶│ PK id              │──1:1─▶│ PK id                  │
│    email     │       │ FK user_id         │       │ FK advocate_id         │
│    password  │       │    bar_council_id  │       │    verification_status │
│    role      │       │    practice_areas  │       │    verified_at         │
│    created_at│       │    experience_yrs  │       │    council_response    │
│    updated_at│       │    designation     │       │    submitted_at        │
└──────────────┘       │    court_name      │       │    expires_at          │
                       │    bio             │       └────────────────────────┘
                       │    avatar_url      │
                       └────────┬───────────┘
                                │
                    ┌───────────┴────────────┐
                    │                        │
             ┌──────▼──────┐         ┌───────▼────────────┐
             │    Case     │         │ ClientAssignment   │
             │─────────────│         │────────────────────│
             │ PK id       │         │ PK id              │
             │ FK advocate │         │ FK advocate_id     │
             │    title    │         │    client_ref_id   │
             │    case_no  │         │    case_id         │
             │    type     │         │    assigned_at     │
             │    status   │         │    status          │
             │    court    │         └────────────────────┘
             │    filed_at │
             └──────┬──────┘
                    │
             ┌──────▼──────┐
             │CaseDocument │
             │─────────────│
             │ PK id       │
             │ FK case_id  │
             │    title    │
             │    type     │
             │    file_url │
             │    uploaded │
             └─────────────┘
```

### Entity Details

#### User

Same structure as Student Service `User` entity — each service maintains its own user table.

#### AdvocateProfile

| Column              | Type           | Constraints            | Description                         |
| ------------------- | -------------- | ---------------------- | ----------------------------------- |
| `id`                | `UUID`         | PK, auto-generated     | Unique profile identifier           |
| `user_id`           | `UUID`         | FK → User.id, UNIQUE   | Owning user reference               |
| `bar_council_id`    | `VARCHAR(50)`  | UNIQUE, NOT NULL        | Bar Council registration number     |
| `practice_areas`    | `TEXT[]`       |                         | Array of practice area strings      |
| `experience_years`  | `INTEGER`      | NOT NULL                | Years of practice                   |
| `designation`       | `VARCHAR(100)` |                         | Professional designation            |
| `court_name`        | `VARCHAR(200)` |                         | Primary court of practice           |
| `office_address`    | `TEXT`         |                         | Office address                      |
| `bio`               | `TEXT`         |                         | Professional biography              |
| `avatar_url`        | `VARCHAR(500)` |                         | Profile picture URL                 |
| `is_verified`       | `BOOLEAN`      | NOT NULL, DEFAULT false | Bar Council verification status     |
| `hourly_rate`       | `DECIMAL(10,2)`|                         | Consultation hourly rate            |
| `created_at`        | `TIMESTAMP`    | NOT NULL, DEFAULT now() | Record creation timestamp           |
| `updated_at`        | `TIMESTAMP`    | NOT NULL, DEFAULT now() | Last update timestamp               |

#### BarCouncilVerification

| Column                | Type           | Constraints                         | Description                      |
| --------------------- | -------------- | ----------------------------------- | -------------------------------- |
| `id`                  | `UUID`         | PK, auto-generated                  | Unique verification identifier   |
| `advocate_id`         | `UUID`         | FK → AdvocateProfile.id, UNIQUE     | Target advocate                  |
| `verification_status` | `VARCHAR(20)`  | NOT NULL, DEFAULT 'PENDING'         | PENDING, VERIFIED, REJECTED, EXPIRED |
| `council_response`    | `TEXT`         |                                      | Response from Bar Council API    |
| `submitted_at`        | `TIMESTAMP`    | NOT NULL, DEFAULT now()             | Submission timestamp             |
| `verified_at`         | `TIMESTAMP`    |                                      | Verification timestamp           |
| `expires_at`          | `TIMESTAMP`    |                                      | Verification expiry date         |

#### Case

| Column          | Type           | Constraints                          | Description                     |
| --------------- | -------------- | ------------------------------------ | ------------------------------- |
| `id`            | `UUID`         | PK, auto-generated                   | Unique case identifier          |
| `advocate_id`   | `UUID`         | FK → AdvocateProfile.id, NOT NULL    | Assigned advocate               |
| `title`         | `VARCHAR(255)` | NOT NULL                              | Case title                      |
| `case_number`   | `VARCHAR(50)`  | UNIQUE                                | Official case number            |
| `description`   | `TEXT`         |                                       | Case description                |
| `type`          | `VARCHAR(50)`  | NOT NULL                              | CIVIL, CRIMINAL, CORPORATE, FAMILY, CONSTITUTIONAL, OTHER |
| `status`        | `VARCHAR(20)`  | NOT NULL, DEFAULT 'OPEN'             | OPEN, IN_PROGRESS, HEARING, CLOSED, APPEALED |
| `court`         | `VARCHAR(200)` | NOT NULL                              | Court name                      |
| `filed_at`      | `DATE`         |                                       | Filing date                     |
| `next_hearing`  | `DATE`         |                                       | Next hearing date               |
| `created_at`    | `TIMESTAMP`    | NOT NULL, DEFAULT now()              | Record creation timestamp       |
| `updated_at`    | `TIMESTAMP`    | NOT NULL, DEFAULT now()              | Last update timestamp           |

#### CaseDocument

| Column       | Type           | Constraints                    | Description                    |
| ------------ | -------------- | ------------------------------ | ------------------------------ |
| `id`         | `UUID`         | PK, auto-generated             | Unique document identifier     |
| `case_id`    | `UUID`         | FK → Case.id, NOT NULL         | Owning case                    |
| `title`      | `VARCHAR(255)` | NOT NULL                        | Document title                 |
| `description`| `TEXT`         |                                 | Document description           |
| `type`       | `VARCHAR(30)`  | NOT NULL                        | PETITION, AFFIDAVIT, EVIDENCE, ORDER, JUDGMENT, OTHER |
| `file_url`   | `VARCHAR(500)` | NOT NULL                        | File storage URL               |
| `file_size`  | `BIGINT`       |                                 | File size in bytes             |
| `uploaded_at`| `TIMESTAMP`    | NOT NULL, DEFAULT now()         | Upload timestamp               |

#### ClientAssignment

| Column          | Type           | Constraints                          | Description                       |
| --------------- | -------------- | ------------------------------------ | --------------------------------- |
| `id`            | `UUID`         | PK, auto-generated                   | Unique assignment identifier      |
| `advocate_id`   | `UUID`         | FK → AdvocateProfile.id, NOT NULL    | Assigned advocate                 |
| `client_ref_id` | `UUID`         | NOT NULL                              | Client UUID (from client-service) |
| `case_id`       | `UUID`         | FK → Case.id                          | Related case (optional)           |
| `status`        | `VARCHAR(20)`  | NOT NULL, DEFAULT 'ACTIVE'           | ACTIVE, COMPLETED, TERMINATED     |
| `notes`         | `TEXT`         |                                       | Assignment notes                  |
| `assigned_at`   | `TIMESTAMP`    | NOT NULL, DEFAULT now()              | Assignment timestamp              |
| `completed_at`  | `TIMESTAMP`    |                                       | Completion timestamp              |

---

## Client Service Entities

### ER Diagram

```
┌──────────────┐       ┌─────────────────┐
│     User     │       │  ClientProfile  │
│──────────────│       │─────────────────│
│ PK id        │──1:1─▶│ PK id           │
│    email     │       │ FK user_id      │
│    password  │       │    occupation   │
│    role      │       │    address      │
│    created_at│       │    aadhaar_no   │
│    updated_at│       │    bio          │
└──────────────┘       │    avatar_url   │
                       └────────┬────────┘
                                │
              ┌─────────────────┼──────────────────┐
              │                 │                  │
       ┌──────▼──────┐  ┌──────▼───────┐   ┌──────▼──────┐
       │ Consultation│  │ CaseRequest  │   │   Review    │
       │─────────────│  │──────────────│   │─────────────│
       │ PK id       │  │ PK id        │   │ PK id       │
       │    title    │  │ FK client_id │   │ FK client_id│
       │    adv_ref  │  │    title     │   │    adv_ref  │
       │    fee      │  │    type      │   │    rating   │
       │    duration │  │    urgency   │   │    comment  │
       │    slot_time│  │    status    │   │    created  │
       │    status   │  │    budget    │   └─────────────┘
       └──────┬──────┘  │    created   │
              │         └──────────────┘
       ┌──────▼───────────┐
       │ConsultationBooking│
       │──────────────────│
       │ PK id            │
       │ FK consultation  │
       │ FK client_id     │
       │    booked_at     │
       │    status        │
       │    payment_status│
       │    notes         │
       └──────────────────┘
```

### Entity Details

#### User

Same structure as Student Service `User` entity.

#### ClientProfile

| Column        | Type           | Constraints             | Description                      |
| ------------- | -------------- | ----------------------- | -------------------------------- |
| `id`          | `UUID`         | PK, auto-generated      | Unique profile identifier        |
| `user_id`     | `UUID`         | FK → User.id, UNIQUE    | Owning user reference            |
| `occupation`  | `VARCHAR(100)` |                          | Client's occupation              |
| `address`     | `TEXT`         |                          | Residential address              |
| `city`        | `VARCHAR(100)` |                          | City                             |
| `state`       | `VARCHAR(100)` |                          | State                            |
| `pin_code`    | `VARCHAR(10)`  |                          | PIN code                         |
| `aadhaar_no`  | `VARCHAR(12)`  | UNIQUE                   | Aadhaar number (encrypted)       |
| `bio`         | `TEXT`         |                          | Brief bio                        |
| `avatar_url`  | `VARCHAR(500)` |                          | Profile picture URL              |
| `created_at`  | `TIMESTAMP`    | NOT NULL, DEFAULT now()  | Record creation timestamp        |
| `updated_at`  | `TIMESTAMP`    | NOT NULL, DEFAULT now()  | Last update timestamp            |

#### Consultation

| Column             | Type            | Constraints              | Description                        |
| ------------------ | --------------- | ------------------------ | ---------------------------------- |
| `id`               | `UUID`          | PK, auto-generated       | Unique consultation identifier     |
| `advocate_ref_id`  | `UUID`          | NOT NULL                  | Advocate UUID (from advocate-svc)  |
| `title`            | `VARCHAR(255)`  | NOT NULL                  | Consultation title                 |
| `description`      | `TEXT`          |                           | Consultation details               |
| `fee`              | `DECIMAL(10,2)` | NOT NULL                  | Consultation fee                   |
| `duration_minutes` | `INTEGER`       | NOT NULL                  | Duration in minutes                |
| `slot_time`        | `TIMESTAMP`     | NOT NULL                  | Scheduled time slot                |
| `mode`             | `VARCHAR(20)`   | NOT NULL, DEFAULT 'ONLINE'| ONLINE, IN_PERSON, PHONE          |
| `status`           | `VARCHAR(20)`   | NOT NULL, DEFAULT 'AVAILABLE' | AVAILABLE, BOOKED, COMPLETED, CANCELLED |
| `created_at`       | `TIMESTAMP`     | NOT NULL, DEFAULT now()   | Record creation timestamp          |

#### ConsultationBooking

| Column             | Type           | Constraints                          | Description                       |
| ------------------ | -------------- | ------------------------------------ | --------------------------------- |
| `id`               | `UUID`         | PK, auto-generated                   | Unique booking identifier         |
| `consultation_id`  | `UUID`         | FK → Consultation.id, NOT NULL       | Target consultation               |
| `client_id`        | `UUID`         | FK → ClientProfile.id, NOT NULL      | Booking client                    |
| `status`           | `VARCHAR(20)`  | NOT NULL, DEFAULT 'CONFIRMED'        | CONFIRMED, CANCELLED, NO_SHOW, COMPLETED |
| `payment_status`   | `VARCHAR(20)`  | NOT NULL, DEFAULT 'PENDING'          | PENDING, PAID, REFUNDED           |
| `payment_amount`   | `DECIMAL(10,2)`|                                       | Amount paid                       |
| `notes`            | `TEXT`         |                                       | Client notes for the session      |
| `booked_at`        | `TIMESTAMP`    | NOT NULL, DEFAULT now()              | Booking timestamp                 |
| `cancelled_at`     | `TIMESTAMP`    |                                       | Cancellation timestamp            |

#### CaseRequest

| Column             | Type            | Constraints                         | Description                       |
| ------------------ | --------------- | ----------------------------------- | --------------------------------- |
| `id`               | `UUID`          | PK, auto-generated                  | Unique request identifier         |
| `client_id`        | `UUID`          | FK → ClientProfile.id, NOT NULL     | Requesting client                 |
| `advocate_ref_id`  | `UUID`          |                                      | Preferred advocate (optional)     |
| `title`            | `VARCHAR(255)`  | NOT NULL                             | Case request title                |
| `description`      | `TEXT`          | NOT NULL                             | Detailed case description         |
| `type`             | `VARCHAR(50)`   | NOT NULL                             | CIVIL, CRIMINAL, CORPORATE, FAMILY, OTHER |
| `urgency`          | `VARCHAR(20)`   | NOT NULL, DEFAULT 'NORMAL'          | LOW, NORMAL, HIGH, URGENT         |
| `budget_min`       | `DECIMAL(10,2)` |                                      | Minimum budget                    |
| `budget_max`       | `DECIMAL(10,2)` |                                      | Maximum budget                    |
| `status`           | `VARCHAR(20)`   | NOT NULL, DEFAULT 'OPEN'            | OPEN, MATCHED, ACCEPTED, IN_PROGRESS, CLOSED |
| `created_at`       | `TIMESTAMP`     | NOT NULL, DEFAULT now()             | Request timestamp                 |
| `updated_at`       | `TIMESTAMP`     | NOT NULL, DEFAULT now()             | Last update timestamp             |

#### Review

| Column             | Type           | Constraints                          | Description                       |
| ------------------ | -------------- | ------------------------------------ | --------------------------------- |
| `id`               | `UUID`         | PK, auto-generated                   | Unique review identifier          |
| `client_id`        | `UUID`         | FK → ClientProfile.id, NOT NULL      | Reviewing client                  |
| `advocate_ref_id`  | `UUID`         | NOT NULL                              | Reviewed advocate UUID            |
| `rating`           | `INTEGER`      | NOT NULL, CHECK (1–5)                | Rating (1 to 5 stars)             |
| `title`            | `VARCHAR(255)` |                                       | Review title                      |
| `comment`          | `TEXT`         |                                       | Review body text                  |
| `is_anonymous`     | `BOOLEAN`      | NOT NULL, DEFAULT false              | Anonymous review flag             |
| `created_at`       | `TIMESTAMP`    | NOT NULL, DEFAULT now()              | Review timestamp                  |

> **Unique constraint:** `(client_id, advocate_ref_id)` — one review per advocate per client.

---

## Cross-Service References

Since each microservice owns its own database, cross-service entity references use **UUID foreign references** (not database-level foreign keys). These are validated at the application layer via REST API calls.

| Source Service   | Field               | References                | Description                          |
| ---------------- | ------------------- | ------------------------- | ------------------------------------ |
| advocate-service | `ClientAssignment.client_ref_id` | client-service → ClientProfile.user_id | Client assigned to advocate |
| client-service   | `Consultation.advocate_ref_id`   | advocate-service → AdvocateProfile.user_id | Advocate offering consultation |
| client-service   | `CaseRequest.advocate_ref_id`    | advocate-service → AdvocateProfile.user_id | Preferred advocate for case |
| client-service   | `Review.advocate_ref_id`         | advocate-service → AdvocateProfile.user_id | Reviewed advocate |

---

*Last updated: 2024*
