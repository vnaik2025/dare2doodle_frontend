// // import api from ".";

// // export interface User {
// //   id: string;
// //   username: string;
// //   email: string;
// // }

// // export interface Comment {
// //   id: string;
// //   challengeId: string;
// //   userId: string;
// //   text: string;
// //   createdAt: string; // datetime as ISO string
// //   mediaUrl?: string; // optional
// //   content?: string; // optional
// //   parentCommentId?: string; // optional
// //   nsfw: boolean;
// // }

// // export const getProfile = () =>
// //   api.get<User>("/users/profile").then((res) => res.data);

// // export const getSubmissions = () =>
// //   api.get<Comment[]>("/users/submissions").then((res) => res.data);

// // export const getLikedPosts = () =>
// //   api.get<Comment[]>("/users/liked-posts").then((res) => res.data);

// // export const getCommentedPosts = () =>
// //   api.get<Comment[]>("/users/commented-posts").then((res) => res.data);

// // export const getUserById = (userId: string) =>
// //   api.get<User>(`/users/${userId}`).then((res) => res.data);

// // export const updateProfile = async (data: {
// //   username?: string;
// //   bio?: string;
// // }) => {
// //   return api.put<User>("/users/profile", data).then((res) => res.data);
// // };

// // export const followUserApi = (targetId: string) =>
// //   api.post("/users/follow", { targetId }).then((res) => res.data);
// // export const unfollowUserApi = (targetId: string) =>
// //   api.post("/users/unfollow", { targetId }).then((res) => res.data);
// // export const getFollowersApi = (userId: string) =>
// //   api.get(`/users/${userId}/followers`).then((res) => res.data);
// // export const getFollowingApi = (userId: string) =>
// //   api.get(`/users/${userId}/following`).then((res) => res.data);
// // export const blockUserApi = (targetId: string) =>
// //   api.post("/users/block", { targetId }).then((res) => res.data);
// // export const unblockUserApi = (targetId: string) =>
// //   api.post("/users/unblock", { targetId }).then((res) => res.data);
// // export const getIncomingFollowRequestsApi = () =>
// //   api.get("/users/follow-requests/incoming").then((res) => res.data);
// // export const handleFollowRequestApi = (
// //   requestId: string,
// //   action: "accept" | "reject"
// // ) =>
// //   api
// //     .post("/users/follow-request/handle", { requestId, action })
// //     .then((res) => res.data);

// // // Toggle privacy
// // export const togglePrivacyApi = (makePrivate: boolean) =>
// //   api
// //     .put<User>("/users/privacy", { private: makePrivate })
// //     .then((res) => res.data);


// //     // Check follow status
// // export const getFollowStatusApi = (targetId: string) =>
// //   api.get(`/users/follow-status/${targetId}`).then((res) => res.data);



// import api from ".";

// export interface User {
//   id: string;
//   username: string;
//   email: string;
//   bio?: string;
//   private: boolean;
//   createdAt: string;
//   message?: string; // For private profiles when not following
//   submissions?: Comment[]; // Included for followers or public profiles
// }

// export interface Profile {
//   user: User;
//   submissions?: Comment[];
//   likedPosts?: Comment[];
//   commentedPosts?: Comment[];
//   bookmarks?: any[];
//   notifications?: any[];
// }

// export interface Comment {
//   id: string;
//   challengeId: string;
//   userId: string;
//   text: string;
//   createdAt: string; // datetime as ISO string
//   mediaUrl?: string; // optional
//   content?: string; // optional
//   parentCommentId?: string; // optional
//   nsfw: boolean;
// }

// export const getProfile = () =>
//   api.get<Profile>("/users/profile").then((res) => res.data);

// export const getSubmissions = () =>
//   api.get<Comment[]>("/users/submissions").then((res) => res.data);

// export const getLikedPosts = () =>
//   api.get<Comment[]>("/users/liked-posts").then((res) => res.data);

