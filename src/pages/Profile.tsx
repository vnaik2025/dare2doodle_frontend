// // // import React, { useState } from "react";
// // // import { useParams } from "react-router-dom";
// // // import { useQuery } from "@tanstack/react-query";
// // // import { getProfile, getUserById, getFollowStatusApi } from "../apis/usersApi";
// // // import { useAuth } from "../hooks/useAuth";
// // // import ProfileHeader from "../components/features/ProfileHeader";
// // // import Loader from "../components/common/Loader";
// // // import ErrorMessage from "../components/common/ErrorMessage";
// // // import Avatar from "../components/common/Avatar";
// // // import MediaPreview from "../components/features/MediaPreview";
// // // import { formatDate } from "../utils/helpers";

// // // const Profile: React.FC = () => {
// // //   const { userId } = useParams<{ userId: string }>();
// // //   const { user: currentUser } = useAuth();
// // //   const [activeTab, setActiveTab] = useState<
// // //     "Submissions" | "Liked" | "Commented" | "Bookmarks" | "Notifications"
// // //   >("Submissions");

// // //   const isOwner = userId === currentUser?.id;

// // //   const { data: profile, isLoading, isError, error } = useQuery({
// // //     queryKey: ["profile", isOwner ? currentUser?.id : userId],
// // //     queryFn: () => (isOwner ? getProfile() : getUserById(userId!)),
// // //     enabled: !!(isOwner ? currentUser?.id : userId),
// // //     staleTime: Infinity,
// // //     cacheTime: Infinity,
// // //     refetchOnWindowFocus: false,
// // //     refetchOnReconnect: false,
// // //     retry: 1,
// // //   });

// // //   const { data: followStatus } = useQuery({
// // //     queryKey: ["followStatus", userId],
// // //     queryFn: () => getFollowStatusApi(userId!),
// // //     enabled: !isOwner && !!userId,
// // //   });

// // //   if (isLoading) return <Loader />;
// // //   if (isError) return <ErrorMessage message={(error as Error).message} />;
// // //   if (!profile) return <ErrorMessage message="Profile not found" />;

// // //   const userData = isOwner ? profile.user : profile;
// // //   const submissions = isOwner ? profile.submissions ?? [] : [];
// // //   const likedPosts = isOwner ? profile.likedPosts ?? [] : [];
// // //   const commentedPosts = isOwner ? profile.commentedPosts ?? [] : [];
// // //   const bookmarks = isOwner ? profile.bookmarks ?? [] : [];
// // //   const notifications = isOwner ? profile.notifications ?? [] : [];

// // //   const canSeeContent = isOwner || !userData?.private || followStatus?.isFollowing;

// // //   // extras visible only if owner or profile is public
// // //   const canSeeExtras = isOwner || userData?.private === false;
// // //   const tabs = [
// // //     "Submissions",
// // //     "Liked",
// // //     "Commented",
// // //     "Bookmarks",
// // //     "Notifications",
// // //   ];

// // //   return (
// // //     <div className="px-4 py-6 max-w-4xl mx-auto text-zinc-100">
// // //       <ProfileHeader userData={userData} />

// // //       {/* Private account message */}
// // //       {userData?.private && !isOwner && (
// // //         <div className="text-center text-zinc-400 text-sm mt-6">
// // //           🔒 This account is private. Follow to see posts.
// // //         </div>
// // //       )}

// // //       {canSeeExtras && (
// // //         <div className="mt-6">
// // //           {/* Tabs */}
// // //           <div className="mb-4 flex border-b border-zinc-800">
// // //             {tabs.map((tab) => (
// // //               <button
// // //                 key={tab}
// // //                 className={`px-4 py-2 -mb-px font-medium ${
// // //                   activeTab === tab
// // //                     ? "border-b-2 border-blue-500 text-white"
// // //                     : "text-zinc-400 hover:text-white"
// // //                 }`}
// // //                 onClick={() => setActiveTab(tab as any)}
// // //               >
// // //                 {tab}
// // //               </button>
// // //             ))}
// // //           </div>

// // //           {/* Tab content */}
// // //           <div className="space-y-4">
// // //             {activeTab === "Submissions" &&
// // //               (submissions.length ? (
// // //                 submissions.map((s: any, idx: number) => (
// // //                   <article
// // //                     key={idx}
// // //                     className="bg-zinc-950/30 border border-zinc-800 rounded-lg p-4"
// // //                   >
// // //                     <div className="flex items-start gap-3">
// // //                       <Avatar
// // //                         name={userData?.username ?? "Guest"}
// // //                         size={48}
// // //                         className="border"
// // //                       />
// // //                       <div className="flex-1">
// // //                         <div className="text-sm text-zinc-200">
// // //                           {s.text ?? s.content ?? "—"}
// // //                         </div>
// // //                         {s.mediaUrl && (
// // //                           <div className="mt-3">
// // //                             <MediaPreview url={s.mediaUrl} />
// // //                           </div>
// // //                         )}
// // //                       </div>
// // //                     </div>
// // //                   </article>
// // //                 ))
// // //               ) : (
// // //                 <div className="text-sm text-zinc-500">No submissions yet.</div>
// // //               ))}

