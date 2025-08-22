import {jwtDecode} from 'jwt-decode';

interface DecodedToken {
  exp: number;
}

export const isTokenValid = (token: string): boolean => {
  try {
    const decoded: DecodedToken = jwtDecode(token);
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export const formatDate = (date: string) => new Date(date).toLocaleDateString();