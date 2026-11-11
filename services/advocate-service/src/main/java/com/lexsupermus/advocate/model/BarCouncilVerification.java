package com.lexsupermus.advocate.model;

import com.lexsupermus.advocate.model.enums.VerificationStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * A Bar Council enrolment verification request submitted by an advocate.
 *
 * Workflow (see docs/LEX_SUPERMUS_Advocate_Bar_Council_Verification_Module.pdf):
 *   PENDING -> VERIFIED | REJECTED  (reviewer action)
 *   PENDING | VERIFIED -> EXPIRED   (stale enrolment evidence)
 *
 * This is a review workflow only — the service records submissions and
 * reviewer decisions; it does not itself confirm enrolment with a Bar Council.
 */
@Entity
@Table(name = "bar_council_verifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BarCouncilVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "advocate_id", nullable = false)
    private UUID advocateId;

    @Column(name = "bar_council_number", nullable = false, length = 100)
    private String barCouncilNumber;

    @Column(name = "state_bar_council", nullable = false)
    private String stateBarCouncil;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private VerificationStatus verificationStatus = VerificationStatus.PENDING;

    @Column(name = "submitted_at", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime submittedAt;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    @Column(name = "rejection_reason")
    private String rejectionReason;

    @Column(name = "document_url", length = 512)
    private String documentUrl;

    @Column(name = "verifier_notes")
    private String verifierNotes;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
