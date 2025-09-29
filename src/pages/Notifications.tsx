// import { useQuery } from '@tanstack/react-query';
// import { getNotifications } from '../apis/notificationsApi';
// import type { Notification } from '../apis/notificationsApi';

// import NotificationCard from '../components/features/Notification';
// import Loader from '../components/common/Loader';
// import ErrorMessage from '../components/common/ErrorMessage';
// import { Bell } from 'lucide-react';

// const Notifications = () => {
//   const { data: notifications, isLoading, error } = useQuery<Notification[]>({
//     queryKey: ['notifications'],
//     queryFn: getNotifications,
//   });

//   if (isLoading) return <Loader />;
//   if (error) return <ErrorMessage message="Failed to load notifications" />;

//   return (
//     <div className="px-4 py-6 max-w-2xl mx-auto">
//       {/* Header */}
//       <div className="flex items-center gap-2 mb-6">
//         <Bell className="w-6 h-6 text-zinc-100" />
//         <h2 className="text-lg md:text-xl font-semibold text-zinc-100 hidden sm:block">
//           Notifications
//         </h2>
//       </div>

//       {notifications?.length ? (
//         <div className="space-y-3">
//           {notifications.map((notification) => (
//             <NotificationCard key={notification.id} notification={notification} />
//           ))}
//         </div>
//       ) : (
//         <p className="text-sm text-zinc-500 text-center">
//           No notifications found.
//         </p>
//       )}
//     </div>
//   );
// };

// // export default Notifications;
// import React, { useEffect, useState } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import {
//   getNotifications as fetchNotifications,
// } from '../apis/notificationsApi';
// import { getUserById } from '../apis/usersApi';
// import { getChallenge } from '../apis/challengesApi';
// import { getCommentById } from '../apis/commentsApi';
// import type { Notification as NotificationType } from '../apis/notificationsApi';
// import Avatar from '../components/common/Avatar';
// import { Bell, MessageSquare, Heart, Star, UserPlus } from 'lucide-react';
// import clsx from 'clsx';
// import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
// import 'react-loading-skeleton/dist/skeleton.css';

// // --- Types ---
// interface Notification extends NotificationType {
//   $id?: string;
//   id?: string;
//   actorId: string;
//   targetId: string;
//   targetType: string;
//   type: string;
//   read: boolean;
//   createdAt?: string;
//   $createdAt?: string;
// }

// // --- Helpers ---
// const getCreatedAt = (notification: Notification): string =>
//   notification.$createdAt || notification.createdAt || new Date().toISOString();

// const timeAgo = (iso: string): string => {
//   const then = new Date(iso).getTime();
//   const now = Date.now();
//   const diff = Math.floor((now - then) / 1000);
//   if (diff < 60) return `${diff}s`;
//   if (diff < 3600) return `${Math.floor(diff / 60)}m`;
//   if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
//   return `${Math.floor(diff / 86400)}d`;
// };

// const getIconForType = (type: string) => {
//   switch (type) {
//     case 'reply':
//       return <MessageSquare size={18} className="text-blue-400" />;
//     case 'like':
//       return <Heart size={18} className="text-pink-500" />;
//     case 'new_submission':
//       return <Star size={18} className="text-yellow-400" />;
//     case 'follow':
//       return <UserPlus size={18} className="text-green-400" />;
//     default:
//       return <Bell size={18} className="text-zinc-400" />;
//   }
// };

// // --- Notification Item ---
// const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
//   const [actor, setActor] = useState<any | null>(null);
//   const [challengeTitle, setChallengeTitle] = useState<string>('');
//   const [commentPreview, setCommentPreview] = useState<string>('');

//   useEffect(() => {
//     let mounted = true;

//     const load = async () => {
//       try {
//         if (notification.actorId) {
//           const user = await getUserById(notification.actorId).catch(() => null);
//           if (user && mounted) setActor(user);
//         }

//         if (notification.targetType === 'challenge') {
//           const challenge = await getChallenge(notification.targetId).catch(() => null);
//           if (challenge && mounted) setChallengeTitle(challenge.title || '');
//         } else if (notification.targetType === 'comment') {
//           const comment = await getCommentById(notification.targetId).catch(() => null);
//           if (comment && mounted) {
//             setCommentPreview(comment.text || '');
//             if (comment.challengeId) {
//               const challenge = await getChallenge(comment.challengeId).catch(() => null);
//               if (challenge && mounted) setChallengeTitle(challenge.title || '');
//             }
//           }
//         }
//       } catch (err) {
//         console.error('Notification hydration error', err);
//       }
//     };

//     load();
//     return () => {
//       mounted = false;
//     };
//   }, [notification.actorId, notification.targetId, notification.targetType]);

//   const renderMessage = () => {
//     const actorName = actor?.username || 'Someone';
//     const icon = getIconForType(notification.type);

//     switch (notification.type) {
//       case 'like':
//         return (
//           <>
//             {icon} {actorName} liked your comment {commentPreview ? `“${commentPreview}”` : ''}{' '}
//             {challengeTitle ? `on "${challengeTitle}"` : ''}
//           </>
//         );
//       case 'reply':
//         return (
//           <>
//             {icon} {actorName} replied {commentPreview ? `“${commentPreview}”` : ''}{' '}
//             {challengeTitle ? `on "${challengeTitle}"` : ''}
//           </>
//         );
//       case 'new_submission':
//         return (
//           <>
//             {icon} {actorName} submitted a new artwork {challengeTitle ? `to "${challengeTitle}"` : ''}
//           </>
//         );
//       case 'follow':
//         return (
//           <>
//             {icon} {actorName} started following you
//           </>
//         );
//       default:
//         return (
//           <>
//             {icon} {actorName} did something
//           </>
//         );
//     }
//   };

//   const createdIso = getCreatedAt(notification);

//   return (
//     <div
//       className={clsx(
//         'flex items-start gap-3 rounded-xl border border-zinc-800 p-3 text-sm',
//         notification.read ? 'bg-zinc-900/40 opacity-70' : 'bg-zinc-900/80 hover:bg-zinc-800/80'
//       )}
//     >
//       <div className="flex-shrink-0 h-9 w-9 rounded-full bg-zinc-800 overflow-hidden flex items-center justify-center">
//         {actor ? (
//           <Avatar name={actor.username || 'User'} size={36} />
//         ) : (
//           <div className="p-1">{getIconForType(notification.type)}</div>
//         )}
//       </div>
//       <div className="flex-1 min-w-0">
//         {/* Full message (no truncate) */}
//         <p className="text-zinc-200 leading-snug break-words">{renderMessage()}</p>
//         <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 mt-1">
//           <span>{timeAgo(createdIso)}</span>
//           {challengeTitle && <span>• {challengeTitle}</span>}
//           {!notification.read && <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />}
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- Skeleton Item ---
// const NotificationSkeleton: React.FC = () => (
//   <div className="flex items-center gap-3 rounded-xl border border-zinc-800 p-3 bg-zinc-900/40">
//     <Skeleton circle width={36} height={36} />
//     <div className="flex-1">
//       <Skeleton width="90%" height={14} />
//       <Skeleton width="60%" height={12} style={{ marginTop: 6 }} />
//     </div>
//   </div>
// );

