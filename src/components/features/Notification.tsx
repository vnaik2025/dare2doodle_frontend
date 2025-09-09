import React, { useEffect, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getNotifications as fetchNotifications,
  updateNotification as markNotificationRead,
} from '../../apis/notificationsApi';
import { getUserById } from '../../apis/usersApi';
import { getChallenge } from '../../apis/challengesApi';
import { getCommentById } from '../../apis/commentsApi';
import type { Notification as NotificationType } from '../../apis/notificationsApi';
import Avatar from '../common/Avatar';
import {
  Bell,
  MessageSquare,
  Heart,
  Star,
  CheckCircle2,
  UserPlus,
} from 'lucide-react';
import clsx from 'clsx';

// --- Helpers ---
const getCreatedAt = (n: any): string | null => n.createdAt || n.$createdAt || null;

const formatGroupKey = (iso: string) => {
  const d = new Date(iso);
  const today = new Date();
  const diff = +truncateToDay(today) - +truncateToDay(d);
  if (diff === 0) return 'Today';
  if (diff === 24 * 3600 * 1000) return 'Yesterday';
  return d.toLocaleDateString();
};

function truncateToDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

const timeAgo = (iso: string) => {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
};

const getIconForType = (type: string) => {
  switch (type) {
    case 'reply': return <MessageSquare size={18} className="text-blue-400" />;
    case 'like': return <Heart size={18} className="text-pink-500" />;
    case 'new_submission': return <Star size={18} className="text-yellow-400" />;
    case 'follow': return <UserPlus size={18} className="text-green-400" />;
    default: return <Bell size={18} className="text-zinc-400" />;
  }
};

