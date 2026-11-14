package com.lexsupermus.auth.model.enums;

/**
 * Account lifecycle. Verification badges are separate from account status —
 * an ACTIVE account may still be unverified (master spec Part 4.2).
 */
public enum AccountStatus {
    ACTIVE,
    PENDING_VERIFICATION,
    SUSPENDED,
    DEACTIVATED
}
