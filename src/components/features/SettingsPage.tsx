// src/pages/SettingsPage.tsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserById, togglePrivacyApi } from "../../apis/usersApi"; // ✅ import togglePrivacyApi
import { useAuth } from "../../hooks/useAuth";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import Avatar from "../../components/common/Avatar";
import api from "../../apis"; // direct axios for logout/delete

const SettingsPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const isOwner = user?.id === userId;

  const { data: profile, isLoading, isError, error } = useQuery({
    queryKey: ["settings", userId],
    queryFn: () => getUserById(userId!),
    enabled: !!userId,
  });

  // ✅ Privacy mutation
  const updatePrivacyMutation = useMutation({
    mutationFn: (makePrivate: boolean) => togglePrivacyApi(makePrivate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", userId] });
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    },
  });

  // ✅ Delete account
  const deleteAccountMutation = useMutation({
    mutationFn: () => api.delete(`/users/${userId}`),
    onSuccess: () => {
      logout();
      navigate("/login");
    },
  });

  if (isLoading) return <Loader />;
  if (isError) return <ErrorMessage message={(error as Error).message} />;
  if (!profile) return <ErrorMessage message="User not found" />;

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto text-zinc-100">
      <div className="flex items-center gap-4 mb-6">
        <Avatar name={profile.username} size={80} className="border" />
        <div>
          <h2 className="text-xl font-semibold">{profile.username}</h2>
          <p className="text-zinc-400 text-sm">{profile.email}</p>
        </div>
      </div>

      {isOwner ? (
        <>
          {/* Privacy toggle */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Privacy</h3>
            <button
              onClick={() =>
                updatePrivacyMutation.mutate(!profile.private)
              }
              className="px-4 py-2 rounded-md border border-zinc-700 text-sm hover:bg-zinc-800"
              disabled={updatePrivacyMutation.isLoading}
            >
              {profile.private ? "🔒 Switch to Public" : "🌍 Switch to Private"}
            </button>
          </div>

          {/* Delete account */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Danger Zone</h3>
            <button
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to delete your account? This cannot be undone."
                  )
                ) {
                  deleteAccountMutation.mutate();
                }
              }}
              className="px-4 py-2 rounded-md border border-red-700 text-red-400 text-sm hover:bg-red-800/30"
              disabled={deleteAccountMutation.isLoading}
            >
              Delete Account
            </button>
          </div>

          {/* Logout */}
          <div>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="px-4 py-2 rounded-md border border-zinc-700 text-sm hover:bg-zinc-800"
            >
              Logout
            </button>
          </div>
        </>
      ) : (
        <div className="text-sm text-zinc-400">
          You cannot edit another user’s settings.
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