// // --- Main List ---
// const NotificationsList: React.FC = () => {
//   const { data: rawNotifications = [], isLoading } = useQuery({
//     queryKey: ['notifications'],
//     queryFn: fetchNotifications,
//   });

//   useEffect(() => {
//     console.log('raw notifications', rawNotifications);
//   }, [rawNotifications]);

//   return (
//     <div className="max-w-2xl mx-auto w-full px-3 sm:px-6 py-4">
//       {/* Header */}
//       <div className="flex items-center gap-2 mb-4">
//         <Bell className="text-blue-400" size={22} />
//         <h1 className="text-lg font-semibold text-zinc-200">Notifications</h1>
//       </div>

//       {/* Content */}
//       {isLoading ? (
//         <SkeletonTheme baseColor="#202020" highlightColor="#444">
//           <div className="space-y-3">
//             {Array.from({ length: 5 }).map((_, i) => (
//               <NotificationSkeleton key={i} />
//             ))}
//           </div>
//         </SkeletonTheme>
//       ) : (
//         <div className="space-y-3">
//           {rawNotifications.length ? (
//             rawNotifications.map((notification: any, idx: number) => (
//               <NotificationItem
//                 key={notification.$id ?? notification.id ?? idx}
//                 notification={notification}
//               />
//             ))
//           ) : (
//             <p className="text-sm text-zinc-500 text-center">No notifications found.</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationsList;

// // NotificationsList.tsx
// import React, { useEffect, useState } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import {
//   getNotifications as fetchNotifications,
//   type Notification as NotificationType,
// } from '../apis/notificationsApi';
// import { getUserById } from '../apis/usersApi';
// import { getChallenge } from '../apis/challengesApi';
// import { getCommentById } from '../apis/commentsApi';
// import Avatar from '../components/common/Avatar';
// import { Bell, MessageSquare, Heart, Star, UserPlus } from 'lucide-react';
// import clsx from 'clsx';
// import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
// import 'react-loading-skeleton/dist/skeleton.css';

// // --- Types ---
// interface Notification extends NotificationType {
//   $id?: string;
//   id?: string;
//   actorId: string;
//   targetId: string;
//   targetType: 'challenge' | 'comment' | string;
//   type: 'reply' | 'like' | 'new_submission' | 'follow' | string;
//   read: boolean;
//   createdAt?: string;
//   $createdAt?: string;
//   actor?: any;
//   challengeTitle?: string;
//   commentPreview?: string;
// }

// // --- Helpers ---
// const getCreatedAt = (n: Notification) =>
//   n.$createdAt || n.createdAt || new Date().toISOString();

// const timeAgo = (iso: string): string => {
//   const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
//   if (diff < 60) return `${diff}s`;
//   if (diff < 3600) return `${Math.floor(diff / 60)}m`;
//   if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
//   return `${Math.floor(diff / 86400)}d`;
// };

// const icons: Record<string, JSX.Element> = {
//   reply: <MessageSquare size={18} className="text-blue-400" />,
//   like: <Heart size={18} className="text-pink-500" />,
//   new_submission: <Star size={18} className="text-yellow-400" />,
//   follow: <UserPlus size={18} className="text-green-400" />,
//   default: <Bell size={18} className="text-zinc-400" />,
// };

// const getIconForType = (type: string) => icons[type] || icons.default;

// // --- Notification Item ---
// const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
//   const actorName = notification.actor?.username || 'Someone';
//   const icon = getIconForType(notification.type);
//   const createdIso = getCreatedAt(notification);

//   const message = (() => {
//     switch (notification.type) {
//       case 'like':
//         return (
//           <>
//             {icon} {actorName} liked your comment{' '}
//             {notification.commentPreview && `“${notification.commentPreview}”`}{' '}
//             {notification.challengeTitle && `on "${notification.challengeTitle}"`}
//           </>
//         );
//       case 'reply':
//         return (
//           <>
//             {icon} {actorName} replied{' '}
//             {notification.commentPreview && `“${notification.commentPreview}”`}{' '}
//             {notification.challengeTitle && `on "${notification.challengeTitle}"`}
//           </>
//         );
//       case 'new_submission':
//         return (
//           <>
//             {icon} {actorName} submitted a new artwork{' '}
//             {notification.challengeTitle && `to "${notification.challengeTitle}"`}
//           </>
//         );
//       case 'follow':
//         return (
//           <>
//             {icon} {actorName} started following you
//           </>
//         );
//       default:
//         return (
//           <>
//             {icon} {actorName} did something
//           </>
//         );
//     }
//   })();

//   return (
//     <div
//       className={clsx(
//         'flex items-start gap-3 rounded-xl border border-zinc-800 p-3 text-sm',
//         notification.read
//           ? 'bg-zinc-900/40 opacity-70'
//           : 'bg-zinc-900/80 hover:bg-zinc-800/80'
//       )}
//     >
//       <div className="flex-shrink-0 h-9 w-9 rounded-full bg-zinc-800 overflow-hidden flex items-center justify-center">
//         {notification.actor ? (
//           <Avatar name={actorName} size={36} />
//         ) : (
//           <div className="p-1">{getIconForType(notification.type)}</div>
//         )}
//       </div>
//       <div className="flex-1 min-w-0">
//         <p className="text-zinc-200 leading-snug break-words">{message}</p>
//         <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 mt-1">
//           <span>{timeAgo(createdIso)}</span>
//           {notification.challengeTitle && <span>• {notification.challengeTitle}</span>}
//           {!notification.read && (
//             <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- Skeleton Item ---
// const NotificationSkeleton = () => (
//   <div className="flex items-center gap-3 rounded-xl border border-zinc-800 p-3 bg-zinc-900/40">
//     <Skeleton circle width={36} height={36} />
//     <div className="flex-1">
//       <Skeleton width="90%" height={14} />
//       <Skeleton width="60%" height={12} style={{ marginTop: 6 }} />
//     </div>
//   </div>
// );

// // --- Main List ---
// const NotificationsList: React.FC = () => {
//   const { data: rawNotifications = [], isLoading } = useQuery({
//     queryKey: ['notifications'],
//     queryFn: fetchNotifications,
//   });

//   const [hydrated, setHydrated] = useState<Notification[]>([]);

//   useEffect(() => {
//     const hydrate = async () => {
//       if (!rawNotifications.length) {
//         setHydrated([]);
//         return;
//       }

