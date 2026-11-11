# LEX SUPERMUS — API Contracts

> This document defines the REST API specifications for all LEX SUPERMUS microservices. All APIs use JSON for request/response bodies and require JWT authentication unless marked as public.

---

## Table of Contents

- [Common Standards](#common-standards)
- [Student Service APIs](#student-service-apis)
- [Advocate Service APIs](#advocate-service-apis)
- [Client Service APIs](#client-service-apis)

---

## Common Standards

### Base URLs

| Service          | Base URL                             |
| ---------------- | ------------------------------------ |
| Student Service  | `http://localhost:8081/api`           |
| Advocate Service | `http://localhost:8082/api`           |
| Client Service   | `http://localhost:8083/api`           |
| Via Nginx Proxy  | `http://localhost/api`                |

### Authentication Header

All protected endpoints require the `Authorization` header:

```
Authorization: Bearer <jwt-token>
```

### Common Response Envelope

All successful responses follow this structure:

```json
{
  "success": true,
  "data": { },
  "message": "Operation completed successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Paginated Response

List endpoints return paginated results:

```json
{
  "success": true,
  "data": {
    "content": [ ],
    "page": 0,
    "size": 20,
    "totalElements": 150,
    "totalPages": 8,
    "last": false
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Common Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed for one or more fields",
    "details": [
      {
        "field": "email",
        "message": "must be a valid email address"
      }
    ]
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Standard Error Codes

| HTTP Status | Error Code             | Description                              |
| ----------- | ---------------------- | ---------------------------------------- |
| 400         | `VALIDATION_ERROR`     | Request body validation failed           |
| 400         | `BAD_REQUEST`          | Malformed request                        |
| 401         | `UNAUTHORIZED`         | Missing or invalid JWT token             |
| 403         | `FORBIDDEN`            | Insufficient permissions                 |
| 404         | `NOT_FOUND`            | Resource does not exist                  |
| 409         | `CONFLICT`             | Duplicate resource or state conflict     |
| 422         | `UNPROCESSABLE_ENTITY` | Semantically invalid request             |
| 429         | `RATE_LIMITED`         | Too many requests                        |
| 500         | `INTERNAL_ERROR`       | Unexpected server error                  |

---

## Student Service APIs

### Authentication

#### Register Student

| | |
|-|-|
| **Method** | `POST` |
| **Path** | `/api/auth/register` |
| **Auth** | Public |

**Request Body:**

```json
{
  "email": "student@lawschool.edu",
  "password": "SecureP@ss1",
  "firstName": "Priya",
  "lastName": "Sharma",
  "phone": "+919876543210"
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "student@lawschool.edu",
    "firstName": "Priya",
    "lastName": "Sharma",
    "role": "STUDENT",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "Registration successful"
}
```

**Error Responses:** `400` Validation error, `409` Email already registered

---

#### Login

| | |
|-|-|
| **Method** | `POST` |
| **Path** | `/api/auth/login` |
| **Auth** | Public |

**Request Body:**

```json
{
  "email": "student@lawschool.edu",
  "password": "SecureP@ss1"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "student@lawschool.edu",
    "role": "STUDENT",
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 86400000
  },
  "message": "Login successful"
}
```

**Error Responses:** `401` Invalid credentials, `423` Account locked

---

### Student Profile

#### Get Current Student Profile

| | |
|-|-|
| **Method** | `GET` |
| **Path** | `/api/students/me` |
| **Auth** | `STUDENT` |

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "660e8400-e29b-41d4-a716-446655440000",
    "university": "National Law University, Delhi",
    "enrollmentNo": "NLU2024001",
    "yearOfStudy": 3,
    "specialization": "Constitutional Law",
    "bio": "Aspiring constitutional lawyer...",
    "avatarUrl": "https://storage.example.com/avatars/priya.jpg",
    "cgpa": 8.75
  }
}
```

---

#### Update Student Profile

| | |
|-|-|
| **Method** | `PUT` |
| **Path** | `/api/students/me` |
| **Auth** | `STUDENT` |

**Request Body:**

```json
{
  "university": "National Law University, Delhi",
  "enrollmentNo": "NLU2024001",
  "yearOfStudy": 3,
  "specialization": "Constitutional Law",
  "bio": "Aspiring constitutional lawyer with interest in human rights.",
  "cgpa": 8.75
}
```

**Response:** `200 OK` — Updated profile object

**Error Responses:** `400` Validation error, `409` Enrollment number already exists

---

#### Get Student by ID

| | |
|-|-|
| **Method** | `GET` |
| **Path** | `/api/students/{id}` |
| **Auth** | `STUDENT`, `ADMIN` |

**Path Parameters:** `id` (UUID) — Student profile ID

**Response:** `200 OK` — Student profile object

**Error Responses:** `404` Student not found

---

#### List All Students

| | |
|-|-|
| **Method** | `GET` |
| **Path** | `/api/students` |
| **Auth** | `ADMIN` |

**Query Parameters:**

| Parameter        | Type     | Default | Description                  |
| ---------------- | -------- | ------- | ---------------------------- |
| `page`           | integer  | 0       | Page number (zero-indexed)   |
| `size`           | integer  | 20      | Page size                    |
| `university`     | string   |         | Filter by university         |
| `yearOfStudy`    | integer  |         | Filter by year               |
| `sort`           | string   | `createdAt,desc` | Sort field and direction |

**Response:** `200 OK` — Paginated list of student profiles

---

### Courses

#### List Courses

| | |
|-|-|
| **Method** | `GET` |
| **Path** | `/api/courses` |
| **Auth** | `STUDENT` |

**Query Parameters:**

| Parameter  | Type    | Default | Description                      |
| ---------- | ------- | ------- | -------------------------------- |
| `page`     | integer | 0       | Page number                      |
| `size`     | integer | 20      | Page size                        |
| `level`    | string  |         | BEGINNER, INTERMEDIATE, ADVANCED |
| `category` | string  |         | Filter by category               |
| `search`   | string  |         | Search by title or description   |

**Response:** `200 OK` — Paginated list of courses

---

#### Get Course by ID

| | |
|-|-|
| **Method** | `GET` |
| **Path** | `/api/courses/{id}` |
| **Auth** | `STUDENT` |

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440000",
    "title": "Constitutional Law Fundamentals",
    "description": "A comprehensive course covering...",
    "instructor": "Prof. Rajesh Kumar",
    "durationHours": 40,
    "level": "BEGINNER",
    "category": "Constitutional Law",
    "thumbnailUrl": "https://storage.example.com/courses/const-law.jpg",
    "isPublished": true,
    "enrollmentCount": 145,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

#### Enroll in Course

| | |
|-|-|
| **Method** | `POST` |
| **Path** | `/api/courses/{id}/enroll` |
| **Auth** | `STUDENT` |

**Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    "enrollmentId": "880e8400-e29b-41d4-a716-446655440000",
    "courseId": "770e8400-e29b-41d4-a716-446655440000",
    "studentId": "550e8400-e29b-41d4-a716-446655440000",
    "status": "ENROLLED",
    "progressPct": 0,
    "enrolledAt": "2024-01-15T10:30:00Z"
  },
  "message": "Successfully enrolled in course"
}
```

**Error Responses:** `409` Already enrolled

---

#### Get My Enrollments

| | |
|-|-|
| **Method** | `GET` |
| **Path** | `/api/courses/my-enrollments` |
| **Auth** | `STUDENT` |

**Response:** `200 OK` — List of enrollment objects with nested course data

---

#### Update Enrollment Progress

| | |
|-|-|
| **Method** | `PATCH` |
| **Path** | `/api/courses/{courseId}/progress` |
| **Auth** | `STUDENT` |

**Request Body:**

```json
{
  "progressPct": 65
}
```

**Response:** `200 OK` — Updated enrollment object

---

### Moot Courts

#### List Moot Courts

| | |
|-|-|
| **Method** | `GET` |
| **Path** | `/api/moot-courts` |
| **Auth** | `STUDENT` |

**Query Parameters:**

| Parameter | Type   | Default | Description                                  |
| --------- | ------ | ------- | -------------------------------------------- |
| `page`    | integer| 0       | Page number                                  |
| `size`    | integer| 20      | Page size                                    |
| `status`  | string |         | UPCOMING, ONGOING, COMPLETED, CANCELLED      |

**Response:** `200 OK` — Paginated list of moot courts

---

#### Get Moot Court by ID

| | |
|-|-|
| **Method** | `GET` |
| **Path** | `/api/moot-courts/{id}` |
| **Auth** | `STUDENT` |

**Response:** `200 OK` — Moot court object with participation list

---

#### Register for Moot Court

| | |
|-|-|
| **Method** | `POST` |
| **Path** | `/api/moot-courts/{id}/register` |
| **Auth** | `STUDENT` |

**Request Body:**

```json
{
  "role": "SPEAKER",
  "teamName": "Legal Eagles"
}
```

**Response:** `201 Created` — Participation record

**Error Responses:** `409` Already registered, `422` Registration closed or max teams reached

---

#### Get My Moot Court Participations

| | |
|-|-|
| **Method** | `GET` |
| **Path** | `/api/moot-courts/my-participations` |
| **Auth** | `STUDENT` |

**Response:** `200 OK` — List of participation objects with nested moot court data

---

### Internships

#### List Internships

| | |
|-|-|
| **Method** | `GET` |
| **Path** | `/api/internships` |
| **Auth** | `STUDENT` |

**Query Parameters:**

| Parameter  | Type    | Default | Description               |
| ---------- | ------- | ------- | ------------------------- |
| `page`     | integer | 0       | Page number               |
| `size`     | integer | 20      | Page size                 |
| `location` | string  |         | Filter by location        |
| `search`   | string  |         | Search title or org name  |

**Response:** `200 OK` — Paginated list of internships

---

#### Get Internship by ID

| | |
|-|-|
| **Method** | `GET` |
| **Path** | `/api/internships/{id}` |
| **Auth** | `STUDENT` |

**Response:** `200 OK` — Internship object with application count

---

#### Apply for Internship

| | |
|-|-|
| **Method** | `POST` |
| **Path** | `/api/internships/{id}/apply` |
| **Auth** | `STUDENT` |

**Request Body:**

```json
{
  "coverLetter": "I am writing to express my interest...",
  "resumeUrl": "https://storage.example.com/resumes/priya-resume.pdf"
}
```

**Response:** `201 Created` — Application record

**Error Responses:** `409` Already applied, `422` Deadline passed

---

#### Get My Applications

| | |
|-|-|
| **Method** | `GET` |
| **Path** | `/api/internships/my-applications` |
| **Auth** | `STUDENT` |

**Response:** `200 OK` — List of application objects with nested internship data

---

---

## Advocate Service APIs

### Authentication

Same auth endpoints as Student Service (`/api/auth/register`, `/api/auth/login`) with `role: "ADVOCATE"`.

---

### Advocate Profile

#### Get Current Advocate Profile

| | |
|-|-|
| **Method** | `GET` |
| **Path** | `/api/advocates/me` |
| **Auth** | `ADVOCATE` |

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "990e8400-e29b-41d4-a716-446655440000",
    "userId": "aa0e8400-e29b-41d4-a716-446655440000",
    "barCouncilId": "BCI/MAH/12345/2020",
    "practiceAreas": ["Criminal Law", "Constitutional Law"],
    "experienceYears": 8,
    "designation": "Senior Advocate",
    "courtName": "Bombay High Court",
    "officeAddress": "123 Legal Lane, Mumbai 400001",
    "bio": "Experienced criminal law advocate...",
    "avatarUrl": "https://storage.example.com/avatars/advocate.jpg",
    "isVerified": true,
    "hourlyRate": 5000.00,
    "verificationStatus": "VERIFIED"
  }
}
```

---

#### Update Advocate Profile

| | |
|-|-|
| **Method** | `PUT` |
| **Path** | `/api/advocates/me` |
| **Auth** | `ADVOCATE` |

**Request Body:**

```json
{
  "barCouncilId": "BCI/MAH/12345/2020",
  "practiceAreas": ["Criminal Law", "Constitutional Law"],
  "experienceYears": 8,
  "designation": "Senior Advocate",
  "courtName": "Bombay High Court",
  "officeAddress": "123 Legal Lane, Mumbai 400001",
  "bio": "Experienced criminal law advocate...",
  "hourlyRate": 5000.00
}
```

**Response:** `200 OK` — Updated profile object

---

#### Get Advocate by ID

| | |
|-|-|
| **Method** | `GET` |
| **Path** | `/api/advocates/{id}` |
| **Auth** | `ADVOCATE`, `CLIENT`, `ADMIN` |

**Response:** `200 OK` — Public advocate profile

---

#### List Advocates

| | |
|-|-|
| **Method** | `GET` |
| **Path** | `/api/advocates` |
| **Auth** | `CLIENT`, `ADMIN` |

**Query Parameters:**

| Parameter      | Type    | Default          | Description                   |
| -------------- | ------- | ---------------- | ----------------------------- |
| `page`         | integer | 0                | Page number                   |
| `size`         | integer | 20               | Page size                     |
| `practiceArea` | string  |                  | Filter by practice area       |
| `courtName`    | string  |                  | Filter by court               |
| `isVerified`   | boolean |                  | Filter by verification status |
| `sort`         | string  | `experienceYears,desc` | Sort field and direction |

**Response:** `200 OK` — Paginated list of advocate profiles

---

### Bar Council Verification

#### Submit Verification Request

| | |
|-|-|
| **Method** | `POST` |
| **Path** | `/api/bar-council/verify` |
| **Auth** | `ADVOCATE` |

**Request Body:**

```json
{
  "barCouncilId": "BCI/MAH/12345/2020",
  "fullName": "Adv. Vikram Mehta",
  "enrollmentDate": "2020-03-15"
}
```

**Response:** `202 Accepted`

```json
{
  "success": true,
  "data": {
    "verificationId": "bb0e8400-e29b-41d4-a716-446655440000",
    "status": "PENDING",
    "submittedAt": "2024-01-15T10:30:00Z",
    "estimatedCompletionTime": "24-48 hours"
  },
  "message": "Verification request submitted successfully"
}
```

**Error Responses:** `409` Verification already pending or completed

---

#### Get Verification Status

| | |
|-|-|
| **Method** | `GET` |
| **Path** | `/api/bar-council/verify/status` |
| **Auth** | `ADVOCATE` |

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "verificationId": "bb0e8400-e29b-41d4-a716-446655440000",
    "status": "VERIFIED",
    "submittedAt": "2024-01-15T10:30:00Z",
    "verifiedAt": "2024-01-16T14:00:00Z",
    "expiresAt": "2025-01-16T14:00:00Z"
  }
}
```

---

### Cases

#### Create Case

| | |
|-|-|
| **Method** | `POST` |
| **Path** | `/api/cases` |
| **Auth** | `ADVOCATE` |

**Request Body:**

```json
{
  "title": "State vs. Kumar — Theft Charges",
  "caseNumber": "CRL/2024/00456",
  "description": "Criminal case involving charges of theft under IPC Section 379...",
  "type": "CRIMINAL",
  "court": "Sessions Court, Mumbai",
  "filedAt": "2024-01-10"
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    "id": "cc0e8400-e29b-41d4-a716-446655440000",
    "advocateId": "990e8400-e29b-41d4-a716-446655440000",
    "title": "State vs. Kumar — Theft Charges",
    "caseNumber": "CRL/2024/00456",
    "type": "CRIMINAL",
    "status": "OPEN",
    "court": "Sessions Court, Mumbai",
    "filedAt": "2024-01-10",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "message": "Case created successfully"
}
```

**Error Responses:** `409` Case number already exists

---

#### Get Case by ID

| | |
|-|-|
| **Method** | `GET` |
| **Path** | `/api/cases/{id}` |
| **Auth** | `ADVOCATE` |

**Response:** `200 OK` — Case object with documents list

---

#### List My Cases

| | |
|-|-|
| **Method** | `GET` |
| **Path** | `/api/cases` |
| **Auth** | `ADVOCATE` |

**Query Parameters:**

| Parameter | Type    | Default | Description                                       |
| --------- | ------- | ------- | ------------------------------------------------- |
| `page`    | integer | 0       | Page number                                       |
| `size`    | integer | 20      | Page size                                         |
| `status`  | string  |         | OPEN, IN_PROGRESS, HEARING, CLOSED, APPEALED      |
| `type`    | string  |         | CIVIL, CRIMINAL, CORPORATE, FAMILY, CONSTITUTIONAL|
| `search`  | string  |         | Search by title or case number                    |

**Response:** `200 OK` — Paginated list of cases

---

#### Update Case

| | |
|-|-|
| **Method** | `PUT` |
| **Path** | `/api/cases/{id}` |
| **Auth** | `ADVOCATE` |

**Request Body:**

```json
{
  "title": "State vs. Kumar — Theft Charges",
  "status": "HEARING",
  "nextHearing": "2024-02-20",
  "description": "Updated case description..."
}
```

**Response:** `200 OK` — Updated case object

**Error Responses:** `403` Not the assigned advocate, `404` Case not found

---

#### Upload Case Document

| | |
|-|-|
| **Method** | `POST` |
| **Path** | `/api/cases/{caseId}/documents` |
| **Auth** | `ADVOCATE` |

**Request Body:** `multipart/form-data`

| Field         | Type   | Required | Description          |
| ------------- | ------ | -------- | -------------------- |
| `file`        | file   | Yes      | Document file        |
| `title`       | string | Yes      | Document title       |
| `description` | string | No       | Document description |
| `type`        | string | Yes      | PETITION, AFFIDAVIT, EVIDENCE, ORDER, JUDGMENT, OTHER |

**Response:** `201 Created` — Document metadata object

---

#### List Case Documents

| | |
|-|-|
| **Method** | `GET` |
| **Path** | `/api/cases/{caseId}/documents` |
| **Auth** | `ADVOCATE` |

**Response:** `200 OK` — List of document metadata objects

---

#### Assign Client to Case

| | |
|-|-|
| **Method** | `POST` |
| **Path** | `/api/cases/{caseId}/assign-client` |
| **Auth** | `ADVOCATE` |

**Request Body:**

```json
{
  "clientRefId": "dd0e8400-e29b-41d4-a716-446655440000",
  "notes": "Client referred by Adv. Singh"
}
```

**Response:** `201 Created` — ClientAssignment record

---

#### List My Client Assignments

| | |
|-|-|
| **Method** | `GET` |
| **Path** | `/api/advocates/me/assignments` |
| **Auth** | `ADVOCATE` |

**Response:** `200 OK` — List of client assignment objects

---

---

## Client Service APIs

### Authentication

Same auth endpoints as Student Service (`/api/auth/register`, `/api/auth/login`) with `role: "CLIENT"`.

---

### Client Profile

#### Get Current Client Profile

| | |
|-|-|
| **Method** | `GET` |
| **Path** | `/api/clients/me` |
| **Auth** | `CLIENT` |

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "ee0e8400-e29b-41d4-a716-446655440000",
    "userId": "ff0e8400-e29b-41d4-a716-446655440000",
    "occupation": "Business Owner",
    "address": "456 Market Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pinCode": "400001",
    "bio": "Small business owner seeking legal guidance...",
    "avatarUrl": "https://storage.example.com/avatars/client.jpg"
  }
}
```

---

#### Update Client Profile

| | |
|-|-|
| **Method** | `PUT` |
| **Path** | `/api/clients/me` |
| **Auth** | `CLIENT` |

**Request Body:**

```json
{
  "occupation": "Business Owner",
  "address": "456 Market Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pinCode": "400001",
  "bio": "Small business owner seeking legal guidance..."
}
```

**Response:** `200 OK` — Updated profile object

---

#### Get Client by ID

| | |
|-|-|
| **Method** | `GET` |
| **Path** | `/api/clients/{id}` |
| **Auth** | `ADVOCATE`, `ADMIN` |

**Response:** `200 OK` — Client profile object

---

### Consultations

#### List Available Consultations

| | |
|-|-|
| **Method** | `GET` |
| **Path** | `/api/consultations` |
| **Auth** | `CLIENT` |

**Query Parameters:**

| Parameter      | Type    | Default | Description                 |
| -------------- | ------- | ------- | --------------------------- |
| `page`         | integer | 0       | Page number                 |
| `size`         | integer | 20      | Page size                   |
| `advocateId`   | UUID    |         | Filter by advocate          |
| `mode`         | string  |         | ONLINE, IN_PERSON, PHONE    |
| `dateFrom`     | date    |         | Slots starting from date    |
| `dateTo`       | date    |         | Slots up to date            |
| `maxFee`       | decimal |         | Maximum fee filter          |

**Response:** `200 OK` — Paginated list of consultation slots

---

#### Get Consultation by ID

| | |
|-|-|
| **Method** | `GET` |
| **Path** | `/api/consultations/{id}` |
| **Auth** | `CLIENT`, `ADVOCATE` |

**Response:** `200 OK` — Consultation object with advocate details

---

#### Book Consultation

| | |
|-|-|
| **Method** | `POST` |
| **Path** | `/api/consultations/{id}/book` |
| **Auth** | `CLIENT` |

**Request Body:**

```json
{
  "notes": "I need advice regarding a property dispute with my neighbor..."
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    "bookingId": "110e8400-e29b-41d4-a716-446655440000",
    "consultationId": "220e8400-e29b-41d4-a716-446655440000",
    "clientId": "ee0e8400-e29b-41d4-a716-446655440000",
    "status": "CONFIRMED",
    "paymentStatus": "PENDING",
    "paymentAmount": 5000.00,
    "bookedAt": "2024-01-15T10:30:00Z",
    "consultation": {
      "title": "Property Law Consultation",
      "slotTime": "2024-01-20T14:00:00Z",
      "durationMinutes": 60,
      "mode": "ONLINE"
    }
  },
  "message": "Consultation booked successfully"
}
```

**Error Responses:** `409` Slot already booked, `422` Slot not available

---

#### Get My Bookings

| | |
|-|-|
| **Method** | `GET` |
| **Path** | `/api/consultations/my-bookings` |
| **Auth** | `CLIENT` |

**Query Parameters:**

| Parameter | Type   | Default | Description                               |
| --------- | ------ | ------- | ----------------------------------------- |
| `status`  | string |         | CONFIRMED, CANCELLED, NO_SHOW, COMPLETED  |

**Response:** `200 OK` — List of booking objects with nested consultation data

---

#### Cancel Booking

| | |
|-|-|
| **Method** | `PATCH` |
| **Path** | `/api/consultations/bookings/{bookingId}/cancel` |
| **Auth** | `CLIENT` |

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "bookingId": "110e8400-e29b-41d4-a716-446655440000",
    "status": "CANCELLED",
    "paymentStatus": "REFUNDED",
    "cancelledAt": "2024-01-16T08:00:00Z"
  },
  "message": "Booking cancelled and refund initiated"
}
```

