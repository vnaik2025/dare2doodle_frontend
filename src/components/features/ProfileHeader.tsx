import React, { useState } from "react";
import Avatar from "../../components/common/Avatar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../hooks/useAuth";
import { Settings } from "lucide-react";
import {
  followUserApi,
  unfollowUserApi,
  getFollowersApi,
  getFollowingApi,
  blockUserApi,
  unblockUserApi,
  getFollowStatusApi,
} from "../../apis/usersApi";
import FollowersList from "../features/FollowersList";
import FollowingList from "../features/FollowingList";
import FollowRequests from "../features/FollowRequests";
import Toast from "../common/Toast";

type Props = {
  userData: any;
};

const ProfileHeader: React.FC<Props> = ({ userData }) => {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();
  const viewerId = currentUser?.id;
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [showFollowRequests, setShowFollowRequests] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const isOwner = viewerId === (userData.id ?? userData.$id);

  // Follow status query
  const { data: followStatus } = useQuery({
    queryKey: ["followStatus", userData.id ?? userData.$id],
    queryFn: () => getFollowStatusApi(userData.id ?? userData.$id),
    enabled: !isOwner && !!viewerId,
  });

  const { data: followers } = useQuery({
    queryKey: ["followers", userData.id ?? userData.$id],
    queryFn: () => getFollowersApi(userData.id ?? userData.$id),
    enabled: !!userData?.id || !!userData?.$id,
  });

  const { data: following } = useQuery({
    queryKey: ["following", userData.id ?? userData.$id],
    queryFn: () => getFollowingApi(userData.id ?? userData.$id),
    enabled: !!userData?.id || !!userData?.$id,
  });

  // Mutations
  const followMutation = useMutation({
    mutationFn: () => followUserApi(userData.id ?? userData.$id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["followStatus", userData.id ?? userData.$id],
      });
      queryClient.invalidateQueries({
        queryKey: ["followers", userData.id ?? userData.$id],
      });
      queryClient.invalidateQueries({
        queryKey: ["profile", userData.id ?? userData.$id],
      }); // Invalidate profile to refresh submissions
      setToast({
        message: data.message.includes("request")
          ? "Follow request sent"
          : "Followed successfully",
        type: "success",
      });
    },
    onError: () => setToast({ message: "Failed to follow", type: "error" }),
  });

  const unfollowMutation = useMutation({
    mutationFn: () => unfollowUserApi(userData.id ?? userData.$id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["followStatus", userData.id ?? userData.$id],
      });
      queryClient.invalidateQueries({
        queryKey: ["followers", userData.id ?? userData.$id],
      });
      queryClient.invalidateQueries({
        queryKey: ["profile", userData.id ?? userData.$id],
      }); // Invalidate profile to refresh submissions
      setToast({ message: "Unfollowed successfully", type: "success" });
    },
    onError: () => setToast({ message: "Failed to unfollow", type: "error" }),
  });

  const blockMutation = useMutation({
    mutationFn: () => blockUserApi(userData.id ?? userData.$id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile", userData.id ?? userData.$id],
      });
      queryClient.invalidateQueries({
        queryKey: ["followStatus", userData.id ?? userData.$id],
      });
      setToast({ message: "User blocked", type: "success" });
    },
    onError: () => setToast({ message: "Failed to block", type: "error" }),
  });

  return (
    <div className="bg-zinc-950/40 border border-zinc-800 rounded-xl p-4 mb-6">
      <div className="flex items-start gap-5">
        <Avatar
          name={userData?.username}
          size={96}
          className="border border-zinc-700 shadow-sm"
        />
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold leading-tight tracking-wide">
              {userData?.username}
            </h1>
            {userData?.private && (
              <span className="text-xs px-2 py-1 rounded-full bg-blue-600/80 text-white">
                Private
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-zinc-400">{userData?.bio || "—"}</p>

          <div className="mt-3 flex items-center gap-4 text-sm text-zinc-400">
            <button
              onClick={() => setShowFollowers(true)}
              className="hover:text-white"
              aria-label="View followers"
            >
              <div className="text-xs text-zinc-500">Followers</div>
              <div className="text-sm text-white">{followers?.length ?? 0}</div>
            </button>
            <button
              onClick={() => setShowFollowing(true)}
              className="hover:text-white"
              aria-label="View following"
            >
              <div className="text-xs text-zinc-500">Following</div>
              <div className="text-sm text-white">{following?.length ?? 0}</div>
            </button>

            {/* Actions */}
            <div className="ml-auto flex items-center gap-2">
              {!isOwner && viewerId && (
                <>
                  {followStatus?.isBlocked ? (
                    <button
                      onClick={() => blockMutation.mutate()}
                      className="px-3 py-1 rounded-md border border-red-700 text-red-400 text-sm"
                    >
                      Blocked
                    </button>
                  ) : followStatus?.isFollowing ? (
                    <button
                      onClick={() => unfollowMutation.mutate()}
                      className="px-3 py-1 rounded-md border border-zinc-700 text-sm hover:bg-zinc-800"
                    >
                      Following
                    </button>
                  ) : followStatus?.isRequested ? (
                    <button
                      onClick={() => unfollowMutation.mutate()}
                      className="px-3 py-1 rounded-md border border-zinc-700 text-sm text-yellow-400"
                    >
                      Requested
                    </button>
                  ) : (
                    <button
                      onClick={() => followMutation.mutate()}
                      className="px-3 py-1 rounded-md bg-blue-600 text-white text-sm"
                    >
                      Follow
                    </button>
                  )}
                  {!followStatus?.isBlocked && (
                    <button
                      onClick={() => blockMutation.mutate()}
                      className="px-3 py-1 rounded-md border border-zinc-700 text-sm text-red-400"
                    >
                      Block
                    </button>
                  )}
                </>
              )}

              {isOwner && (
                <button
                  onClick={() => setShowFollowRequests(true)}
                  className="px-3 py-1 rounded-md border border-zinc-700 text-sm"
                >
                  Follow Requests
                </button>
              )}
            </div>
          </div>
        </div>

        {isOwner && (
          <button
            onClick={() =>
              (window.location.href = `/settings/${userData?.$id}`)
            }
            className="ml-2 p-2 rounded-md border border-zinc-700 hover:bg-zinc-800"
            title="Settings"
            aria-label="Go to settings"
          >
            <Settings className="w-5 h-5 text-zinc-300" />
          </button>
        )}
      </div>

      <FollowersList
        userId={userData.id ?? userData.$id}
        isOpen={showFollowers}
        onClose={() => setShowFollowers(false)}
      />
      <FollowingList
        userId={userData.id ?? userData.$id}
        isOpen={showFollowing}
        onClose={() => setShowFollowing(false)}
      />
      {isOwner && (
        <FollowRequests
          isOpen={showFollowRequests}
          onClose={() => setShowFollowRequests(false)}
        />
      )}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default ProfileHeader;