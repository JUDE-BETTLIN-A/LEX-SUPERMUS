package com.lexsupermus.auth.dto;

import jakarta.validation.constraints.*;

/** Advocate registration payload (master spec Part 5.1 / product-owner field list). */
public record AdvocateRegistrationRequest(

        @NotBlank(message = "Full legal name is required.")
        @Size(min = 3, max = 200, message = "Full legal name must be 3-200 characters.")
        String fullName,

        @NotBlank(message = "Email is required.")
        @Email(message = "Invalid email format.")
        String email,

        @NotBlank(message = "Mobile number is required.")
        @Pattern(regexp = "^\\d{10}$", message = "Mobile number must be exactly 10 digits.")
        String mobileNumber,

        @NotBlank(message = "Password is required.")
        @Size(min = 8, max = 100, message = "Password must be at least 8 characters.")
        String password,

        @NotBlank(message = "State Bar Council is required.")
        String barCouncil,

        @NotBlank(message = "Bar Council enrolment number / bar ID is required.")
        @Size(min = 4, max = 100, message = "Enrolment number must be at least 4 characters.")
        String enrollmentNumber,

        @Min(value = 0, message = "Years of experience cannot be negative.")
        @Max(value = 70, message = "Years of experience looks unrealistic.")
        Integer yearsOfExperience,

        String specialization,

        @NotBlank(message = "Place of practice / location is required.")
        String practiceLocation
) {
}
