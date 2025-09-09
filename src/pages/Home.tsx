import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Tags } from "lucide-react";
import type { Challenge } from "../apis/challengesApi";
import { getChallenges } from "../apis/challengesApi";
import ChallengeCard from "../components/features/ChallengeCard";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

const Home = () => {
  const { data: challenges, isLoading, error } = useQuery<Challenge[]>({
    queryKey: ["challenges"],
    queryFn: getChallenges,
  });

  const [search, setSearch] = useState("");
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
    <div className="min-h-screen bg-black text-white px-4 py-8">
      {/* Header */}
      <div className="max-w-5xl mx-auto text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center justify-center gap-2">
          🔥 Ongoing Challenges
        </h1>
        <p className="text-gray-400 mt-1 text-xs md:text-sm">
          Join exciting doodle challenges happening now.
        </p>
      </div>

      {/* Filters */}
      <div className="max-w-5xl mx-auto mb-6 flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="flex items-center w-full md:flex-1 bg-gray-900/70 border border-gray-800 rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-gray-200 text-sm focus:outline-none"
          />
        </div>

        {/* Tag Filter */}
        {allTags.length > 0 && (
          <div className="flex items-center w-full md:w-48 bg-gray-900/70 border border-gray-800 rounded-xl px-3 py-2">
            <Tags className="w-4 h-4 text-gray-400 mr-2" />
            <select
              value={selectedTag ?? ""}
              onChange={(e) => setSelectedTag(e.target.value || null)}
              className="w-full bg-transparent text-gray-200 text-sm focus:outline-none"
            >
              <option value="">All</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag} className="bg-black">
                  {tag}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Challenges Grid */}
      <div
        className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        style={{
          backgroundImage: "url(/src/assets/doodle-bg.png)",
          backgroundSize: "cover",
        }}
      >
        {filteredChallenges?.length ? (
          filteredChallenges.map((challenge) => (
            <ChallengeCard key={challenge.$id} challenge={challenge} />
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full text-sm">
            No challenges found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;