//       // --- Fetch related data ---
//       const actorIds = [...new Set(rawNotifications.map((n) => n.actorId))];
//       const users = await Promise.all(
//         actorIds.map((id) => getUserById(id).catch(() => null))
//       );
//       const userMap = Object.fromEntries(
//         users.filter(Boolean).map((u) => [u.$id || u.id, u])
//       );

//       const challengeIds: string[] = [];
//       const commentIds: string[] = [];

//       rawNotifications.forEach((n) => {
//         if (n.targetType === 'challenge') challengeIds.push(n.targetId);
//         if (n.targetType === 'comment') commentIds.push(n.targetId);
//       });

//       const challenges = await Promise.all(
//         challengeIds.map((id) => getChallenge(id).catch(() => null))
//       );
//       const challengeMap = Object.fromEntries(
//         challenges.filter(Boolean).map((c) => [c.$id || c.id, c])
//       );

//       const comments = await Promise.all(
//         commentIds.map((id) => getCommentById(id).catch(() => null))
//       );
//       const commentMap = Object.fromEntries(
//         comments.filter(Boolean).map((c) => [c.$id || c.id, c])
//       );

//       // --- Merge into notifications ---
//       const enriched = rawNotifications.map((n) => {
//         const actor = userMap[n.actorId];
//         let challengeTitle = '';
//         let commentPreview = '';

//         if (n.targetType === 'challenge') {
//           challengeTitle = challengeMap[n.targetId]?.title || '';
//         } else if (n.targetType === 'comment') {
//           const comment = commentMap[n.targetId];
//           commentPreview = comment?.text || '';
//           if (comment?.challengeId) {
//             challengeTitle = challengeMap[comment.challengeId]?.title || '';
//           }
//         }

//         return { ...n, actor, challengeTitle, commentPreview };
//       });

//       setHydrated(enriched);
//     };

//     hydrate();
//   }, [rawNotifications]);

//   return (
//     <div className="max-w-2xl mx-auto w-full px-3 sm:px-6 py-4">
//       {/* Header */}
//       <div className="flex items-center gap-2 mb-4">
//         <Bell className="text-blue-400" size={22} />
//         <h1 className="text-lg font-semibold text-zinc-200">Notifications</h1>
//       </div>

//       {/* Content */}
//       {isLoading ? (
//         <SkeletonTheme baseColor="#202020" highlightColor="#444">
//           <div className="space-y-3">
//             {Array.from({ length: 5 }).map((_, i) => (
//               <NotificationSkeleton key={i} />
//             ))}
//           </div>
//         </SkeletonTheme>
//       ) : (
//         <div className="space-y-3">
//           {hydrated.length ? (
//             hydrated.map((n, idx) => (
//               <NotificationItem
//                 key={n.$id ?? n.id ?? idx}
//                 notification={n}
//               />
//             ))
//           ) : (
//             <p className="text-sm text-zinc-500 text-center">
//               No notifications found.
//             </p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationsList;



// // NotificationsList.tsx
// import React, { useEffect, useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import {
//   getNotifications as fetchNotifications,
//   type Notification as NotificationType,
// } from "../apis/notificationsApi";
// import { getUserById } from "../apis/usersApi";
// import { getChallenge } from "../apis/challengesApi";
// import { getCommentById } from "../apis/commentsApi";
// import Avatar from "../components/common/Avatar";
// import { Bell, MessageSquare, Heart, Star, UserPlus } from "lucide-react";
// import clsx from "clsx";
// import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";

// // --- Types ---
// interface Notification extends NotificationType {
//   $id?: string;
//   id?: string;
//   actorId: string;
//   targetId: string;
//   targetType: "challenge" | "comment" | string;
//   type: "reply" | "like" | "new_submission" | "follow" | string;
//   read: boolean;
//   createdAt?: string;
//   $createdAt?: string;
//   actor?: any;
//   challengeTitle?: string;
//   commentPreview?: string;
// }

// // --- Helpers ---
// const getCreatedAt = (n: Notification) =>
//   n.$createdAt || n.createdAt || new Date().toISOString();

// const timeAgo = (iso: string): string => {
//   const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
//   if (diff < 60) return `${diff}s`;
//   if (diff < 3600) return `${Math.floor(diff / 60)}m`;
//   if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
//   return `${Math.floor(diff / 86400)}d`;
// };

// const icons: Record<string, JSX.Element> = {
//   reply: <MessageSquare size={18} className="text-blue-400" />,
//   like: <Heart size={18} className="text-pink-500" />,
//   new_submission: <Star size={18} className="text-yellow-400" />,
//   follow: <UserPlus size={18} className="text-green-400" />,
//   default: <Bell size={18} className="text-zinc-400" />,
// };

// const getIconForType = (type: string) => icons[type] || icons.default;

// // --- Notification Item ---
// const NotificationItem: React.FC<{ notification: Notification }> = ({
//   notification,
// }) => {
//   const actorName = notification.actor?.username || "Someone";
//   const icon = getIconForType(notification.type);
//   const createdIso = getCreatedAt(notification);

//   const message = (() => {
//     switch (notification.type) {
//       case "like":
//         return (
//           <>
//             {icon} {actorName} liked your comment{" "}
//             {notification.commentPreview && `“${notification.commentPreview}”`}{" "}
//             {notification.challengeTitle &&
//               `on "${notification.challengeTitle}"`}
//           </>
//         );
//       case "reply":
//         return (
//           <>
//             {icon} {actorName} replied{" "}
//             {notification.commentPreview && `“${notification.commentPreview}”`}{" "}
//             {notification.challengeTitle &&
//               `on "${notification.challengeTitle}"`}
//           </>
//         );
//       case "new_submission":
//         return (
//           <>
//             {icon} {actorName} submitted a new artwork{" "}
//             {notification.challengeTitle &&
//               `to "${notification.challengeTitle}"`}
//           </>
//         );
//       case "follow":
//         return (
//           <>
//             {icon} {actorName} started following you
//           </>
//         );
//       default:
//         return (
//           <>
//             {icon} {actorName} did something
//           </>
//         );
//     }
//   })();