**Error Responses:** `422` Cannot cancel within 24 hours of slot time

---

### Case Requests

#### Create Case Request

| | |
|-|-|
| **Method** | `POST` |
| **Path** | `/api/case-requests` |
| **Auth** | `CLIENT` |

**Request Body:**

```json
{
  "title": "Property Boundary Dispute",
  "description": "My neighbor has encroached upon 200 sq ft of my property. I have the original survey documents...",
  "type": "CIVIL",
  "urgency": "HIGH",
  "advocateRefId": "990e8400-e29b-41d4-a716-446655440000",
  "budgetMin": 50000.00,
  "budgetMax": 200000.00
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    "id": "330e8400-e29b-41d4-a716-446655440000",
    "clientId": "ee0e8400-e29b-41d4-a716-446655440000",
    "title": "Property Boundary Dispute",
    "type": "CIVIL",
    "urgency": "HIGH",
    "status": "OPEN",
    "budgetMin": 50000.00,
    "budgetMax": 200000.00,
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "message": "Case request submitted successfully"
}
```

---

#### List My Case Requests

| | |
|-|-|
| **Method** | `GET` |
| **Path** | `/api/case-requests` |
| **Auth** | `CLIENT` |

**Query Parameters:**

| Parameter | Type    | Default | Description                                      |
| --------- | ------- | ------- | ------------------------------------------------ |
| `page`    | integer | 0       | Page number                                      |
| `size`    | integer | 20      | Page size                                        |
| `status`  | string  |         | OPEN, MATCHED, ACCEPTED, IN_PROGRESS, CLOSED     |
| `type`    | string  |         | CIVIL, CRIMINAL, CORPORATE, FAMILY, OTHER        |

