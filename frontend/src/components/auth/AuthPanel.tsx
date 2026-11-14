"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import ProfileProgressAvatar from "@/components/ProfileProgressAvatar";
import {
  useProfessionalSession,
  type ProfessionalRole,
} from "@/components/ProfessionalSession";

type AuthMode = "login" | "register";
type AuthStep = "credentials" | "profile";

function getProfileCompletion(form: HTMLFormElement, role: ProfessionalRole) {
  const formData = new FormData(form);
  const fields =
    role === "STUDENT"
      ? [
          "fullName",
          "phone",
          "lawSchool",
          "degree",
          "studyYear",
          "graduationYear",
          "city",
          "legalInterests",
          "profilePhoto",
        ]
      : [
          "fullName",
          "phone",
          "stateBarCouncil",
          "enrolmentNumber",
          "yearsExperience",
          "practiceAreas",
          "city",
          "profilePhoto",
        ];
  const completed = fields.filter((field) => {
    const value = formData.get(field);
    if (value instanceof File) {
      return value.size > 0 && value.type.startsWith("image/");
    }
    return typeof value === "string" && value.trim().length > 0;
  }).length;

  return Math.round((completed / fields.length) * 100);
}

export default function AuthPanel() {
  const router = useRouter();
  const { profile, completeProfile } = useProfessionalSession();
  const [mode, setMode] = useState<AuthMode>("login");
  const [step, setStep] = useState<AuthStep>("credentials");
  const [role, setRole] = useState<ProfessionalRole>("STUDENT");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [profileProgress, setProfileProgress] = useState(0);
  const [photoPreview, setPhotoPreview] = useState("");
  const [error, setError] = useState("");
  const profileFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (profile) router.replace("/feed");
  }, [profile, router]);

  useEffect(() => {
    const preview = photoPreview;
    return () => {
      if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [photoPreview]);

  useEffect(() => {
    if (step === "profile" && profileFormRef.current) {
      setProfileProgress(getProfileCompletion(profileFormRef.current, role));
    }
  }, [role, step]);

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode);
    setStep("credentials");
    setEmail("");
    setFullName("");
    setProfileProgress(0);
    setPhotoPreview("");
    setError("");
  }

  function handleCredentialsSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = event.currentTarget;
    const formData = new FormData(form);
    const submittedEmail = String(formData.get("email") ?? "").trim();

    if (mode === "register") {
      const password = String(formData.get("password") ?? "");
      const confirmPassword = String(formData.get("confirmPassword") ?? "");
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    setEmail(submittedEmail);
    setFullName("");
    setProfileProgress(0);
    form.reset();
    setStep("profile");
  }

  function handleProfileChange(event: ChangeEvent<HTMLFormElement>) {
    setProfileProgress(getProfileCompletion(event.currentTarget, role));
    const target = event.target;
    if (
      target instanceof HTMLInputElement &&
      target.name === "profilePhoto" &&
      target.files?.[0]
    ) {
      setPhotoPreview(URL.createObjectURL(target.files[0]));
    }
  }

  function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const completion = getProfileCompletion(form, role);
    const photo = formData.get("profilePhoto");
    const submittedName = String(formData.get("fullName") ?? "").trim();

    setProfileProgress(completion);
    if (completion !== 100) {
      setError("Complete every required field and add a profile photo.");
      return;
    }
    if (!(photo instanceof File) || !photo.type.startsWith("image/")) {
      setError("Choose a valid image for your profile photo.");
      return;
    }

    setError("");
    completeProfile({
      role,
      fullName: submittedName,
      email,
      completion,
      avatar: photo,
    });
    form.reset();
    router.replace("/feed");
  }

  if (profile) return null;

  return (
    <div className="auth-page">
      <div className="auth-brand">
        <span className="auth-brand-mark" aria-hidden="true">
          ⚖
        </span>
        <div>
          <strong>LEX SUPERMUS</strong>
          <small>STUDENT &amp; ADVOCATE ACCESS</small>
        </div>
      </div>

      <div className="auth-card professional-auth-card">
        <div className="auth-mode-row" role="group" aria-label="Account action">
          <button
            type="button"
            aria-pressed={mode === "login"}
            className={`auth-mode-btn${mode === "login" ? " auth-mode-btn--active" : ""}`}
            onClick={() => changeMode("login")}
          >
            Sign In
          </button>
          <button
            type="button"
            aria-pressed={mode === "register"}
            className={`auth-mode-btn${mode === "register" ? " auth-mode-btn--active" : ""}`}
            onClick={() => changeMode("register")}
          >
            Create Account
          </button>
        </div>

        <div className="auth-heading">
          <h2>
            {step === "credentials"
              ? mode === "login"
                ? "Welcome back"
                : "Create a professional account"
              : `Complete your ${role === "STUDENT" ? "student" : "advocate"} profile`}
          </h2>
          <p className="auth-sub">
            {step === "credentials"
              ? "Choose your professional role to continue."
              : "Complete the required details to finish your profile."}
          </p>
        </div>

        {step === "credentials" ? (
          <form className="auth-form" onSubmit={handleCredentialsSubmit}>
            <div className="auth-role-selector" aria-label="Choose a role">
              <button
                type="button"
                aria-pressed={role === "STUDENT"}
                className={`auth-role-button${role === "STUDENT" ? " active" : ""}`}
                onClick={() => setRole("STUDENT")}
              >
                Student
              </button>
              <button
                type="button"
                aria-pressed={role === "ADVOCATE"}
                className={`auth-role-button${role === "ADVOCATE" ? " active" : ""}`}
                onClick={() => setRole("ADVOCATE")}
              >
                Advocate
              </button>
            </div>

            <label htmlFor="professional-email">Email address</label>
            <input
              id="professional-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
            />
            <label htmlFor="professional-password">Password</label>
            <input
              id="professional-password"
              name="password"
              type="password"
              autoComplete={mode === "register" ? "new-password" : "current-password"}
              minLength={8}
              required
              placeholder={mode === "register" ? "At least 8 characters" : "Enter your password"}
            />
            {mode === "register" && (
              <>
                <label htmlFor="professional-confirm-password">Confirm password</label>
                <input
                  id="professional-confirm-password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  placeholder="Re-enter your password"
                />
              </>
            )}

            {error && (
              <div className="auth-error" role="alert">
                {error}
              </div>
            )}

            <button type="submit" className="auth-submit auth-submit--navy">
              {mode === "login" ? "Continue to profile" : "Create account"}
            </button>
            <p className="auth-disclaimer">
              Demo only — credentials are not verified or saved. The next step
              collects role-specific profile details in this browser only.
            </p>
          </form>
        ) : (
          <form
            ref={profileFormRef}
            className="auth-form"
            onChange={handleProfileChange}
            onSubmit={handleProfileSubmit}
          >
            <div className="profile-setup-progress">
              <ProfileProgressAvatar
                fullName={fullName || email.split("@")[0]}
                imageUrl={photoPreview}
                completion={profileProgress}
                size={88}
              />
              <div>
                <strong>{profileProgress}% complete</strong>
                <p>Add every required detail and a photo to complete your profile.</p>
              </div>
            </div>

            <div className="professional-profile-grid">
              <div>
                <label htmlFor="professional-full-name">Full name</label>
                <input
                  id="professional-full-name"
                  name="fullName"
                  autoComplete="name"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  required
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label htmlFor="professional-profile-email">Email address</label>
                <input
                  id="professional-profile-email"
                  name="email"
                  type="email"
                  value={email}
                  readOnly
                  required
                />
              </div>
              <div>
                <label htmlFor="professional-phone">Phone number</label>
                <input
                  id="professional-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  placeholder="Your phone number"
                />
              </div>
              <div>
                <label htmlFor="professional-city">City</label>
                <input
                  id="professional-city"
                  name="city"
                  autoComplete="address-level2"
                  required
                  placeholder="Your city"
                />
              </div>

              {role === "STUDENT" ? (
                <>
                  <div>
                    <label htmlFor="student-law-school">Law school / university</label>
                    <input
                      id="student-law-school"
                      name="lawSchool"
                      required
                      placeholder="Institution name"
                    />
                  </div>
                  <div>
                    <label htmlFor="student-degree">Degree / course</label>
                    <input
                      id="student-degree"
                      name="degree"
                      required
                      placeholder="e.g. BA LL.B. or LL.B."
                    />
                  </div>
                  <div>
                    <label htmlFor="student-study-year">Year of study</label>
                    <select id="student-study-year" name="studyYear" defaultValue="" required>
                      <option value="" disabled>Select year</option>
                      <option>1st year</option>
                      <option>2nd year</option>
                      <option>3rd year</option>
                      <option>4th year</option>
                      <option>5th year</option>
                      <option>Graduated</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="student-graduation-year">Expected graduation year</label>
                    <input
                      id="student-graduation-year"
                      name="graduationYear"
                      type="number"
                      min="2000"
                      max="2100"
                      required
                      placeholder="e.g. 2028"
                    />
                  </div>
                  <div className="professional-profile-field--full">
                    <label htmlFor="student-interests">Legal interests</label>
                    <input
                      id="student-interests"
                      name="legalInterests"
                      required
                      placeholder="e.g. constitutional law, legal research"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label htmlFor="advocate-bar-council">State Bar Council</label>
                    <select
                      id="advocate-bar-council"
                      name="stateBarCouncil"
                      defaultValue=""
                      required
                    >
                      <option value="" disabled>Select council</option>
                      <option>Bar Council of Tamil Nadu and Puducherry</option>
                      <option>Bar Council of Delhi</option>
                      <option>Bar Council of Maharashtra and Goa</option>
                      <option>Other State Bar Council</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="advocate-enrolment-number">Enrolment number</label>
                    <input
                      id="advocate-enrolment-number"
                      name="enrolmentNumber"
                      required
                      placeholder="Your Bar Council enrolment number"
                    />
                  </div>
                  <div>
                    <label htmlFor="advocate-years-experience">Years in practice</label>
                    <input
                      id="advocate-years-experience"
                      name="yearsExperience"
                      type="number"
                      min="0"
                      max="70"
                      required
                      placeholder="Years"
                    />
                  </div>
                  <div>
                    <label htmlFor="advocate-practice-areas">Practice areas</label>
                    <input
                      id="advocate-practice-areas"
                      name="practiceAreas"
                      required
                      placeholder="e.g. family law, civil litigation"
                    />
                  </div>
                </>
              )}

              <div className="professional-profile-field--full">
                <label htmlFor="professional-profile-photo">Profile photo</label>
                <input
                  id="professional-profile-photo"
                  name="profilePhoto"
                  type="file"
                  accept="image/*"
                  required
                />
                <small className="field-hint">
                  Required to complete your profile. This demo keeps the image
                  only in memory.
                </small>
              </div>
            </div>

            {error && (
              <div className="auth-error" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="auth-submit auth-submit--navy"
              disabled={profileProgress < 100}
            >
              Finish profile and open professional feed
            </button>
            <p className="auth-disclaimer">
              Demo only — profile details are not saved or sent and will be
              cleared when you leave or reload this page.
            </p>
          </form>
        )}

        <div className="auth-switch">
          {step === "profile" ? (
            <button
              type="button"
              className="auth-link-btn"
              onClick={() => {
                setStep("credentials");
                setError("");
              }}
            >
              ← Back to sign in
            </button>
          ) : mode === "login" ? (
            <>
              Need a new account?{" "}
              <button
                type="button"
                className="auth-link-btn"
                onClick={() => changeMode("register")}
              >
                Create account
              </button>
            </>
          ) : (
            <>
              Already registered?{" "}
              <button
                type="button"
                className="auth-link-btn"
                onClick={() => changeMode("login")}
              >
                Sign in
              </button>
            </>
          )}
          {step === "credentials" && (
            <p className="auth-client-link">
              Client? <Link href="/client/access">Use the separate Client Portal</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
