package com.lexsupermus.auth.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Professional details captured at advocate registration (master spec
 * Part 11.3 subset). verificationStatus starts PENDING — this service does
 * not confirm enrolment; review stays in advocate-service.
 */
@Entity
@Table(name = "advocate_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdvocateProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false, unique = true)
    private UUID userId;

    @Column(name = "bar_council", nullable = false)
    private String barCouncil;

    @Column(name = "enrollment_number", nullable = false, unique = true, length = 100)
    private String enrollmentNumber;

    @Column(name = "years_of_experience")
    private Integer yearsOfExperience;

    @Column(length = 150)
    private String specialization;

    @Column(name = "practice_location", nullable = false)
    private String practiceLocation;

    /** PENDING | UNDER_REVIEW | VERIFIED | REJECTED | NEEDS_MORE_INFORMATION | EXPIRED | SUSPENDED */
    @Column(name = "verification_status", nullable = false, length = 30)
    @Builder.Default
    private String verificationStatus = "PENDING";

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
