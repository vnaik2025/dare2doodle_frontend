import api from '.';

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Comment {
  id: string;
  challengeId: string;
  userId: string;
  text: string;
  createdAt: string;       // datetime as ISO string
  mediaUrl?: string;       // optional
  content?: string;        // optional
  parentCommentId?: string; // optional
  nsfw: boolean;
}

export const getProfile = () => api.get<User>('/users/profile').then(res => res.data);

export const getSubmissions = () => api.get<Comment[]>('/users/submissions').then(res => res.data);

export const getLikedPosts = () => api.get<Comment[]>('/users/liked-posts').then(res => res.data);

export const getCommentedPosts = () => api.get<Comment[]>('/users/commented-posts').then(res => res.data);



export const getUserById = (userId: string) =>
  api.get<User>(`/users/${userId}`).then(res => res.data);