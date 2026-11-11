package com.lexsupermus.advocate.dto;

import com.lexsupermus.advocate.model.BarCouncilVerification;
import com.lexsupermus.advocate.model.enums.VerificationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerificationResponse {

    private UUID id;
    private UUID advocateId;
    private String barCouncilNumber;
    private String stateBarCouncil;
    private VerificationStatus status;
    private LocalDateTime submittedAt;
    private LocalDateTime verifiedAt;
    private String rejectionReason;

    public static VerificationResponse from(BarCouncilVerification v) {
        return VerificationResponse.builder()
                .id(v.getId())
                .advocateId(v.getAdvocateId())
                .barCouncilNumber(v.getBarCouncilNumber())
                .stateBarCouncil(v.getStateBarCouncil())
                .status(v.getVerificationStatus())
                .submittedAt(v.getSubmittedAt())
                .verifiedAt(v.getVerifiedAt())
                .rejectionReason(v.getRejectionReason())
                .build();
    }
}
