// // src/pages/Profile.tsx
// import React, { useState } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import {
//   getProfile,
//   getSubmissions,
//   getLikedPosts,
//   getCommentedPosts,
// } from '../apis/usersApi';
// import type { User, Comment } from '../apis/usersApi';
// import Loader from '../components/common/Loader';
// import ErrorMessage from '../components/common/ErrorMessage';
// import Avatar from '../components/common/Avatar';
// import EditProfileForm from '../components/features/EditProfileForm';
// import Button from '../components/common/Button';

// const formatDate = (iso?: string | null) =>
//   iso ? new Date(iso).toLocaleString() : '—';

// const MediaPreview: React.FC<{ url?: string | null }> = ({ url }) => {
//   if (!url) return <span className="text-zinc-500">No media</span>;

//   const src = url.split('|')[0];
//   const isImage = /\.(jpe?g|png|gif|webp|svg)(?:\?|$)/i.test(src);
//   const isVideo = /\.(mp4|webm|ogg)(?:\?|$)/i.test(src);

//   if (isImage)
//     return <img src={src} alt="media" className="w-full h-40 object-cover rounded-md border border-zinc-700" />;
//   if (isVideo)
//     return <video src={src} controls className="w-full h-40 object-cover rounded-md border border-zinc-700" />;

//   return (
//     <a href={src} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
//       View media
//     </a>
//   );
// };

// const tabs = ['Submissions', 'Liked', 'Commented', 'Bookmarks', 'Notifications'] as const;
// type TabType = typeof tabs[number];

// const Profile: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<TabType>('Submissions');
//   const [isEditing, setIsEditing] = useState(false);

//   const { data: profile, isLoading: profileLoading, error: profileError } = useQuery<User>({
//     queryKey: ['profile'],
//     queryFn: getProfile,
//   });

//   const { data: submissions, isLoading: submissionsLoading, error: submissionsError } = useQuery<Comment[]>({
//     queryKey: ['submissions'],
//     queryFn: getSubmissions,
//   });

//   const { data: likedPosts, isLoading: likedLoading, error: likedError } = useQuery<any[]>({
//     queryKey: ['likedPosts'],
//     queryFn: getLikedPosts,
//   });

//   const { data: commentedPosts, isLoading: commentedLoading, error: commentedError } = useQuery<any[]>({
//     queryKey: ['commentedPosts'],
//     queryFn: getCommentedPosts,
//   });

//   if (profileLoading || submissionsLoading || likedLoading || commentedLoading) return <Loader />;
//   if (profileError || submissionsError || likedError || commentedError)
//     return <ErrorMessage message="Failed to load profile data" />;

//   const userData: any = (profile as any)?.user ?? profile;

//   return (
//     <div className="px-4 py-6 max-w-4xl mx-auto text-zinc-100">
//       {/* Banner */}
//       {userData?.bannerUrl ? (
//         <div className="w-full h-44 mb-6 rounded-lg overflow-hidden border border-zinc-800">
//           <img src={userData.bannerUrl} alt="banner" className="w-full h-full object-cover" />
//         </div>
//       ) : (
//         <div className="w-full h-24 mb-6 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
//           <span className="text-zinc-600 text-sm">No banner</span>
//         </div>
//       )}

//       <div className="mb-4">
//         <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
//       </div>
//       {isEditing && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-zinc-900 p-6 rounded-lg max-w-md w-full">
//             <EditProfileForm user={userData} onClose={() => setIsEditing(false)} />
//           </div>
//         </div>
//       )}

//       {/* Header card */}
//       <div className="bg-zinc-950/40 border border-zinc-800 rounded-xl p-4 mb-6">
//         <div className="flex items-start gap-5">
//           <Avatar name={userData?.$id ?? 'Guest'} size={96} className="border border-zinc-700 shadow-sm" />
//           <div className="flex-1">
//             <div className="flex items-center gap-3">
//               <h1 className="text-2xl font-bold leading-tight tracking-wide">{userData?.username ?? 'Guest'}</h1>
//               {userData?.role && (
//                 <span className="text-xs px-2 py-1 rounded-full bg-blue-600/80 text-white">{userData.role}</span>
//               )}
//               {userData?.nsfw && (
//                 <span className="text-xs px-2 py-1 rounded-full bg-red-600/80 text-white">NSFW</span>
//               )}
//             </div>
//             <p className="mt-1 text-sm text-zinc-400">{userData?.bio || '—'}</p>