**Response:** `200 OK` — Paginated list of case requests

---

#### Get Case Request by ID

| | |
|-|-|
| **Method** | `GET` |
| **Path** | `/api/case-requests/{id}` |
| **Auth** | `CLIENT`, `ADVOCATE` |

**Response:** `200 OK` — Case request object

---

#### Update Case Request

| | |
|-|-|
| **Method** | `PUT` |
| **Path** | `/api/case-requests/{id}` |
| **Auth** | `CLIENT` |

**Request Body:**

```json
{
  "title": "Property Boundary Dispute — Updated",
  "description": "Updated description with additional details...",
  "urgency": "URGENT",
  "budgetMax": 300000.00
}
```

**Response:** `200 OK` — Updated case request object

**Error Responses:** `403` Not the owning client, `422` Cannot update after being accepted

---

### Reviews

#### Submit Review

| | |
|-|-|
| **Method** | `POST` |
| **Path** | `/api/reviews` |
| **Auth** | `CLIENT` |

**Request Body:**

```json
{
  "advocateRefId": "990e8400-e29b-41d4-a716-446655440000",
  "rating": 5,
  "title": "Excellent Legal Representation",
  "comment": "Adv. Mehta handled my property case with utmost professionalism...",
  "isAnonymous": false
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    "id": "440e8400-e29b-41d4-a716-446655440000",
    "clientId": "ee0e8400-e29b-41d4-a716-446655440000",
    "advocateRefId": "990e8400-e29b-41d4-a716-446655440000",
    "rating": 5,
    "title": "Excellent Legal Representation",
    "comment": "Adv. Mehta handled my property case with utmost professionalism...",
    "isAnonymous": false,
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "message": "Review submitted successfully"
}
```

