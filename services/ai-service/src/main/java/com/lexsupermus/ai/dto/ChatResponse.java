package com.lexsupermus.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Chat response. {@code disclaimer} is always populated — AI output is a
 * demo aid, never verified legal advice.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatResponse {

    private String mode;
    private String reply;
    private String disclaimer;
}
