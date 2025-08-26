import { Link } from 'react-router-dom';
import type { Challenge } from '../../apis/challengesApi';

interface ChallengeCardProps {
  challenge: Challenge;
}

const ChallengeCard = ({ challenge }: ChallengeCardProps) => (
  <Link
    to={`/challenge/${challenge.$id}`}
    className="group relative flex flex-col bg-gray-900/70 rounded-2xl border border-gray-800 backdrop-blur-md p-4 transition-transform hover:scale-[1.02] hover:border-gray-700 shadow-lg"
  >
    {/* Thumbnail */}
    {challenge.imageUrl && (
      <div className="w-full h-44 overflow-hidden rounded-xl mb-3">
        <img
          src={challenge.imageUrl}
          alt={challenge.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
    )}

    {/* Title + Description */}
    <h3 className="text-lg font-semibold text-white truncate group-hover:text-amber-400 transition-colors">
      {challenge.title}
    </h3>
    <p className="text-gray-400 text-sm mt-1 line-clamp-2">
      {challenge.description}
    </p>

    {/* Tags */}
    <div className="mt-3 flex flex-wrap gap-1">
      {challenge.tags?.map((tag) => (
        <span
          key={tag}
          className="bg-gray-800/70 border border-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded-full group-hover:bg-gray-700 transition-colors"
        >
          {tag}
        </span>
      ))}
    </div>
  </Link>
);

export default ChallengeCard;