// --- Notification item ---
const NotificationItem: React.FC<{
  notification: NotificationType;
  userCache: Map<string, any>;
  challengeCache: Map<string, any>;
  commentCache: Map<string, any>;
  setUserCache: (fn: (prev: Map<string, any>) => Map<string, any>) => void;
  setChallengeCache: (fn: (prev: Map<string, any>) => Map<string, any>) => void;
  setCommentCache: (fn: (prev: Map<string, any>) => Map<string, any>) => void;
}> = ({
  notification,
  userCache,
  challengeCache,
  commentCache,
  setUserCache,
  setChallengeCache,
  setCommentCache,
}) => {
  const queryClient = useQueryClient();
  const [actor, setActor] = useState<any | null>(null);
  const [challengeTitle, setChallengeTitle] = useState('');
  const [commentPreview, setCommentPreview] = useState('');
  const notifId = (notification as any).id || (notification as any).$id;

  const mutation = useMutation({
    mutationFn: async () => markNotificationRead(notifId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        // --- actor ---
        const actorId = (notification as any).actorId;
        if (actorId) {
          const cached = userCache.get(actorId);
          if (cached) {
            if (mounted) setActor(cached);
          } else {
            const u = await getUserById(actorId).catch(() => null);
            if (u && mounted) {
              setActor(u);
              setUserCache(prev => new Map(prev).set(actorId, u));
            }
          }
        }

        // --- challenge ---
        if ((notification as any).targetType === 'challenge') {
          const challengeId = (notification as any).targetId;
          if (challengeId) {
            const cachedC = challengeCache.get(challengeId);
            if (cachedC) {
              if (mounted) setChallengeTitle(cachedC.title || '');
            } else {
              const c = await getChallenge(challengeId).catch(() => null);
              if (c && mounted) {
                setChallengeTitle(c.title || '');
                setChallengeCache(prev => new Map(prev).set(challengeId, c));
              }
            }
          }
        }

        // --- comment ---
        if ((notification as any).targetType === 'comment') {
          const commentId = (notification as any).targetId;
          if (commentId) {
            const cachedCm = commentCache.get(commentId);
            if (cachedCm) {
              if (mounted) {
                setCommentPreview((cachedCm.text || '').slice(0, 120));
                if (cachedCm.challengeId) {
                  const cachedC = challengeCache.get(cachedCm.challengeId);
                  if (cachedC) setChallengeTitle(cachedC.title || '');
                  else {
                    const c = await getChallenge(cachedCm.challengeId).catch(() => null);
                    if (c) {
                      setChallengeCache(prev => new Map(prev).set(cachedCm.challengeId, c));
                      if (mounted) setChallengeTitle(c.title || '');
                    }
                  }
                }
              }
            } else {
              const cm = await getCommentById(commentId).catch(() => null);
              if (cm && mounted) {
                setCommentPreview((cm.text || '').slice(0, 120));
                setCommentCache(prev => new Map(prev).set(commentId, cm));
                if (cm.challengeId) {
                  const cachedC = challengeCache.get(cm.challengeId);
                  if (cachedC) setChallengeTitle(cachedC.title || '');
                  else {
                    const c = await getChallenge(cm.challengeId).catch(() => null);
                    if (c) {
                      setChallengeCache(prev => new Map(prev).set(cm.challengeId, c));
                      if (mounted) setChallengeTitle(c.title || '');
                    }
                  }
                }
              }
            }
          }
        }
      } catch (err) {
        console.error('Notification hydration error', err);
      }
    };
    load();
    return () => { mounted = false; };
  }, [notification]);

  const renderMessage = () => {
    const actorName = actor?.username || 'Someone';
    const icon = getIconForType(notification.type);

    switch (notification.type) {
      case 'like':
        return (
          <span className="inline-flex items-center gap-1">
            <span>
              {actorName} liked your comment
              {commentPreview ? ` “${commentPreview}”` : ''}
              {challengeTitle ? ` on "${challengeTitle}"` : ''}
            </span>
          </span>
        );
      case 'reply':
        return (
          <span className="inline-flex items-center gap-1">
            <span>
              {actorName} replied
              {commentPreview ? `: “${commentPreview}”` : ''}
              {challengeTitle ? ` on "${challengeTitle}"` : ''}
            </span>
          </span>
        );
      case 'new_submission':
        return (
          <span className="inline-flex items-center gap-1">
            <span>
              {actorName} submitted a new artwork
              {challengeTitle ? ` to "${challengeTitle}"` : ''}
            </span>
          </span>
        );
      case 'follow':
        return (
          <span className="inline-flex items-center gap-1">
            <span>{actorName} started following you</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1">
            <span>{actorName} did something</span>
          </span>
        );
    }
  };

  const createdIso = getCreatedAt(notification) || new Date().toISOString();

  return (
    <div
      className={clsx(
        'flex items-center justify-between gap-3 rounded-xl border border-zinc-800 p-3 transition-colors text-sm',
        (notification as any).read
          ? 'bg-zinc-900/40 opacity-70'
          : 'bg-zinc-900/80 hover:bg-zinc-800/80'
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800 overflow-hidden">
          {actor ? (
            <Avatar name={actor.username || 'User'} size={36} />
          ) : (
            <div className="p-1">{getIconForType(notification.type)}</div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-zinc-200 truncate leading-tight">{renderMessage()}</p>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span>{timeAgo(createdIso)}</span>
            {challengeTitle ? <span>• {challengeTitle}</span> : null}
            {!((notification as any).read) && <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />}
          </div>
        </div>
      </div>

      {!((notification as any).read) && (
        <button
          onClick={() => mutation.mutate()}
          disabled={mutation.isLoading}
          className="rounded-full p-1 hover:bg-zinc-800"
          aria-label="Mark as read"
        >
        </button>
      )}
    </div>
  );
};

// --- Main List ---
const NotificationsList: React.FC = () => {
  const [userCache] = useState(() => new Map<string, any>());
  const [challengeCache] = useState(() => new Map<string, any>());
  const [commentCache] = useState(() => new Map<string, any>());

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => fetchNotifications(),
  });

  const grouped = useMemo(() => {
    const map = new Map<string, NotificationType[]>();
    for (const n of notifications) {
      const iso = getCreatedAt(n) || new Date().toISOString();
      const key = formatGroupKey(iso);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(n);
    }
    return Array.from(map.entries()).sort((a, b) => {
      const nameA = a[0], nameB = b[0];
      if (nameA === 'Today') return -1;
      if (nameB === 'Today') return 1;
      if (nameA === 'Yesterday') return -1;
      if (nameB === 'Yesterday') return 1;
      return new Date(b[0]).valueOf() - new Date(a[0]).valueOf();
    });
  }, [notifications]);

  if (isLoading) return <div className="p-4 text-zinc-400 text-sm">Loading notifications…</div>;
  if (!notifications.length) return <div className="p-4 text-zinc-400 text-sm">No notifications yet</div>;

  return (
    <div className="space-y-6">
      {grouped.map(([groupLabel, items]) => (
        <div key={groupLabel}>
          <h3 className="px-3 py-1 text-xs font-semibold uppercase text-zinc-500">{groupLabel}</h3>
          <div className="space-y-3 px-1">
            {items.map((notification) => (
              <NotificationItem
                key={(notification as any).id || (notification as any).$id}
                notification={notification}
                userCache={userCache}
                challengeCache={challengeCache}
                commentCache={commentCache}
                setUserCache={(fn) => {
                  const next = fn(userCache);
                  next.forEach((v, k) => userCache.set(k, v));
                }}
                setChallengeCache={(fn) => {
                  const next = fn(challengeCache);
                  next.forEach((v, k) => challengeCache.set(k, v));
                }}
                setCommentCache={(fn) => {
                  const next = fn(commentCache);
                  next.forEach((v, k) => commentCache.set(k, v));
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationsList;
