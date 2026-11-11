package com.lexsupermus.ai.controller;

import com.lexsupermus.ai.dto.ChatRequest;
import com.lexsupermus.ai.dto.ChatResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * AI assistant endpoints used by the AI Intelligence Workspace.
 *
 * Until a real model provider is wired in (ai.provider), replies are demo
 * responses. The disclaimer is appended to EVERY reply:
 * "Please independently verify legal information."
 */
@RestController
@RequestMapping("/api/ai")
public class AiController {

    @Value("${ai.disclaimer:Please independently verify legal information.}")
    private String disclaimer;

    @PostMapping("/chat")
    public ChatResponse chat(@Valid @RequestBody ChatRequest request) {
        String intro = "career".equalsIgnoreCase(request.getMode())
                ? "Career AI demo response: A production version would retrieve relevant career resources, resume guidance and skill-gap analysis."
                : "Legal AI demo response: A production version would retrieve verified legal sources and display citations for your issue.";

        return ChatResponse.builder()
                .mode(request.getMode())
                .reply(intro + " Your question has been received: \""
                        + truncate(request.getMessage()) + "\"")
                .disclaimer(disclaimer)
                .build();
    }

    @GetMapping("/ping")
    public String ping() {
        return "ai-service ok";
    }

    private static String truncate(String s) {
        return s.length() <= 200 ? s : s.substring(0, 200) + "…";
    }
}