//   return (
//     <div
//       className={clsx(
//         "flex items-start gap-3 rounded-xl border border-zinc-800 p-3 text-sm",
//         notification.read
//           ? "bg-zinc-900/40 opacity-70"
//           : "bg-zinc-900/80 hover:bg-zinc-800/80"
//       )}
//     >
//       <div className="flex-shrink-0 h-9 w-9 rounded-full bg-zinc-800 overflow-hidden flex items-center justify-center">
//         {notification.actor ? (
//           <Avatar name={actorName} size={36} />
//         ) : (
//           <div className="p-1">{getIconForType(notification.type)}</div>
//         )}
//       </div>
//       <div className="flex-1 min-w-0">
//         <p className="text-zinc-200 leading-snug break-words">{message}</p>
//         <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 mt-1">
//           <span>{timeAgo(createdIso)}</span>
//           {notification.challengeTitle && (
//             <span>• {notification.challengeTitle}</span>
//           )}
//           {!notification.read && (
//             <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- Skeleton Item ---
// const NotificationSkeleton = () => (
//   <div className="flex items-center gap-3 rounded-xl border border-zinc-800 p-3 bg-zinc-900/40">
//     <Skeleton circle width={36} height={36} />
//     <div className="flex-1">
//       <Skeleton width="90%" height={14} />
//       <Skeleton width="60%" height={12} style={{ marginTop: 6 }} />
//     </div>
//   </div>
// );

// // --- Main List ---
// const NotificationsList: React.FC = () => {
//   const { data: rawNotifications = [], isLoading } = useQuery({
//     queryKey: ["notifications"],
//     queryFn: fetchNotifications,
//   });

//   const [hydrated, setHydrated] = useState<Notification[]>([]);
//   const [hydrating, setHydrating] = useState(true);

//   useEffect(() => {
//     const hydrate = async () => {
//       if (!rawNotifications.length) {
//         setHydrated([]);
//         setHydrating(false);
//         return;
//       }

//       setHydrating(true);

//       // --- Fetch related data ---
//       const actorIds = [...new Set(rawNotifications.map((n) => n.actorId))];
//       const users = await Promise.all(
//         actorIds.map((id) => getUserById(id).catch(() => null))
//       );
//       const userMap = Object.fromEntries(
//         users.filter(Boolean).map((u) => [u.$id || u.id, u])
//       );

//       const challengeIds: string[] = [];
//       const commentIds: string[] = [];

//       rawNotifications.forEach((n) => {
//         if (n.targetType === "challenge") challengeIds.push(n.targetId);
//         if (n.targetType === "comment") commentIds.push(n.targetId);
//       });

//       const challenges = await Promise.all(
//         challengeIds.map((id) => getChallenge(id).catch(() => null))
//       );
//       const challengeMap = Object.fromEntries(
//         challenges.filter(Boolean).map((c) => [c.$id || c.id, c])
//       );

//       const comments = await Promise.all(
//         commentIds.map((id) => getCommentById(id).catch(() => null))
//       );
//       const commentMap = Object.fromEntries(
//         comments.filter(Boolean).map((c) => [c.$id || c.id, c])
//       );

//       // --- Merge into notifications ---
//       const enriched = rawNotifications.map((n) => {
//         const actor = userMap[n.actorId];
//         let challengeTitle = "";
//         let commentPreview = "";

//         if (n.targetType === "challenge") {
//           challengeTitle = challengeMap[n.targetId]?.title || "";
//         } else if (n.targetType === "comment") {
//           const comment = commentMap[n.targetId];
//           commentPreview = comment?.text || "";
//           if (comment?.challengeId) {
//             challengeTitle = challengeMap[comment.challengeId]?.title || "";
//           }
//         }

//         return { ...n, actor, challengeTitle, commentPreview };
//       });

//       setHydrated(enriched);
//       setHydrating(false);
//     };

//     hydrate();
//   }, [rawNotifications]);

//   return (
//     <div className="max-w-2xl mx-auto w-full px-3 sm:px-6 py-4">
//       {/* Header */}
//       <div className="flex items-center gap-2 mb-4">
//         <Bell className="text-blue-400" size={22} />
//         <h1 className="text-lg font-semibold text-zinc-200">Notifications</h1>
//       </div>

//       {/* Content */}
//       {isLoading || hydrating ? (
//         <SkeletonTheme baseColor="#202020" highlightColor="#444">
//           <div className="space-y-3">
//             {Array.from({ length: 5 }).map((_, i) => (
//               <NotificationSkeleton key={i} />
//             ))}
//           </div>
//         </SkeletonTheme>
//       ) : (
//         <div className="space-y-3">
//           {hydrated.length ? (
//             hydrated.map((n, idx) => (
//               <NotificationItem key={n.$id ?? n.id ?? idx} notification={n} />
//             ))
//           ) : (
//             <p className="text-sm text-zinc-500 text-center">
//               No notifications found.
//             </p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };



// // export default NotificationsList;

// import React, { useEffect, useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import {
//   getNotifications as fetchNotifications,
//   type Notification as NotificationType,
//   createNotification,
// } from "../apis/notificationsApi";
// import { getUserById } from "../apis/usersApi";
// import { getChallenge } from "../apis/challengesApi";
// import { getCommentById, createComment } from "../apis/commentsApi";
// import Avatar from "../components/common/Avatar";
// import LikeButton from "../components/features/LikeButton";
// import Input from "../components/common/Input";
// import { Bell, MessageSquare, Heart, Star, UserPlus, Send } from "lucide-react";
// import clsx from "clsx";
// import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";

// // --- Types ---
// interface Notification extends NotificationType {
//   $id?: string;
//   id?: string;
//   actorId: string;
//   targetId: string;
//   targetType: "challenge" | "comment" | string;
//   type: "reply" | "like" | "new_submission" | "follow" | string;
//   read: boolean;
//   createdAt?: string;
//   $createdAt?: string;
//   actor?: any;
//   challengeTitle?: string;
//   commentPreview?: string;
// }

// // --- Helpers ---
// const getCreatedAt = (n: Notification) =>
//   n.$createdAt || n.createdAt || new Date().toISOString();

// const timeAgo = (iso: string): string => {
//   const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
//   if (diff < 60) return `${diff}s`;
//   if (diff < 3600) return `${Math.floor(diff / 60)}m`;
//   if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
//   return `${Math.floor(diff / 86400)}d`;
// };

// const icons: Record<string, JSX.Element> = {
//   reply: <MessageSquare size={18} className="text-blue-400" />,
//   like: <Heart size={18} className="text-pink-500" />,
//   new_submission: <Star size={18} className="text-yellow-400" />,
//   follow: <UserPlus size={18} className="text-green-400" />,
//   default: <Bell size={18} className="text-zinc-400" />,
// };

// const getIconForType = (type: string) => icons[type] || icons.default;

// // --- Notification Item ---
// const NotificationItem: React.FC<{ notification: Notification }> = ({
//   notification,
// }) => {
//   const queryClient = useQueryClient();
//   const [showReplyBox, setShowReplyBox] = useState(false);
//   const [replyText, setReplyText] = useState("");

//   const actorName = notification.actor?.username || "Someone";
//   const icon = getIconForType(notification.type);
//   const createdIso = getCreatedAt(notification);

