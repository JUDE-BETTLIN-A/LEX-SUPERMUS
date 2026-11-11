package com.lexsupermus.advocate.repository;

import com.lexsupermus.advocate.model.BarCouncilVerification;
import com.lexsupermus.advocate.model.enums.VerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BarCouncilVerificationRepository
        extends JpaRepository<BarCouncilVerification, UUID> {

    List<BarCouncilVerification> findByAdvocateIdOrderBySubmittedAtDesc(UUID advocateId);

    List<BarCouncilVerification> findByVerificationStatusOrderBySubmittedAtDesc(
            VerificationStatus status);
}