// // //             {activeTab === "Liked" &&
// // //               (likedPosts.length ? (
// // //                 likedPosts.map((lp: any, idx: number) => (
// // //                   <div
// // //                     key={idx}
// // //                     className="bg-zinc-950/30 border border-zinc-800 rounded-lg p-4"
// // //                   >
// // //                     <div className="text-sm text-zinc-200">
// // //                       {lp.data?.text ?? "—"}
// // //                     </div>
// // //                     {lp.data?.mediaUrl && (
// // //                       <div className="mt-3">
// // //                         <MediaPreview url={lp.data.mediaUrl} />
// // //                       </div>
// // //                     )}
// // //                   </div>
// // //                 ))
// // //               ) : (
// // //                 <div className="text-sm text-zinc-500">No liked posts yet.</div>
// // //               ))}

// // //             {activeTab === "Commented" &&
// // //               (commentedPosts.length ? (
// // //                 commentedPosts.map((entry: any, i: number) => (
// // //                   <div
// // //                     key={i}
// // //                     className="bg-zinc-950/30 border border-zinc-800 rounded-lg p-4"
// // //                   >
// // //                     <div className="text-sm">{entry.comment?.text ?? "—"}</div>
// // //                     {entry.comment?.mediaUrl && (
// // //                       <div className="mt-3">
// // //                         <MediaPreview url={entry.comment.mediaUrl} />
// // //                       </div>
// // //                     )}
// // //                     {entry.challenge && (
// // //                       <div className="mt-3 p-3 border border-zinc-800 rounded-md bg-zinc-900/40">
// // //                         <div className="text-sm font-semibold">
// // //                           {entry.challenge.title}
// // //                         </div>
// // //                         <div className="text-xs text-zinc-500">
// // //                           {entry.challenge.description}
// // //                         </div>
// // //                       </div>
// // //                     )}
// // //                   </div>
// // //                 ))
// // //               ) : (
// // //                 <div className="text-sm text-zinc-500">
// // //                   No commented posts yet.
// // //                 </div>
// // //               ))}

// // //             {activeTab === "Bookmarks" &&
// // //               (bookmarks.length ? (
// // //                 bookmarks.map((b: any, idx: number) => (
// // //                   <div
// // //                     key={idx}
// // //                     className="bg-zinc-950/30 border border-zinc-800 rounded-md p-3 text-sm"
// // //                   >
// // //                     <div>
// // //                       Challenge:{" "}
// // //                       <span className="text-zinc-300">
// // //                         {b.challengeTitle ?? "—"}
// // //                       </span>
// // //                     </div>
// // //                     <div className="text-xs text-zinc-500">
// // //                       Created: {formatDate(b.createdAt)}
// // //                     </div>
// // //                   </div>
// // //                 ))
// // //               ) : (
// // //                 <div className="text-sm text-zinc-500">No bookmarks.</div>
// // //               ))}

// // //             {activeTab === "Notifications" &&
// // //               (notifications.length ? (
// // //                 notifications.map((n: any, idx: number) => (
// // //                   <div
// // //                     key={idx}
// // //                     className="bg-zinc-950/30 border border-zinc-800 rounded-md p-3 text-sm"
// // //                   >
// // //                     <div className="text-sm">{n.title ?? n.message ?? "—"}</div>
// // //                     <div className="text-xs text-zinc-500 mt-1">
// // //                       {formatDate(n.createdAt)}
// // //                     </div>
// // //                   </div>
// // //                 ))
// // //               ) : (
// // //                 <div className="text-sm text-zinc-500">No notifications.</div>
// // //               ))}
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default Profile;

// // import React, { useState } from "react";
// // import { useParams } from "react-router-dom";
// // import { useQuery } from "@tanstack/react-query";
// // import { getProfile, getUserById, getFollowStatusApi } from "../apis/usersApi";
// // import { useAuth } from "../hooks/useAuth";
// // import ProfileHeader from "../components/features/ProfileHeader";
// // import Loader from "../components/common/Loader";
// // import ErrorMessage from "../components/common/ErrorMessage";
// // import Avatar from "../components/common/Avatar";
// // import MediaPreview from "../components/features/MediaPreview";
// // import { formatDate } from "../utils/helpers";

// // const Profile: React.FC = () => {
// //   const { userId } = useParams<{ userId: string }>();
// //   const { user: currentUser } = useAuth();
// //   const [activeTab, setActiveTab] = useState<
// //     "Submissions" | "Liked" | "Commented" | "Bookmarks" | "Notifications"
// //   >("Submissions");

// //   const isOwner = userId === currentUser?.id;

// //   const { data: profile, isLoading, isError, error } = useQuery({
// //     queryKey: ["profile", isOwner ? currentUser?.id : userId],
// //     queryFn: () => (isOwner ? getProfile() : getUserById(userId!)),
// //     enabled: !!(isOwner ? currentUser?.id : userId),
// //     staleTime: Infinity,
// //     cacheTime: Infinity,
// //     refetchOnWindowFocus: false,
// //     refetchOnReconnect: false,
// //     retry: 1,
// //   });

// //   const { data: followStatus } = useQuery({
// //     queryKey: ["followStatus", userId],
// //     queryFn: () => getFollowStatusApi(userId!),
// //     enabled: !isOwner && !!userId,
// //   });