//             <div className="mt-3 flex items-center gap-3 text-sm text-zinc-400">
//               <div>
//                 <div className="text-xs text-zinc-500">Email</div>
//                 <div className="text-sm">{userData?.email ?? '—'}</div>
//               </div>
//               <div className="border-l border-zinc-800 pl-3">
//                 <div className="text-xs text-zinc-500">Joined</div>
//                 <div className="text-sm">{formatDate(userData?.createdAt)}</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="mb-4 flex border-b border-zinc-800">
//         {tabs.map((tab) => (
//           <button
//             key={tab}
//             className={`px-4 py-2 -mb-px font-medium ${
//               activeTab === tab ? 'border-b-2 border-blue-500 text-white' : 'text-zinc-400 hover:text-white'
//             }`}
//             onClick={() => setActiveTab(tab)}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       {/* Tab content */}
//       <div className="space-y-4">
//         {activeTab === 'Submissions' &&
//           (submissions?.length ? (
//             submissions.map((s: any, idx: number) => (
//               <article key={idx} className="bg-zinc-950/30 border border-zinc-800 rounded-lg p-4">
//                 <div className="flex items-start gap-3">
//                   <Avatar name={userData?.$id ?? 'Guest'} size={48} className="border" />
//                   <div className="flex-1">
//                     <div className="text-sm text-zinc-200">{s.text ?? s.content ?? '—'}</div>
//                     {s.mediaUrl && <div className="mt-3"><MediaPreview url={s.mediaUrl} /></div>}
//                   </div>
//                 </div>
//               </article>
//             ))
//           ) : (
//             <div className="text-sm text-zinc-500">No submissions yet.</div>
//           ))}

//         {activeTab === 'Liked' &&
//           (likedPosts?.length ? (
//             likedPosts.map((lp: any, idx: number) => (
//               <div key={idx} className="bg-zinc-950/30 border border-zinc-800 rounded-lg p-4">
//                 <div className="text-sm text-zinc-200">{lp.data?.text ?? '—'}</div>
//                 {lp.data?.mediaUrl && <div className="mt-3"><MediaPreview url={lp.data.mediaUrl} /></div>}
//               </div>
//             ))
//           ) : (
//             <div className="text-sm text-zinc-500">No liked posts yet.</div>
//           ))}

//         {activeTab === 'Commented' &&
//           (commentedPosts?.length ? (
//             commentedPosts.map((entry: any, i: number) => (
//               <div key={i} className="bg-zinc-950/30 border border-zinc-800 rounded-lg p-4">
//                 <div className="text-sm">{entry.comment?.text ?? '—'}</div>
//                 {entry.comment?.mediaUrl && <div className="mt-3"><MediaPreview url={entry.comment.mediaUrl} /></div>}
//                 {entry.challenge && (
//                   <div className="mt-3 p-3 border border-zinc-800 rounded-md bg-zinc-900/40">
//                     <div className="text-sm font-semibold">{entry.challenge.title}</div>
//                     <div className="text-xs text-zinc-500">{entry.challenge.description}</div>
//                   </div>
//                 )}
//               </div>
//             ))
//           ) : (
//             <div className="text-sm text-zinc-500">No commented posts yet.</div>
//           ))}

//         {activeTab === 'Bookmarks' &&
//           (profile?.bookmarks?.length ? (
//             profile.bookmarks.map((b: any, idx: number) => (
//               <div key={idx} className="bg-zinc-950/30 border border-zinc-800 rounded-md p-3 text-sm">
//                 <div>Challenge: <span className="text-zinc-300">{b.challengeTitle ?? '—'}</span></div>
//                 <div className="text-xs text-zinc-500">Created: {formatDate(b.createdAt)}</div>
//               </div>
//             ))
//           ) : (
//             <div className="text-sm text-zinc-500">No bookmarks.</div>
//           ))}

//         {activeTab === 'Notifications' &&
//           (profile?.notifications?.length ? (
//             profile.notifications.map((n: any, idx: number) => (
//               <div key={idx} className="bg-zinc-950/30 border border-zinc-800 rounded-md p-3 text-sm">
//                 <div className="text-sm">{n.title ?? n.message ?? '—'}</div>
//                 <div className="text-xs text-zinc-500 mt-1">{formatDate(n.createdAt)}</div>
//               </div>
//             ))
//           ) : (
//             <div className="text-sm text-zinc-500">No notifications.</div>
//           ))}
//       </div>
//     </div>
//   );
// };

