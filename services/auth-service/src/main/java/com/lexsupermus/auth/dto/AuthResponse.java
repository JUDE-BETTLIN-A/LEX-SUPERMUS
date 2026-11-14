package com.lexsupermus.auth.dto;

/**
 * Registration response. Verification claims are never produced here —
 * the message only reports account creation state.
 */
public record AuthResponse(
        String message,
        UserResponse user,
        String token
) {
}
