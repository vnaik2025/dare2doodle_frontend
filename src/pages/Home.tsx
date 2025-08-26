import { useState, useMemo } from 'react';
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

  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    challenges?.forEach((c) => c.tags?.forEach((t) => tags.add(t)));
    return Array.from(tags);
  }, [challenges]);

  const filteredChallenges = useMemo(() => {
    return challenges?.filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.description?.toLowerCase().includes(search.toLowerCase());
      const matchesTag = selectedTag ? c.tags?.includes(selectedTag) : true;
      return matchesSearch && matchesTag;
    });
  }, [challenges, search, selectedTag]);

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage message="Failed to load challenges" />;

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      {/* Header */}
      <div className="max-w-5xl mx-auto text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold">🔥 Ongoing Challenges</h1>
        <p className="text-gray-400 mt-2 text-sm md:text-base">
          Discover and participate in exciting doodle challenges happening right now.
        </p>
      </div>

      {/* Filters */}
      <div className="max-w-5xl mx-auto mb-8 flex flex-col md:flex-row items-center gap-4">
        {/* Search */}
        <input
          type="text"
          placeholder="Search challenges..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:flex-1 rounded-xl bg-gray-900/70 border border-gray-800 text-gray-200 px-4 py-2 focus:outline-none focus:border-gray-600"
        />

        {/* Tag Filter */}
        {allTags.length > 0 && (
          <select
            value={selectedTag ?? ''}
            onChange={(e) => setSelectedTag(e.target.value || null)}
            className="w-full md:w-48 rounded-xl bg-gray-900/70 border border-gray-800 text-gray-200 px-3 py-2 focus:outline-none focus:border-gray-600"
          >
            <option value="">All Tags</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Challenges Grid */}
      <div
        className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        style={{
          backgroundImage: 'url(/src/assets/doodle-bg.png)',
          backgroundSize: 'cover',
        }}
      >
        {filteredChallenges?.length ? (
          filteredChallenges.map((challenge) => (
            <ChallengeCard key={challenge.$id} challenge={challenge} />
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No challenges found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;
