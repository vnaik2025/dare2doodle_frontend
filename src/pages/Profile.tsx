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
// //   const submissions = isOwner ? profile.submissions ?? [] : [];
// //   const likedPosts = isOwner ? profile.likedPosts ?? [] : [];
// //   const commentedPosts = isOwner ? profile.commentedPosts ?? [] : [];
// //   const bookmarks = isOwner ? profile.bookmarks ?? [] : [];
// //   const notifications = isOwner ? profile.notifications ?? [] : [];

// //   const canSeeContent = isOwner || !userData?.private || followStatus?.isFollowing;

// //   // extras visible only if owner or profile is public
// //   const canSeeExtras = isOwner || userData?.private === false;
// //   const tabs = [
// //     "Submissions",
// //     "Liked",
// //     "Commented",
// //     "Bookmarks",
// //     "Notifications",
// //   ];

// //   return (
// //     <div className="px-4 py-6 max-w-4xl mx-auto text-zinc-100">
// //       <ProfileHeader userData={userData} />

// //       {/* Private account message */}
// //       {userData?.private && !isOwner && (
// //         <div className="text-center text-zinc-400 text-sm mt-6">
// //           🔒 This account is private. Follow to see posts.
// //         </div>
// //       )}

// //       {canSeeExtras && (
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

// //             {activeTab === "Liked" &&
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

// //             {activeTab === "Commented" &&
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

// //             {activeTab === "Bookmarks" &&
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

// //             {activeTab === "Notifications" &&
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
// import { getProfile, getUserById, getFollowStatusApi } from "../apis/usersApi";
// import { useAuth } from "../hooks/useAuth";
// import ProfileHeader from "../components/features/ProfileHeader";
// import Loader from "../components/common/Loader";
// import ErrorMessage from "../components/common/ErrorMessage";
// import Avatar from "../components/common/Avatar";
// import MediaPreview from "../components/features/MediaPreview";
// import { formatDate } from "../utils/helpers";

// const Profile: React.FC = () => {
//   const { userId } = useParams<{ userId: string }>();
//   const { user: currentUser } = useAuth();
//   const [activeTab, setActiveTab] = useState<
//     "Submissions" | "Liked" | "Commented" | "Bookmarks" | "Notifications"
//   >("Submissions");

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
//   const submissions = isOwner ? profile.submissions ?? [] : profile.submissions ?? [];
//   const likedPosts = isOwner ? profile.likedPosts ?? [] : [];
//   const commentedPosts = isOwner ? profile.commentedPosts ?? [] : [];
//   const bookmarks = isOwner ? profile.bookmarks ?? [] : [];
//   const notifications = isOwner ? profile.notifications ?? [] : [];

//   // Allow content visibility for owner, public profiles, or followers of private profiles
//   const canSeeContent = isOwner || !userData?.private || followStatus?.isFollowing;

//   // Show all tabs for owner, only Submissions for non-owners
//   const tabs = isOwner
//     ? ["Submissions", "Liked", "Commented", "Bookmarks", "Notifications"]
//     : ["Submissions"];

//   return (
//     <div className="px-4 py-6 max-w-4xl mx-auto text-zinc-100">
//       <ProfileHeader userData={userData} />

//       {/* Show private account message only if not owner and not following */}
//       {userData?.private && !isOwner && !followStatus?.isFollowing && (
//         <div className="text-center text-zinc-400 text-sm mt-6">
//           🔒 This account is private. Follow to see posts.
//         </div>
//       )}

//       {canSeeContent && (
//         <div className="mt-6">
//           {/* Tabs */}
//           <div className="mb-4 flex border-b border-zinc-800">
//             {tabs.map((tab) => (
//               <button
//                 key={tab}
//                 className={`px-4 py-2 -mb-px font-medium ${
//                   activeTab === tab
//                     ? "border-b-2 border-blue-500 text-white"
//                     : "text-zinc-400 hover:text-white"
//                 }`}
//                 onClick={() => setActiveTab(tab as any)}
//               >
//                 {tab}
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
//                         size={48}
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

//             {isOwner && activeTab === "Liked" &&
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

