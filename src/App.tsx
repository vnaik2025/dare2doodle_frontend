import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store } from './store';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ChallengeDetail from './pages/ChallengeDetail';
import Profile from './pages/Profile';
import Bookmarks from './pages/Bookmarks';
import Notifications from './pages/Notifications';
import useProtectedRoute from './hooks/useProtectedRoute';
import SettingsPage from './components/features/SettingsPage';

const queryClient = new QueryClient();

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<MainLayout />}>
              <Route path="/" element={<ProtectedHome />} />
              <Route path="/challenge/:id" element={<ProtectedChallengeDetail />} />
              <Route path="/profile/:userId" element={<ProtectedProfile />} />

              <Route path="/bookmarks" element={<ProtectedBookmarks />} />
              <Route path="/notifications" element={<ProtectedNotifications />} />
              <Route path="/settings/:userId" element={<ProtectedSettingsPage />} />

            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
}

const ProtectedHome = () => {
  useProtectedRoute();
  return <Home />;
};

const ProtectedChallengeDetail = () => {
  useProtectedRoute();
  return <ChallengeDetail />;
};

const ProtectedProfile = () => {
  useProtectedRoute();
  return <Profile />;
};

const ProtectedBookmarks = () => {
  useProtectedRoute();
  return <Bookmarks />;
};

const ProtectedNotifications = () => {
  useProtectedRoute();
  return <Notifications />;
};

const ProtectedSettingsPage = () => {
  useProtectedRoute();
  return <SettingsPage />;
};

export default App;