// //   if (isLoading) return <Loader />;
// //   if (isError) return <ErrorMessage message={(error as Error).message} />;
// //   if (!profile) return <ErrorMessage message="Profile not found" />;

// //   const userData = isOwner ? profile.user : profile;
// //   const submissions = isOwner ? profile.submissions ?? [] : profile.submissions ?? [];
// //   const likedPosts = isOwner ? profile.likedPosts ?? [] : [];
// //   const commentedPosts = isOwner ? profile.commentedPosts ?? [] : [];
// //   const bookmarks = isOwner ? profile.bookmarks ?? [] : [];
// //   const notifications = isOwner ? profile.notifications ?? [] : [];

// //   // Allow content visibility for owner, public profiles, or followers of private profiles
// //   const canSeeContent = isOwner || !userData?.private || followStatus?.isFollowing;

// //   // Show all tabs for owner, only Submissions for non-owners
// //   const tabs = isOwner
// //     ? ["Submissions", "Liked", "Commented", "Bookmarks", "Notifications"]
// //     : ["Submissions"];

// //   return (
// //     <div className="px-4 py-6 max-w-4xl mx-auto text-zinc-100">
// //       <ProfileHeader userData={userData} />

// //       {/* Show private account message only if not owner and not following */}
// //       {userData?.private && !isOwner && !followStatus?.isFollowing && (
// //         <div className="text-center text-zinc-400 text-sm mt-6">
// //           🔒 This account is private. Follow to see posts.
// //         </div>
// //       )}

// //       {canSeeContent && (
// //         <div className="mt-6">
// //           {/* Tabs */}
// //           <div className="mb-4 flex border-b border-zinc-800">
// //             {tabs.map((tab) => (
// //               <button
// //                 key={tab}
// //                 className={`px-4 py-2 -mb-px font-medium ${
// //                   activeTab === tab
// //                     ? "border-b-2 border-blue-500 text-white"
// //                     : "text-zinc-400 hover:text-white"
// //                 }`}
// //                 onClick={() => setActiveTab(tab as any)}
// //               >
// //                 {tab}
// //               </button>
// //             ))}
// //           </div>

// //           {/* Tab content */}
// //           <div className="space-y-4">
// //             {activeTab === "Submissions" &&
// //               (submissions.length ? (
// //                 submissions.map((s: any, idx: number) => (
// //                   <article
// //                     key={idx}
// //                     className="bg-zinc-950/30 border border-zinc-800 rounded-lg p-4"
// //                   >
// //                     <div className="flex items-start gap-3">
// //                       <Avatar
// //                         name={userData?.username ?? "Guest"}
// //                         size={48}
// //                         className="border"
// //                       />
// //                       <div className="flex-1">
// //                         <div className="text-sm text-zinc-200">
// //                           {s.text ?? s.content ?? "—"}
// //                         </div>
// //                         {s.mediaUrl && (
// //                           <div className="mt-3">
// //                             <MediaPreview url={s.mediaUrl} />
// //                           </div>
// //                         )}
// //                       </div>
// //                     </div>
// //                   </article>
// //                 ))
// //               ) : (
// //                 <div className="text-sm text-zinc-500">No submissions yet.</div>
// //               ))}

// //             {isOwner && activeTab === "Liked" &&
// //               (likedPosts.length ? (
// //                 likedPosts.map((lp: any, idx: number) => (
// //                   <div
// //                     key={idx}
// //                     className="bg-zinc-950/30 border border-zinc-800 rounded-lg p-4"
// //                   >
// //                     <div className="text-sm text-zinc-200">
// //                       {lp.data?.text ?? "—"}
// //                     </div>
// //                     {lp.data?.mediaUrl && (
// //                       <div className="mt-3">
// //                         <MediaPreview url={lp.data.mediaUrl} />
// //                       </div>
// //                     )}
// //                   </div>
// //                 ))
// //               ) : (
// //                 <div className="text-sm text-zinc-500">No liked posts yet.</div>
// //               ))}

// //             {isOwner && activeTab === "Commented" &&
// //               (commentedPosts.length ? (
// //                 commentedPosts.map((entry: any, i: number) => (
// //                   <div
// //                     key={i}
// //                     className="bg-zinc-950/30 border border-zinc-800 rounded-lg p-4"
// //                   >
// //                     <div className="text-sm">{entry.comment?.text ?? "—"}</div>
// //                     {entry.comment?.mediaUrl && (
// //                       <div className="mt-3">
// //                         <MediaPreview url={entry.comment.mediaUrl} />
// //                       </div>
// //                     )}
// //                     {entry.challenge && (
// //                       <div className="mt-3 p-3 border border-zinc-800 rounded-md bg-zinc-900/40">
// //                         <div className="text-sm font-semibold">
// //                           {entry.challenge.title}
// //                         </div>
// //                         <div className="text-xs text-zinc-500">
// //                           {entry.challenge.description}
// //                         </div>
// //                       </div>
// //                     )}
// //                   </div>
// //                 ))
// //               ) : (
// //                 <div className="text-sm text-zinc-500">
// //                   No commented posts yet.
// //                 </div>
// //               ))}

