package com.lexsupermus.advocate;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

/**
 * Entry point for the LEX SUPERMUS Advocate Service.
 * Manages advocate profiles, bar council verification, case management,
 * case documents, and case notes.
 */
@SpringBootApplication
@ConfigurationPropertiesScan
public class AdvocateServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AdvocateServiceApplication.class, args);
    }
}