//   const replyMutation = useMutation({
//     mutationFn: (formData: FormData) => createComment(formData),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["comments", notification.targetId] });
//       queryClient.invalidateQueries({ queryKey: ["notifications"] });
//       setReplyText("");
//       setShowReplyBox(false);
//     },
//   });

//   const handleReplySubmit = () => {
//     if (!replyText.trim()) return;

//     const formData = new FormData();
//     formData.append("challengeId", notification.challengeId || "");
//     formData.append("text", replyText);
//     formData.append("parentCommentId", notification.targetId);

//     replyMutation.mutate(formData);
//   };

//   const message = (() => {
//     switch (notification.type) {
//       case "like":
//         return (
//           <>
//             {icon} {actorName} liked your comment{" "}
//             {notification.commentPreview && `“${notification.commentPreview}”`}{" "}
//             {notification.challengeTitle &&
//               `on "${notification.challengeTitle}"`}
//           </>
//         );
//       case "reply":
//         return (
//           <>
//             {icon} {actorName} replied{" "}
//             {notification.commentPreview && `“${notification.commentPreview}”`}{" "}
//             {notification.challengeTitle &&
//               `on "${notification.challengeTitle}"`}
//           </>
//         );
//       case "new_submission":
//         return (
//           <>
//             {icon} {actorName} submitted a new artwork{" "}
//             {notification.challengeTitle &&
//               `to "${notification.challengeTitle}"`}
//           </>
//         );
//       case "follow":
//         return (
//           <>
//             {icon} {actorName} started following you
//           </>
//         );
//       default:
//         return (
//           <>
//             {icon} {actorName} did something
//           </>
//         );
//     }
//   })();

//   return (
//     <div
//       className={clsx(
//         "flex flex-col items-start gap-3 rounded-xl border border-zinc-800 p-3 text-sm",
//         notification.read
//           ? "bg-zinc-900/40 opacity-70"
//           : "bg-zinc-900/80 hover:bg-zinc-800/80"
//       )}
//     >
//       <div className="flex items-start gap-3 w-full">
//         <div className="flex-shrink-0 h-9 w-9 rounded-full bg-zinc-800 overflow-hidden flex items-center justify-center">
//           {notification.actor ? (
//             <Avatar name={actorName} size={36} />
//           ) : (
//             <div className="p-1">{getIconForType(notification.type)}</div>
//           )}
//         </div>
//         <div className="flex-1 min-w-0">
//           <p className="text-zinc-200 leading-snug break-words">{message}</p>
//           <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 mt-1">
//             <span>{timeAgo(createdIso)}</span>
//             {notification.challengeTitle && (
//               <span>• {notification.challengeTitle}</span>
//             )}
//             {!notification.read && (
//               <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Action Buttons and Reply Input */}
//       {(notification.type === "like" || notification.type === "reply") && (
//         <div className="flex items-center gap-3 w-full pl-12">
//           {notification.type === "like" && (
//             <LikeButton targetId={notification.targetId} targetType="comment" />
//           )}
//           {notification.type === "reply" && (
//             <button
//               onClick={() => setShowReplyBox((s) => !s)}
//               className="p-1 rounded hover:bg-zinc-800 transition-colors"
//               aria-label="Reply"
//             >
//               <MessageSquare size={14} className="text-zinc-400 hover:text-white" />
//             </button>
//           )}
//         </div>
//       )}

//       {showReplyBox && notification.type === "reply" && (
//         <div className="w-full pl-12 mt-2 space-y-2">
//           <div className="flex items-center gap-2 flex-nowrap">
//             <Input
//               value={replyText}
//               onChange={(e) => setReplyText(e.target.value)}
//               placeholder="Write a reply..."
//               isComment={true}
//               className="flex-1 min-w-0"
//             />
//             <button
//               type="button"
//               onClick={handleReplySubmit}
//               disabled={replyMutation.isPending}
//               className="p-2 rounded bg-blue-500 hover:bg-blue-600 text-white flex-shrink-0"
//               aria-label="Send reply"
//             >
//               {replyMutation.isPending ? (
//                 <span className="text-xs">...</span>
//               ) : (
//                 <Send size={16} />
//               )}
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // --- Skeleton Item ---
// const NotificationSkeleton = () => (
//   <div className="flex items-center gap-3 rounded-xl border border-zinc-800 p-3 bg-zinc-900/40">
//     <Skeleton circle width={36} height={36} />
//     <div className="flex-1">
//       <Skeleton width="90%" height={14} />
//       <Skeleton width="60%" height={12} style={{ marginTop: 6 }} />
//     </div>
//   </div>
// );

// // --- Main List ---
// const NotificationsList: React.FC = () => {
//   const { data: rawNotifications = [], isLoading } = useQuery({
//     queryKey: ["notifications"],
//     queryFn: fetchNotifications,
//   });

//   const [hydrated, setHydrated] = useState<Notification[]>([]);
//   const [hydrating, setHydrating] = useState(true);

//   useEffect(() => {
//     const hydrate = async () => {
//       if (!rawNotifications.length) {
//         setHydrated([]);
//         setHydrating(false);
//         return;
//       }

//       setHydrating(true);

//       // --- Fetch related data ---
//       const actorIds = [...new Set(rawNotifications.map((n) => n.actorId))];
//       const users = await Promise.all(
//         actorIds.map((id) => getUserById(id).catch(() => null))
//       );
//       const userMap = Object.fromEntries(
//         users.filter(Boolean).map((u) => [u.$id || u.id, u])
//       );

//       const challengeIds: string[] = [];
//       const commentIds: string[] = [];

//       rawNotifications.forEach((n) => {
//         if (n.targetType === "challenge") challengeIds.push(n.targetId);
//         if (n.targetType === "comment") commentIds.push(n.targetId);
//       });

//       const challenges = await Promise.all(
//         challengeIds.map((id) => getChallenge(id).catch(() => null))
//       );
//       const challengeMap = Object.fromEntries(
//         challenges.filter(Boolean).map((c) => [c.$id || c.id, c])
//       );

//       const comments = await Promise.all(
//         commentIds.map((id) => getCommentById(id).catch(() => null))
//       );
//       const commentMap = Object.fromEntries(
//         comments.filter(Boolean).map((c) => [c.$id || c.id, c])
//       );

//       // --- Merge into notifications ---
//       const enriched = rawNotifications.map((n) => {
//         const actor = userMap[n.actorId];
//         let challengeTitle = "";
//         let commentPreview = "";
//         let challengeId = "";

//         if (n.targetType === "challenge") {
//           challengeTitle = challengeMap[n.targetId]?.title || "";
//         } else if (n.targetType === "comment") {
//           const comment = commentMap[n.targetId];
//           commentPreview = comment?.text || "";
//           if (comment?.challengeId) {
//             challengeTitle = challengeMap[comment.challengeId]?.title || "";
//             challengeId = comment.challengeId;
//           }
//         }