// //             {isOwner && activeTab === "Bookmarks" &&
// //               (bookmarks.length ? (
// //                 bookmarks.map((b: any, idx: number) => (
// //                   <div
// //                     key={idx}
// //                     className="bg-zinc-950/30 border border-zinc-800 rounded-md p-3 text-sm"
// //                   >
// //                     <div>
// //                       Challenge:{" "}
// //                       <span className="text-zinc-300">
// //                         {b.challengeTitle ?? "—"}
// //                       </span>
// //                     </div>
// //                     <div className="text-xs text-zinc-500">
// //                       Created: {formatDate(b.createdAt)}
// //                     </div>
// //                   </div>
// //                 ))
// //               ) : (
// //                 <div className="text-sm text-zinc-500">No bookmarks.</div>
// //               ))}

// //             {isOwner && activeTab === "Notifications" &&
// //               (notifications.length ? (
// //                 notifications.map((n: any, idx: number) => (
// //                   <div
// //                     key={idx}
// //                     className="bg-zinc-950/30 border border-zinc-800 rounded-md p-3 text-sm"
// //                   >
// //                     <div className="text-sm">{n.title ?? n.message ?? "—"}</div>
// //                     <div className="text-xs text-zinc-500 mt-1">
// //                       {formatDate(n.createdAt)}
// //                     </div>
// //                   </div>
// //                 ))
// //               ) : (
// //                 <div className="text-sm text-zinc-500">No notifications.</div>
// //               ))}
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default Profile;
// import React, { useState } from "react";
// import { useParams } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import {
//   getProfile,
//   getUserById,
//   getFollowStatusApi,
// } from "../apis/usersApi";
// import { useAuth } from "../hooks/useAuth";
// import ProfileHeader from "../components/features/ProfileHeader";
// import Loader from "../components/common/Loader";
// import ErrorMessage from "../components/common/ErrorMessage";
// import Avatar from "../components/common/Avatar";
// import MediaPreview from "../components/features/MediaPreview";
// import { formatDate } from "../utils/helpers";
// import { FileText, Heart, MessageSquare } from "lucide-react";

// const Profile: React.FC = () => {
//   const { userId } = useParams<{ userId: string }>();
//   const { user: currentUser } = useAuth();
//   const [activeTab, setActiveTab] = useState<"Submissions" | "Liked" | "Commented">("Submissions");

//   const isOwner = userId === currentUser?.id;

//   const { data: profile, isLoading, isError, error } = useQuery({
//     queryKey: ["profile", isOwner ? currentUser?.id : userId],
//     queryFn: () => (isOwner ? getProfile() : getUserById(userId!)),
//     enabled: !!(isOwner ? currentUser?.id : userId),
//     staleTime: Infinity,
//     cacheTime: Infinity,
//     refetchOnWindowFocus: false,
//     refetchOnReconnect: false,
//     retry: 1,
//   });

//   const { data: followStatus } = useQuery({
//     queryKey: ["followStatus", userId],
//     queryFn: () => getFollowStatusApi(userId!),
//     enabled: !isOwner && !!userId,
//   });

//   if (isLoading) return <Loader />;
//   if (isError) return <ErrorMessage message={(error as Error).message} />;
//   if (!profile) return <ErrorMessage message="Profile not found" />;

//   const userData = isOwner ? profile.user : profile;
//   const submissions = profile.submissions ?? [];
//   const likedPosts = profile.likedPosts ?? [];
//   const commentedPosts = profile.commentedPosts ?? [];

//   const canSeeContent = isOwner || !userData?.private || followStatus?.isFollowing;

//   const tabs = ["Submissions", ...(isOwner ? ["Liked", "Commented"] : [])];

//   const tabIcons: Record<string, JSX.Element> = {
//     Submissions: <FileText size={20} />,
//     Liked: <Heart size={20} />,
//     Commented: <MessageSquare size={20} />,
//   };

//   return (
//     <div className="px-4 py-6 max-w-2xl mx-auto text-zinc-100">
//       <ProfileHeader userData={userData} />

//       {userData?.private && !isOwner && !followStatus?.isFollowing && (
//         <div className="text-center text-zinc-400 text-sm mt-6">
//           🔒 This account is private. Follow to see posts.
//         </div>
//       )}

//       {canSeeContent && (
//         <div className="mt-6">
//           {/* Tabs */}
//           <div className="flex justify-around border-b border-zinc-800 mb-4">
//             {tabs.map((tab) => (
//               <button
//                 key={tab}
//                 className={`flex flex-col items-center gap-1 py-2 text-xs transition-colors flex-1 ${
//                   activeTab === tab
//                     ? "text-blue-500 border-b-2 border-blue-500"
//                     : "text-zinc-400 hover:text-white"
//                 }`}
//                 onClick={() => setActiveTab(tab as any)}
//               >
//                 {tabIcons[tab]}
//                 <span className="hidden sm:block">{tab}</span>
//               </button>
//             ))}
//           </div>

