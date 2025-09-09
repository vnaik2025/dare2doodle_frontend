// src/components/features/BlockedUsersList.tsx
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBlockedUsersApi, unblockUserApi } from "../../apis/usersApi";
import Avatar from "../common/Avatar";
import Loader from "../common/Loader";
import ErrorMessage from "../common/ErrorMessage";
import Modal from "../common/Modal";
import Toast from "../common/Toast";

interface BlockedUsersListProps {
  isOpen: boolean;
  onClose: () => void;
}

const BlockedUsersList: React.FC<BlockedUsersListProps> = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [toast, setToast] = React.useState<{ message: string; type: "success" | "error" } | null>(null);

  const { data: blockedUsers, isLoading, isError, error } = useQuery({
    queryKey: ["blockedUsers"],
    queryFn: getBlockedUsersApi,
    enabled: isOpen,
  });

  const unblockUserMutation = useMutation({
    mutationFn: (targetId: string) => unblockUserApi(targetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blockedUsers"] });
      queryClient.invalidateQueries({ queryKey: ["followStatus"] });
      setToast({ message: "User unblocked successfully", type: "success" });
    },
    onError: () => setToast({ message: "Failed to unblock user", type: "error" }),
  });

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Blocked Users">
        {isLoading && <Loader />}
        {isError && <ErrorMessage message={(error as Error).message} />}
        {blockedUsers?.length ? (
          <ul className="space-y-2">
            {blockedUsers.map((user: any) => (
              <li key={user.blockDocId} className="flex items-center gap-3 p-2 hover:bg-zinc-800 rounded-md">
                <Avatar name={user.user.username} size={40} />
                <span className="text-white flex-1">{user.user.username}</span>
                <button
                  onClick={() => unblockUserMutation.mutate(user.user.$id)}
                  className="px-3 py-1 rounded-md border border-blue-600 text-blue-400 text-sm hover:bg-blue-800/30"
                  disabled={unblockUserMutation.isLoading}
                >
                  Unblock
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-zinc-400 text-sm">No blocked users.</p>
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

export default BlockedUsersList;