// export default Profile;



// // src/pages/Profile.tsx
// import React, { useState } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import {
//   getProfile,
//   getSubmissions,
//   getLikedPosts,
//   getCommentedPosts,
//   updateProfile,
// } from '../apis/usersApi';
// import type { User, Comment } from '../apis/usersApi';
// import Loader from '../components/common/Loader';
// import ErrorMessage from '../components/common/ErrorMessage';
// import Avatar from '../components/common/Avatar';
// import Button from '../components/common/Button';
// import Input from '../components/common/Input';

// const formatDate = (iso?: string | null) =>
//   iso ? new Date(iso).toLocaleString() : '—';

// const MediaPreview: React.FC<{ url?: string | null }> = ({ url }) => {
//   if (!url) return <span className="text-zinc-500">No media</span>;

//   const src = url.split('|')[0];
//   const isImage = /\.(jpe?g|png|gif|webp|svg)(?:\?|$)/i.test(src);
//   const isVideo = /\.(mp4|webm|ogg)(?:\?|$)/i.test(src);

//   if (isImage)
//     return <img src={src} alt="media" className="w-full h-40 object-cover rounded-md border border-zinc-700" />;
//   if (isVideo)
//     return <video src={src} controls className="w-full h-40 object-cover rounded-md border border-zinc-700" />;

//   return (
//     <a href={src} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
//       View media
//     </a>
//   );
// };

// const tabs = ['Submissions', 'Liked', 'Commented', 'Bookmarks', 'Notifications'] as const;
// type TabType = typeof tabs[number];

// const Profile: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<TabType>('Submissions');
//   const [isEditing, setIsEditing] = useState(false);
//   const [username, setUsername] = useState('');
//   const [bio, setBio] = useState('');
//   const queryClient = useQueryClient();

//   const { data: profile, isLoading: profileLoading, error: profileError } = useQuery<User>({
//     queryKey: ['profile'],
//     queryFn: getProfile,
//     onSuccess: (data) => {
//       setUsername(data?.username ?? '');
//       setBio(data?.bio ?? '');
//     },
//   });

//   const { data: submissions, isLoading: submissionsLoading, error: submissionsError } = useQuery<Comment[]>({
//     queryKey: ['submissions'],
//     queryFn: getSubmissions,
//   });

//   const { data: likedPosts, isLoading: likedLoading, error: likedError } = useQuery<any[]>({
//     queryKey: ['likedPosts'],
//     queryFn: getLikedPosts,
//   });

//   const { data: commentedPosts, isLoading: commentedLoading, error: commentedError } = useQuery<any[]>({
//     queryKey: ['commentedPosts'],
//     queryFn: getCommentedPosts,
//   });

//   const updateProfileMutation = useMutation({
//     mutationFn: updateProfile,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['profile'] });
//       setIsEditing(false);
//     },
//     onError: (error: any) => {
//       alert(error.response?.data?.error || 'Failed to update profile');
//     },
//   });

//   const handleUpdateProfile = () => {
//     updateProfileMutation.mutate({ username, bio });
//   };

//   if (profileLoading || submissionsLoading || likedLoading || commentedLoading) return <Loader />;
//   if (profileError || submissionsError || likedError || commentedError)
//     return <ErrorMessage message="Failed to load profile data" />;

//   const userData: any = (profile as any)?.user ?? profile;

//   return (
//     <div className="px-4 py-6 max-w-4xl mx-auto text-zinc-100">
//       {/* Banner */}
//       {userData?.bannerUrl ? (
//         <div className="w-full h-44 mb-6 rounded-lg overflow-hidden border border-zinc-800">
//           <img src={userData.bannerUrl} alt="banner" className="w-full h-full object-cover" />
//         </div>
//       ) : (
//         <div className="w-full h-24 mb-6 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
//           <span className="text-zinc-600 text-sm">No banner</span>
//         </div>
//       )}

