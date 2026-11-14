"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import ProfileAvatar from "@/components/ProfileAvatar";
import { getSavedProfileKey, type ProfessionalRole } from "@/lib/professional-profile";

type AuthMode = "login" | "register";

const BAR_COUNCILS = [
  "Bar Council of Tamil Nadu and Puducherry",
  "Bar Council of Delhi",
  "Bar Council of Maharashtra and Goa",
  "Other State Bar Council",
];

const PROFILE_FIELDS: Record<ProfessionalRole, string[]> = {
  STUDENT: [
    "fullName",
    "dateOfBirth",
    "email",
    "phone",
    "institution",
    "degree",
    "yearOfStudy",
    "city",
  ],
  ADVOCATE: [
    "fullName",
    "dateOfBirth",
    "email",
    "phone",
    "stateBarCouncil",
    "barCouncilNumber",
    "practiceAreas",
    "yearsOfExperience",
    "city",
    "verificationConsent",
  ],
};

function getAge(dateOfBirth: string): number | null {
  if (!dateOfBirth) return null;

  const [year, month, day] = dateOfBirth.split("-").map(Number);
  const birthDate = new Date(year, month - 1, day);
  if (
    Number.isNaN(birthDate.getTime()) ||
    birthDate.getFullYear() !== year ||
    birthDate.getMonth() !== month - 1 ||
    birthDate.getDate() !== day
  ) {
    return null;
  }

  const today = new Date();
  let age = today.getFullYear() - year;
  if (
    today.getMonth() < month - 1 ||
    (today.getMonth() === month - 1 && today.getDate() < day)
  ) {
    age -= 1;
  }
  return age;
}

