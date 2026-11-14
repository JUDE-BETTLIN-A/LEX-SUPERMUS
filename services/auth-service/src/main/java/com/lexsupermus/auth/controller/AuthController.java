package com.lexsupermus.auth.controller;

import com.lexsupermus.auth.dto.*;
import com.lexsupermus.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Auth REST endpoints (master spec Part 12.1 subset for this phase).
 * Implemented now: register student / advocate / client, login, me.
 * Pending phases: logout, verify-email, verify-mobile, resend-otp,
 * forgot-password, reset-password (OTP infrastructure — Part 10.2).
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register/student")
    public ResponseEntity<AuthResponse> registerStudent(
            @Valid @RequestBody StudentRegistrationRequest request) {
        return ResponseEntity.ok(authService.registerStudent(request));
    }

    @PostMapping("/register/advocate")
    public ResponseEntity<AuthResponse> registerAdvocate(
            @Valid @RequestBody AdvocateRegistrationRequest request) {
        return ResponseEntity.ok(authService.registerAdvocate(request));
    }

    @PostMapping("/register/client")
    public ResponseEntity<AuthResponse> registerClient(
            @Valid @RequestBody ClientRegistrationRequest request) {
        return ResponseEntity.ok(authService.registerClient(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        return ResponseEntity.ok(authService.me(authorization));
    }
}
