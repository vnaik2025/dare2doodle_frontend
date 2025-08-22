import { Link } from 'react-router-dom';
import Card from '../common/Card';
import type { Challenge } from '../../apis/challengesApi';

interface ChallengeCardProps {
  challenge: Challenge;
}

const ChallengeCard = ({ challenge }: ChallengeCardProps) => (
  console.log("challenge", challenge.$id),
  <Card className="bg-gray-900 bg-opacity-500 backdrop-blur-sm">
    <Link to={`/challenge/${challenge.$id}`}>
      <h3 className="text-xl font-semibold text-white">{challenge.title}</h3>
      <p className="text-gray-300">{challenge.description}</p>
      {challenge.imageUrl && (
        <img src={challenge.imageUrl} alt={challenge.title} className="mt-4 max-w-xs rounded" />
      )}
      <div className="mt-2 flex flex-wrap gap-2">
        {challenge.tags?.map((tag) => (
          <span key={tag} className="bg-gray-700 text-white text-sm px-2 py-1 rounded">{tag}</span>
        ))}
      </div>
    </Link>
  </Card>
);

export default ChallengeCard;