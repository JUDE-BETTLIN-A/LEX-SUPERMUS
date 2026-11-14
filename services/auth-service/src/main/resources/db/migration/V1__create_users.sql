-- V1__create_users.sql
-- Master spec Part 11: users (11.1), student_profiles (11.2), advocate_profiles (11.3).
-- Client accounts need no profile table (email + password only).

CREATE TABLE users (
    id              UUID PRIMARY KEY,
    full_name       VARCHAR(200) NOT NULL,
    email           VARCHAR(255) NOT NULL UNIQUE,
    mobile_number   VARCHAR(15) UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    role            VARCHAR(20)  NOT NULL CHECK (role IN ('STUDENT', 'ADVOCATE', 'CLIENT', 'ADMIN')),
    account_status  VARCHAR(30)  NOT NULL DEFAULT 'ACTIVE'
                    CHECK (account_status IN ('ACTIVE', 'PENDING_VERIFICATION', 'SUSPENDED', 'DEACTIVATED')),
    email_verified  BOOLEAN      NOT NULL DEFAULT FALSE,
    mobile_verified BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_role ON users (role);
CREATE INDEX idx_users_account_status ON users (account_status);

CREATE TABLE student_profiles (
    id             UUID PRIMARY KEY,
    user_id        UUID NOT NULL UNIQUE REFERENCES users (id),
    course_type    VARCHAR(100) NOT NULL,
    college_name   VARCHAR(255) NOT NULL,
    cgpa           NUMERIC(4, 2),
    passed_out_year INTEGER,
    years_of_study INTEGER,
    created_at     TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE advocate_profiles (
    id                 UUID PRIMARY KEY,
    user_id            UUID NOT NULL UNIQUE REFERENCES users (id),
    bar_council        VARCHAR(255) NOT NULL,
    enrollment_number  VARCHAR(100) NOT NULL UNIQUE,
    years_of_experience INTEGER,
    specialization     VARCHAR(150),
    practice_location  VARCHAR(255) NOT NULL,
    -- Master spec 11.3 status columns; values start PENDING. Actual
    -- enrolment review lives in advocate-service (Bar Council module).
    verification_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    created_at         TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_advocate_profiles_council ON advocate_profiles (bar_council);
