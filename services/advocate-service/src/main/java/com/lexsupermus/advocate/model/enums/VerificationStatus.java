package com.lexsupermus.advocate.model.enums;

/**
* ADVOCATE VERIFICATION STATUS ENUM
 * Lifecycle of an advocate's Bar Council enrolment review.
 * Mirrors the PostgreSQL enum {@code verification_status}
 * ('PENDING', 'VERIFIED', 'REJECTED', 'EXPIRED') in V3__create_advocate_tables.sql.
 */
public enum VerificationStatus {
    PENDING,
    VERIFIED,
    REJECTED,
    EXPIRED
}
