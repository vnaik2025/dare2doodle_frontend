import { Link } from "react-router-dom";
import { Tag, Image as ImageIcon } from "lucide-react";
import type { Challenge } from "../../apis/challengesApi";
import { extractImageUrl } from "../../utils/url";

interface ChallengeCardProps {
  challenge: Challenge;
}

const ChallengeCard = ({ challenge }: ChallengeCardProps) => {
  const imgSrc = extractImageUrl(challenge.imageUrl);

  return (
    <Link
      to={`/challenge/${challenge.$id}`}
      className="group relative flex flex-col bg-gray-900/70 rounded-2xl border border-gray-800 backdrop-blur-md p-4 transition-transform hover:scale-[1.02] hover:border-gray-700 shadow-lg"
    >
      {/* Thumbnail */}
      <div className="w-full h-44 overflow-hidden rounded-xl mb-3 flex items-center justify-center bg-gray-800">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={challenge.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <ImageIcon className="w-10 h-10 text-gray-500" />
        )}
      </div>

      {/* Title + Description */}
      <h3 className="text-lg font-semibold text-white truncate group-hover:text-amber-400 transition-colors">
        {challenge.title}
      </h3>
      <p className="text-gray-400 text-sm mt-1 line-clamp-2">
        {challenge.description}
      </p>

      {/* Tags */}
      {challenge.tags?.length ? (
        <div className="mt-3 flex flex-wrap gap-1 items-center">
          <Tag className="w-4 h-4 text-gray-500" />
          {challenge.tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-800/70 border border-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded-full group-hover:bg-gray-700 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </Link>
  );
};

export default ChallengeCard;