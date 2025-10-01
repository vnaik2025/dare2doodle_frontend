// import React, { useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { useNavigate } from "react-router-dom";
// import clsx from "clsx";

// import { getChallenges } from "../apis/challengesApi";
// import {
//   createBookmark,
//   deleteBookmark,
//   getBookmarks,
// } from "../apis/bookmarksApi";
// import { extractImageUrl } from "../utils/url";
// import { useAuth } from "../hooks/useAuth";

// import Loader from "../components/common/Loader";
// import ErrorMessage from "../components/common/ErrorMessage";
// import Avatar from "../components/common/Avatar";
// import LikeButton from "../components/features/LikeButton";
// import CommentsSection from "../components/features/MobileCommentSheet";
// import BookmarkButton from "../components/features/BookmarkButton";
// import CommentButton from "../components/features/CommentButton";
// import ShareButton from "../components/features/ShareButton";

// const timeAgo = (iso?: string) => {
//   if (!iso) return "";
//   const d = new Date(iso).getTime();
//   const s = Math.floor((Date.now() - d) / 1000);
//   if (s < 60) return `${s}s`;
//   if (s < 3600) return `${Math.floor(s / 60)}m`;
//   if (s < 86400) return `${Math.floor(s / 3600)}h`;
//   return `${Math.floor(s / 86400)}d`;
// };

// const Feed: React.FC = () => {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const queryClient = useQueryClient();

//   // Fetch challenges
//   const {
//     data: challenges = [],
//     isLoading,
//     error,
//   } = useQuery({
//     queryKey: ["challenges"],
//     queryFn: getChallenges,
//     staleTime: 1000 * 60 * 2,
//   });

//   // Fetch bookmarks (only when user exists)
//   const { data: bookmarks = [] } = useQuery({
//     queryKey: ["bookmarks"],
//     queryFn: getBookmarks,
//     enabled: !!user,
//   });

//   // Bookmark mutations
//   const addBookmarkMutation = useMutation({
//     mutationFn: (challengeId: string) => createBookmark({ challengeId }),
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookmarks"] }),
//   });

//   const removeBookmarkMutation = useMutation({
//     mutationFn: (challengeId: string) => deleteBookmark(challengeId),
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookmarks"] }),
//   });

//   const handleToggleBookmark = (challengeId: string, isBookmarked: boolean) => {
//     if (!user) {
//       navigate("/login");
//       return;
//     }
//     isBookmarked
//       ? removeBookmarkMutation.mutate(challengeId)
//       : addBookmarkMutation.mutate(challengeId);
//   };

//   // track which challenge's comments are open
//   const [openCommentsId, setOpenCommentsId] = useState<string | null>(null);

//   if (isLoading) return <Loader />;
//   if (error) return <ErrorMessage message="Failed to load feed" />;

//   if (!challenges.length) {
//     return (
//       <div className="min-h-[60vh] flex items-center justify-center">
//         <p className="text-zinc-400">
//           No challenges yet — create one or follow creators to see their posts.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full max-w-2xl mx-auto px-4 py-4">
//       <div className="space-y-4">
//         {challenges.map((c: any) => {
//           const isBookmarked = bookmarks.some(
//             (b: any) => b.challengeId === c.$id
//           );
//           const creatorName = c.creatorName || c.creatorUsername || "Guest";
//           const handle = c.creatorUsername ? `@${c.creatorUsername}` : "";

//           return (
//             <article
//               key={c.$id}
//               className="bg-black/60 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-zinc-800"
//             >
//               {/* Header */}
//               <div className="flex items-center gap-3">
//                 <button
//                   onClick={() => navigate(`/profile/${c.creatorId}`)}
//                   className="flex-shrink-0"
//                   aria-label={`Open ${creatorName} profile`}
//                 >
//                   <Avatar name={creatorName} size={48} />
//                 </button>

