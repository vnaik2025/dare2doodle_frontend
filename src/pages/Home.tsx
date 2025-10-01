// // src/pages/Home.tsx
// import { useState, useMemo } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { Search, Tags, Plus } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import type { Challenge } from "../apis/challengesApi";
// import { getChallenges, createChallenge } from "../apis/challengesApi";
// import ChallengeCard from "../components/features/ChallengeCard";
// import ErrorMessage from "../components/common/ErrorMessage";
// import { useAuth } from "../hooks/useAuth";
// import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";

// const Home = () => {
//   const queryClient = useQueryClient();
//   const { isAuthenticated } = useAuth();
//   const navigate = useNavigate();

//   // ✅ Fast data: show cached challenges immediately, then refetch in background
//   const {
//     data: challenges = [],
//     isLoading,
//     error,
//   } = useQuery<Challenge[]>({
//     queryKey: ["challenges"],
//     queryFn: getChallenges,
//     staleTime: 1000 * 60, // 1 min = fresh
//     cacheTime: 1000 * 60 * 5, // keep in cache 5 min
//     refetchOnWindowFocus: false,
//     refetchOnReconnect: false,
//     refetchOnMount: false,
//     initialData: () => queryClient.getQueryData(["challenges"]), // use cache instantly
//   });

//   // ✅ Optimistic mutation example for adding a challenge
//   const addChallengeMutation = useMutation({
//     mutationFn: (newChallenge: Partial<Challenge>) =>
//       createChallenge(newChallenge),
//     onMutate: async (newChallenge) => {
//       await queryClient.cancelQueries({ queryKey: ["challenges"] });

//       const previous =
//         queryClient.getQueryData<Challenge[]>(["challenges"]) || [];

//       // Optimistically update
//       const optimisticChallenge = {
//         ...newChallenge,
//         $id: "temp-" + Date.now(),
//         createdAt: new Date().toISOString(),
//       } as Challenge;

//       queryClient.setQueryData(
//         ["challenges"],
//         [...previous, optimisticChallenge]
//       );

//       return { previous };
//     },
//     onError: (_err, _newChallenge, context) => {
//       if (context?.previous) {
//         queryClient.setQueryData(["challenges"], context.previous);
//       }
//     },
//     onSettled: () => {
//       queryClient.invalidateQueries({ queryKey: ["challenges"] });
//     },
//   });

//   const [search, setSearch] = useState("");
//   const [selectedTag, setSelectedTag] = useState<string | null>(null);

//   const allTags = useMemo(() => {
//     const tags = new Set<string>();
//     challenges?.forEach((c) => c.tags?.forEach((t) => tags.add(t)));
//     return Array.from(tags);
//   }, [challenges]);

//   const filteredChallenges = useMemo(() => {
//     return challenges?.filter((c) => {
//       const matchesSearch =
//         c.title.toLowerCase().includes(search.toLowerCase()) ||
//         c.description?.toLowerCase().includes(search.toLowerCase());
//       const matchesTag = selectedTag ? c.tags?.includes(selectedTag) : true;
//       return matchesSearch && matchesTag;
//     });
//   }, [challenges, search, selectedTag]);

//   if (error) return <ErrorMessage message="Failed to load challenges" />;

//   return (
//     <div className="h-full flex flex-col bg-black text-white">
//       {/* 🔥 Title + Create Button */}
//       <div className="flex flex-col md:flex-row justify-between items-center px-4 py-4 md:py-6 gap-3">
//         <div className="flex flex-col items-center md:items-start">
//           <h1 className="text-lg md:text-2xl font-bold">
//             🔥 Ongoing Challenges
//           </h1>
//           <p className="text-gray-400 text-xs md:text-sm">
//             Join exciting doodle challenges happening now.
//           </p>
//         </div>

//         {isAuthenticated && (
//           <button
//             onClick={() => navigate("/challenge/create")}
//             className="flex items-center gap-2 border border-gray-300 text-gray-300 px-4 py-2 rounded-[5px] text-sm md:text-base font-medium transition-colors hover:bg-gray-300 hover:text-black"
//           >
//             <Plus className="w-4 h-4" />
//             Create Challenge
//           </button>
//         )}
//       </div>

//       {/* 🔎 Search + Filter */}
//       <div className="flex flex-col sm:flex-row items-center gap-3 px-4 py-2">
//         {/* Search */}
//         <div className="flex items-center w-full sm:w-auto flex-1 bg-gray-900/70 border border-gray-800 rounded-xl px-3 py-2">
//           <Search className="w-4 h-4 text-gray-400 mr-2" />
//           <input
//             type="text"
//             placeholder="Search..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full bg-transparent text-gray-200 text-sm focus:outline-none"
//           />
//         </div>

//         {/* Tag Filter */}
//         {allTags.length > 0 && (
//           <div className="flex items-center w-full sm:w-32 bg-gray-900/70 border border-gray-800 rounded-xl px-3 py-2">
//             <Tags className="w-4 h-4 text-gray-400 mr-2" />
//             <select
//               value={selectedTag ?? ""}
//               onChange={(e) => setSelectedTag(e.target.value || null)}
//               className="w-full bg-transparent text-gray-200 text-sm focus:outline-none"
//             >
//               <option value="">All</option>
//               {allTags.map((tag) => (
//                 <option key={tag} value={tag} className="bg-black">
//                   {tag}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}
//       </div>

