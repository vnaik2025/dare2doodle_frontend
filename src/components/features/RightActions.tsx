import React from "react";
import { MessageCircle, Bookmark, Share2 } from "lucide-react";
import LikeButton from "./LikeButton";

interface Props {
  challengeId: string;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onOpenComments: () => void;
}

const RightActions: React.FC<Props> = ({ challengeId, isBookmarked, onToggleBookmark, onOpenComments }) => {
  return (
    <div className="absolute right-4 bottom-1/3 z-30 flex flex-col items-center gap-5 pointer-events-auto">
      {/* Like */}
      <div className="flex flex-col items-center">
        <LikeButton targetId={challengeId} targetType="challenge" />
      </div>

      {/* Comment */}
      <button
        onClick={onOpenComments}
        className="text-white flex flex-col items-center hover:text-primary transition-colors"
        aria-label="Open comments"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Bookmark */}
      <button
        onClick={onToggleBookmark}
        className="text-white flex flex-col items-center hover:text-primary transition-colors"
        aria-label="Toggle bookmark"
      >
        <Bookmark className="w-6 h-6" fill={isBookmarked ? "currentColor" : "none"} />
      </button>

      {/* Share */}
      <button
        onClick={() => {
          const challengeLink = `${window.location.origin}/challenge/${challengeId}`;
          navigator.clipboard.writeText(challengeLink);
          // simple non-blocking feedback
          try {
            // try using the native clipboard feedback pattern
            // avoid using alert in production; keep for quick demo
            // eslint-disable-next-line no-console
            console.log("Challenge link copied:", challengeLink);
          } catch {
            // noop
          }
        }}
        className="text-white flex flex-col items-center hover:text-primary transition-colors"
        aria-label="Share"
      >
        <Share2 className="w-6 h-6" />
      </button>
    </div>
  );
};

export default RightActions;
