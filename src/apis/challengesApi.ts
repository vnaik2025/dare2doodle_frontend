import api from '.';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  artStyle?: string;
  tags?: string[];
  nsfw?: boolean;
}

// ✅ Get all challenges
export const getChallenges = async (): Promise<Challenge[]> => {
  const response = await api.get<Challenge[]>('/challenges');
  return response.data;
};

// ✅ Fetch single challenge
export const getChallenge = async (id: string): Promise<Challenge> => {
  const response = await api.get<Challenge>(`/challenges/challenge/${id}`);
  return response.data;
};

// ✅ Create challenge (FormData required)
export const createChallenge = (data: FormData) =>
  api.post('/challenges', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// ✅ Update challenge (also FormData)
export const updateChallenge = (id: string, data: FormData) =>
  api.patch(`/challenges/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// ✅ Delete challenge
export const deleteChallenge = (id: string) => api.delete(`/challenges/${id}`);