//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center gap-2">
//                     <h3 className="text-sm font-semibold text-white truncate">
//                       {creatorName}
//                     </h3>
//                     {handle && (
//                       <span className="text-xs text-zinc-400 truncate">
//                         {handle}
//                       </span>
//                     )}
//                     <span className="text-xs text-zinc-500 ml-auto">
//                       {timeAgo(c.publishedAt || c.$createdAt)}
//                     </span>
//                   </div>
//                   {c.title && (
//                     <p className="text-sm text-zinc-300 truncate mt-1">
//                       {c.title}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               {/* Body */}
//               <div className="mt-3">
//                 {c.description && (
//                   <p className="text-sm text-zinc-300 whitespace-pre-wrap break-words">
//                     {c.description}
//                   </p>
//                 )}

//                 {/* image (if present) */}
//                 {c.imageUrl && (
//                   <div className="mt-3 rounded-lg overflow-hidden border border-zinc-800">
//                     <img
//                       src={extractImageUrl(c.imageUrl)}
//                       alt={c.title || "challenge image"}
//                       className="w-full max-h-72 object-contain"
//                       loading="lazy"
//                     />
//                   </div>
//                 )}

//                 {/* tags */}
//                 {c.tags?.length > 0 && (
//                   <div className="mt-2 flex flex-wrap gap-2">
//                     {c.tags.map((t: string) => (
//                       <span
//                         key={t}
//                         className="text-xs px-2 py-1 rounded-full bg-white/5 text-zinc-200"
//                         onClick={() =>
//                           navigate(`/search?tag=${encodeURIComponent(t)}`)
//                         }
//                       >
//                         #{t}
//                       </span>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Actions row */}
//               <div className="mt-3 flex items-center justify-between">
//                 <div className="flex items-center gap-4">
//                   <LikeButton targetId={c.$id} targetType="challenge" />
//                   <CommentButton
//                     isOpen={openCommentsId === c.$id}
//                     toggle={() =>
//                       setOpenCommentsId(openCommentsId === c.$id ? null : c.$id)
//                     }
//                     count={c.commentCount}
//                     challengeId={c.$id}
//                   />
//                 </div>

//                 <div className="flex items-center gap-4">
//                   <BookmarkButton challengeId={c.$id} />
//                   <ShareButton challengeId={c.$id} />
//                 </div>
//               </div>

//               {/* Inline comments section */}
//               {openCommentsId === c.$id && (
//                 <CommentsSection challengeId={c.$id} />
//               )}
//             </article>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default Feed;

// // src/pages/Feed.tsx
// import React, { useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { useNavigate } from "react-router-dom";
// import clsx from "clsx";

// import { getChallenges } from "../apis/challengesApi";
// import {
//   createBookmark,
//   deleteBookmark,
//   getBookmarks,
// } from "../apis/bookmarksApi";
// import { extractImageUrl } from "../utils/url";
// import { useAuth } from "../hooks/useAuth";

// import ErrorMessage from "../components/common/ErrorMessage";
// import Avatar from "../components/common/Avatar";
// import LikeButton from "../components/features/LikeButton";
// import CommentsSection from "../components/features/MobileCommentSheet";
// import BookmarkButton from "../components/features/BookmarkButton";
// import CommentButton from "../components/features/CommentButton";
// import ShareButton from "../components/features/ShareButton";

// import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";

// const timeAgo = (iso?: string) => {
//   if (!iso) return "";
//   const d = new Date(iso).getTime();
//   const s = Math.floor((Date.now() - d) / 1000);
//   if (s < 60) return `${s}s`;
//   if (s < 3600) return `${Math.floor(s / 60)}m`;
//   if (s < 86400) return `${Math.floor(s / 3600)}h`;
//   return `${Math.floor(s / 86400)}d`;
// };

// const Feed: React.FC = () => {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const queryClient = useQueryClient();

//   // Fetch challenges
//   const {
//     data: challenges = [],
//     isLoading,
//     error,
//   } = useQuery({
//     queryKey: ["challenges"],
//     queryFn: getChallenges,
//     staleTime: 1000 * 60 * 2,
//   });

//   // Fetch bookmarks (only when user exists)
//   const { data: bookmarks = [] } = useQuery({
//     queryKey: ["bookmarks"],
//     queryFn: getBookmarks,
//     enabled: !!user,
//   });

//   // Bookmark mutations
//   const addBookmarkMutation = useMutation({
//     mutationFn: (challengeId: string) => createBookmark({ challengeId }),
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookmarks"] }),
//   });

