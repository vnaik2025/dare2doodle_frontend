import api from '.';

export const createReport = (data: { targetType: string; targetId: string; reason: string }) =>
  api.post('/reports', data);