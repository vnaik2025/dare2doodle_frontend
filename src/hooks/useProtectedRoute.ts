import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../store';
import { isTokenValid } from '../utils/helpers';

const useProtectedRoute = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !isTokenValid(token)) {
      navigate('/login');
    }
  }, [token, navigate]);
};

export default useProtectedRoute;