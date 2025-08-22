import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

// 👤 Define what your JWT payload looks like
interface UserPayload {
  id: string;
  email: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: UserPayload | null;
}

// Helper: safely decode token
const getUserFromToken = (token: string | null): UserPayload | null => {
  try {
    return token ? (jwtDecode<UserPayload>(token) as UserPayload) : null;
  } catch {
    return null; // invalid/malformed token
  }
};

const initialToken = localStorage.getItem('token');

const initialState: AuthState = {
  token: initialToken,
  user: getUserFromToken(initialToken),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ token: string }>) => {
      const token = action.payload.token;
      localStorage.setItem('token', token);
      state.token = token;
      state.user = getUserFromToken(token);
    },
    logout: (state) => {
      localStorage.removeItem('token');
      state.token = null;
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
