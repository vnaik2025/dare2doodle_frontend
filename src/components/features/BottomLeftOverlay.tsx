import React from "react";
import Avatar from "../../components/common/Avatar";
// import { Challenge } from "../../apis/challengesApi"; // optional ts type import
import { getUserById } from "../../apis/usersApi";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";

/**
 * BottomLeftOverlay
 *
 * Renders avatar at bottom-left over image, title, description with "Read more"
 * Expand behavior: when expanded -> a rounded card is shown that grows upwards.
 * Description content becomes scrollable within the fixed max-height.
 */

interface Props {
  challenge: any;
  expanded: boolean;
  onToggleExpand: () => void;
  onProfileClick: (userId: string) => void;
}

const BottomLeftOverlay: React.FC<Props> = ({ challenge, expanded, onToggleExpand, onProfileClick }) => {
  // fetch creator info (name) to pass to Avatar seed
  const { data: creator, isLoading } = useQuery({
    queryKey: ["user", challenge.creatorId],
    queryFn: () => getUserById(challenge.creatorId),
    enabled: !!challenge?.creatorId,
    staleTime: 1000 * 60 * 5,
  });

  const name = creator?.username || "Guest";

  return (
    <div className="absolute bottom-4 left-4 right-20 z-20 pointer-events-auto">
      {/* container that expands upwards when `expanded` */}
      <div
        className={clsx(
          "transition-all duration-300 ease-out overflow-hidden",
          expanded ? "max-h-80" : "max-h-28"
        )}
        style={{ willChange: "max-height" }}
      >
        <div
          className={clsx(
            "bg-black/70 backdrop-blur-md rounded-xl p-3 shadow-lg flex gap-3 items-start",
            expanded ? "flex-col" : "flex-row"
          )}
        >
          {/* avatar + info */}
          <div className="flex-shrink-0">
            <button
              onClick={() => onProfileClick(challenge.creatorId)}
              className="block p-0 rounded-full"
              aria-label="Open creator profile"
            >
              <Avatar name={name} size={52} />
            </button>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-white font-semibold text-base truncate">{challenge.title}</h3>
            </div>

            {/* Description - collapsed shows 2 lines, expanded shows scrollable content */}
            {!expanded ? (
              <div className="mt-1">
                <p className="text-sm text-zinc-300 line-clamp-2 break-words">{challenge.description}</p>
                {challenge.description && challenge.description.length > 80 && (
                  <button className="text-xs text-primary mt-2" onClick={onToggleExpand}>
                    Read more
                  </button>
                )}
              </div>
            ) : (
              <div className="mt-2">
                <div className="max-h-36 overflow-y-auto scrollbar-hide pr-2">
                  <p className="text-sm text-zinc-200 whitespace-pre-wrap">{challenge.description}</p>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {challenge.tags?.map((tag: string) => (
                      <span key={tag} className="text-xs bg-white/5 px-2 py-1 rounded-full text-zinc-200">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <button className="text-xs text-primary" onClick={onToggleExpand}>
                    Show less
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomLeftOverlay;