//             {isOwner && activeTab === "Bookmarks" &&
//               (bookmarks.length ? (
//                 bookmarks.map((b: any, idx: number) => (
//                   <div
//                     key={idx}
//                     className="bg-zinc-950/30 border border-zinc-800 rounded-md p-3 text-sm"
//                   >
//                     <div>
//                       Challenge:{" "}
//                       <span className="text-zinc-300">
//                         {b.challengeTitle ?? "—"}
//                       </span>
//                     </div>
//                     <div className="text-xs text-zinc-500">
//                       Created: {formatDate(b.createdAt)}
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-sm text-zinc-500">No bookmarks.</div>
//               ))}

//             {isOwner && activeTab === "Notifications" &&
//               (notifications.length ? (
//                 notifications.map((n: any, idx: number) => (
//                   <div
//                     key={idx}
//                     className="bg-zinc-950/30 border border-zinc-800 rounded-md p-3 text-sm"
//                   >
//                     <div className="text-sm">{n.title ?? n.message ?? "—"}</div>
//                     <div className="text-xs text-zinc-500 mt-1">
//                       {formatDate(n.createdAt)}
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-sm text-zinc-500">No notifications.</div>
//               ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Profile;
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  getProfile,
  getUserById,
  getFollowStatusApi,
} from "../apis/usersApi";
import { useAuth } from "../hooks/useAuth";
import ProfileHeader from "../components/features/ProfileHeader";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import Avatar from "../components/common/Avatar";
import MediaPreview from "../components/features/MediaPreview";
import { formatDate } from "../utils/helpers";
import { FileText, Heart, MessageSquare } from "lucide-react";

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<"Submissions" | "Liked" | "Commented">("Submissions");

  const isOwner = userId === currentUser?.id;

  const { data: profile, isLoading, isError, error } = useQuery({
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

  if (isLoading) return <Loader />;
  if (isError) return <ErrorMessage message={(error as Error).message} />;
  if (!profile) return <ErrorMessage message="Profile not found" />;

  const userData = isOwner ? profile.user : profile;
  const submissions = profile.submissions ?? [];
  const likedPosts = profile.likedPosts ?? [];
  const commentedPosts = profile.commentedPosts ?? [];

  const canSeeContent = isOwner || !userData?.private || followStatus?.isFollowing;

  const tabs = ["Submissions", ...(isOwner ? ["Liked", "Commented"] : [])];

  const tabIcons: Record<string, JSX.Element> = {
    Submissions: <FileText size={20} />,
    Liked: <Heart size={20} />,
    Commented: <MessageSquare size={20} />,
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
              (submissions.length ? (
                submissions.map((s: any, idx: number) => (
                  <article
                    key={idx}
                    className="bg-zinc-950/30 border border-zinc-800 rounded-lg p-4"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar
                        name={userData?.username ?? "Guest"}
                        size={40}
                        className="border"
                      />
                      <div className="flex-1">
                        <div className="text-sm text-zinc-200">{s.text ?? s.content ?? "—"}</div>
                        {s.mediaUrl && (
                          <div className="mt-3">
                            <MediaPreview url={s.mediaUrl} />
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="text-sm text-zinc-500">No submissions yet.</div>
              ))}

            {isOwner && activeTab === "Liked" &&
              (likedPosts.length ? (
                likedPosts.map((lp: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-zinc-950/30 border border-zinc-800 rounded-lg p-4"
                  >
                    <div className="text-sm text-zinc-200">{lp.data?.text ?? "—"}</div>
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

            {isOwner && activeTab === "Commented" &&
              (commentedPosts.length ? (
                commentedPosts.map((entry: any, i: number) => (
                  <div
                    key={i}
                    className="bg-zinc-950/30 border border-zinc-800 rounded-lg p-4"
                  >
                    <div className="text-sm">{entry.comment?.text ?? "—"}</div>
                    {entry.comment?.mediaUrl && (
                      <div className="mt-3">
                        <MediaPreview url={entry.comment.mediaUrl} />
                      </div>
                    )}
                    {entry.challenge && (
                      <div className="mt-3 p-3 border border-zinc-800 rounded-md bg-zinc-900/40">
                        <div className="text-sm font-semibold">{entry.challenge.title}</div>
                        <div className="text-xs text-zinc-500">{entry.challenge.description}</div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-sm text-zinc-500">No commented posts yet.</div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
