import api from '.';

// ✅ likes for both comments & challenges
export const createLike = (targetType: 'challenge' | 'comment', targetId: string) =>
  api.post(`/likes`, { targetType, targetId });

export const deleteLike = (targetType: 'challenge' | 'comment', targetId: string) =>
  api.delete(`/likes?targetType=${targetType}&targetId=${targetId}`);

export const getLikes = (targetType: 'challenge' | 'comment', targetId: string) =>
  api.get(`/likes?targetType=${targetType}&targetId=${targetId}`);
