import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateNotification } from '../../apis/notificationsApi';
import type { Notification as NotificationType } from '../../apis/notificationsApi';
import {
  Bell,
  MessageSquare,
  Heart,
  Star,
  CheckCircle2,
} from 'lucide-react';

interface NotificationProps {
  notification: NotificationType;
}

const Notification = ({ notification }: NotificationProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      return updateNotification(notification.id, { read: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Choose icon based on type
  const getIcon = () => {
    switch (notification.type) {
      case 'comment':
        return <MessageSquare size={18} className="text-blue-400" />;
      case 'like':
        return <Heart size={18} className="text-pink-500" />;
      case 'system':
        return <Star size={18} className="text-yellow-400" />;
      default:
        return <Bell size={18} className="text-zinc-400" />;
    }
  };

  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-xl border border-zinc-800 p-3 transition-colors ${
        notification.read
          ? 'bg-zinc-900/40 opacity-70'
          : 'bg-zinc-900/80 hover:bg-zinc-800/80'
      }`}
    >
      {/* Icon + Content */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800">
          {getIcon()}
        </div>
        <div>
          <p className="text-sm text-zinc-200">
            <span className="font-medium capitalize">{notification.type}</span>{' '}
            on {notification.targetType}{' '}
            <span className="text-zinc-400">#{notification.targetId}</span>
          </p>
          {!notification.read && (
            <span className="inline-block h-2 w-2 rounded-full bg-blue-500 mt-1" />
          )}
        </div>
      </div>

      {/* Mark as Read */}
      {!notification.read && (
        <button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className="rounded-full p-1 hover:bg-zinc-800 transition-colors"
        >
          <CheckCircle2 size={18} className="text-green-400" />
        </button>
      )}
    </div>
  );
};

export default Notification;
