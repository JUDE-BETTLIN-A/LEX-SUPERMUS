package com.lexsupermus.auth.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/** Academic details captured at student registration (master spec Part 11.2 subset). */
@Entity
@Table(name = "student_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false, unique = true)
    private UUID userId;

    @Column(name = "course_type", nullable = false, length = 100)
    private String courseType;

    @Column(name = "college_name", nullable = false)
    private String collegeName;

    @Column(precision = 4, scale = 2)
    private BigDecimal cgpa;

    @Column(name = "passed_out_year")
    private Integer passedOutYear;

    @Column(name = "years_of_study")
    private Integer yearsOfStudy;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
