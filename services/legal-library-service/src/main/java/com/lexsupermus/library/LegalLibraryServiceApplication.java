package com.lexsupermus.library;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point for the LEX SUPERMUS Legal Library Service.
 * Serves the Digital Legal Library page (/library) with statute, judgment
 * and bare-act search. Persistence (PostgreSQL + Flyway) is added together
 * with corpus ingestion; today the service answers from a demo index.
 */
@SpringBootApplication
public class LegalLibraryServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(LegalLibraryServiceApplication.class, args);
    }
}
