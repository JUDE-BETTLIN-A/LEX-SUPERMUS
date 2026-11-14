package com.lexsupermus.auth.repository;

import com.lexsupermus.auth.model.AdvocateProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AdvocateProfileRepository extends JpaRepository<AdvocateProfile, UUID> {

    boolean existsByEnrollmentNumberIgnoreCase(String enrollmentNumber);
}
