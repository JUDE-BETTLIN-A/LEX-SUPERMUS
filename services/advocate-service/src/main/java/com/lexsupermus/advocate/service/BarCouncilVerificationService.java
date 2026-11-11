package com.lexsupermus.advocate.service;

import com.lexsupermus.advocate.dto.VerificationRequest;
import com.lexsupermus.advocate.dto.VerificationResponse;
import com.lexsupermus.advocate.model.BarCouncilVerification;
import com.lexsupermus.advocate.model.enums.VerificationStatus;
import com.lexsupermus.advocate.repository.BarCouncilVerificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Bar Council enrolment review workflow.
 *
 * Submission and reviewer decisions are recorded here. Enrolment numbers are
 * NOT confirmed against any Bar Council in this module — an optional external
 * check (bar-council.api.*) can be plugged in behind this service later.
 */
@Service
@RequiredArgsConstructor
public class BarCouncilVerificationService {

    private final BarCouncilVerificationRepository repository;

    /** Step 1-2 of the UI wizard: advocate submits enrolment details. */
    @Transactional
    public VerificationResponse submit(VerificationRequest request) {
        BarCouncilVerification verification = BarCouncilVerification.builder()
                .advocateId(request.getAdvocateId())
                .barCouncilNumber(request.getBarCouncilNumber())
                .stateBarCouncil(request.getStateBarCouncil())
                .documentUrl(request.getDocumentUrl())
                .verificationStatus(VerificationStatus.PENDING)
                .build();
        return VerificationResponse.from(repository.save(verification));
    }

    @Transactional(readOnly = true)
    public VerificationResponse get(UUID id) {
        return VerificationResponse.from(require(id));
    }

    @Transactional(readOnly = true)
    public List<VerificationResponse> listForAdvocate(UUID advocateId) {
        return repository.findByAdvocateIdOrderBySubmittedAtDesc(advocateId)
                .stream().map(VerificationResponse::from).toList();
    }

    /** Admin/reviewer queue. */
    @Transactional(readOnly = true)
    public List<VerificationResponse> listByStatus(VerificationStatus status) {
        return repository.findByVerificationStatusOrderBySubmittedAtDesc(status)
                .stream().map(VerificationResponse::from).toList();
    }

    /** Reviewer decision: mark verified. */
    @Transactional
    public VerificationResponse verify(UUID id, String verifierNotes) {
        BarCouncilVerification v = require(id);
        v.setVerificationStatus(VerificationStatus.VERIFIED);
        v.setVerifiedAt(LocalDateTime.now());
        v.setVerifierNotes(verifierNotes);
        return VerificationResponse.from(repository.save(v));
    }

    /** Reviewer decision: reject with a reason. */
    @Transactional
    public VerificationResponse reject(UUID id, String reason) {
        BarCouncilVerification v = require(id);
        v.setVerificationStatus(VerificationStatus.REJECTED);
        v.setVerifiedAt(LocalDateTime.now());
        v.setRejectionReason(reason);
        return VerificationResponse.from(repository.save(v));
    }

    private BarCouncilVerification require(UUID id) {
        return repository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("Verification request not found: " + id));
    }
}
