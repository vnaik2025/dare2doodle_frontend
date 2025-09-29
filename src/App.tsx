// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "./store";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ChallengeDetail from "./pages/ChallengeDetail";
import Profile from "./pages/Profile";
import Bookmarks from "./pages/Bookmarks";
import Notifications from "./pages/Notifications";
import useProtectedRoute from "./hooks/useProtectedRoute";
import SettingsPage from "./components/features/SettingsPage";
import ChallengeCreateEdit from "./pages/ChallengeCreateEdit";
import FeedPage from "./pages/Feed";
import VerifyEmail from "./components/features/VerifyEmail";

const queryClient = new QueryClient();

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route element={<MainLayout />}>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/challenge/:id"
                element={
                  <ProtectedRoute>
                    <ChallengeDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/:userId"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/challenge/create"
                element={
                  <ProtectedRoute>
                    <ChallengeCreateEdit />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/challenge/edit/:challengeId"
                element={
                  <ProtectedRoute>
                    <ChallengeCreateEdit />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bookmarks"
                element={
                  <ProtectedRoute>
                    <Bookmarks />
                  </ProtectedRoute>
                }
              />

               <Route path="/verify-email" element={
                  <ProtectedRoute>
                <VerifyEmail />
                  </ProtectedRoute>
                } />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings/:userId"
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="challenges"
                element={
                  <ProtectedRoute>
                    <FeedPage />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
}

// Reusable ProtectedRoute wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  useProtectedRoute();
  return <>{children}</>;
};

export default App;