function getDateString(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function getProfileCompletion(
  formData: FormData,
  role: ProfessionalRole,
  hasPhoto: boolean
): number {
  const fields = PROFILE_FIELDS[role];
  const completeFields = fields.filter((field) => {
    if (field === "verificationConsent") return formData.get(field) === "yes";
    return String(formData.get(field) ?? "").trim().length > 0;
  }).length;
  return Math.round(((completeFields + Number(hasPhoto)) / (fields.length + 1)) * 100);
}

function compressProfilePhoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("The selected photo could not be read."));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("Choose a valid image file."));
      image.onload = () => {
        const side = Math.min(image.naturalWidth, image.naturalHeight);
        const sourceX = (image.naturalWidth - side) / 2;
        const sourceY = (image.naturalHeight - side) / 2;
        const canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 256;
        const context = canvas.getContext("2d");
        if (!context) {
          reject(new Error("Your browser could not prepare the profile photo."));
          return;
        }
        context.drawImage(image, sourceX, sourceY, side, side, 0, 0, 256, 256);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export default function AuthPanel() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [role, setRole] = useState<ProfessionalRole | null>(null);
  const [mode, setMode] = useState<AuthMode>("login");
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [profileName, setProfileName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [photoProcessing, setPhotoProcessing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function chooseRole(nextRole: ProfessionalRole) {
    setRole(nextRole);
    setMode("login");
    setError("");
    setProfileCompletion(0);
    setProfileName("");
    setProfilePhoto("");
  }

  function updateProfileCompletion(form: HTMLFormElement, hasPhoto = Boolean(profilePhoto)) {
    if (!role) return;
    const formData = new FormData(form);
    setProfileName(String(formData.get("fullName") ?? "").trim());
    setProfileCompletion(getProfileCompletion(formData, role, hasPhoto));
  }

  async function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    setError("");
    if (!file) {
      setProfilePhoto("");
      if (formRef.current) updateProfileCompletion(formRef.current, false);
      return;
    }
    if (!file.type.startsWith("image/")) {
      setProfilePhoto("");
      event.currentTarget.value = "";
      if (formRef.current) updateProfileCompletion(formRef.current, false);
      setError("Choose an image file for your profile photo.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setProfilePhoto("");
      event.currentTarget.value = "";
      if (formRef.current) updateProfileCompletion(formRef.current, false);
      setError("Choose a profile photo smaller than 5 MB.");
      return;
    }

    setPhotoProcessing(true);
    try {
      const photo = await compressProfilePhoto(file);
      setProfilePhoto(photo);
      if (formRef.current) updateProfileCompletion(formRef.current, true);
    } catch (photoError) {
      setProfilePhoto("");
      setError(photoError instanceof Error ? photoError.message : "The profile photo could not be prepared.");
    } finally {
      setPhotoProcessing(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!role) return;

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");

    if (mode === "login") {
      const savedName = window.localStorage.getItem(getSavedProfileKey(role, "name"));
      if (!savedName) {
        setError(`No local ${role.toLowerCase()} demo profile was found. Create an account first.`);
        return;
      }

      setLoading(true);
      await new Promise<void>((resolve) => setTimeout(resolve, 400));
      window.localStorage.setItem("lex-supermus-user-name", savedName);
      window.localStorage.setItem("lex-supermus-user-role", role);
      window.localStorage.setItem(
        "lex-supermus-user-avatar",
        window.localStorage.getItem(getSavedProfileKey(role, "avatar")) ?? ""
      );
      window.localStorage.setItem("lex-supermus-profile-completion", "100");
      window.dispatchEvent(new Event("lex-auth-updated"));
      router.push("/feed");
      setLoading(false);
      return;
    }

    const dateOfBirth = String(formData.get("dateOfBirth") ?? "");
    const age = getAge(dateOfBirth);
    if (age === null || age < 0 || (role === "STUDENT" && age < 18)) {
      setError(
        role === "STUDENT"
          ? "Student accounts require a valid date of birth and age of at least 18."
          : "Enter a valid date of birth that is not in the future."
      );
      return;
    }
    if (password !== String(formData.get("confirmPassword") ?? "")) {
      setError("Passwords do not match.");
      return;
    }
    if (!profilePhoto || getProfileCompletion(formData, role, Boolean(profilePhoto)) !== 100) {
      setError("Complete all required profile details and add a profile photo before continuing.");
      return;
    }

    const fullName = String(formData.get("fullName") ?? "").trim();
    setLoading(true);
    await new Promise<void>((resolve) => setTimeout(resolve, 500));
    window.localStorage.setItem("lex-supermus-user-name", fullName);
    window.localStorage.setItem("lex-supermus-user-role", role);
    window.localStorage.setItem("lex-supermus-user-avatar", profilePhoto);
    window.localStorage.setItem("lex-supermus-profile-completion", "100");
    window.localStorage.setItem(getSavedProfileKey(role, "name"), fullName);
    window.localStorage.setItem(getSavedProfileKey(role, "avatar"), profilePhoto);
    const profileFields = role === "STUDENT"
      ? ["fullName", "dateOfBirth", "email", "phone", "institution", "degree", "yearOfStudy", "city"]
      : [
          "fullName",
          "dateOfBirth",
          "email",
          "phone",
          "stateBarCouncil",
          "barCouncilNumber",
          "practiceAreas",
          "yearsOfExperience",
          "city",
          "verificationConsent",
        ];
    const profileDetails: Record<string, string> = {};
    profileFields.forEach((field) => {
      profileDetails[field] = String(formData.get(field) ?? "").trim();
    });
    window.localStorage.setItem(
      getSavedProfileKey(role, "details"),
      JSON.stringify(profileDetails)
    );
    if (role === "ADVOCATE") {
      window.localStorage.setItem("lex-supermus-advocate-verification-status", "PENDING_REVIEW_DEMO");
    }
    window.dispatchEvent(new Event("lex-auth-updated"));
    router.push("/feed");
    setLoading(false);
  }

  if (!role) {
    return (
      <div className="auth-page">
        <div className="auth-brand">
          <span className="auth-brand-mark" aria-hidden="true">⚖</span>
          <div>
            <strong>LEX SUPERMUS</strong>
            <small>PROFESSIONAL NETWORK</small>
          </div>
        </div>
        <div className="professional-role-card">
          <div className="auth-heading">
            <h2>Choose your professional account</h2>
            <p className="auth-sub">Sign in or create a profile to continue to the professional feed.</p>
          </div>
          <div className="professional-role-options">
            <button type="button" className="professional-role-option" onClick={() => chooseRole("STUDENT")}>
              <span aria-hidden="true">🎓</span>
              <span><b>Student</b><small>Law students and recent graduates</small></span>
              <span className="professional-role-arrow" aria-hidden="true">→</span>
            </button>
            <button type="button" className="professional-role-option" onClick={() => chooseRole("ADVOCATE")}>
              <span aria-hidden="true">⚖</span>
              <span><b>Advocate</b><small>Legal professionals and practitioners</small></span>
              <span className="professional-role-arrow" aria-hidden="true">→</span>
            </button>
          </div>
          <p className="auth-disclaimer">Looking for legal support? Use the separate Client Portal.</p>
        </div>
      </div>
    );
  }

  const isStudent = role === "STUDENT";
  const roleLabel = isStudent ? "Student" : "Advocate";

  return (
    <div className="auth-page">
      <div className="auth-brand">
        <span className="auth-brand-mark" aria-hidden="true">⚖</span>
        <div>
          <strong>LEX SUPERMUS</strong>
          <small>{roleLabel.toUpperCase()} PROFESSIONAL NETWORK</small>
        </div>
      </div>

      <div className={`auth-card professional-auth-card${mode === "register" ? " professional-auth-card--register" : ""}`}>
        <button
          type="button"
          className="auth-link-btn professional-back-link"
          onClick={() => {
            setRole(null);
            setMode("login");
            setError("");
            setProfileCompletion(0);
            setProfileName("");
            setProfilePhoto("");
          }}
        >
          ← Change account type
        </button>
        <div className="auth-mode-row" role="group" aria-label={`${roleLabel} account options`}>
          <button
            type="button"
            aria-pressed={mode === "login"}
            className={`auth-mode-btn${mode === "login" ? " auth-mode-btn--active" : ""}`}
            onClick={() => { setMode("login"); setError(""); }}
          >
            Sign In
          </button>
          <button
            type="button"
            aria-pressed={mode === "register"}
            className={`auth-mode-btn${mode === "register" ? " auth-mode-btn--active" : ""}`}
            onClick={() => { setMode("register"); setError(""); }}
          >
            Create Account
          </button>
        </div>
        <div className="auth-heading">
          <h2>{mode === "login" ? `${roleLabel} sign in` : `Create your ${roleLabel.toLowerCase()} profile`}</h2>
          <p className="auth-sub">
            {mode === "login"
              ? "Use your email and password to enter the professional feed."
              : "Complete your professional details to create a profile."}
          </p>
        </div>

        <form
          ref={formRef}
          className="auth-form"
          onSubmit={handleSubmit}
          onChange={(event) => updateProfileCompletion(event.currentTarget)}
        >
          {mode === "login" ? (
            <>
              <label htmlFor="professional-login-email">Email address</label>
              <input
                id="professional-login-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
              />
              <label htmlFor="professional-login-password">Password</label>
              <input
                id="professional-login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
              <p className="auth-disclaimer">
                Demo sign-in uses a locally created profile; passwords are not stored or verified.
              </p>
            </>
          ) : (
            <>
              <div className="professional-profile-progress">
                <ProfileAvatar
                  name={profileName || roleLabel}
                  image={profilePhoto}
                  completion={profileCompletion}
                  size="large"
                />
                <div>
                  <b>Profile completeness</b>
                  <span>{profileCompletion}% complete</span>
                  <div
                    className="professional-progress-track"
                    role="progressbar"
                    aria-label="Profile completeness"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={profileCompletion}
                  >
                    <span style={{ width: `${profileCompletion}%` }} />
                  </div>
                </div>
              </div>

              <div className="professional-form-grid">
                <div className="professional-field">
                  <label htmlFor="professional-full-name">Full name</label>
                  <input id="professional-full-name" name="fullName" autoComplete="name" required />
                </div>
                <div className="professional-field">
                  <label htmlFor="professional-date-of-birth">Date of birth</label>
                  <input
                    id="professional-date-of-birth"
                    name="dateOfBirth"
                    type="date"
                    max={getDateString(new Date())}
                    autoComplete="bday"
                    required
                  />
                  {isStudent && <small>Student profiles are available to adults aged 18 or over.</small>}
                </div>
                <div className="professional-field">
                  <label htmlFor="professional-email">Email address</label>
                  <input
                    id="professional-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div className="professional-field">
                  <label htmlFor="professional-phone">Phone number</label>
                  <input
                    id="professional-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    pattern="[0-9+(). -]{7,20}"
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>

                {isStudent ? (
                  <>
                    <div className="professional-field">
                      <label htmlFor="student-institution">Law school / university</label>
                      <input id="student-institution" name="institution" autoComplete="organization" required />
                    </div>
                    <div className="professional-field">
                      <label htmlFor="student-degree">Degree / course</label>
                      <select id="student-degree" name="degree" defaultValue="" required>
                        <option value="" disabled>Select your course</option>
                        <option>LL.B.</option>
                        <option>B.A. LL.B.</option>
                        <option>B.B.A. LL.B.</option>
                        <option>B.Com. LL.B.</option>
                        <option>LL.M.</option>
                        <option>Other law degree</option>
                      </select>
                    </div>
                    <div className="professional-field">
                      <label htmlFor="student-year">Year of study</label>
                      <select id="student-year" name="yearOfStudy" defaultValue="" required>
                        <option value="" disabled>Select year</option>
                        <option>1st Year</option>
                        <option>2nd Year</option>
                        <option>3rd Year</option>
                        <option>4th Year</option>
                        <option>5th Year</option>
                        <option>Graduate</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="professional-field">
                      <label htmlFor="advocate-bar-council">State Bar Council</label>
                      <select id="advocate-bar-council" name="stateBarCouncil" defaultValue="" required>
                        <option value="" disabled>Select your council</option>
                        {BAR_COUNCILS.map((council) => <option key={council}>{council}</option>)}
                      </select>
                    </div>
                    <div className="professional-field">
                      <label htmlFor="advocate-enrolment-number">Enrolment number</label>
                      <input id="advocate-enrolment-number" name="barCouncilNumber" required />
                    </div>
                    <div className="professional-field">
                      <label htmlFor="advocate-practice-areas">Practice areas</label>
                      <input
                        id="advocate-practice-areas"
                        name="practiceAreas"
                        placeholder="e.g. Civil, family, or corporate law"
                        required
                      />
                    </div>
                    <div className="professional-field">
                      <label htmlFor="advocate-experience">Years of experience</label>
                      <input
                        id="advocate-experience"
                        name="yearsOfExperience"
                        type="number"
                        min="0"
                        max="60"
                        required
                      />
                    </div>
                    <div className="professional-field professional-field--full">
                      <label htmlFor="advocate-verification-document">Supporting verification document (optional)</label>
                      <input
                        id="advocate-verification-document"
                        name="verificationDocument"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      <small>Documents are not uploaded or stored by this demo.</small>
                    </div>
                    <label className="professional-consent professional-field--full">
                      <input name="verificationConsent" type="checkbox" value="yes" required />
                      <span>
                        I confirm these Bar Council details are accurate and understand they require
                        manual review.
                      </span>
                    </label>
                  </>
                )}

                <div className="professional-field">
                  <label htmlFor="professional-city">City</label>
                  <input id="professional-city" name="city" autoComplete="address-level2" required />
                </div>
                <div className="professional-field professional-field--full">
                  <label htmlFor="professional-profile-photo">Profile photo</label>
                  <input
                    id="professional-profile-photo"
                    name="profilePhoto"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    required
                  />
                  <small>Use a clear image, up to 5 MB. It will be resized for your profile.</small>
                </div>
                <div className="professional-field">
                  <label htmlFor="professional-password">Create password</label>
                  <input
                    id="professional-password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />
                </div>
                <div className="professional-field">
                  <label htmlFor="professional-confirm-password">Confirm password</label>
                  <input
                    id="professional-confirm-password"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />
                </div>
              </div>
              {role === "ADVOCATE" && (
                <p className="professional-verification-note">
                    The demo will show a pending-review state. No request is sent, and Bar Council
                    enrolment or supporting documents are not independently verified or uploaded.
                </p>
              )}
              <p className="client-privacy-note">
                Demo only: your profile details and resized photo are stored in this browser, not
                sent to a server. Passwords are never stored or verified.
              </p>
            </>
          )}

          {error && <div className="auth-error" role="alert">{error}</div>}
          <button
            type="submit"
            className="auth-submit auth-submit--navy"
            disabled={loading || photoProcessing || (mode === "register" && profileCompletion !== 100)}
          >
            {photoProcessing
              ? "Preparing photo…"
              : loading
                ? "Please wait…"
                : mode === "login"
                  ? "Sign in to professional feed →"
                  : "Create professional profile →"}
          </button>
        </form>

        <div className="auth-switch">
          {mode === "login" ? (
            <>New to LEX SUPERMUS?{" "}
              <button type="button" className="auth-link-btn" onClick={() => { setMode("register"); setError(""); }}>
                Create a {roleLabel.toLowerCase()} profile
              </button>
            </>
          ) : (
            <>Already have a profile?{" "}
              <button type="button" className="auth-link-btn" onClick={() => { setMode("login"); setError(""); }}>
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
