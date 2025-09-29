import api from '.';

export const login = (data: { email: string; password: string }) =>
  api.post<{ token: string }>('/auth/login', data).then(res => res.data);

export const register = (data: { username: string; email: string; password: string }) =>
  api.post<{ token: string }>('/auth/register', data).then(res => res.data);



export const requestEmailVerification = () =>
  api.post<{ message: string }>("/email-verification/request").then(res => res.data);

export const verifyEmailApi = (data: { otp: string }) =>
  api.post<{ message: string }>("/email-verification/verify", data).then(res => res.data);