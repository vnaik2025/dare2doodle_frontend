import api from '.';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  artStyle?: string;
  tags?: string[];
  nsfw: boolean;
}

// ✅ Return the actual data (array of challenges), not the whole AxiosResponse
export const getChallenges = async (): Promise<Challenge[]> => {
  const response = await api.get<Challenge[]>('/challenges');
  return response.data;
};

// ✅ Fetch a specific challenge by ID
export const getChallenge = async (id: string): Promise<Challenge> => {
  const response = await api.get<Challenge>(`/challenges/challenge/${id}`);
  return response.data;
};

export const createChallenge = (data: FormData) =>
  api.post('/challenges', data, { headers: { 'Content-Type': 'multipart/form-data' } });

export const updateChallenge = (id: string, data: { title?: string; description?: string }) =>
  api.patch(`/challenges/${id}`, data);

export const deleteChallenge = (id: string) => api.delete(`/challenges/${id}`);