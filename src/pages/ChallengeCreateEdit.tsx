// import React from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { getChallenge, createChallenge, updateChallenge } from "../apis/challengesApi";
// import { useAuth } from "../hooks/useAuth";
// import ChallengeForm, { type FormValues } from "../components/features/ChallengeForm";
// import Loader from "../components/common/Loader";
// import ErrorMessage from "../components/common/ErrorMessage";
// import Toast from "../components/common/Toast";

// const ChallengeCreateEdit: React.FC = () => {
//   const { challengeId } = useParams<{ challengeId: string }>();
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();
//   const { user } = useAuth();
//   const isEditMode = !!challengeId;

//   const { data: challenge, isLoading, isError, error } = useQuery({
//     queryKey: ["challenge", challengeId],
//     queryFn: () => getChallenge(challengeId!),
//     enabled: isEditMode,
//   });

//   const createMutation = useMutation({
//     mutationFn: (data: FormData) => createChallenge(data),
//     onSuccess: () => {
//       queryClient.invalidateQueries(["challenges"]);
//       queryClient.invalidateQueries(["userChallenges", user?.id]);
//       navigate("/challenges");
//     },
//   });

//   const updateMutation = useMutation({
//     mutationFn: (data: FormData) => updateChallenge(challengeId!, data),
//     onSuccess: () => {
//       queryClient.invalidateQueries(["challenge", challengeId]);
//       queryClient.invalidateQueries(["userChallenges", user?.id]);
//       navigate(`/challenge/${challengeId}`);
//     },
//   });

//   const [toast, setToast] = React.useState<{ message: string; type: "success" | "error" } | null>(null);

//   if (isLoading && isEditMode) return <Loader />;
//   if (isError && isEditMode) return <ErrorMessage message={(error as Error).message} />;
//   if (isEditMode && !challenge) return <ErrorMessage message="Challenge not found" />;

//   const handleSubmit = (data: FormValues) => {
//     const formData = new FormData();
//     formData.append("title", data.title);
//     formData.append("description", data.description);
//     formData.append("artStyle", data.artStyle); // string now
//     formData.append("tags", JSON.stringify(data.tags));
//     if (data.image) formData.append("image", data.image);

//     const mutation = isEditMode ? updateMutation : createMutation;
//     mutation.mutate(formData, {
//       onError: (err: any) =>
//         setToast({ message: err.message || "Something went wrong", type: "error" }),
//     });
//   };

//   return (
//     <div className="px-4 py-6 max-w-2xl mx-auto text-zinc-100">
//       <h2 className="text-2xl font-bold mb-6">
//         {isEditMode ? "Edit Challenge" : "Create New Challenge"}
//       </h2>
//       <ChallengeForm
//         onSubmit={handleSubmit}
//         initialData={isEditMode ? challenge : undefined}
//         isSubmitting={createMutation.isLoading || updateMutation.isLoading}
//       />
//       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
//     </div>
//   );
// };

// export default ChallengeCreateEdit;

import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getChallenge, createChallenge, updateChallenge } from "../apis/challengesApi";
import { useAuth } from "../hooks/useAuth";
import ChallengeForm, { type FormValues } from "../components/features/ChallengeForm";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import Toast from "../components/common/Toast";

const ChallengeCreateEdit: React.FC = () => {
  const { challengeId } = useParams<{ challengeId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isEditMode = !!challengeId;

  const { data: challenge, isLoading, isError, error } = useQuery({
    queryKey: ["challenge", challengeId],
    queryFn: () => getChallenge(challengeId!),
    enabled: isEditMode,
  });

  const createMutation = useMutation({
    mutationFn: (data: FormData) => createChallenge(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["challenges"]);
      queryClient.invalidateQueries(["userChallenges", user?.id]);
      navigate("/challenges");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: FormData) => updateChallenge(challengeId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["challenge", challengeId]);
      queryClient.invalidateQueries(["userChallenges", user?.id]);
      navigate(`/challenge/${challengeId}`);
    },
  });

  const [toast, setToast] = React.useState<{ message: string; type: "success" | "error" } | null>(null);

  if (isLoading && isEditMode) return <Loader />;
  if (isError && isEditMode) return <ErrorMessage message={(error as Error).message} />;
  if (isEditMode && !challenge) return <ErrorMessage message="Challenge not found" />;

  const handleSubmit = (data: FormValues) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("artStyle", data.artStyle);
    formData.append("tags", JSON.stringify(data.tags));
    if (data.image) formData.append("image", data.image);

    const mutation = isEditMode ? updateMutation : createMutation;
    mutation.mutate(formData, {
      onError: (err: any) =>
        setToast({ message: err.message || "Something went wrong", type: "error" }),
    });
  };

  return (
    <div className="px-4 py-8 max-w-2xl mx-auto text-zinc-100">
      {/* Minimalistic Header */}
      <div className="mb-6 text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          {isEditMode ? "Edit Challenge" : "Create New Challenge"}
        </h2>
        <p className="text-gray-400 mt-1 text-sm md:text-base">
          {isEditMode
            ? "Update the details of your challenge"
            : "Fill in the details to create a new challenge"}
        </p>
      </div>

      <ChallengeForm
        onSubmit={handleSubmit}
        initialData={isEditMode ? challenge : undefined}
        isSubmitting={createMutation.isLoading || updateMutation.isLoading}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default ChallengeCreateEdit;
