package com.lexsupermus.advocate.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Payload for submitting a Bar Council enrolment verification request.
 * The advocate id will come from the authenticated principal once JWT
 * security is wired up; it is accepted explicitly for now.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerificationRequest {

    private UUID advocateId;

    @NotBlank
    @Size(max = 100)
    private String barCouncilNumber;

    @NotBlank
    @Size(max = 255)
    private String stateBarCouncil;

    @Size(max = 512)
    private String documentUrl;
}
