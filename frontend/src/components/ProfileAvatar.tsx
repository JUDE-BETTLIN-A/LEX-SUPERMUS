import Image from "next/image";

type ProfileAvatarProps = {
  name: string;
  image?: string;
  completion: number;
  size?: "small" | "large";
  className?: string;
};

export default function ProfileAvatar({
  name,
  image,
  completion,
  size = "small",
  className = "",
}: ProfileAvatarProps) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
  const progress = Math.max(0, Math.min(100, completion));
  const progressAngle = `${progress * 3.6}deg`;

  return (
    <span
      className={`profileAvatarRing profileAvatarRing--${size} ${className}`.trim()}
      style={{
        background: `conic-gradient(var(--gold) 0deg ${progressAngle}, #dce1e8 ${progressAngle} 360deg)`,
      }}
      role="img"
      aria-label={`${name} profile picture, ${progress}% complete`}
    >
      <span className="profileAvatarCenter" aria-hidden="true">
        {image ? (
          <Image src={image} alt="" width={96} height={96} unoptimized />
        ) : (
          initials || "LS"
        )}
      </span>
    </span>
  );
}
