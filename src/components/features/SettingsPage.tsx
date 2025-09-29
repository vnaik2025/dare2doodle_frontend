// // src/pages/SettingsPage.tsx
// import React from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { getUserById, togglePrivacyApi } from "../../apis/usersApi"; // ✅ import togglePrivacyApi
// import { useAuth } from "../../hooks/useAuth";
// import Loader from "../../components/common/Loader";
// import ErrorMessage from "../../components/common/ErrorMessage";
// import Avatar from "../../components/common/Avatar";
// import api from "../../apis"; // direct axios for logout/delete

// const SettingsPage: React.FC = () => {
//   const { userId } = useParams<{ userId: string }>();
//   const { user, logout } = useAuth();
//   const queryClient = useQueryClient();
//   const navigate = useNavigate();

//   const isOwner = user?.id === userId;

//   const {
//     data: profile,
//     isLoading,
//     isError,
//     error,
//   } = useQuery({
//     queryKey: ["settings", userId],
//     queryFn: () => getUserById(userId!),
//     enabled: !!userId,
//   });

//   // ✅ Privacy mutation
//   const updatePrivacyMutation = useMutation({
//     mutationFn: (makePrivate: boolean) => togglePrivacyApi(makePrivate),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["settings", userId] });
//       queryClient.invalidateQueries({ queryKey: ["profile", userId] });
//     },
//   });

//   // ✅ Delete account
//   const deleteAccountMutation = useMutation({
//     mutationFn: () => api.delete(`/users/${userId}`),
//     onSuccess: () => {
//       logout();
//       navigate("/login");
//     },
//   });

//   if (isLoading) return <Loader />;
//   if (isError) return <ErrorMessage message={(error as Error).message} />;
//   if (!profile) return <ErrorMessage message="User not found" />;

//   return (
//     <div className="px-6 py-8 max-w-3xl mx-auto text-zinc-100">
//       <div className="flex items-center gap-4 mb-6">
//         <Avatar name={profile.username} size={80} className="border" />
//         <div>
//           <h2 className="text-xl font-semibold">{profile.username}</h2>
//           <p className="text-zinc-400 text-sm">{profile.email}</p>
//         </div>
//       </div>

//       {isOwner ? (
//         <>
//           {/* Privacy toggle */}
//          <div className="mb-6">
//   <h3 className="text-lg font-medium mb-2">Privacy</h3>
//   <p className="text-sm text-zinc-400 mb-2">
//     {profile.private
//       ? "Your account is private. Only approved followers can see your content. Switching to public will keep existing followers."
//       : "Your account is public. Anyone can see your content and follow you. Switching to private will keep existing followers, but new followers will need approval."}
//   </p>
//   <button
//     onClick={() => updatePrivacyMutation.mutate(!profile.private)}
//     className="px-4 py-2 rounded-md border border-zinc-700 text-sm hover:bg-zinc-800"
//     disabled={updatePrivacyMutation.isLoading}
//   >
//     {profile.private ? "🔒 Switch to Public" : "🌍 Switch to Private"}
//   </button>
// </div>

//           {/* Delete account */}
//           <div className="mb-6">
//             <h3 className="text-lg font-medium mb-2">Danger Zone</h3>
//             <button
//               onClick={() => {
//                 if (
//                   window.confirm(
//                     "Are you sure you want to delete your account? This cannot be undone."
//                   )
//                 ) {
//                   deleteAccountMutation.mutate();
//                 }
//               }}
//               className="px-4 py-2 rounded-md border border-red-700 text-red-400 text-sm hover:bg-red-800/30"
//               disabled={deleteAccountMutation.isLoading}
//             >
//               Delete Account
//             </button>
//           </div>

