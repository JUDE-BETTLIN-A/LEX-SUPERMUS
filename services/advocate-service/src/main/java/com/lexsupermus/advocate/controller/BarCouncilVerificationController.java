package com.lexsupermus.advocate.controller;

import com.lexsupermus.advocate.dto.VerificationRequest;
import com.lexsupermus.advocate.dto.VerificationResponse;
import com.lexsupermus.advocate.model.enums.VerificationStatus;
import com.lexsupermus.advocate.service.BarCouncilVerificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Bar Council verification endpoints (proxied by the gateway as
 * /api/bar-council/**). See docs/api-contracts.md.
 */
@RestController
@RequestMapping("/api/bar-council")
@RequiredArgsConstructor
public class BarCouncilVerificationController {

    private final BarCouncilVerificationService service;

    @PostMapping("/verifications")
    @ResponseStatus(HttpStatus.CREATED)
    public VerificationResponse submit(@Valid @RequestBody VerificationRequest request) {
        return service.submit(request);
    }

    @GetMapping("/verifications/{id}")
    public VerificationResponse get(@PathVariable UUID id) {
        return service.get(id);
    }

    @GetMapping("/verifications")
    public List<VerificationResponse> list(
            @RequestParam(required = false) UUID advocateId,
            @RequestParam(required = false) VerificationStatus status) {
        if (status != null) {
            return service.listByStatus(status);          // reviewer queue
        }
        if (advocateId != null) {
            return service.listForAdvocate(advocateId);   // advocate's own history
        }
        return service.listByStatus(VerificationStatus.PENDING);
    }

    @PostMapping("/verifications/{id}/verify")
    public VerificationResponse verify(@PathVariable UUID id,
                                       @RequestBody(required = false) String verifierNotes) {
        return service.verify(id, verifierNotes);
    }

    @PostMapping("/verifications/{id}/reject")
    public ResponseEntity<VerificationResponse> reject(
            @PathVariable UUID id, @RequestBody(required = false) String reason) {
        if (reason == null || reason.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(service.reject(id, reason));
    }
}
