import { useSelector } from 'react-redux';
import type  { RootState } from '../store/index';

export const useAuth = () => {
  const { token, user } = useSelector((state: RootState) => state.auth);
  return { isAuthenticated: !!token && !!user, user };
};