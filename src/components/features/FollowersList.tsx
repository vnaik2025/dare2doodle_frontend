// import React from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { getFollowersApi, removeFollowerApi, blockUserApi } from "../../apis/usersApi";
// import Avatar from "../common/Avatar";
// import Loader from "../common/Loader";
// import ErrorMessage from "../common/ErrorMessage";
// import Modal from "../common/Modal";
// import Toast from "../common/Toast";

// interface FollowersListProps {
//   userId: string;
//   isOpen: boolean;
//    isOwner: boolean;
//   onClose: () => void;
// }

// const FollowersList: React.FC<FollowersListProps> = ({ userId,isOwner,  isOpen, onClose }) => {
//   const queryClient = useQueryClient();
//   const [toast, setToast] = React.useState<{ message: string; type: "success" | "error" } | null>(null);

//   const { data: followers, isLoading, isError, error } = useQuery({
//     queryKey: ["followers", userId],
//     queryFn: () => getFollowersApi(userId),
//     enabled: isOpen,
//   });

//   const removeFollowerMutation = useMutation({
//     mutationFn: (followerId: string) => removeFollowerApi(followerId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["followers", userId] });
//       setToast({ message: "Follower removed", type: "success" });
//     },
//     onError: () => setToast({ message: "Failed to remove follower", type: "error" }),
//   });

//   const blockUserMutation = useMutation({
//     mutationFn: (targetId: string) => blockUserApi(targetId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["followers", userId] });
//       queryClient.invalidateQueries({ queryKey: ["followStatus", userId] });
//       setToast({ message: "User blocked", type: "success" });
//     },
//     onError: () => setToast({ message: "Failed to block user", type: "error" }),
//   });

//   return (
//     <>
// <Modal isOpen={isOpen} onClose={onClose} title="Followers">
//       {isLoading && <Loader />}
//       {isError && <ErrorMessage message={(error as Error).message} />}
//       {followers?.length ? (
//         <ul className="space-y-2">
//           {followers.map((f: any) => (
//             <li key={f.followDocId} className="flex items-center gap-3 p-2 hover:bg-zinc-800 rounded-md">
//               <Avatar name={f.user.username} size={40} />
//               <span className="text-white flex-1">{f.user.username}</span>
//               {isOwner && (
//                 <div className="flex gap-2">
//                   <button onClick={() => removeFollowerMutation.mutate(f.user.id)} className="px-3 py-1 rounded-md border border-zinc-700 text-sm">
//                     Remove
//                   </button>
//                   <button onClick={() => blockUserMutation.mutate(f.user.id)} className="px-3 py-1 rounded-md border border-red-700 text-red-400 text-sm">
//                     Block
//                   </button>
//                 </div>
//               )}
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p className="text-zinc-400 text-sm">No followers yet.</p>
//       )}
//     </Modal>
//       {toast && (
//         <Toast
//           message={toast.message}
//           type={toast.type}
//           onClose={() => setToast(null)}
//         />
//       )}
//     </>
//   );
// };

// export default FollowersList;

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFollowersApi, removeFollowerApi, blockUserApi } from "../../apis/usersApi";
import Avatar from "../common/Avatar";
import Loader from "../common/Loader";
import ErrorMessage from "../common/ErrorMessage";
import Modal from "../common/Modal";
import Toast from "../common/Toast";
import { UserMinus, ShieldBan } from "lucide-react";

interface FollowersListProps {
  userId: string;
  isOpen: boolean;
  isOwner: boolean;
  onClose: () => void;
}

const FollowersList: React.FC<FollowersListProps> = ({ userId, isOwner, isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [toast, setToast] = React.useState<{ message: string; type: "success" | "error" } | null>(null);

  const { data: followers, isLoading, isError, error } = useQuery({
    queryKey: ["followers", userId],
    queryFn: () => getFollowersApi(userId),
    enabled: isOpen,
  });

  const removeFollowerMutation = useMutation({
    mutationFn: async (followerId: string) => removeFollowerApi(followerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["followers", userId] });
      setToast({ message: "Follower removed", type: "success" });
    },
    onError: () => setToast({ message: "Failed to remove follower", type: "error" }),
  });

  const blockUserMutation = useMutation({
    mutationFn: async (targetId: string) => blockUserApi(targetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["followers", userId] });
      queryClient.invalidateQueries({ queryKey: ["followStatus", userId] });
      setToast({ message: "User blocked", type: "success" });
    },
    onError: () => setToast({ message: "Failed to block user", type: "error" }),
  });

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Followers">
        {isLoading && <Loader />}
        {isError && <ErrorMessage message={(error as Error).message} />}
        {followers?.length ? (
          <ul className="space-y-2">
            {followers.map((f: any) => (
              <li
                key={f.followDocId}
                className="flex items-center gap-3 p-2 hover:bg-zinc-800 rounded-md"
              >
                <Avatar name={f.user.username} size={40} />
                <span className="text-white flex-1 truncate">{f.user.username}</span>

                {isOwner && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => removeFollowerMutation.mutate(f.user.$id)}
                      className="p-2 rounded-md border border-zinc-700 hover:bg-zinc-800"
                      title="Remove follower"
                    >
                      <UserMinus className="w-4 h-4 text-zinc-300" />
                    </button>
                    <button
                      onClick={() => blockUserMutation.mutate(f.user.$id)}
                      className="p-2 rounded-md border border-red-700 hover:bg-red-800/30"
                      title="Block user"
                    >
                      <ShieldBan className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-zinc-400 text-sm">No followers yet.</p>
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

export default FollowersList;
