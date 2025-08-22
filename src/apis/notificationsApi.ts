import api from '.';

export interface Notification {
  id: string;
  type: string;
  actorId: string;
  targetType: string;
  targetId: string;
  read: boolean;
}

export const createNotification = async (data: {
  type: string;
  actorId: string;
  targetType: string;
  targetId: string;
}) => {
  const response = await api.post<Notification>('/notifications', data);
  return response.data; // ✅ Return only the notification object
};

export const updateNotification = async (id: string, data: { read: boolean }) => {
  const response = await api.patch<Notification>(`/notifications/${id}`, data);
  return response.data; // ✅ Return only updated notification
};

export const getNotifications = async () => {
  const response = await api.get<Notification[]>('/notifications');
  return response.data; // ✅ Return only array of notifications
};
