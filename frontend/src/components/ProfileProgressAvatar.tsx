import Image from "next/image";

export default function ProfileProgressAvatar({
  fullName,
  imageUrl,
  completion,
  size = 44,
}: {
  fullName: string;
  imageUrl: string;
  completion: number;
  size?: number;
}) {
  const initials = fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
  const progress = Math.max(0, Math.min(100, completion));

  return (
    <span
      className="profile-progress-avatar"
      style={{
        width: size,
        height: size,
        background: `conic-gradient(var(--gold) ${progress}%, var(--line) ${progress}% 100%)`,
      }}
      role="img"
      aria-label={`Profile ${progress}% complete`}
    >
      <span className="profile-progress-avatar__inner">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt=""
            fill
            sizes={`${size}px`}
            unoptimized
          />
        ) : (
          <span aria-hidden="true">{initials || "?"}</span>
        )}
      </span>
    </span>
  );
}
