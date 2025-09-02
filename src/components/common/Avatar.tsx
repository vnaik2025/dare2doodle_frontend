import { useMemo } from "react";
import { createAvatar } from "@dicebear/core";
import { lorelei } from "@dicebear/collection";

interface AvatarProps {
  name?: string;
  size?: number;
  className?: string;
  onClick?: () => void; // 👈 make Avatar clickable
}

const getBgColor = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = Math.floor(
    (Math.abs(Math.sin(hash) * 16777215)) % 16777215
  ).toString(16);
  return "#" + "0".repeat(6 - color.length) + color;
};

const Avatar = ({ name = "Guest", size = 40, className = "", onClick }: AvatarProps) => {
  const bgColor = useMemo(() => getBgColor(name), [name]);

  const avatarUri = useMemo(() => {
    return createAvatar(lorelei, {
      seed: name,
      backgroundColor: [bgColor.replace("#", "")],
      radius: 50,
    }).toDataUri();
  }, [name, bgColor]);

  return (
    <img
      src={avatarUri}
      alt={`${name}'s avatar`}
      width={size}
      height={size}
      className={`rounded-full object-cover ${onClick ? "cursor-pointer" : ""} ${className}`}
      onClick={onClick}
    />
  );
};

export default Avatar;
