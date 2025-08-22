import { useQuery } from '@tanstack/react-query';
import type { Challenge } from '../apis/challengesApi';
import { getChallenges } from '../apis/challengesApi';
import ChallengeCard from '../components/features/ChallengeCard';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';

const Home = () => {
  const { data: challenges, isLoading, error } = useQuery<Challenge[]>({
    queryKey: ['challenges'],
    queryFn: getChallenges,
  });

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage message="Failed to load challenges" />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6" style={{ backgroundImage: 'url(/src/assets/doodle-bg.png)', backgroundSize: 'cover' }}>
      {challenges?.map((challenge) => (
        <ChallengeCard key={challenge.id} challenge={challenge} />
      ))}
    </div>
  );
};

export default Home;