//       {/* 📌 Challenge List */}
//       <div
//         className="flex-1 overflow-y-auto px-4 scrollbar-hide"
//         style={{
//           backgroundImage: "url(/src/assets/doodle-bg.png)",
//           backgroundSize: "cover",
//         }}
//       >
//         <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-6">
//           {isLoading && !challenges.length ? (
//             <SkeletonTheme baseColor="#202020" highlightColor="#444">
//               {Array.from({ length: 6 }).map((_, idx) => (
//                 <div
//                   key={idx}
//                   className="bg-gray-900/50 border border-gray-800 rounded-xl p-4"
//                 >
//                   <Skeleton height={160} className="mb-3 rounded-lg" />
//                   <Skeleton width="70%" height={20} className="mb-2" />
//                   <Skeleton count={2} height={14} />
//                 </div>
//               ))}
//             </SkeletonTheme>
//           ) : filteredChallenges?.length ? (
//             filteredChallenges.map((challenge) => (
//               <ChallengeCard key={challenge.$id} challenge={challenge} />
//             ))
//           ) : (
//             <p className="text-center text-gray-500 col-span-full text-sm">
//               No challenges found.
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Challenge } from "../apis/challengesApi";
import { getChallenges, createChallenge } from "../apis/challengesApi";
import ChallengeCard from "../components/features/ChallengeCard";
import ErrorMessage from "../components/common/ErrorMessage";
import { useAuth } from "../hooks/useAuth";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import SearchControl from "../components/controls/SearchControl";
import DropdownControl from "../components/controls/DropdownControl";

const Home = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const {
    data: challenges = [],
    isLoading,
    error,
  } = useQuery<Challenge[]>({
    queryKey: ["challenges"],
    queryFn: getChallenges,
    staleTime: 1000 * 60,
    cacheTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    initialData: () => queryClient.getQueryData(["challenges"]),
  });

  const addChallengeMutation = useMutation({
    mutationFn: (newChallenge: Partial<Challenge>) =>
      createChallenge(newChallenge),
    onMutate: async (newChallenge) => {
      await queryClient.cancelQueries({ queryKey: ["challenges"] });

      const previous =
        queryClient.getQueryData<Challenge[]>(["challenges"]) || [];

      const optimisticChallenge = {
        ...newChallenge,
        $id: "temp-" + Date.now(),
        createdAt: new Date().toISOString(),
      } as Challenge;

      queryClient.setQueryData(
        ["challenges"],
        [...previous, optimisticChallenge]
      );

      return { previous };
    },
    onError: (_err, _newChallenge, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["challenges"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
    },
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

  if (error) return <ErrorMessage message="Failed to load challenges" />;

  return (
    <div className="h-full max-w-1xl flex flex-col bg-black text-white">
      {/* 🔥 Title + Create Button */}
      <div className="flex flex-col md:flex-row justify-between items-center px-4 py-4 md:py-6 gap-3">
        <div className="flex flex-col items-center md:items-start">
          <h1 className="text-lg md:text-2xl font-bold">
            🔥 Ongoing Challenges
          </h1>
          <p className="text-gray-400 text-xs md:text-sm">
            Join exciting doodle challenges happening now.
          </p>
        </div>

        {isAuthenticated && (
          <button
            onClick={() => navigate("/challenge/create")}
            className="flex items-center gap-2 border border-gray-300 text-gray-300 px-4 py-2 rounded-[5px] text-sm md:text-base font-medium transition-colors hover:bg-gray-300 hover:text-black"
          >
            <Plus className="w-4 h-4" />
            Create Challenge
          </button>
        )}
      </div>

      {/* 🔎 Search + Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3 px-4 py-2">
        <SearchControl
          value={search}
          onChange={setSearch}
          placeholder="Search challenges..."
          className="flex-1 w-full sm:w-auto"
        />
        {allTags.length > 0 && (
          <DropdownControl
            value={selectedTag}
            onChange={setSelectedTag}
            options={allTags}
            placeholder="All"
            className="w-full sm:w-40"
          />
        )}
      </div>

      {/* 📌 Challenge List */}
      <div
        className="flex-1 overflow-y-auto px-4 scrollbar-hide"
        style={{
          backgroundImage: "url(/src/assets/doodle-bg.png)",
          backgroundSize: "cover",
        }}
      >
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-6">
          {isLoading && !challenges.length ? (
            <SkeletonTheme baseColor="#202020" highlightColor="#444">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-gray-900/50 border border-gray-800 rounded-xl p-4"
                >
                  <Skeleton height={160} className="mb-3 rounded-lg" />
                  <Skeleton width="70%" height={20} className="mb-2" />
                  <Skeleton count={2} height={14} />
                </div>
              ))}
            </SkeletonTheme>
          ) : filteredChallenges?.length ? (
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
    </div>
  );
};

export default Home;
