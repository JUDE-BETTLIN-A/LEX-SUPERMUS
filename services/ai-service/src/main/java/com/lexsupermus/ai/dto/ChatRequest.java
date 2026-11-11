package com.lexsupermus.ai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Chat request from the AI Intelligence Workspace.
 * {@code mode} is "career" (Career AI) or "legal" (Legal AI).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRequest {

    @NotBlank
    private String mode;

    @NotBlank
    @Size(max = 4000)
    private String message;
}
