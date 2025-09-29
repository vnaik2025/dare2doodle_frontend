// src/components/features/ShareButton.tsx
import { Share2 } from "lucide-react";
import ActionButton from "../common/ActionButton";

interface ShareButtonProps {
  challengeId: string;
}

const ShareButton = ({ challengeId }: ShareButtonProps) => {
  const handleShare = () => {
    const link = `${window.location.origin}/challenge/${challengeId}`;
    navigator.clipboard.writeText(link);
    console.log("Challenge link copied:", link);
  };

  return (
    <ActionButton
      icon={<Share2 className="w-5 h-5 text-zinc-400 group-hover:text-primary" />}
      label="Share"
      onClick={handleShare}
    />
  );
};

export default ShareButton;
