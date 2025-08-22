import { useQuery } from '@tanstack/react-query';
import { getBookmarks,  } from '../apis/bookmarksApi';
import type{ Bookmark  } from '../apis/bookmarksApi';

import { getChallenges  } from '../apis/challengesApi';
import type {  Challenge } from '../apis/challengesApi';

import ChallengeCard from '../components/features/ChallengeCard';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';

const Bookmarks = () => {
  const { data: bookmarks = [], isLoading: bookmarksLoading, error: bookmarksError } = useQuery<Bookmark[]>({
    queryKey: ['bookmarks'],
    queryFn: getBookmarks,
  });

  const { data: challenges = [], isLoading: challengesLoading } = useQuery<Challenge[]>({
    queryKey: ['challenges'],
    queryFn: getChallenges,
  });

  if (bookmarksLoading || challengesLoading) return <Loader />;
  if (bookmarksError) return <ErrorMessage message="Failed to load bookmarks" />;

  const bookmarkedChallenges = challenges.filter((c) =>
    bookmarks.some((b) => b.challengeId === c.id)
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Your Bookmarks</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookmarkedChallenges.map((challenge) => (
          <ChallengeCard key={challenge.id} challenge={challenge} />
        ))}
      </div>
    </div>
  );
};

export default Bookmarks;
