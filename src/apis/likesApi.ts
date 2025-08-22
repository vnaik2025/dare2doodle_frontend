import api from '.';

export const createLike = (data: { targetType: 'comment' | 'challenge'; targetId: string }) =>
  api.post('/likes', data);
export const deleteLike = (targetType: 'comment' | 'challenge', targetId: string) =>
  api.delete(`/likes?targetType=${targetType}&targetId=${targetId}`);
export const getLikes = (targetType: 'comment' | 'challenge', targetId: string) =>
  api.get(`/likes?targetType=${targetType}&targetId=${targetId}`);