// export const getCommentedPosts = () =>
//   api.get<Comment[]>("/users/commented-posts").then((res) => res.data);

// export const getUserById = (userId: string) =>
//   api.get<User>(`/users/${userId}`).then((res) => res.data);

// export const updateProfile = async (data: {
//   username?: string;
//   bio?: string;
// }) => {
//   return api.put<User>("/users/profile", data).then((res) => res.data);
// };

// export const followUserApi = (targetId: string) =>
//   api.post("/users/follow", { targetId }).then((res) => res.data);
// export const unfollowUserApi = (targetId: string) =>
//   api.post("/users/unfollow", { targetId }).then((res) => res.data);
// export const getFollowersApi = (userId: string) =>
//   api.get(`/users/${userId}/followers`).then((res) => res.data);
// export const getFollowingApi = (userId: string) =>
//   api.get(`/users/${userId}/following`).then((res) => res.data);
// export const blockUserApi = (targetId: string) =>
//   api.post("/users/block", { targetId }).then((res) => res.data);
// export const unblockUserApi = (targetId: string) =>
//   api.post("/users/unblock", { targetId }).then((res) => res.data);
// export const getIncomingFollowRequestsApi = () =>
//   api.get("/users/follow-requests/incoming").then((res) => res.data);
// export const handleFollowRequestApi = (
//   requestId: string,
//   action: "accept" | "reject"
// ) =>
//   api
//     .post("/users/follow-request/handle", { requestId, action })
//     .then((res) => res.data);

// // Toggle privacy
// export const togglePrivacyApi = (makePrivate: boolean) =>
//   api
//     .put<User>("/users/privacy", { private: makePrivate })
//     .then((res) => res.data);

// // Check follow status
// export const getFollowStatusApi = (targetId: string) =>
//   api.get(`/users/follow-status/${targetId}`).then((res) => res.data);



// import api from ".";

// export interface User {
//   id: string;
//   username: string;
//   email: string;
//   bio?: string;
//   private?: boolean;
//   createdAt?: string;
//   submissions?: Comment[]; // Add submissions for non-owner profiles
//   message?: string; // For private account message
// }

// export interface Comment {
//   id: string;
//   challengeId: string;
//   userId: string;
//   text: string;
//   createdAt: string; // datetime as ISO string
//   mediaUrl?: string; // optional
//   content?: string; // optional
//   parentCommentId?: string; // optional
//   nsfw: boolean;
// }

// export const getProfile = () =>
//   api.get<{ user: User; submissions: Comment[]; likedPosts: any[]; commentedPosts: any[]; bookmarks: any[]; notifications: any[] }>("/users/profile").then((res) => res.data);

// export const getSubmissions = () =>
//   api.get<Comment[]>("/users/submissions").then((res) => res.data);

// export const getLikedPosts = () =>
//   api.get<Comment[]>("/users/liked-posts").then((res) => res.data);

// export const getCommentedPosts = () =>
//   api.get<Comment[]>("/users/commented-posts").then((res) => res.data);

// export const getUserById = (userId: string) =>
//   api.get<User>(`/users/${userId}`).then((res) => res.data);

// export const updateProfile = async (data: {
//   username?: string;
//   bio?: string;
// }) => {
//   return api.put<User>("/users/profile", data).then((res) => res.data);
// };

// export const followUserApi = (targetId: string) =>
//   api.post("/users/follow", { targetId }).then((res) => res.data);

// export const unfollowUserApi = (targetId: string) =>
//   api.post("/users/unfollow", { targetId }).then((res) => res.data);

// export const getFollowersApi = (userId: string) =>
//   api.get(`/users/${userId}/followers`).then((res) => res.data);

// export const getFollowingApi = (userId: string) =>
//   api.get(`/users/${userId}/following`).then((res) => res.data);

// export const blockUserApi = (targetId: string) =>
//   api.post("/users/block", { targetId }).then((res) => res.data);

