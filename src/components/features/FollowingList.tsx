import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFollowingApi, unfollowUserApi, blockUserApi } from "../../apis/usersApi";
import Avatar from "../common/Avatar";
import Loader from "../common/Loader";
import ErrorMessage from "../common/ErrorMessage";
import Modal from "../common/Modal";
import Toast from "../common/Toast";

interface FollowingListProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

const FollowingList: React.FC<FollowingListProps> = ({ userId, isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [toast, setToast] = React.useState<{ message: string; type: "success" | "error" } | null>(null);

  const { data: following, isLoading, isError, error } = useQuery({
    queryKey: ["following", userId],
    queryFn: () => getFollowingApi(userId),
    enabled: isOpen,
  });

  const unfollowMutation = useMutation({
    mutationFn: (targetId: string) => unfollowUserApi(targetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["following", userId] });
      queryClient.invalidateQueries({ queryKey: ["followStatus", userId] });
      setToast({ message: "Unfollowed successfully", type: "success" });
    },
    onError: () => setToast({ message: "Failed to unfollow", type: "error" }),
  });

  const blockUserMutation = useMutation({
    mutationFn: (targetId: string) => blockUserApi(targetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["following", userId] });
      queryClient.invalidateQueries({ queryKey: ["followStatus", userId] });
      setToast({ message: "User blocked", type: "success" });
    },
    onError: () => setToast({ message: "Failed to block user", type: "error" }),
  });

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Following">
        {isLoading && <Loader />}
        {isError && <ErrorMessage message={(error as Error).message} />}
        {following?.length ? (
          <ul className="space-y-2">
            {following.map((f: any) => (
              <li
                key={f.followDocId}
                className="flex items-center gap-3 p-2 hover:bg-zinc-800 rounded-md"
              >
                <Avatar name={f.user.username} size={40} />
                <span className="text-white flex-1">{f.user.username}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => unfollowMutation.mutate(f.user.id)}
                    className="px-3 py-1 rounded-md border border-zinc-700 text-sm hover:bg-zinc-800"
                    disabled={unfollowMutation.isLoading}
                  >
                    Unfollow
                  </button>
                  <button
                    onClick={() => blockUserMutation.mutate(f.user.id)}
                    className="px-3 py-1 rounded-md border border-red-700 text-red-400 text-sm hover:bg-red-800/30"
                    disabled={blockUserMutation.isLoading}
                  >
                    Block
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-zinc-400 text-sm">Not following anyone yet.</p>
        )}
      </Modal>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default FollowingList;