//           {/* Tab content */}
//           <div className="space-y-4">
//             {activeTab === "Submissions" &&
//               (submissions.length ? (
//                 submissions.map((s: any, idx: number) => (
//                   <article
//                     key={idx}
//                     className="bg-zinc-950/30 border border-zinc-800 rounded-lg p-4"
//                   >
//                     <div className="flex items-start gap-3">
//                       <Avatar
//                         name={userData?.username ?? "Guest"}
//                         size={40}
//                         className="border"
//                       />
//                       <div className="flex-1">
//                         <div className="text-sm text-zinc-200">{s.text ?? s.content ?? "—"}</div>
//                         {s.mediaUrl && (
//                           <div className="mt-3">
//                             <MediaPreview url={s.mediaUrl} />
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </article>
//                 ))
//               ) : (
//                 <div className="text-sm text-zinc-500">No submissions yet.</div>
//               ))}

//             {isOwner && activeTab === "Liked" &&
//               (likedPosts.length ? (
//                 likedPosts.map((lp: any, idx: number) => (
//                   <div
//                     key={idx}
//                     className="bg-zinc-950/30 border border-zinc-800 rounded-lg p-4"
//                   >
//                     <div className="text-sm text-zinc-200">{lp.data?.text ?? "—"}</div>
//                     {lp.data?.mediaUrl && (
//                       <div className="mt-3">
//                         <MediaPreview url={lp.data.mediaUrl} />
//                       </div>
//                     )}
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-sm text-zinc-500">No liked posts yet.</div>
//               ))}

//             {isOwner && activeTab === "Commented" &&
//               (commentedPosts.length ? (
//                 commentedPosts.map((entry: any, i: number) => (
//                   <div
//                     key={i}
//                     className="bg-zinc-950/30 border border-zinc-800 rounded-lg p-4"
//                   >
//                     <div className="text-sm">{entry.comment?.text ?? "—"}</div>
//                     {entry.comment?.mediaUrl && (
//                       <div className="mt-3">
//                         <MediaPreview url={entry.comment.mediaUrl} />
//                       </div>
//                     )}
//                     {entry.challenge && (
//                       <div className="mt-3 p-3 border border-zinc-800 rounded-md bg-zinc-900/40">
//                         <div className="text-sm font-semibold">{entry.challenge.title}</div>
//                         <div className="text-xs text-zinc-500">{entry.challenge.description}</div>
//                       </div>
//                     )}
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-sm text-zinc-500">No commented posts yet.</div>
//               ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };


// // src/pages/Profile.tsx
// import React, { useState } from "react";
// import { useParams, NavLink } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import {
//   getProfile,
//   getUserById,
//   getFollowStatusApi,
//   getUserChallenges,
// } from "../apis/usersApi";
// import { useAuth } from "../hooks/useAuth";
// import ProfileHeader from "../components/features/ProfileHeader";
// import ErrorMessage from "../components/common/ErrorMessage";
// import Avatar from "../components/common/Avatar";
// import MediaPreview from "../components/features/MediaPreview";
// import { FileText, Heart, MessageSquare, Palette } from "lucide-react";

// const ProfileSkeleton: React.FC = () => {
//   return (
//     <div className="px-4 py-6 max-w-2xl mx-auto text-zinc-100 animate-pulse">
//       {/* Header skeleton */}
//       <div className="flex items-center gap-3">
//         <div className="w-16 h-16 rounded-full bg-zinc-800" />
//         <div className="flex-1 space-y-2">
//           <div className="h-4 bg-zinc-800 rounded w-1/3" />
//           <div className="h-3 bg-zinc-800 rounded w-1/4" />
//         </div>
//       </div>

//       {/* Tabs skeleton */}
//       <div className="flex justify-around border-b border-zinc-800 mt-6 mb-4">
//         {Array.from({ length: 3 }).map((_, i) => (
//           <div
//             key={i}
//             className="flex flex-col items-center gap-1 py-2 flex-1"
//           >
//             <div className="w-6 h-6 bg-zinc-800 rounded" />
//             <div className="w-12 h-3 bg-zinc-800 rounded" />
//           </div>
//         ))}
//       </div>