//   const removeBookmarkMutation = useMutation({
//     mutationFn: (challengeId: string) => deleteBookmark(challengeId),
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookmarks"] }),
//   });

//   const handleToggleBookmark = (challengeId: string, isBookmarked: boolean) => {
//     if (!user) {
//       navigate("/login");
//       return;
//     }
//     isBookmarked
//       ? removeBookmarkMutation.mutate(challengeId)
//       : addBookmarkMutation.mutate(challengeId);
//   };

//   // track which challenge's comments are open
//   const [openCommentsId, setOpenCommentsId] = useState<string | null>(null);

//   if (error) return <ErrorMessage message="Failed to load feed" />;

//   return (
//     <div className="w-full max-w-2xl mx-auto px-4 py-4">
//       <div className="space-y-4">
//         {isLoading ? (
//           // 🔥 Skeleton loading state (mimic post cards)
//           <SkeletonTheme baseColor="#202020" highlightColor="#444">
//             {Array.from({ length: 4 }).map((_, idx) => (
//               <article
//                 key={idx}
//                 className="bg-black/60 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-zinc-800"
//               >
//                 {/* Header skeleton */}
//                 <div className="flex items-center gap-3">
//                   <Skeleton circle height={48} width={48} />
//                   <div className="flex-1">
//                     <Skeleton width="40%" height={14} className="mb-2" />
//                     <Skeleton width="60%" height={12} />
//                   </div>
//                 </div>

//                 {/* Body skeleton */}
//                 <div className="mt-3">
//                   <Skeleton count={2} height={14} className="mb-2" />
//                   <Skeleton height={180} className="rounded-md" />
//                 </div>

//                 {/* Actions skeleton */}
//                 <div className="mt-3 flex items-center justify-between">
//                   <div className="flex gap-4">
//                     <Skeleton width={24} height={24} circle />
//                     <Skeleton width={24} height={24} circle />
//                   </div>
//                   <div className="flex gap-4">
//                     <Skeleton width={24} height={24} circle />
//                     <Skeleton width={24} height={24} circle />
//                   </div>
//                 </div>
//               </article>
//             ))}
//           </SkeletonTheme>
//         ) : !challenges.length ? (
//           <div className="min-h-[60vh] flex items-center justify-center">
//             <p className="text-zinc-400">
//               No challenges yet — create one or follow creators to see their
//               posts.
//             </p>
//           </div>
//         ) : (
//           challenges.map((c: any) => {
//             const isBookmarked = bookmarks.some(
//               (b: any) => b.challengeId === c.$id
//             );
//             const creatorName = c.creatorName || c.creatorUsername || "Guest";
//             const handle = c.creatorUsername ? `@${c.creatorUsername}` : "";

//             return (
//               <article
//                 key={c.$id}
//                 className="bg-black/60 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-zinc-800"
//               >
//                 {/* Header */}
//                 <div className="flex items-center gap-3">
//                   <button
//                     onClick={() => navigate(`/profile/${c.creatorId}`)}
//                     className="flex-shrink-0"
//                     aria-label={`Open ${creatorName} profile`}
//                   >
//                     <Avatar name={creatorName} size={48} />
//                   </button>

//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-center gap-2">
//                       <h3 className="text-sm font-semibold text-white truncate">
//                         {creatorName}
//                       </h3>
//                       {handle && (
//                         <span className="text-xs text-zinc-400 truncate">
//                           {handle}
//                         </span>
//                       )}
//                       <span className="text-xs text-zinc-500 ml-auto">
//                         {timeAgo(c.publishedAt || c.$createdAt)}
//                       </span>
//                     </div>
//                     {c.title && (
//                       <p className="text-sm text-zinc-300 truncate mt-1">
//                         {c.title}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 {/* Body */}
//                 <div className="mt-3">
//                   {c.description && (
//                     <p className="text-sm text-zinc-300 whitespace-pre-wrap break-words">
//                       {c.description}
//                     </p>
//                   )}