//           {/* Logout */}
//           <div>
//             <button
//               onClick={() => {
//                 logout();
//                 navigate("/login");
//               }}
//               className="px-4 py-2 rounded-md border border-zinc-700 text-sm hover:bg-zinc-800"
//             >
//               Logout
//             </button>
//           </div>
//         </>
//       ) : (
//         <div className="text-sm text-zinc-400">
//           You cannot edit another user’s settings.
//         </div>
//       )}
//     </div>
//   );
// };
// export default SettingsPage
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserById, togglePrivacyApi } from "../../apis/usersApi";
import { useAuth } from "../../hooks/useAuth";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import Avatar from "../../components/common/Avatar";
import BlockedUsersList from "../../components/features/BlockedUsersList";
import api from "../../apis";
import { Lock, Globe, ShieldBan, Trash2, LogOut } from "lucide-react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SettingsPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [showBlockedUsers, setShowBlockedUsers] = useState(false);

  const isOwner = user?.id === userId;

  const {
    data: profile,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["settings", userId],
    queryFn: () => getUserById(userId!),
    enabled: !!userId,
  });

  const updatePrivacyMutation = useMutation({
    mutationFn: (makePrivate: boolean) => togglePrivacyApi(makePrivate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", userId] });
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: () => api.delete(`/users/${userId}`),
    onSuccess: () => {
      logout();
      navigate("/login");
    },
  });

  if (isError) return <ErrorMessage message={(error as Error).message} />;
  if (!profile && !isLoading) return <ErrorMessage message="User not found" />;

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto text-zinc-100">
      <SkeletonTheme baseColor="#202020" highlightColor="#444">
        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-6">
          {isLoading ? (
            <Skeleton circle width={72} height={72} />
          ) : (
            <Avatar name={profile.username} size={72} className="border" />
          )}

          <div>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton width={150} height={20} />
                <Skeleton width={200} height={14} />
              </div>
            ) : (
              <>
                <h2 className="text-lg font-semibold">{profile.username}</h2>
                <p className="text-zinc-400 text-sm">{profile.email}</p>
              </>
            )}
          </div>
        </div>

        {/* Settings Actions */}
        {isOwner ? (
          <div className="space-y-4">
            {isLoading ? (
              <>
                <Skeleton height={48} />
                <Skeleton height={48} />
                <Skeleton height={48} />
                <Skeleton height={48} />
              </>
            ) : (
              <>
                {/* Privacy toggle */}
                <button
                  onClick={() => updatePrivacyMutation.mutate(!profile.private)}
                  disabled={updatePrivacyMutation.isLoading}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-zinc-700 hover:bg-zinc-800"
                >
                  {profile.private ? (
                    <>
                      <Lock className="w-5 h-5 text-blue-400" />
                      <span className="text-sm">Switch to Public</span>
                    </>
                  ) : (
                    <>
                      <Globe className="w-5 h-5 text-green-400" />
                      <span className="text-sm">Switch to Private</span>
                    </>
                  )}
                </button>

                {/* Blocked Users */}
                <button
                  onClick={() => setShowBlockedUsers(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-zinc-700 hover:bg-zinc-800"
                >
                  <ShieldBan className="w-5 h-5 text-red-400" />
                  <span className="text-sm">Manage Blocked Users</span>
                </button>

                {/* Delete account */}
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
                  disabled={deleteAccountMutation.isLoading}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-red-700 text-red-400 hover:bg-red-800/30"
                >
                  <Trash2 className="w-5 h-5" />
                  <span className="text-sm">Delete Account</span>
                </button>

                {/* Logout */}
                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-zinc-700 hover:bg-zinc-800"
                >
                  <LogOut className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm">Logout</span>
                </button>
              </>
            )}
          </div>
        ) : (
          !isLoading && (
            <div className="text-sm text-zinc-400">
              You cannot edit another user’s settings.
            </div>
          )
        )}

        {isOwner && (
          <BlockedUsersList
            isOpen={showBlockedUsers}
            onClose={() => setShowBlockedUsers(false)}
          />
        )}
      </SkeletonTheme>
    </div>
  );
};

export default SettingsPage;
