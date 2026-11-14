"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type ProfessionalRole = "STUDENT" | "ADVOCATE";

export type ProfessionalProfile = {
  role: ProfessionalRole;
  fullName: string;
  email: string;
  avatarUrl: string;
  completion: number;
};

type ProfessionalSessionValue = {
  profile: ProfessionalProfile | null;
  completeProfile: (
    profile: Omit<ProfessionalProfile, "avatarUrl"> & { avatar: File },
  ) => void;
  signOut: () => void;
};

const ProfessionalSessionContext =
  createContext<ProfessionalSessionValue | null>(null);

export function ProfessionalSessionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [profile, setProfile] = useState<ProfessionalProfile | null>(null);

  useEffect(() => {
    const avatarUrl = profile?.avatarUrl;
    return () => {
      if (avatarUrl?.startsWith("blob:")) URL.revokeObjectURL(avatarUrl);
    };
  }, [profile?.avatarUrl]);

  function completeProfile(
    submittedProfile: Omit<ProfessionalProfile, "avatarUrl"> & {
      avatar: File;
    },
  ) {
    setProfile({
      role: submittedProfile.role,
      fullName: submittedProfile.fullName,
      email: submittedProfile.email,
      completion: submittedProfile.completion,
      avatarUrl: URL.createObjectURL(submittedProfile.avatar),
    });
  }

  function signOut() {
    setProfile(null);
  }

  return (
    <ProfessionalSessionContext.Provider
      value={{ profile, completeProfile, signOut }}
    >
      {children}
    </ProfessionalSessionContext.Provider>
  );
}

export function useProfessionalSession() {
  const session = useContext(ProfessionalSessionContext);
  if (!session) {
    throw new Error(
      "useProfessionalSession must be used within ProfessionalSessionProvider.",
    );
  }
  return session;
}
