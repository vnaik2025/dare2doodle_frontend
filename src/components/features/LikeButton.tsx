import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createLike, deleteLike, getLikes } from '../../apis/likesApi';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useState } from 'react';

interface LikeButtonProps {
  targetId: string;
  targetType: 'comment' | 'challenge';
}

const LikeButton = ({ targetId, targetType }: LikeButtonProps) => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  // Fetch likes data
  const { data: likesData, isLoading } = useQuery<{ count: number; likedByMe: boolean }>({
    queryKey: ['likes', targetType, targetId],
    queryFn: () => getLikes(targetType, targetId).then(res => res.data),
    onError: (err: any) => {
      console.error('Error fetching likes:', err);
      setError('Failed to load like status');
    },
  });

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: () => createLike(targetType, targetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['likes', targetType, targetId] });
      setError(null);
    },
    onError: (err: any) => {
      console.error('Like error:', err);
      if (err.response?.data?.error === 'Already liked') {
        // If already liked, attempt to unlike instead
        unlikeMutation.mutate();
      } else {
        setError('Failed to like comment');
      }
    },
  });

  // Unlike mutation
  const unlikeMutation = useMutation({
    mutationFn: () => deleteLike(targetType, targetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['likes', targetType, targetId] });
      setError(null);
    },
    onError: (err: any) => {
      console.error('Unlike error:', err);
      setError('Failed to unlike comment');
    },
  });

  const handleClick = () => {
    if (isLoading) return; // Prevent clicks during loading
    setError(null); // Clear any previous errors
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
        className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs 
                   text-zinc-400 hover:text-red-400 transition-colors
                   hover:bg-zinc-800/50 disabled:opacity-50"
      >
        {likesData?.likedByMe ? (
          <FaHeart className="text-red-500 w-3.5 h-3.5" />
        ) : (
          <FaRegHeart className="w-3.5 h-3.5" />
        )}
        <span className="text-[11px]">{likesData?.count ?? 0}</span>
      </button>
      {error && (
        <span className="text-red-500 text-xs mt-1">{error}</span>
      )}
    </div>
  );
};

export default LikeButton;