// export const unblockUserApi = (targetId: string) =>
//   api.post("/users/unblock", { targetId }).then((res) => res.data);

// export const getIncomingFollowRequestsApi = () =>
//   api.get("/users/follow-requests/incoming").then((res) => res.data);

// export const handleFollowRequestApi = (
//   requestId: string,
//   action: "accept" | "reject"
// ) =>
//   api
//     .post("/users/follow-request/handle", { requestId, action })
//     .then((res) => res.data);

// // Toggle privacy
// export const togglePrivacyApi = (makePrivate: boolean) =>
//   api
//     .put<User>("/users/privacy", { private: makePrivate })
//     .then((res) => res.data);

// // Check follow status
// export const getFollowStatusApi = (targetId: string) =>
//   api.get(`/users/follow-status/${targetId}`).then((res) => res.data);


import api from ".";

export interface User {
  id: string;
  username: string;
  email: string;
  bio?: string;
  private?: boolean;
  createdAt?: string;
  submissions?: Comment[];
  message?: string;
}

export interface Comment {
  id: string;
  challengeId: string;
  userId: string;
  text: string;
  createdAt: string;
  mediaUrl?: string;
  content?: string;
  parentCommentId?: string;
  nsfw: boolean;
}

export const getProfile = () =>
  api.get<{ user: User; submissions: Comment[]; likedPosts: any[]; commentedPosts: any[]; bookmarks: any[]; notifications: any[] }>("/users/profile").then((res) => res.data);

export const getSubmissions = () =>
  api.get<Comment[]>("/users/submissions").then((res) => res.data);

export const getLikedPosts = () =>
  api.get<Comment[]>("/users/liked-posts").then((res) => res.data);

export const getCommentedPosts = () =>
  api.get<Comment[]>("/users/commented-posts").then((res) => res.data);

export const getUserById = (userId: string) =>
  api.get<User>(`/users/${userId}`).then((res) => res.data);

export const updateProfile = async (data: {
  username?: string;
  bio?: string;
}) => {
  return api.put<User>("/users/profile", data).then((res) => res.data);
};

export const followUserApi = (targetId: string) =>
  api.post("/users/follow", { targetId }).then((res) => res.data);

export const unfollowUserApi = (targetId: string) =>
  api.post("/users/unfollow", { targetId }).then((res) => res.data);

export const removeFollowerApi = (followerId: string) =>
  api.post("/users/remove-follower", { followerId }).then((res) => res.data);

export const getFollowersApi = (userId: string) =>
  api.get(`/users/${userId}/followers`).then((res) => res.data);

export const getFollowingApi = (userId: string) =>
  api.get(`/users/${userId}/following`).then((res) => res.data);

export const blockUserApi = (targetId: string) =>
  api.post("/users/block", { targetId }).then((res) => res.data);

export const unblockUserApi = (targetId: string) =>
  api.post("/users/unblock", { targetId }).then((res) => res.data);

export const getIncomingFollowRequestsApi = () =>
  api.get("/users/follow-requests/incoming").then((res) => res.data);

export const getOutgoingFollowRequestsApi = () =>
  api.get("/users/follow-requests/outgoing").then((res) => res.data);

export const handleFollowRequestApi = (
  requestId: string,
  action: "accept" | "reject"
) =>
  api
    .post("/users/follow-request/handle", { requestId, action })
    .then((res) => res.data);

export const retractFollowRequestApi = (requestId: string) =>
  api.post("/users/follow-request/retract", { requestId }).then((res) => res.data);

export const togglePrivacyApi = (makePrivate: boolean) =>
  api
    .put<User>("/users/privacy", { private: makePrivate })
    .then((res) => res.data);

export const getFollowStatusApi = (targetId: string) =>
  api.get(`/users/follow-status/${targetId}`).then((res) => res.data);



export const getBlockedUsersApi = () =>
  api.get(`/users/blocked`).then((res) => res.data);