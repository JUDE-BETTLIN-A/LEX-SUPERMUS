package com.lexsupermus.auth.service;

import com.lexsupermus.auth.dto.*;
import com.lexsupermus.auth.model.AdvocateProfile;
import com.lexsupermus.auth.model.StudentProfile;
import com.lexsupermus.auth.model.User;
import com.lexsupermus.auth.model.enums.AccountStatus;
import com.lexsupermus.auth.model.enums.UserRole;
import com.lexsupermus.auth.repository.AdvocateProfileRepository;
import com.lexsupermus.auth.repository.StudentProfileRepository;
import com.lexsupermus.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

/**
 * Registration + login business logic (master spec Part 10) — JUDE-BETTLIN branch.
 *
 * Guarantees:
 *  - Passwords are BCrypt-hashed, never stored or returned in plain text.
 *  - Duplicate email / mobile / enrolment number are rejected with clear messages
 *    (master spec Part 16).
 *  - No verification results are produced here; advocate profiles start PENDING
 *    and the enrolment review stays in advocate-service.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final AdvocateProfileRepository advocateProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse registerStudent(StudentRegistrationRequest request) {
        assertEmailFree(request.email(), request.mobileNumber());

        User user = userRepository.save(User.builder()
                .fullName(request.fullName().trim())
                .email(request.email().trim())
                .mobileNumber(request.mobileNumber())
                .passwordHash(passwordEncoder.encode(request.password()))
                .role(UserRole.STUDENT)
                .accountStatus(AccountStatus.ACTIVE)
                .build());

        studentProfileRepository.save(StudentProfile.builder()
                .userId(user.getId())
                .courseType(request.course())
                .collegeName(request.collegeName().trim())
                .cgpa(java.math.BigDecimal.valueOf(request.cgpa()))
                .passedOutYear(request.passedOutYear())
                .yearsOfStudy(request.yearsOfStudy())
                .build());

        log.info("Student registered: {}", user.getEmail());
        return new AuthResponse(
                "Student registration successful. The account starts unverified; "
                        + "complete academic verification to receive the verified badge.",
                UserResponse.from(user),
                jwtService.issueToken(user.getId(), user.getEmail(), user.getRole().name()));
    }

    @Transactional
    public AuthResponse registerAdvocate(AdvocateRegistrationRequest request) {
        assertEmailFree(request.email(), request.mobileNumber());
        if (advocateProfileRepository.existsByEnrollmentNumberIgnoreCase(request.enrollmentNumber().trim())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "This enrolment number is already registered.");
        }

        User user = userRepository.save(User.builder()
                .fullName(request.fullName().trim())
                .email(request.email().trim())
                .mobileNumber(request.mobileNumber())
                .passwordHash(passwordEncoder.encode(request.password()))
                .role(UserRole.ADVOCATE)
                .accountStatus(AccountStatus.PENDING_VERIFICATION)
                .build());

        advocateProfileRepository.save(AdvocateProfile.builder()
                .userId(user.getId())
                .barCouncil(request.barCouncil())
                .enrollmentNumber(request.enrollmentNumber().trim())
                .yearsOfExperience(request.yearsOfExperience())
                .specialization(request.specialization())
                .practiceLocation(request.practiceLocation().trim())
                .verificationStatus("PENDING")
                .build());

        log.info("Advocate registered: {}", user.getEmail());
        return new AuthResponse(
                "Advocate registration successful. Bar Council enrolment verification "
                        + "starts as PENDING — no verified badge until authorized review completes.",
                UserResponse.from(user),
                jwtService.issueToken(user.getId(), user.getEmail(), user.getRole().name()));
    }

    @Transactional
    public AuthResponse registerClient(ClientRegistrationRequest request) {
        assertEmailFree(request.email(), null);

        User user = userRepository.save(User.builder()
                .fullName(request.email().trim())
                .email(request.email().trim())
                .passwordHash(passwordEncoder.encode(request.password()))
                .role(UserRole.CLIENT)
                .accountStatus(AccountStatus.ACTIVE)
                .build());

        log.info("Client registered: {}", user.getEmail());
        return new AuthResponse(
                "Client registration successful.",
                UserResponse.from(user),
                jwtService.issueToken(user.getId(), user.getEmail(), user.getRole().name()));
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmailIgnoreCase(request.email().trim())
                .orElse(null);

        // Same generic message for unknown email and wrong password — do not
        // reveal which accounts exist (master spec Part 16).
        if (user == null || !passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                    "Invalid email or password.");
        }
        if (user.getAccountStatus() == AccountStatus.SUSPENDED
                || user.getAccountStatus() == AccountStatus.DEACTIVATED) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "This account is " + user.getAccountStatus().name().toLowerCase()
                            + ". Contact platform support.");
        }

        return new AuthResponse(
                "Sign-in successful.",
                UserResponse.from(user),
                jwtService.issueToken(user.getId(), user.getEmail(), user.getRole().name()));
    }

    /** GET /api/auth/me — resolves the caller from a Bearer token. */
    @Transactional(readOnly = true)
    public UserResponse me(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing bearer token.");
        }
        var claims = jwtService.parse(authorizationHeader.substring(7));
        if (claims == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or expired token.");
        }
        User user = userRepository.findByEmailIgnoreCase(claims.getSubject())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                        "Account no longer exists."));
        return UserResponse.from(user);
    }

    private void assertEmailFree(String email, String mobileNumber) {
        if (userRepository.existsByEmailIgnoreCase(email.trim())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "This email is already registered. Try signing in instead.");
        }
        if (mobileNumber != null && userRepository.existsByMobileNumber(mobileNumber)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "This mobile number is already registered.");
        }
    }
}
