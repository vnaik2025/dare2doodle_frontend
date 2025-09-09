import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getIncomingFollowRequestsApi,
  getOutgoingFollowRequestsApi,
  handleFollowRequestApi,
  retractFollowRequestApi,
} from "../../apis/usersApi";
import Avatar from "../common/Avatar";
import Loader from "../common/Loader";
import ErrorMessage from "../common/ErrorMessage";
import Toast from "../common/Toast";
import Modal from "../common/Modal";
import { Check, X, Undo2 } from "lucide-react";

interface FollowRequestsProps {
  isOpen: boolean;
  onClose: () => void;
}

const FollowRequests: React.FC<FollowRequestsProps> = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [toast, setToast] = React.useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const {
    data: incomingRequests,
    isLoading: isLoadingIncoming,
    isError: isErrorIncoming,
    error: errorIncoming,
  } = useQuery({
    queryKey: ["incomingFollowRequests"],
    queryFn: getIncomingFollowRequestsApi,
    enabled: isOpen,
  });

  const {
    data: outgoingRequests,
    isLoading: isLoadingOutgoing,
    isError: isErrorOutgoing,
    error: errorOutgoing,
  } = useQuery({
    queryKey: ["outgoingFollowRequests"],
    queryFn: getOutgoingFollowRequestsApi,
    enabled: isOpen,
  });

  const handleRequestMutation = useMutation({
    mutationFn: ({
      requestId,
      action,
    }: {
      requestId: string;
      action: "accept" | "reject";
    }) => handleFollowRequestApi(requestId, action),
    onSuccess: (_, { action }) => {
      queryClient.invalidateQueries({ queryKey: ["incomingFollowRequests"] });
      queryClient.invalidateQueries({ queryKey: ["followers"] });
      setToast({ message: `Request ${action}ed`, type: "success" });
    },
    onError: () =>
      setToast({ message: "Failed to process request", type: "error" }),
  });

  const retractRequestMutation = useMutation({
    mutationFn: (requestId: string) => retractFollowRequestApi(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outgoingFollowRequests"] });
      setToast({ message: "Follow request retracted", type: "success" });
    },
    onError: () =>
      setToast({ message: "Failed to retract request", type: "error" }),
  });

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Follow Requests">
        {(isLoadingIncoming || isLoadingOutgoing) && <Loader />}
        {(isErrorIncoming || isErrorOutgoing) && (
          <ErrorMessage
            message={
              (isErrorIncoming ? (errorIncoming as Error).message : "") ||
              (isErrorOutgoing ? (errorOutgoing as Error).message : "")
            }
          />
        )}
        <div className="space-y-4">
          {/* Incoming Requests */}
          {incomingRequests?.length ? (
            <>
              <h3 className="text-lg font-medium text-white">Incoming</h3>
              <ul className="space-y-2">
                {incomingRequests.map((req: any) => (
                  <li
                    key={req.$id}
                    className="flex items-center gap-3 p-2 hover:bg-zinc-800 rounded-md"
                  >
                    <Avatar name={req.requester?.username} size={40} />
                    <span className="text-white flex-1">
                      {req.requester?.username}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleRequestMutation.mutate({
                            requestId: req.$id,
                            action: "accept",
                          })
                        }
                        className="p-2 rounded-full bg-green-600 text-white hover:bg-green-700"
                        disabled={handleRequestMutation.isLoading}
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() =>
                          handleRequestMutation.mutate({
                            requestId: req.$id,
                            action: "reject",
                          })
                        }
                        className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700"
                        disabled={handleRequestMutation.isLoading}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          {/* Outgoing Requests */}
          {outgoingRequests?.length ? (
            <>
              <h3 className="text-lg font-medium text-white">Outgoing</h3>
              <ul className="space-y-2">
                {outgoingRequests.map((req: any) => (
                  <li
                    key={req.$id}
                    className="flex items-center gap-3 p-2 hover:bg-zinc-800 rounded-md"
                  >
                    <Avatar name={req.target?.username} size={40} />
                    <span className="text-white flex-1">
                      {req.target?.username}
                    </span>
                    <button
                      onClick={() => retractRequestMutation.mutate(req.$id)}
                      className="p-2 rounded-full bg-yellow-600 text-white hover:bg-yellow-700"
                      disabled={retractRequestMutation.isLoading}
                    >
                      <Undo2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          {!incomingRequests?.length && !outgoingRequests?.length && (
            <p className="text-zinc-400 text-sm">
              No pending follow requests.
            </p>
          )}
        </div>
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

export default FollowRequests;