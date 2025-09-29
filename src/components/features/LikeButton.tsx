// src/components/features/LikeButton.tsx
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createLike, deleteLike, getLikes } from "../../apis/likesApi";
import { Heart } from "lucide-react";
import { useState } from "react";

interface LikeButtonProps {
  targetId: string;
  targetType: "comment" | "challenge";
}

const LikeButton = ({ targetId, targetType }: LikeButtonProps) => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  // Fetch likes data
  const { data: likesData, isLoading } = useQuery<{ count: number; likedByMe: boolean }>({
    queryKey: ["likes", targetType, targetId],
    queryFn: () => getLikes(targetType, targetId).then((res) => res.data),
    onError: (err: any) => {
      console.error("Error fetching likes:", err);
      setError("Failed to load like status");
    },
  });

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: () => createLike(targetType, targetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["likes", targetType, targetId] });
      setError(null);
    },
    onError: (err: any) => {
      console.error("Like error:", err);
      if (err.response?.data?.error === "Already liked") {
        unlikeMutation.mutate();
      } else {
        setError("Failed to like");
      }
    },
  });

  // Unlike mutation
  const unlikeMutation = useMutation({
    mutationFn: () => deleteLike(targetType, targetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["likes", targetType, targetId] });
      setError(null);
    },
    onError: (err: any) => {
      console.error("Unlike error:", err);
      setError("Failed to unlike");
    },
  });

  const handleClick = () => {
    if (isLoading) return;
    setError(null);
    if (likesData?.likedByMe) {
      unlikeMutation.mutate();
    } else {
      likeMutation.mutate();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleClick}
        disabled={isLoading || likeMutation.isPending || unlikeMutation.isPending}
        className="flex items-center gap-1 text-white hover:text-red-400 transition-colors"
      >
        <Heart
          className={`w-5 h-5 ${
            likesData?.likedByMe ? "text-red-500 fill-red-500" : ""
          }`}
        />
        <span className="text-xs">{likesData?.count ?? 0}</span>
      </button>

      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  );
};

export default LikeButton;