**Error Responses:** `409` Already reviewed this advocate

---

#### List Reviews for Advocate

| | |
|-|-|
| **Method** | `GET` |
| **Path** | `/api/reviews` |
| **Auth** | `CLIENT`, `ADVOCATE` |

**Query Parameters:**

| Parameter      | Type    | Default       | Description             |
| -------------- | ------- | ------------- | ----------------------- |
| `advocateId`   | UUID    | **required**  | Target advocate UUID    |
| `page`         | integer | 0             | Page number             |
| `size`         | integer | 20            | Page size               |
| `sort`         | string  | `createdAt,desc` | Sort field and direction |

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": "440e8400-e29b-41d4-a716-446655440000",
        "rating": 5,
        "title": "Excellent Legal Representation",
        "comment": "Adv. Mehta handled my property case...",
        "clientName": "Rahul P.",
        "isAnonymous": false,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "averageRating": 4.7,
    "totalReviews": 23,
    "page": 0,
    "size": 20,
    "totalPages": 2
  }
}
```

---

#### Get My Reviews

| | |
|-|-|
| **Method** | `GET` |
| **Path** | `/api/reviews/mine` |
| **Auth** | `CLIENT` |

**Response:** `200 OK` — List of reviews submitted by the authenticated client

---

#### Delete Review

| | |
|-|-|
| **Method** | `DELETE` |
| **Path** | `/api/reviews/{id}` |
| **Auth** | `CLIENT`, `ADMIN` |

**Response:** `204 No Content`

**Error Responses:** `403` Not the review author (unless ADMIN), `404` Review not found

---

---

*Last updated: 2024*
