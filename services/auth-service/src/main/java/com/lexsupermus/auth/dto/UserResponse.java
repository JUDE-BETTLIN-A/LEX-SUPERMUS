package com.lexsupermus.auth.dto;

import com.lexsupermus.auth.model.enums.AccountStatus;
import com.lexsupermus.auth.model.enums.UserRole;
import com.lexsupermus.auth.model.User;

/**
 * Safe user representation — passwords are never returned through the API
 * (master spec Part 10.3 / security test case 5).
 */
public record UserResponse(
        String id,
        String fullName,
        String email,
        UserRole role,
        AccountStatus accountStatus,
        boolean emailVerified,
        boolean mobileVerified
) {
    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId().toString(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getAccountStatus(),
                user.isEmailVerified(),
                user.isMobileVerified()
        );
    }
}