//       {/* Content skeleton */}
//       <div className="space-y-4">
//         {Array.from({ length: 3 }).map((_, i) => (
//           <div
//             key={i}
//             className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4"
//           >
//             <div className="flex items-start gap-3">
//               <div className="w-10 h-10 rounded-full bg-zinc-800" />
//               <div className="flex-1 space-y-2">
//                 <div className="h-4 bg-zinc-800 rounded w-2/3" />
//                 <div className="h-3 bg-zinc-800 rounded w-1/2" />
//                 <div className="h-28 bg-zinc-800 rounded mt-2" />
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const Profile: React.FC = () => {
//   const { userId } = useParams<{ userId: string }>();
//   const { user: currentUser } = useAuth();
//   const [activeTab, setActiveTab] = useState<
//     "Submissions" | "Liked" | "Commented" | "Challenges"
//   >("Submissions");

//   const isOwner = userId === currentUser?.id;

//   const {
//     data: profile,
//     isLoading,
//     isError,
//     error,
//   } = useQuery({
//     queryKey: ["profile", isOwner ? currentUser?.id : userId],
//     queryFn: () => (isOwner ? getProfile() : getUserById(userId!)),
//     enabled: !!(isOwner ? currentUser?.id : userId),
//     staleTime: Infinity,
//     cacheTime: Infinity,
//     refetchOnWindowFocus: false,
//     refetchOnReconnect: false,
//     retry: 1,
//   });

//   const { data: followStatus } = useQuery({
//     queryKey: ["followStatus", userId],
//     queryFn: () => getFollowStatusApi(userId!),
//     enabled: !isOwner && !!userId,
//   });

//   const { data: userChallenges } = useQuery({
//     queryKey: ["userChallenges", userId],
//     queryFn: () => getUserChallenges(userId!),
//     enabled: !!userId,
//   });

//   if (isLoading) return <ProfileSkeleton />;
//   if (isError) return <ErrorMessage message={(error as Error).message} />;
//   if (!profile) return <ErrorMessage message="Profile not found" />;

//   const userData = isOwner ? profile.user : profile;
//   const submissions = profile.submissions ?? [];
//   const likedPosts = profile.likedPosts ?? [];
//   const commentedPosts = profile.commentedPosts ?? [];
//   const challenges = userChallenges ?? [];

//   const canSeeContent =
//     isOwner || !userData?.private || followStatus?.isFollowing;

//   const tabs = [
//     "Submissions",
//     "Challenges",
//     ...(isOwner ? ["Liked", "Commented"] : []),
//   ];

//   const tabIcons: Record<string, JSX.Element> = {
//     Submissions: <FileText size={20} />,
//     Challenges: <Palette size={20} />,
//     Liked: <Heart size={20} />,
//     Commented: <MessageSquare size={20} />,
//   };

//   return (
//     <div className="px-4 py-6 max-w-2xl mx-auto text-zinc-100">
//       <ProfileHeader userData={userData} />

//       {userData?.private && !isOwner && !followStatus?.isFollowing && (
//         <div className="text-center text-zinc-400 text-sm mt-6">
//           🔒 This account is private. Follow to see posts.
//         </div>
//       )}

//       {canSeeContent && (
//         <div className="mt-6">
//           {/* Tabs */}
//           <div className="flex justify-around border-b border-zinc-800 mb-4">
//             {tabs.map((tab) => (
//               <button
//                 key={tab}
//                 className={`flex flex-col items-center gap-1 py-2 text-xs transition-colors flex-1 ${
//                   activeTab === tab
//                     ? "text-blue-500 border-b-2 border-blue-500"
//                     : "text-zinc-400 hover:text-white"
//                 }`}
//                 onClick={() => setActiveTab(tab as any)}
//               >
//                 {tabIcons[tab]}
//                 <span className="hidden sm:block">{tab}</span>
//               </button>
//             ))}
//           </div>

//           {/* Tab content */}
//           <div className="space-y-4">
//             {activeTab === "Submissions" &&
//               (submissions.length ? (
//                 submissions.map((s: any, idx: number) => (
//                   <article
//                     key={idx}
//                     className="bg-zinc-950/30 border border-zinc-800 rounded-lg p-4"
//                   >
//                     <div className="flex items-start gap-3">
//                       <Avatar
//                         name={userData?.username ?? "Guest"}
//                         size={40}
//                         className="border"
//                       />
//                       <div className="flex-1">
//                         <div className="text-sm text-zinc-200">
//                           {s.text ?? s.content ?? "—"}
//                         </div>
//                         {s.mediaUrl && (
//                           <div className="mt-3">
//                             <MediaPreview url={s.mediaUrl} />
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </article>
//                 ))
//               ) : (
//                 <div className="text-sm text-zinc-500">No submissions yet.</div>
//               ))}

//             {activeTab === "Challenges" &&
//               (challenges.length ? (
//                 challenges.map((challenge: any, idx: number) => (
//                   <NavLink
//                     to={`/challenge/${challenge.$id}`}
//                     key={idx}
//                     className="block bg-zinc-950/30 border border-zinc-800 rounded-lg p-4"
//                   >
//                     <div className="flex items-start gap-3">
//                       <Avatar
//                         name={userData?.username ?? "Guest"}
//                         size={40}
//                         className="border"
//                       />
//                       <div className="flex-1">
//                         <div className="text-sm font-semibold">
//                           {challenge.title}
//                         </div>
//                         <div className="text-xs text-zinc-500">
//                           {challenge.description}
//                         </div>
//                         {challenge.imageUrl && (
//                           <div className="mt-3">
//                             <MediaPreview url={challenge.imageUrl.split("|")[0]} />
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </NavLink>
//                 ))
//               ) : (
//                 <div className="text-sm text-zinc-500">
//                   No challenges created yet.
//                 </div>
//               ))}

//             {isOwner &&
//               activeTab === "Liked" &&
//               (likedPosts.length ? (
//                 likedPosts.map((lp: any, idx: number) => (
//                   <div
//                     key={idx}
//                     className="bg-zinc-950/30 border border-zinc-800 rounded-lg p-4"
//                   >
//                     <div className="text-sm text-zinc-200">
//                       {lp.data?.text ?? "—"}
//                     </div>
//                     {lp.data?.mediaUrl && (
//                       <div className="mt-3">
//                         <MediaPreview url={lp.data.mediaUrl} />
//                       </div>
//                     )}
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-sm text-zinc-500">No liked posts yet.</div>
//               ))}

//             {isOwner &&
//               activeTab === "Commented" &&
//               (commentedPosts.length ? (
//                 commentedPosts.map((entry: any, i: number) => (
//                   <div
//                     key={i}
//                     className="bg-zinc-950/30 border border-zinc-800 rounded-lg p-4"
//                   >
//                     <div className="text-sm">
//                       {entry.comment?.text ?? "—"}
//                     </div>
//                     {entry.comment?.mediaUrl && (
//                       <div className="mt-3">
//                         <MediaPreview url={entry.comment.mediaUrl} />
//                       </div>
//                     )}
//                     {entry.challenge && (
//                       <div className="mt-3 p-3 border border-zinc-800 rounded-md bg-zinc-900/40">
//                         <div className="text-sm font-semibold">
//                           {entry.challenge.title}
//                         </div>
//                         <div className="text-xs text-zinc-500">
//                           {entry.challenge.description}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-sm text-zinc-500">
//                   No commented posts yet.
//                 </div>
//               ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Profile;


// src/pages/Profile.tsx
import React, { useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  getProfile,
  getUserById,
  getFollowStatusApi,
  getUserChallenges,
} from "../apis/usersApi";
import { deleteComment, markAsSubmission } from "../apis/commentsApi";
import { useAuth } from "../hooks/useAuth";
import ProfileHeader from "../components/features/ProfileHeader";
import ErrorMessage from "../components/common/ErrorMessage";
import Avatar from "../components/common/Avatar";
import MediaPreview from "../components/features/MediaPreview";
import { FileText, Heart, MessageSquare, Palette, CheckCircle, XCircle, Trash2 } from "lucide-react";

const ProfileSkeleton: React.FC = () => {
  return (
    <div className="px-4 py-6 max-w-2xl mx-auto text-zinc-100 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 rounded-full bg-zinc-800" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-zinc-800 rounded w-1/3" />
          <div className="h-3 bg-zinc-800 rounded w-1/4" />
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="flex justify-around border-b border-zinc-800 mt-6 mb-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-1 py-2 flex-1"
          >
            <div className="w-6 h-6 bg-zinc-800 rounded" />
            <div className="w-12 h-3 bg-zinc-800 rounded" />
          </div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-zinc-800" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-zinc-800 rounded w-2/3" />
                <div className="h-3 bg-zinc-800 rounded w-1/2" />
                <div className="h-28 bg-zinc-800 rounded mt-2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<
    "Submissions" | "Liked" | "Commented" | "Challenges"
  >("Submissions");

  const isOwner = userId === currentUser?.id;

  const {
    data: profile,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["profile", isOwner ? currentUser?.id : userId],
    queryFn: () => (isOwner ? getProfile() : getUserById(userId!)),
    enabled: !!(isOwner ? currentUser?.id : userId),
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });

  const { data: followStatus } = useQuery({
    queryKey: ["followStatus", userId],
    queryFn: () => getFollowStatusApi(userId!),
    enabled: !isOwner && !!userId,
  });

  const { data: userChallenges } = useQuery({
    queryKey: ["userChallenges", userId],
    queryFn: () => getUserChallenges(userId!),
    enabled: !!userId,
  });

  const submissionMutation = useMutation({
    mutationFn: (commentId: string) => markAsSubmission(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    },
  });

  if (isLoading) return <ProfileSkeleton />;
  if (isError) return <ErrorMessage message={(error as Error).message} />;
  if (!profile) return <ErrorMessage message="Profile not found" />;

  const userData = isOwner ? profile.user : profile;
  const submissions = profile.submissions ?? [];
  const likedPosts = profile.likedPosts ?? [];
  const commentedPosts = profile.commentedPosts ?? [];
  const challenges = userChallenges ?? [];

  const filteredSubmissions = submissions.filter(
    (s: any) => s.isSubmission === true && !s.parentCommentId
  );

  const canSeeContent =
    isOwner || !userData?.private || followStatus?.isFollowing;

  const tabs = [
    "Submissions",
    "Challenges",
    ...(isOwner ? ["Liked", "Commented"] : []),
  ];

  const tabIcons: Record<string, JSX.Element> = {
    Submissions: <FileText size={20} />,
    Challenges: <Palette size={20} />,
    Liked: <Heart size={20} />,
    Commented: <MessageSquare size={20} />,
  };

  const handleToggleSubmission = (commentId: string, isCurrentlySubmission: boolean) => {
    submissionMutation.mutate(commentId);
  };

  const handleDelete = (commentId: string) => {
    if (confirm("Are you sure you want to delete this submission?")) {
      deleteMutation.mutate(commentId);
    }
  };

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto text-zinc-100">
      <ProfileHeader userData={userData} />

      {userData?.private && !isOwner && !followStatus?.isFollowing && (
        <div className="text-center text-zinc-400 text-sm mt-6">
          🔒 This account is private. Follow to see posts.
        </div>
      )}

      {canSeeContent && (
        <div className="mt-6">
          {/* Tabs */}
          <div className="flex justify-around border-b border-zinc-800 mb-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`flex flex-col items-center gap-1 py-2 text-xs transition-colors flex-1 ${
                  activeTab === tab
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : "text-zinc-400 hover:text-white"
                }`}
                onClick={() => setActiveTab(tab as any)}
              >
                {tabIcons[tab]}
                <span className="hidden sm:block">{tab}</span>
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="space-y-4">
            {activeTab === "Submissions" &&
              (filteredSubmissions.length ? (
                filteredSubmissions.map((s: any) => {
                  const isSubmission = s.isSubmission ?? false;
                  const mediaUrl = s.mediaUrl ? s.mediaUrl.split("|")[0] : null;
                  const canToggle =
                    isOwner && !s.parentCommentId && s.mediaUrl;
                  const containerClass = [
                    "bg-zinc-950/30 border border-zinc-800 rounded-lg p-4",
                    isSubmission ? "bg-green-900/10 border-green-500/30" : "",
                  ].join(" ");

                  return (
                    <article
                      key={s.$id}
                      className={containerClass}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar
                          name={userData?.username ?? "Guest"}
                          size={40}
                          className="border flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="text-xs font-semibold text-zinc-400 truncate">
                              {userData?.username ?? "Guest"}
                            </p>
                            {isSubmission && (
                              <span className="px-2 py-0.5 bg-green-900/50 border border-green-500/30 text-green-300 text-xs rounded-full">
                                Submission
                              </span>
                            )}
                          </div>
                          <p className="text-sm leading-snug text-zinc-200 mb-3">
                            {s.text ?? "—"}
                          </p>
                          {mediaUrl && (
                            <div className="mb-3 max-w-xs rounded-md overflow-hidden border border-zinc-700">
                              <MediaPreview url={mediaUrl} />
                            </div>
                          )}
                          <div className="flex items-center gap-3 text-xs text-zinc-500">
                            {canToggle && (
                              <button
                                onClick={() => handleToggleSubmission(s.$id, isSubmission)}
                                disabled={submissionMutation.isPending}
                                className={`flex items-center gap-1 p-1 rounded hover:bg-zinc-800 transition-colors ${
                                  isSubmission ? "text-red-400" : "text-green-400"
                                }`}
                                aria-label={isSubmission ? "Unmark as submission" : "Mark as submission"}
                              >
                                {isSubmission ? <XCircle size={14} /> : <CheckCircle size={14} />}
                                <span className="text-xs">
                                  {isSubmission ? "Unmark" : "Mark"} as submission
                                </span>
                              </button>
                            )}
                            {isOwner && (
                              <button
                                onClick={() => handleDelete(s.$id)}
                                disabled={deleteMutation.isPending}
                                className="p-1 rounded hover:bg-zinc-800 transition-colors"
                                aria-label="Delete"
                              >
                                <Trash2
                                  size={14}
                                  className="text-zinc-400 hover:text-red-400"
                                />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })
              ) : (
                <div className="text-sm text-zinc-500">No submissions yet.</div>
              ))}

            {activeTab === "Challenges" &&
              (challenges.length ? (
                challenges.map((challenge: any) => (
                  <NavLink
                    to={`/challenge/${challenge.$id}`}
                    key={challenge.$id}
                    className="block bg-zinc-950/30 border border-zinc-800 rounded-lg p-4"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar
                        name={userData?.username ?? "Guest"}
                        size={40}
                        className="border"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-semibold">
                          {challenge.title}
                        </div>
                        <div className="text-xs text-zinc-500">
                          {challenge.description}
                        </div>
                        {challenge.imageUrl && (
                          <div className="mt-3">
                            <MediaPreview url={challenge.imageUrl.split("|")[0]} />
                          </div>
                        )}
                      </div>
                    </div>
                  </NavLink>
                ))
              ) : (
                <div className="text-sm text-zinc-500">
                  No challenges created yet.
                </div>
              ))}

            {isOwner &&
              activeTab === "Liked" &&
              (likedPosts.length ? (
                likedPosts.map((lp: any) => (
                  <div
                    key={lp.data?.$id || lp.data?.id}
                    className="bg-zinc-950/30 border border-zinc-800 rounded-lg p-4"
                  >
                    <div className="text-sm text-zinc-200">
                      {lp.data?.text ?? "—"}
                    </div>
                    {lp.data?.mediaUrl && (
                      <div className="mt-3">
                        <MediaPreview url={lp.data.mediaUrl} />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-sm text-zinc-500">No liked posts yet.</div>
              ))}

            {isOwner &&
              activeTab === "Commented" &&
              (commentedPosts.length ? (
                commentedPosts.map((entry: any) => (
                  <div
                    key={entry.comment?.$id}
                    className="bg-zinc-950/30 border border-zinc-800 rounded-lg p-4"
                  >
                    <div className="text-sm">
                      {entry.comment?.text ?? "—"}
                    </div>
                    {entry.comment?.mediaUrl && (
                      <div className="mt-3">
                        <MediaPreview url={entry.comment.mediaUrl} />
                      </div>
                    )}
                    {entry.challenge && (
                      <div className="mt-3 p-3 border border-zinc-800 rounded-md bg-zinc-900/40">
                        <div className="text-sm font-semibold">
                          {entry.challenge.title}
                        </div>
                        <div className="text-xs text-zinc-500">
                          {entry.challenge.description}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-sm text-zinc-500">
                  No commented posts yet.
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;