import { useQuery } from '@tanstack/react-query';
import { getNotifications } from '../apis/notificationsApi';
import type { Notification } from '../apis/notificationsApi';

import NotificationCard from '../components/features/Notification';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import { Bell } from 'lucide-react';

const Notifications = () => {
  const { data: notifications, isLoading, error } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: getNotifications,
  });

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage message="Failed to load notifications" />;

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Bell className="w-6 h-6 text-zinc-100" />
        <h2 className="text-lg md:text-xl font-semibold text-zinc-100 hidden sm:block">
          Notifications
        </h2>
      </div>

      {notifications?.length ? (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-zinc-500 text-center">
          No notifications found.
        </p>
      )}
    </div>
  );
};

export default Notifications;