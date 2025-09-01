import { useMemo } from "react";
import { createAvatar } from "@dicebear/core";
import { lorelei } from "@dicebear/collection";

interface AvatarProps {
  name?: string; // Seed for avatar
  size?: number; // Avatar size in px
  className?: string; // Extra styles
}

// 🎨 Helper: generate background color from name
const getBgColor = (name: string): string => {
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Convert hash to hex color
  const color = Math.floor(
    (Math.abs(Math.sin(hash) * 16777215)) % 16777215
  ).toString(16);

  // Always return 6-digit hex
  return "#" + "0".repeat(6 - color.length) + color;
};

const Avatar = ({ name = "Guest", size = 40, className = "" }: AvatarProps) => {
  const bgColor = useMemo(() => getBgColor(name), [name]);

  const avatarUri = useMemo(() => {
    return createAvatar(lorelei, {
      seed: name,
      backgroundColor: [bgColor.replace("#", "")], // dicebear expects hex without '#'
      radius: 50,
    }).toDataUri();
  }, [name, bgColor]);

  console.log("name is", name, " → bgColor:", bgColor);

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