//       {/* Header card */}
//       <div className="bg-zinc-950/40 border border-zinc-800 rounded-xl p-4 mb-6">
//         <div className="flex items-start gap-5">
//           <Avatar name={userData?.$id ?? 'Guest'} size={96} className="border border-zinc-700 shadow-sm" />
//           <div className="flex-1">
//             {isEditing ? (
//               <div className="space-y-4">
//                 <Input
//                   label="Username"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   placeholder="Enter username"
//                 />
//                 <Input
//                   label="Bio"
//                   value={bio}
//                   onChange={(e) => setBio(e.target.value)}
//                   placeholder="Enter bio"
//                   textarea
//                 />
//                 <div className="flex gap-2">
//                   <Button
//                     onClick={handleUpdateProfile}
//                     disabled={updateProfileMutation.isLoading}
//                     className="bg-blue-500 hover:bg-blue-600"
//                   >
//                     {updateProfileMutation.isLoading ? 'Saving...' : 'Save'}
//                   </Button>
//                   <Button
//                     onClick={() => setIsEditing(false)}
//                     className="bg-zinc-700 hover:bg-zinc-600"
//                   >
//                     Cancel
//                   </Button>
//                 </div>
//               </div>
//             ) : (
//               <>
//                 <div className="flex items-center gap-3">
//                   <h1 className="text-2xl font-bold leading-tight tracking-wide">{userData?.username ?? 'Guest'}</h1>
//                   {userData?.role && (
//                     <span className="text-xs px-2 py-1 rounded-full bg-blue-600/80 text-white">{userData.role}</span>
//                   )}
//                   {userData?.nsfw && (
//                     <span className="text-xs px-2 py-1 rounded-full bg-red-600/80 text-white">NSFW</span>
//                   )}
//                 </div>
//                 <p className="mt-1 text-sm text-zinc-400">{userData?.bio || '—'}</p>
//                 <Button
//                   onClick={() => setIsEditing(true)}
//                   className="mt-2 bg-blue-500 hover:bg-blue-600 text-sm"
//                 >
//                   Edit Profile
//                 </Button>
//                 <div className="mt-3 flex items-center gap-3 text-sm text-zinc-400">
//                   <div>
//                     <div className="text-xs text-zinc-500">Email</div>
//                     <div className="text-sm">{userData?.email ?? '—'}</div>
//                   </div>
//                   <div className="border-l border-zinc-800 pl-3">
//                     <div className="text-xs text-zinc-500">Joined</div>
//                     <div className="text-sm">{formatDate(userData?.createdAt)}</div>
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="mb-4 flex border-b border-zinc-800">
//         {tabs.map((tab) => (
//           <button
//             key={tab}
//             className={`px-4 py-2 -mb-px font-medium ${
//               activeTab === tab ? 'border-b-2 border-blue-500 text-white' : 'text-zinc-400 hover:text-white'
//             }`}
//             onClick={() => setActiveTab(tab)}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       {/* Tab content */}
//       <div className="space-y-4">
//         {activeTab === 'Submissions' &&
//           (submissions?.length ? (
//             submissions.map((s: any, idx: number) => (
//               <article key={idx} className="bg-zinc-950/30 border border-zinc-800 rounded-lg p-4">
//                 <div className="flex items-start gap-3">
//                   <Avatar name={userData?.$id ?? 'Guest'} size={48} className="border" />
//                   <div className="flex-1">
//                     <div className="text-sm text-zinc-200">{s.text ?? s.content ?? '—'}</div>
//                     {s.mediaUrl && <div className="mt-3"><MediaPreview url={s.mediaUrl} /></div>}
//                   </div>
//                 </div>
//               </article>
//             ))
//           ) : (
//             <div className="text-sm text-zinc-500">No submissions yet.</div>
//           ))}

//         {activeTab === 'Liked' &&
//           (likedPosts?.length ? (
//             likedPosts.map((lp: any, idx: number) => (
//               <div key={idx} className="bg-zinc-950/30 border border-zinc-800 rounded-lg p-4">
//                 <div className="text-sm text-zinc-200">{lp.data?.text ?? '—'}</div>
//                 {lp.data?.mediaUrl && <div className="mt-3"><MediaPreview url={lp.data.mediaUrl} /></div>}
//               </div>
//             ))
//           ) : (
//             <div className="text-sm text-zinc-500">No liked posts yet.</div>
//           ))}

