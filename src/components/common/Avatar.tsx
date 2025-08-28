import { useMemo } from "react";
import { createAvatar } from "@dicebear/core";
import { lorelei } from "@dicebear/collection";

interface AvatarProps {
  name?: string; // Seed for avatar
  size?: number; // Avatar size in px
  className?: string; // Extra styles
}

const Avatar = ({ name = "Guest", size = 40, className = "" }: AvatarProps) => {
  const avatarUri = useMemo(() => {
    return createAvatar(lorelei, {
      seed: name,
      backgroundColor: ["1e293b"], // Tailwind slate-900
      radius: 50,
    }).toDataUri();
  }, [name]);

  console.log("name is",name)

  return (
    <img
      src={avatarUri}
      alt={`${name}'s avatar`}
      width={size}
      height={size}
      className={`rounded-full object-cover ${className}`}
    />
  );
};

export default Avatar;
