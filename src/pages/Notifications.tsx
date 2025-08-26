import { useQuery } from '@tanstack/react-query';
import { getNotifications } from '../apis/notificationsApi';
import type { Notification } from '../apis/notificationsApi';

import NotificationCard from '../components/features/Notification';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';

const Notifications = () => {
  const { data: notifications, isLoading, error } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: getNotifications,
  });

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage message="Failed to load notifications" />;

  return (
    <div className="px-4 py-6  mx-auto">
      <h2 className="text-xl font-semibold mb-6 text-zinc-100">Notifications</h2>
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
