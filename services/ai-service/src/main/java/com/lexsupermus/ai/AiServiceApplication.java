package com.lexsupermus.ai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point for the LEX SUPERMUS AI Service.
 * Powers the AI Intelligence Workspace (/ai): Career AI and Legal AI.
 * Every response must carry the demo/unverified disclaimer —
 * "Please independently verify legal information."
 */
@SpringBootApplication
public class AiServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AiServiceApplication.class, args);
    }
}
