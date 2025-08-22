import api from '.';

export interface Comment {
  id: string;
  challengeId: string;
  text: string;
  mediaUrl?: string;
  mediaType?: string;
  nsfw: boolean;
  parentCommentId?: string;
  replies?: Comment[];
}

export const createComment = (data: FormData) =>
  api.post('/comments', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateComment = (id: string, data: FormData) =>
  api.put(`/comments/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteComment = (id: string) => api.delete(`/comments/${id}`);
export const getComments = async (challengeId: string): Promise<Comment[]> => {
  const res = await api.get<Comment[]>(`/comments/${challengeId}`);
  return res.data;
};