//         return { ...n, actor, challengeTitle, commentPreview, challengeId };
//       });

//       setHydrated(enriched);
//       setHydrating(false);
//     };

//     hydrate();
//   }, [rawNotifications]);

//   return (
//     <div className="max-w-2xl mx-auto w-full px-3 sm:px-6 py-4">
//       {/* Header */}
//       <div className="flex items-center gap-2 mb-4">
//         <Bell className="text-blue-400" size={22} />
//         <h1 className="text-lg font-semibold text-zinc-200">Notifications</h1>
//       </div>

//       {/* Content */}
//       {isLoading || hydrating ? (
//         <SkeletonTheme baseColor="#202020" highlightColor="#444">
//           <div className="space-y-3">
//             {Array.from({ length: 5 }).map((_, i) => (
//               <NotificationSkeleton key={i} />
//             ))}
//           </div>
//         </SkeletonTheme>
//       ) : (
//         <div className="space-y-3">
//           {hydrated.length ? (
//             hydrated.map((n, idx) => (
//               <NotificationItem key={n.$id ?? n.id ?? idx} notification={n} />
//             ))
//           ) : (
//             <p className="text-sm text-zinc-500 text-center">
//               No notifications found.
//             </p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationsList;


// import React, { useEffect, useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import {
//   getNotifications as fetchNotifications,
//   type Notification as NotificationType,
//   createNotification,
// } from "../apis/notificationsApi";
// import { getUserById } from "../apis/usersApi";
// import { getChallenge } from "../apis/challengesApi";
// import { getCommentById, createComment } from "../apis/commentsApi";
// import Avatar from "../components/common/Avatar";
// import LikeButton from "../components/features/LikeButton";
// import Input from "../components/common/Input";
// import { Bell, Heart, Star, UserPlus, Send, Reply } from "lucide-react";
// import clsx from "clsx";
// import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";

// // --- Types ---
// interface Notification extends NotificationType {
//   $id?: string;
//   id?: string;
//   actorId: string;
//   targetId: string;
//   targetType: "challenge" | "comment" | string;
//   type: "reply" | "like" | "new_submission" | "follow" | string;
//   read: boolean;
//   createdAt?: string;
//   $createdAt?: string;
//   actor?: any;
//   challengeTitle?: string;
//   commentPreview?: string;
//   challengeId?: string;
// }

// // --- Helpers ---
// const getCreatedAt = (n: Notification) =>
//   n.$createdAt || n.createdAt || new Date().toISOString();

// const timeAgo = (iso: string): string => {
//   const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
//   if (diff < 60) return `${diff}s`;
//   if (diff < 3600) return `${Math.floor(diff / 60)}m`;
//   if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
//   return `${Math.floor(diff / 86400)}d`;
// };

// // --- Notification Item ---
// const NotificationItem: React.FC<{ notification: Notification }> = ({
//   notification,
// }) => {
//   const queryClient = useQueryClient();
//   const [showReplyBox, setShowReplyBox] = useState(false);
//   const [replyText, setReplyText] = useState("");

//   const actorName = notification.actor?.username || "Someone";
//   const createdIso = getCreatedAt(notification);

//   const replyMutation = useMutation({
//     mutationFn: (formData: FormData) => createComment(formData),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["comments", notification.targetId] });
//       queryClient.invalidateQueries({ queryKey: ["notifications"] });
//       setReplyText("");
//       setShowReplyBox(false);
//     },
//   });

//   const handleReplySubmit = () => {
//     if (!replyText.trim()) return;

//     const formData = new FormData();
//     formData.append("challengeId", notification.challengeId || "");
//     formData.append("text", replyText);
//     formData.append("parentCommentId", notification.targetId);

//     replyMutation.mutate(formData);
//   };

//   const message = (() => {
//     switch (notification.type) {
//       case "like":
//         return (
//           <>
//             {actorName} liked your comment{" "}
//             {notification.commentPreview && `“${notification.commentPreview}”`}{" "}
//             {notification.challengeTitle &&
//               `on "${notification.challengeTitle}"`}
//           </>
//         );
//       case "reply":
//         return (
//           <>
//             {actorName} replied{" "}
//             {notification.commentPreview && `“${notification.commentPreview}”`}{" "}
//             {notification.challengeTitle &&
//               `on "${notification.challengeTitle}"`}
//           </>
//         );
//       case "new_submission":
//         return (
//           <>
//             {actorName} submitted a new artwork{" "}
//             {notification.challengeTitle &&
//               `to "${notification.challengeTitle}"`}
//           </>
//         );
//       case "follow":
//         return <>{actorName} started following you</>;
//       default:
//         return <>{actorName} did something</>;
//     }
//   })();

//   return (
//     <div
//       className={clsx(
//         "flex flex-col items-start gap-3 rounded-xl border border-zinc-800 p-3 text-sm",
//         notification.read
//           ? "bg-zinc-900/40 opacity-70"
//           : "bg-zinc-900/80 hover:bg-zinc-800/80"
//       )}
//     >
//       <div className="flex items-start gap-3 w-full">
//         <div className="flex-shrink-0 h-9 w-9 rounded-full bg-zinc-800 overflow-hidden flex items-center justify-center">
//           {notification.actor ? (
//             <Avatar name={actorName} size={36} />
//           ) : (
//             <div className="p-1">
//               <Bell className="text-zinc-400" size={18} />
//             </div>
//           )}
//         </div>

//         <div className="flex-1 min-w-0 flex items-center justify-between">
//           <div>
//             <p className="text-zinc-200 leading-snug break-words">{message}</p>
//             <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 mt-1">
//               <span>{timeAgo(createdIso)}</span>
//               {notification.challengeTitle && (
//                 <span>• {notification.challengeTitle}</span>
//               )}
//               {!notification.read && (
//                 <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
//               )}
//             </div>
//           </div>

//           {/* Actions aligned to the right */}
//           {(notification.type === "like" || notification.type === "reply") && (
//             <div className="flex items-center gap-2 ml-3">
//               {notification.type === "like" && (
//                 <LikeButton targetId={notification.targetId} targetType="comment" />
//               )}
//               {notification.type === "reply" && (
//                 <button
//                   onClick={() => setShowReplyBox((s) => !s)}
//                   className="flex items-center gap-1 text-zinc-400 hover:text-white text-xs"
//                 >
//                   <Reply size={14} />
//                   <span>Reply</span>
//                 </button>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Reply Input */}
//       {showReplyBox && notification.type === "reply" && (
//         <div className="w-full pl-12 mt-2 space-y-2">
//           <div className="flex items-center gap-2 flex-nowrap">
//             <Input
//               value={replyText}
//               onChange={(e) => setReplyText(e.target.value)}
//               placeholder="Write a reply..."
//               isComment={true}
//               className="flex-1 min-w-0"
//             />
//             <button
//               type="button"
//               onClick={handleReplySubmit}
//               disabled={replyMutation.isPending}
//               className="p-2 rounded bg-blue-500 hover:bg-blue-600 text-white flex-shrink-0"
//               aria-label="Send reply"
//             >
//               {replyMutation.isPending ? (
//                 <span className="text-xs">...</span>
//               ) : (
//                 <Send size={16} />
//               )}
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // --- Skeleton Item ---
// const NotificationSkeleton = () => (
//   <div className="flex items-center gap-3 rounded-xl border border-zinc-800 p-3 bg-zinc-900/40">
//     <Skeleton circle width={36} height={36} />
//     <div className="flex-1">
//       <Skeleton width="90%" height={14} />
//       <Skeleton width="60%" height={12} style={{ marginTop: 6 }} />
//     </div>
//   </div>
// );

