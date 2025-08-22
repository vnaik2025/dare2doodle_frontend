import api from '.';

export interface Bookmark {
  challengeId: string;
}

export const createBookmark = (data: { challengeId: string }) => api.post('/bookmarks', data);
export const deleteBookmark = (challengeId: string) => api.delete(`/bookmarks?challengeId=${challengeId}`);
export const getBookmarks = async (): Promise<Bookmark[]> => {
  const res = await api.get<Bookmark[]>('/bookmarks/me');
  return res.data;
};