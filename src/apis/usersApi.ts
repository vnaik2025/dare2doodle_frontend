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

export const updateProfile = async (data: { username?: string; bio?: string }) => {
  return api.put<User>('/users/profile', data).then(res => res.data);
};


export const followUserApi = (targetId: string) => api.post('/users/follow', { targetId }).then(res => res.data);
export const unfollowUserApi = (targetId: string) => api.post('/users/unfollow', { targetId }).then(res => res.data);
export const getFollowersApi = (userId: string) => api.get(`/users/${userId}/followers`).then(res => res.data);
export const getFollowingApi = (userId: string) => api.get(`/users/${userId}/following`).then(res => res.data);
export const blockUserApi = (targetId: string) => api.post('/users/block', { targetId }).then(res => res.data);
export const unblockUserApi = (targetId: string) => api.post('/users/unblock', { targetId }).then(res => res.data);
export const getIncomingFollowRequestsApi = () => api.get('/users/follow-requests/incoming').then(res => res.data);
export const handleFollowRequestApi = (requestId: string, action: 'accept'|'reject') =>
  api.post('/users/follow-request/handle', { requestId, action }).then(res => res.data);

// utility: check if current viewer follows target (optional endpoint could be added server-side)
// For now check profile data or query followers list and search.
