package com.lexsupermus.auth.dto;

import jakarta.validation.constraints.*;

/** Student registration payload (master spec Part 4.1 / product-owner field list). */
public record StudentRegistrationRequest(

        @NotBlank(message = "Full name is required.")
        @Size(min = 3, max = 200, message = "Full name must be 3-200 characters.")
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

        @NotBlank(message = "Course is required.")
        String course,

        @NotBlank(message = "College / university name is required.")
        String collegeName,

        @NotNull(message = "CGPA is required.")
        @DecimalMin(value = "0.0", message = "CGPA must be between 0 and 10.")
        @DecimalMax(value = "10.0", message = "CGPA must be between 0 and 10.")
        Double cgpa,

        @NotNull(message = "Year of passed out is required.")
        @Min(value = 1990, message = "Year of passed out looks too early.")
        @Max(value = 2100, message = "Year of passed out looks too far in the future.")
        Integer passedOutYear,

        @NotNull(message = "Years of study is required.")
        @Min(value = 1, message = "Years of study must be between 1 and 6.")
        @Max(value = 6, message = "Years of study must be between 1 and 6.")
        Integer yearsOfStudy
) {
}
