package com.lexsupermus.library.controller;

import com.lexsupermus.library.dto.LibraryResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Search endpoints for the Digital Legal Library page.
 * NOTE: today's corpus is a small demo index. Replace it with PostgreSQL +
 * full-text search (or an external index) over authoritative sources such as
 * India Code and court repositories before treating results as current law.
 */
@RestController
@RequestMapping("/api/library")
public class LibraryController {

    private static final List<LibraryResult> DEMO_CORPUS = List.of(
            LibraryResult.builder()
                    .title("Constitution of India")
                    .source("India Code / Legislative Dept.")
                    .citation("Constitution of India, 1950")
                    .summary("Articles, schedules and constitutional materials.")
                    .build(),
            LibraryResult.builder()
                    .title("Central Acts")
                    .source("India Code")
                    .summary("Legislation with source and amendment metadata.")
                    .build(),
            LibraryResult.builder()
                    .title("Judgments")
                    .source("Supreme Court / High Court repositories")
                    .summary("Supreme Court and High Court decisions.")
                    .build(),
            LibraryResult.builder()
                    .title("Bare Acts & Rules")
                    .source("Legislative drafting sources")
                    .summary("Organised statutory texts and rules.")
                    .build());

    /** Demo search: matches the query against titles and summaries. */
    @GetMapping("/search")
    public List<LibraryResult> search(@RequestParam(name = "q", defaultValue = "") String q) {
        String needle = q.trim().toLowerCase();
        if (needle.isEmpty()) {
            return DEMO_CORPUS;
        }
        return DEMO_CORPUS.stream()
                .filter(r -> r.getTitle().toLowerCase().contains(needle)
                        || r.getSummary().toLowerCase().contains(needle)
                        || (r.getCitation() != null
                            && r.getCitation().toLowerCase().contains(needle)))
                .toList();
    }

    /** Health-style endpoint used by the gateway/readiness checks. */
    @GetMapping("/ping")
    public String ping() {
        return "legal-library-service ok";
    }
}
