import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateNotification } from '../../apis/notificationsApi';
import Card from '../common/Card';
import Button from '../common/Button';
import type { Notification as NotificationType } from '../../apis/notificationsApi';

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

  return (
    <Card className={notification.read ? 'opacity-50' : ''}>
      <p className="text-textPrimary">
        {notification.type} on {notification.targetType} {notification.targetId}
      </p>
      <Button
        variant="outline"
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending || notification.read}
      >
        Mark as Read
      </Button>
    </Card>
  );
};

export default Notification;