//                   {/* image (if present) */}
//                   {c.imageUrl && (
//                     <div className="mt-3 rounded-lg overflow-hidden border border-zinc-800">
//                       <img
//                         src={extractImageUrl(c.imageUrl)}
//                         alt={c.title || "challenge image"}
//                         className="w-full max-h-72 object-contain"
//                         loading="lazy"
//                       />
//                     </div>
//                   )}

//                   {/* tags */}
//                   {c.tags?.length > 0 && (
//                     <div className="mt-2 flex flex-wrap gap-2">
//                       {c.tags.map((t: string) => (
//                         <span
//                           key={t}
//                           className="text-xs px-2 py-1 rounded-full bg-white/5 text-zinc-200"
//                           onClick={() =>
//                             navigate(`/search?tag=${encodeURIComponent(t)}`)
//                           }
//                         >
//                           #{t}
//                         </span>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 {/* Actions row */}
//                 <div className="mt-3 flex items-center justify-between">
//                   <div className="flex items-center gap-4">
//                     <LikeButton targetId={c.$id} targetType="challenge" />
//                     <CommentButton
//                       isOpen={openCommentsId === c.$id}
//                       toggle={() =>
//                         setOpenCommentsId(
//                           openCommentsId === c.$id ? null : c.$id
//                         )
//                       }
//                       count={c.commentCount}
//                       challengeId={c.$id}
//                     />
//                   </div>

//                   <div className="flex items-center gap-4">
//                     <BookmarkButton challengeId={c.$id} />
//                     <ShareButton challengeId={c.$id} />
//                   </div>
//                 </div>

//                 {/* Inline comments section */}
//                 {openCommentsId === c.$id && (
//                   <CommentsSection challengeId={c.$id} />
//                 )}
//               </article>
//             );
//           })
//         )}
//       </div>
//     </div>
//   );
// };

// export default Feed;


// src/pages/Feed.tsx
import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { getChallenges } from "../apis/challengesApi";
import {
  createBookmark,
  deleteBookmark,
  getBookmarks,
} from "../apis/bookmarksApi";
import { extractImageUrl } from "../utils/url";
import { useAuth } from "../hooks/useAuth";

import ErrorMessage from "../components/common/ErrorMessage";
import Avatar from "../components/common/Avatar";
import LikeButton from "../components/features/LikeButton";
import CommentsSection from "../components/features/MobileCommentSheet";
import BookmarkButton from "../components/features/BookmarkButton";
import CommentButton from "../components/features/CommentButton";
import ShareButton from "../components/features/ShareButton";

import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { useUser } from "../hooks/useUser";

const timeAgo = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso).getTime();
  const s = Math.floor((Date.now() - d) / 1000);
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
};

