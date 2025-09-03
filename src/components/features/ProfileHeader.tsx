// src/components/features/ProfileHeader.tsx
import React from 'react';
import Avatar from '../../components/common/Avatar';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth';
import { Settings } from "lucide-react";
import {
  followUserApi,
  unfollowUserApi,
  getFollowersApi,
  getFollowingApi,
  blockUserApi,
  unblockUserApi,
} from '../../apis/usersApi';

type Props = {
  userData: any; // profile owner
};

const ProfileHeader: React.FC<Props> = ({ userData }) => {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();
  const viewerId = currentUser?.id ?? currentUser?.id;

  // Queries
  const { data: followers } = useQuery({
    queryKey: ['followers', userData.id ?? userData.$id],
    queryFn: () => getFollowersApi(userData.id ?? userData.$id),
    enabled: !!userData?.id || !!userData?.$id,
    refetchIntervalInBackground:true
  });

  const { data: following } = useQuery({
    queryKey: ['following', userData.id ?? userData.$id],
    queryFn: () => getFollowingApi(userData.id ?? userData.$id),
    enabled: !!userData?.id || !!userData?.$id,
    refetchIntervalInBackground:true
  });

  // Relationship
  const isOwner = viewerId === (userData.id ?? userData.$id);
  const isFollowing = !!followers?.find(
    (f: any) => (f.user?.id ?? f.user?.$id) === viewerId
  );

  // Mutations
  const followMutation = useMutation({
    mutationFn: () => followUserApi(userData.id ?? userData.$id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followers', userData.id ?? userData.$id] });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () => unfollowUserApi(userData.id ?? userData.$id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followers', userData.id ?? userData.$id] });
    },
  });

  const blockMutation = useMutation({
    mutationFn: () => blockUserApi(userData.id ?? userData.$id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', userData.id ?? userData.$id] });
    },
  });

  const unblockMutation = useMutation({
    mutationFn: () => unblockUserApi(userData.id ?? userData.$id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', userData.id ?? userData.$id] });
    },
  });

  console.log("user name is ",userData)

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
            {userData?.role && (
              <span className="text-xs px-2 py-1 rounded-full bg-blue-600/80 text-white">
                {userData.role}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-zinc-400">{userData?.bio || '—'}</p>

          <div className="mt-3 flex items-center gap-4 text-sm text-zinc-400">
            <div>
              <div className="text-xs text-zinc-500">Followers</div>
              <div className="text-sm text-white">{followers?.length ?? 0}</div>
            </div>
            <div>
              <div className="text-xs text-zinc-500">Following</div>
              <div className="text-sm text-white">{following?.length ?? 0}</div>
            </div>

            {/* Actions */}
            <div className="ml-auto flex items-center gap-2">
              {!isOwner && viewerId && (
                <>
                  {isFollowing ? (
                    <button
                      onClick={() => unfollowMutation.mutate()}
                      className="px-3 py-1 rounded-md border border-zinc-700 text-sm"
                    >
                      Following
                    </button>
                  ) : (
                    <button
                      onClick={() => followMutation.mutate()}
                      className="px-3 py-1 rounded-md bg-blue-600 text-white text-sm"
                    >
                      Follow
                    </button>
                  )}

                  <button
                    onClick={() => blockMutation.mutate()}
                    className="px-3 py-1 rounded-md border border-zinc-700 text-sm text-red-400"
                  >
                    Block
                  </button>
                </>
              )}

              {isOwner && (
                <button
                  onClick={() => {
                    // toggle privacy API call
                  }}
                  className="px-3 py-1 rounded-md border border-zinc-700 text-sm"
                >
                  {userData?.private ? 'Private account' : 'Public account'}
                </button>
              )}
            </div>
          </div>
        </div>


        {isOwner && (
  <button
    onClick={() => window.location.href = `/settings/${userData?.$id}`}
    className="ml-2 p-2 rounded-md border border-zinc-700 hover:bg-zinc-800"
    title="Settings"
  >
    <Settings className="w-5 h-5 text-zinc-300" />
  </button>
)}
      </div>
    </div>
  );
};

export default ProfileHeader;