//         {activeTab === 'Commented' &&
//           (commentedPosts?.length ? (
//             commentedPosts.map((entry: any, i: number) => (
//               <div key={i} className="bg-zinc-950/30 border border-zinc-800 rounded-lg p-4">
//                 <div className="text-sm">{entry.comment?.text ?? '—'}</div>
//                 {entry.comment?.mediaUrl && <div className="mt-3"><MediaPreview url={entry.comment.mediaUrl} /></div>}
//                 {entry.challenge && (
//                   <div className="mt-3 p-3 border border-zinc-800 rounded-md bg-zinc-900/40">
//                     <div className="text-sm font-semibold">{entry.challenge.title}</div>
//                     <div className="text-xs text-zinc-500">{entry.challenge.description}</div>
//                   </div>
//                 )}
//               </div>
//             ))
//           ) : (
//             <div className="text-sm text-zinc-500">No commented posts yet.</div>
//           ))}

//         {activeTab === 'Bookmarks' &&
//           (profile?.bookmarks?.length ? (
//             profile.bookmarks.map((b: any, idx: number) => (
//               <div key={idx} className="bg-zinc-950/30 border border-zinc-800 rounded-md p-3 text-sm">
//                 <div>Challenge: <span className="text-zinc-300">{b.challengeTitle ?? '—'}</span></div>
//                 <div className="text-xs text-zinc-500">Created: {formatDate(b.createdAt)}</div>
//               </div>
//             ))
//           ) : (
//             <div className="text-sm text-zinc-500">No bookmarks.</div>
//           ))}

//         {activeTab === 'Notifications' &&
//           (profile?.notifications?.length ? (
//             profile.notifications.map((n: any, idx: number) => (
//               <div key={idx} className="bg-zinc-950/30 border border-zinc-800 rounded-md p-3 text-sm">
//                 <div className="text-sm">{n.title ?? n.message ?? '—'}</div>
//                 <div className="text-xs text-zinc-500 mt-1">{formatDate(n.createdAt)}</div>
//               </div>
//             ))
//           ) : (
//             <div className="text-sm text-zinc-500">No notifications.</div>
//           ))}
//       </div>
//     </div>
//   );
// };

// export default Profile;


// // src/pages/Profile.tsx
// import React, { useState } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import {
//   getProfile,
//   getSubmissions,
//   getLikedPosts,
//   getCommentedPosts,
// } from '../apis/usersApi';
// import type { User, Comment } from '../apis/usersApi';
// import Loader from '../components/common/Loader';
// import ErrorMessage from '../components/common/ErrorMessage';
// import Avatar from '../components/common/Avatar';
// import ProfileHeader from '../components/features/ProfileHeader';

// const formatDate = (iso?: string | null) =>
//   iso ? new Date(iso).toLocaleString() : '—';

// const MediaPreview: React.FC<{ url?: string | null }> = ({ url }) => {
//   if (!url) return <span className="text-zinc-500">No media</span>;

//   const src = url.split('|')[0];
//   const isImage = /\.(jpe?g|png|gif|webp|svg)(?:\?|$)/i.test(src);
//   const isVideo = /\.(mp4|webm|ogg)(?:\?|$)/i.test(src);

//   if (isImage)
//     return <img src={src} alt="media" className="w-full h-40 object-cover rounded-md border border-zinc-700" />;
//   if (isVideo)
//     return <video src={src} controls className="w-full h-40 object-cover rounded-md border border-zinc-700" />;

//   return (
//     <a href={src} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
//       View media
//     </a>
//   );
// };

// const tabs = ['Submissions', 'Liked', 'Commented', 'Bookmarks', 'Notifications'] as const;
// type TabType = typeof tabs[number];

// const Profile: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<TabType>('Submissions');

//   const { data: profile, isLoading: profileLoading, error: profileError } = useQuery<User>({
//     queryKey: ['profile'],
//     queryFn: getProfile,
//   });

//   const { data: submissions, isLoading: submissionsLoading, error: submissionsError } = useQuery<Comment[]>({
//     queryKey: ['submissions'],
//     queryFn: getSubmissions,
//   });

//   const { data: likedPosts, isLoading: likedLoading, error: likedError } = useQuery<any[]>({
//     queryKey: ['likedPosts'],
//     queryFn: getLikedPosts,
//   });

//   const { data: commentedPosts, isLoading: commentedLoading, error: commentedError } = useQuery<any[]>({
//     queryKey: ['commentedPosts'],
//     queryFn: getCommentedPosts,
//   });