// Child component to handle individual challenge with user fetch
const FeedItem: React.FC<{
  challenge: any;
  isBookmarked: boolean;
  onToggleBookmark: (challengeId: string, isBookmarked: boolean) => void;
  openCommentsId: string | null;
  setOpenCommentsId: (id: string | null) => void;
}> = ({ challenge, isBookmarked, onToggleBookmark, openCommentsId, setOpenCommentsId }) => {
  const navigate = useNavigate();

  // fetch user info for the challenge creator
  const { data: feedCreator, isLoading: userLoading } = useUser(challenge.creatorId);

  const creatorName =
    feedCreator?.name || feedCreator?.username || challenge.creatorName || "Guest";
  const handle = feedCreator?.username
    ? `@${feedCreator.username}`
    : challenge.creatorUsername
    ? `@${challenge.creatorUsername}`
    : "";

  return (
    <article
      key={challenge.$id}
      className="bg-black/60 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-zinc-800"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(`/profile/${challenge.creatorId}`)}
          className="flex-shrink-0"
          aria-label={`Open ${creatorName} profile`}
        >
          <Avatar name={creatorName} size={48} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white truncate">
              {userLoading ? "Loading..." : creatorName}
            </h3>
            {handle && (
              <span className="text-xs text-zinc-400 truncate">{handle}</span>
            )}
            <span className="text-xs text-zinc-500 ml-auto">
              {timeAgo(challenge.publishedAt || challenge.$createdAt)}
            </span>
          </div>
          {challenge.title && (
            <p className="text-sm text-zinc-300 truncate mt-1">{challenge.title}</p>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="mt-3">
        {challenge.description && (
          <p className="text-sm text-zinc-300 whitespace-pre-wrap break-words">
            {challenge.description}
          </p>
        )}
        {challenge.imageUrl && (
          <div className="mt-3 rounded-lg overflow-hidden border border-zinc-800">
            <img
              src={extractImageUrl(challenge.imageUrl)}
              alt={challenge.title || "challenge image"}
              className="w-full max-h-72 object-contain"
              loading="lazy"
            />
          </div>
        )}
        {challenge.tags?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {challenge.tags.map((t: string) => (
              <span
                key={t}
                className="text-xs px-2 py-1 rounded-full bg-white/5 text-zinc-200"
                onClick={() => navigate(`/search?tag=${encodeURIComponent(t)}`)}
              >
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <LikeButton targetId={challenge.$id} targetType="challenge" />
          <CommentButton
            isOpen={openCommentsId === challenge.$id}
            toggle={() =>
              setOpenCommentsId(openCommentsId === challenge.$id ? null : challenge.$id)
            }
            count={challenge.commentCount}
            challengeId={challenge.$id}
          />
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onToggleBookmark(challenge.$id, isBookmarked)}
            aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            <BookmarkButton challengeId={challenge.$id} />
          </button>
          <ShareButton challengeId={challenge.$id} />
        </div>
      </div>

      {/* Inline comments */}
      {openCommentsId === challenge.$id && (
        <CommentsSection challengeId={challenge.$id} />
      )}
    </article>
  );
};

const Feed: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch challenges
  const {
    data: challenges = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["challenges"],
    queryFn: getChallenges,
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });

  // Fetch bookmarks
  const { data: bookmarks = [] } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: getBookmarks,
    enabled: !!user,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });

const addBookmarkMutation = useMutation({
  mutationFn: (challengeId: string) => createBookmark({ challengeId }),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookmarks"] }),
});

const removeBookmarkMutation = useMutation({
  mutationFn: (challengeId: string) => deleteBookmark(challengeId),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookmarks"] }),
});


  const handleToggleBookmark = (challengeId: string, isBookmarked: boolean) => {
    if (!user) {
      navigate("/login");
      return;
    }
    isBookmarked
      ? removeBookmarkMutation.mutate(challengeId)
      : addBookmarkMutation.mutate(challengeId);
  };

  const [openCommentsId, setOpenCommentsId] = useState<string | null>(null);

  if (error) return <ErrorMessage message="Failed to load feed" />;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-4">
      <div className="space-y-4">
        {isLoading ? (
          // Skeleton loader
          <SkeletonTheme baseColor="#202020" highlightColor="#444">
            {Array.from({ length: 4 }).map((_, idx) => (
              <article
                key={idx}
                className="bg-black/60 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-zinc-800"
              >
                <div className="flex items-center gap-3">
                  <Skeleton circle height={48} width={48} />
                  <div className="flex-1">
                    <Skeleton width="40%" height={14} className="mb-2" />
                    <Skeleton width="60%" height={12} />
                  </div>
                </div>
                <div className="mt-3">
                  <Skeleton count={2} height={14} className="mb-2" />
                  <Skeleton height={180} className="rounded-md" />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex gap-4">
                    <Skeleton width={24} height={24} circle />
                    <Skeleton width={24} height={24} circle />
                  </div>
                  <div className="flex gap-4">
                    <Skeleton width={24} height={24} circle />
                    <Skeleton width={24} height={24} circle />
                  </div>
                </div>
              </article>
            ))}
          </SkeletonTheme>
        ) : !challenges.length ? (
          <div className="min-h-[60vh] flex items-center justify-center">
            <p className="text-zinc-400">
              No challenges yet — create one or follow creators to see their posts.
            </p>
          </div>
        ) : (
          challenges.map((c: any) => {
            const isBookmarked = bookmarks.some((b: any) => b.challengeId === c.$id);
            return (
              <FeedItem
                key={c.$id}
                challenge={c}
                isBookmarked={isBookmarked}
                onToggleBookmark={handleToggleBookmark}
                openCommentsId={openCommentsId}
                setOpenCommentsId={setOpenCommentsId}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default Feed;
