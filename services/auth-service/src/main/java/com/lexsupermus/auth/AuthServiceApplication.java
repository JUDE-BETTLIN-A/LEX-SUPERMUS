package com.lexsupermus.auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * LEX SUPERMUS Auth Service (port 8086) — JUDE-BETTLIN branch.
 * Common authentication + role-specific registration (master spec Parts 3-5, 10).
 * Professional verification stays in advocate-service; this service never
 * issues verification results itself.
 */
@SpringBootApplication
public class AuthServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuthServiceApplication.class, args);
    }
}
