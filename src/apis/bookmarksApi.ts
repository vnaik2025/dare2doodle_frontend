import api from '.';

export interface Bookmark {
  challengeId: string;
}

export const getBookmarks = async () => {
  const res = await api.get("/bookmarks/me");
  return res.data;
};

export const createBookmark = async (data: { challengeId: string }) => {
  const res = await api.post("/bookmarks", data);
  return res.data;
};

export const deleteBookmark = async (challengeId: string) => {
  const res = await api.delete(`/bookmarks`, { params: { challengeId } });
  return res.data;
};