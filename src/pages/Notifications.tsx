import { useQuery } from '@tanstack/react-query';
import { getNotifications  } from '../apis/notificationsApi';
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
    <div>
      <h2 className="text-2xl font-bold mb-6">Notifications</h2>
      {notifications?.length ? (
        notifications.map((notification) => (
          <NotificationCard key={notification.id} notification={notification} />
        ))
      ) : (
        <p className="text-gray-500">No notifications found.</p>
      )}
    </div>
  );
};

export default Notifications;