//   if (profileLoading || submissionsLoading || likedLoading || commentedLoading) return <Loader />;
//   if (profileError || submissionsError || likedError || commentedError)
//     return <ErrorMessage message="Failed to load profile data" />;

//   const userData: any = (profile as any)?.user ?? profile;

//   return (
//     <div className="px-4 py-6 max-w-4xl mx-auto text-zinc-100">
//       {/* Banner */}
//       {userData?.bannerUrl ? (
//         <div className="w-full h-44 mb-6 rounded-lg overflow-hidden border border-zinc-800">
//           <img src={userData.bannerUrl} alt="banner" className="w-full h-full object-cover" />
//         </div>
//       ) : (
//         <div className="w-full h-24 mb-6 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
//           <span className="text-zinc-600 text-sm">No banner</span>
//         </div>
//       )}

//       {/* Profile header (refactored) */}
//       <ProfileHeader userData={userData} />

//       {/* Tabs */}
//       <div className="mb-4 flex border-b border-zinc-800">
//         {tabs.map((tab) => (
//           <button
//             key={tab}
//             className={`px-4 py-2 -mb-px font-medium ${
//               activeTab === tab ? 'border-b-2 border-blue-500 text-white' : 'text-zinc-400 hover:text-white'
//             }`}
//             onClick={() => setActiveTab(tab)}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       {/* Tab content */}
//       <div className="space-y-4">
//         {activeTab === 'Submissions' &&
//           (submissions?.length ? (
//             submissions.map((s: any, idx: number) => (
//               <article key={idx} className="bg-zinc-950/30 border border-zinc-800 rounded-lg p-4">
//                 <div className="flex items-start gap-3">
//                   <Avatar name={userData?.$id ?? 'Guest'} size={48} className="border" />
//                   <div className="flex-1">
//                     <div className="text-sm text-zinc-200">{s.text ?? s.content ?? '—'}</div>
//                     {s.mediaUrl && <div className="mt-3"><MediaPreview url={s.mediaUrl} /></div>}
//                   </div>
//                 </div>
//               </article>
//             ))
//           ) : (
//             <div className="text-sm text-zinc-500">No submissions yet.</div>
//           ))}

//         {activeTab === 'Liked' &&
//           (likedPosts?.length ? (
//             likedPosts.map((lp: any, idx: number) => (
//               <div key={idx} className="bg-zinc-950/30 border border-zinc-800 rounded-lg p-4">
//                 <div className="text-sm text-zinc-200">{lp.data?.text ?? '—'}</div>
//                 {lp.data?.mediaUrl && <div className="mt-3"><MediaPreview url={lp.data.mediaUrl} /></div>}
//               </div>
//             ))
//           ) : (
//             <div className="text-sm text-zinc-500">No liked posts yet.</div>
//           ))}

//         {activeTab === 'Commented' &&
//           (commentedPosts?.length ? (
//             commentedPosts.map((entry: any, i: number) => (
//               <div key={i} className="bg-zinc-950/30 border border-zinc-800 rounded-lg p-4">
//                 <div className="text-sm">{entry.comment?.text ?? '—'}</div>
//                 {entry.comment?.mediaUrl && <div className="mt-3"><MediaPreview url={entry.comment.mediaUrl} /></div>}
//                 {entry.challenge && (
//                   <div className="mt-3 p-3 border border-zinc-800 rounded-md bg-zinc-900/40">
//                     <div className="text-sm font-semibold">{entry.challenge.title}</div>
//                     <div className="text-xs text-zinc-500">{entry.challenge.description}</div>
//                   </div>
//                 )}
//               </div>
//             ))
//           ) : (
//             <div className="text-sm text-zinc-500">No commented posts yet.</div>
//           ))}

//         {activeTab === 'Bookmarks' &&
//           (profile?.bookmarks?.length ? (
//             profile.bookmarks.map((b: any, idx: number) => (
//               <div key={idx} className="bg-zinc-950/30 border border-zinc-800 rounded-md p-3 text-sm">
//                 <div>Challenge: <span className="text-zinc-300">{b.challengeTitle ?? '—'}</span></div>
//                 <div className="text-xs text-zinc-500">Created: {formatDate(b.createdAt)}</div>
//               </div>
//             ))
//           ) : (
//             <div className="text-sm text-zinc-500">No bookmarks.</div>
//           ))}

//         {activeTab === 'Notifications' &&
//           (profile?.notifications?.length ? (
//             profile.notifications.map((n: any, idx: number) => (
//               <div key={idx} className="bg-zinc-950/30 border border-zinc-800 rounded-md p-3 text-sm">
//                 <div className="text-sm">{n.title ?? n.message ?? '—'}</div>
//                 <div className="text-xs text-zinc-500 mt-1">{formatDate(n.createdAt)}</div>
//               </div>
//             ))
//           ) : (
//             <div className="text-sm text-zinc-500">No notifications.</div>
//           ))}
//       </div>
//     </div>
//   );
// };

// export default Profile;


// src/pages/Profile.tsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProfile, getUserById } from "../apis/usersApi";
import { useAuth } from "../hooks/useAuth";
import ProfileHeader from "../components/features/ProfileHeader";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import Avatar from "../components/common/Avatar";
import MediaPreview from "../components/features/MediaPreview";
import { formatDate } from "../utils/helpers";

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "Submissions" | "Liked" | "Commented" | "Bookmarks" | "Notifications"
  >("Submissions");

  // are we looking at our own profile?
  const isOwner = userId === currentUser?.id;

  // ✅ React Query with long-lived cache
  const {
    data: profile,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["profile", isOwner ? currentUser?.id : userId],
    queryFn: () => (isOwner ? getProfile() : getUserById(userId!)),
    enabled: !!(isOwner ? currentUser?.id : userId),
    staleTime: Infinity, // never refetch automatically
    cacheTime: Infinity, // keep cache forever
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });

  if (isLoading) return <Loader />;
  if (isError) return <ErrorMessage message={(error as Error).message} />;
  if (!profile) return <ErrorMessage message="Profile not found" />;

  // Normalize
  const userData = isOwner ? profile.user : profile;

  // Tabs data (only owner has these)
  const submissions = isOwner ? profile.submissions ?? [] : [];
  const likedPosts = isOwner ? profile.likedPosts ?? [] : [];
  const commentedPosts = isOwner ? profile.commentedPosts ?? [] : [];
  const bookmarks = isOwner ? profile.bookmarks ?? [] : [];
  const notifications = isOwner ? profile.notifications ?? [] : [];

  // extras visible only if owner or profile is public
  const canSeeExtras = isOwner || userData?.private === false;
  const tabs = ["Submissions", "Liked", "Commented", "Bookmarks", "Notifications"];

  return (
    <div className="px-4 py-6 max-w-4xl mx-auto text-zinc-100">
      <ProfileHeader userData={userData} />

      {/* Private account message */}
      {userData?.private && !isOwner && (
        <div className="text-center text-zinc-400 text-sm mt-6">
          🔒 This account is private. Follow to see posts.
        </div>
      )}

      {canSeeExtras && (
        <div className="mt-6">
          {/* Tabs */}
          <div className="mb-4 flex border-b border-zinc-800">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 -mb-px font-medium ${
                  activeTab === tab
                    ? "border-b-2 border-blue-500 text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
                onClick={() => setActiveTab(tab as any)}
              >
                {tab}
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
                        size={48}
                        className="border"
                      />
                      <div className="flex-1">
                        <div className="text-sm text-zinc-200">
                          {s.text ?? s.content ?? "—"}
                        </div>
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

            {activeTab === "Liked" &&
              (likedPosts.length ? (
                likedPosts.map((lp: any, idx: number) => (
                  <div
                    key={idx}
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

            {activeTab === "Commented" &&
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

            {activeTab === "Bookmarks" &&
              (bookmarks.length ? (
                bookmarks.map((b: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-zinc-950/30 border border-zinc-800 rounded-md p-3 text-sm"
                  >
                    <div>
                      Challenge:{" "}
                      <span className="text-zinc-300">
                        {b.challengeTitle ?? "—"}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-500">
                      Created: {formatDate(b.createdAt)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-zinc-500">No bookmarks.</div>
              ))}

            {activeTab === "Notifications" &&
              (notifications.length ? (
                notifications.map((n: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-zinc-950/30 border border-zinc-800 rounded-md p-3 text-sm"
                  >
                    <div className="text-sm">
                      {n.title ?? n.message ?? "—"}
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">
                      {formatDate(n.createdAt)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-zinc-500">No notifications.</div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