// // --- Main List ---
// const NotificationsList: React.FC = () => {
//   const { data: rawNotifications = [], isLoading } = useQuery({
//     queryKey: ["notifications"],
//     queryFn: fetchNotifications,
//   });

//   const [hydrated, setHydrated] = useState<Notification[]>([]);
//   const [hydrating, setHydrating] = useState(true);

//   useEffect(() => {
//     const hydrate = async () => {
//       if (!rawNotifications.length) {
//         setHydrated([]);
//         setHydrating(false);
//         return;
//       }

//       setHydrating(true);

//       const actorIds = [...new Set(rawNotifications.map((n) => n.actorId))];
//       const users = await Promise.all(
//         actorIds.map((id) => getUserById(id).catch(() => null))
//       );
//       const userMap = Object.fromEntries(
//         users.filter(Boolean).map((u) => [u.$id || u.id, u])
//       );

//       const challengeIds: string[] = [];
//       const commentIds: string[] = [];

//       rawNotifications.forEach((n) => {
//         if (n.targetType === "challenge") challengeIds.push(n.targetId);
//         if (n.targetType === "comment") commentIds.push(n.targetId);
//       });

//       const challenges = await Promise.all(
//         challengeIds.map((id) => getChallenge(id).catch(() => null))
//       );
//       const challengeMap = Object.fromEntries(
//         challenges.filter(Boolean).map((c) => [c.$id || c.id, c])
//       );

//       const comments = await Promise.all(
//         commentIds.map((id) => getCommentById(id).catch(() => null))
//       );
//       const commentMap = Object.fromEntries(
//         comments.filter(Boolean).map((c) => [c.$id || c.id, c])
//       );

//       const enriched = rawNotifications.map((n) => {
//         const actor = userMap[n.actorId];
//         let challengeTitle = "";
//         let commentPreview = "";
//         let challengeId = "";

//         if (n.targetType === "challenge") {
//           challengeTitle = challengeMap[n.targetId]?.title || "";
//         } else if (n.targetType === "comment") {
//           const comment = commentMap[n.targetId];
//           commentPreview = comment?.text || "";
//           if (comment?.challengeId) {
//             challengeTitle = challengeMap[comment.challengeId]?.title || "";
//             challengeId = comment.challengeId;
//           }
//         }

//         return { ...n, actor, challengeTitle, commentPreview, challengeId };
//       });

//       setHydrated(enriched);
//       setHydrating(false);
//     };

//     hydrate();
//   }, [rawNotifications]);

//   return (
//     <div className="max-w-2xl mx-auto w-full px-3 sm:px-6 py-4">
//       <div className="flex items-center gap-2 mb-4">
//         <Bell className="text-blue-400" size={22} />
//         <h1 className="text-lg font-semibold text-zinc-200">Notifications</h1>
//       </div>

//       {isLoading || hydrating ? (
//         <SkeletonTheme baseColor="#202020" highlightColor="#444">
//           <div className="space-y-3">
//             {Array.from({ length: 5 }).map((_, i) => (
//               <NotificationSkeleton key={i} />
//             ))}
//           </div>
//         </SkeletonTheme>
//       ) : (
//         <div className="space-y-3">
//           {hydrated.length ? (
//             hydrated.map((n, idx) => (
//               <NotificationItem key={n.$id ?? n.id ?? idx} notification={n} />
//             ))
//           ) : (
//             <p className="text-sm text-zinc-500 text-center">
//               No notifications found.
//             </p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationsList;
import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications as fetchNotifications,
  type Notification as NotificationType,
  createNotification,
} from "../apis/notificationsApi";
import { getUserById } from "../apis/usersApi";
import { getChallenge } from "../apis/challengesApi";
import { getCommentById, createComment } from "../apis/commentsApi";
import Avatar from "../components/common/Avatar";
import LikeButton from "../components/features/LikeButton";
import Input from "../components/common/Input";
import { Bell, Heart, Star, UserPlus, Send, Reply } from "lucide-react";
import clsx from "clsx";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useAuth } from "../hooks/useAuth";

// --- Types ---
interface Notification extends NotificationType {
  $id?: string;
  id?: string;
  actorId: string;
  targetId: string;
  targetType: "challenge" | "comment" | string;
  type: "reply" | "like" | "new_submission" | "follow" | string;
  read: boolean;
  createdAt?: string;
  $createdAt?: string;
  actor?: any;
  challengeTitle?: string;
  commentPreview?: string;
  challengeId?: string;
}

// --- Helpers ---
const getCreatedAt = (n: Notification) =>
  n.$createdAt || n.createdAt || new Date().toISOString();

const timeAgo = (iso: string): string => {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
};

