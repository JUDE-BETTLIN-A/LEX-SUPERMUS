package com.lexsupermus.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/** Common login payload (master spec Part 10.1 — email + password). */
public record LoginRequest(

        @NotBlank(message = "Email is required.")
        @Email(message = "Invalid email format.")
        String email,

        @NotBlank(message = "Password is required.")
        String password
) {
}