// --- Notification Item ---
const NotificationItem: React.FC<{ notification: Notification }> = ({
  notification,
}) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [newReply, setNewReply] = useState<any>(null);

  const actorName = notification.actor?.username || "Someone";
  const createdIso = getCreatedAt(notification);

  const replyMutation = useMutation({
    mutationFn: (formData: FormData) => createComment(formData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["comments", notification.targetId] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      // Store the new reply to display it immediately
      setNewReply({
        id: data.id,
        text: replyText,
        userId: user?.id,
        username: user?.username,
        challengeId: notification.challengeId,
        parentCommentId: notification.targetId,
        createdAt: new Date().toISOString(),
      });
      setReplyText("");
      setShowReplyBox(false);
    },
  });

  const handleReplySubmit = () => {
    if (!replyText.trim()) return;

    const formData = new FormData();
    formData.append("challengeId", notification.challengeId || "");
    formData.append("text", replyText);
    formData.append("parentCommentId", notification.targetId);

    replyMutation.mutate(formData);
  };

  const message = (() => {
    switch (notification.type) {
      case "like":
        return (
          <>
            {actorName} liked your comment{" "}
            {notification.commentPreview && `“${notification.commentPreview}”`}{" "}
            {notification.challengeTitle &&
              `on "${notification.challengeTitle}"`}
          </>
        );
      case "reply":
        return (
          <>
            {actorName} replied{" "}
            {notification.commentPreview && `“${notification.commentPreview}”`}{" "}
            {notification.challengeTitle &&
              `on "${notification.challengeTitle}"`}
          </>
        );
      case "new_submission":
        return (
          <>
            {actorName} submitted a new artwork{" "}
            {notification.challengeTitle &&
              `to "${notification.challengeTitle}"`}
          </>
        );
      case "follow":
        return <>{actorName} started following you</>;
      default:
        return <>{actorName} did something</>;
    }
  })();

  return (
    <div
      className={clsx(
        "flex flex-col items-start gap-3 rounded-xl border border-zinc-800 p-3 text-sm",
        notification.read
          ? "bg-zinc-900/40 opacity-70"
          : "bg-zinc-900/80 hover:bg-zinc-800/80"
      )}
    >
      <div className="flex items-start gap-3 w-full">
        <div className="flex-shrink-0 h-9 w-9 rounded-full bg-zinc-800 overflow-hidden flex items-center justify-center">
          {notification.actor ? (
            <Avatar name={actorName} size={36} />
          ) : (
            <div className="p-1">
              <Bell className="text-zinc-400" size={18} />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 flex items-center justify-between">
          <div>
            <p className="text-zinc-200 leading-snug break-words">{message}</p>
            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 mt-1">
              <span>{timeAgo(createdIso)}</span>
              {notification.challengeTitle && (
                <span>• {notification.challengeTitle}</span>
              )}
              {!notification.read && (
                <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
              )}
            </div>
          </div>

          {/* Actions aligned to the right */}
          {(notification.type === "like" || notification.type === "reply") && (
            <div className="flex items-center gap-2 ml-3">
              {notification.type === "like" && (
                <LikeButton targetId={notification.targetId} targetType="comment" />
              )}
              {notification.type === "reply" && (
                <button
                  onClick={() => setShowReplyBox((s) => !s)}
                  className="flex items-center gap-1 text-zinc-400 hover:text-white text-xs"
                >
                  <Reply size={14} />
                  <span>Reply</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Reply Input */}
      {showReplyBox && notification.type === "reply" && (
        <div className="w-full pl-12 mt-2 space-y-2">
          <div className="flex items-center gap-2 flex-nowrap">
            <Input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              isComment={true}
              className="flex-1 min-w-0"
            />
            <button
              type="button"
              onClick={handleReplySubmit}
              disabled={replyMutation.isPending}
              className="p-2 rounded bg-blue-500 hover:bg-blue-600 text-white flex-shrink-0"
              aria-label="Send reply"
            >
              {replyMutation.isPending ? (
                <span className="text-xs">...</span>
              ) : (
                <Send size={16} />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Display New Reply with Arrow-Down Design */}
      {newReply && notification.type === "reply" && newReply.parentCommentId === notification.targetId && (
        <div className="w-full mt-2 pl-12 border-l border-zinc-800 ml-2">
          <div className="flex items-start gap-2 p-2 rounded-lg bg-zinc-900/40 border border-zinc-800">
            <Avatar
              name={newReply.username || "You"}
              size={28}
              className="flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-zinc-400">
                {newReply.username || "You"}
              </p>
              <p className="text-sm leading-snug text-zinc-200">
                {newReply.text}
              </p>
              <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                <span>{timeAgo(newReply.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Skeleton Item ---
const NotificationSkeleton = () => (
  <div className="flex items-center gap-3 rounded-xl border border-zinc-800 p-3 bg-zinc-900/40">
    <Skeleton circle width={36} height={36} />
    <div className="flex-1">
      <Skeleton width="90%" height={14} />
      <Skeleton width="60%" height={12} style={{ marginTop: 6 }} />
    </div>
  </div>
);

// --- Main List ---
const NotificationsList: React.FC = () => {
  const { data: rawNotifications = [], isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
  });

  const [hydrated, setHydrated] = useState<Notification[]>([]);
  const [hydrating, setHydrating] = useState(true);

  useEffect(() => {
    const hydrate = async () => {
      if (!rawNotifications.length) {
        setHydrated([]);
        setHydrating(false);
        return;
      }

      setHydrating(true);

      const actorIds = [...new Set(rawNotifications.map((n) => n.actorId))];
      const users = await Promise.all(
        actorIds.map((id) => getUserById(id).catch(() => null))
      );
      const userMap = Object.fromEntries(
        users.filter(Boolean).map((u) => [u.$id || u.id, u])
      );

      const challengeIds: string[] = [];
      const commentIds: string[] = [];

      rawNotifications.forEach((n) => {
        if (n.targetType === "challenge") challengeIds.push(n.targetId);
        if (n.targetType === "comment") commentIds.push(n.targetId);
      });

      const challenges = await Promise.all(
        challengeIds.map((id) => getChallenge(id).catch(() => null))
      );
      const challengeMap = Object.fromEntries(
        challenges.filter(Boolean).map((c) => [c.$id || c.id, c])
      );

      const comments = await Promise.all(
        commentIds.map((id) => getCommentById(id).catch(() => null))
      );
      const commentMap = Object.fromEntries(
        comments.filter(Boolean).map((c) => [c.$id || c.id, c])
      );

      const enriched = rawNotifications.map((n) => {
        const actor = userMap[n.actorId];
        let challengeTitle = "";
        let commentPreview = "";
        let challengeId = "";

        if (n.targetType === "challenge") {
          challengeTitle = challengeMap[n.targetId]?.title || "";
        } else if (n.targetType === "comment") {
          const comment = commentMap[n.targetId];
          commentPreview = comment?.text || "";
          if (comment?.challengeId) {
            challengeTitle = challengeMap[comment.challengeId]?.title || "";
            challengeId = comment.challengeId;
          }
        }

        return { ...n, actor, challengeTitle, commentPreview, challengeId };
      });

      setHydrated(enriched);
      setHydrating(false);
    };

    hydrate();
  }, [rawNotifications]);

  return (
    <div className="max-w-2xl mx-auto w-full px-3 sm:px-6 py-4">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="text-blue-400" size={22} />
        <h1 className="text-lg font-semibold text-zinc-200">Notifications</h1>
      </div>

      {isLoading || hydrating ? (
        <SkeletonTheme baseColor="#202020" highlightColor="#444">
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <NotificationSkeleton key={i} />
            ))}
          </div>
        </SkeletonTheme>
      ) : (
        <div className="space-y-3">
          {hydrated.length ? (
            hydrated.map((n, idx) => (
              <NotificationItem key={n.$id ?? n.id ?? idx} notification={n} />
            ))
          ) : (
            <p className="text-sm text-zinc-500 text-center">
              No notifications found.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsList;