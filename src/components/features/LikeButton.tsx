import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createLike, deleteLike, getLikes } from '../../apis/likesApi';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

interface Like {
  id: string;
  userId: string;
  targetId: string;
  targetType: 'comment' | 'challenge';
}

interface LikeButtonProps {
  targetId: string;
  targetType: 'comment' | 'challenge';
}

const LikeButton = ({ targetId, targetType }: LikeButtonProps) => {
  const queryClient = useQueryClient();

  const { data: likes = [] } = useQuery<Like[]>({
    queryKey: ['likes', targetType, targetId],
    queryFn: async () => {
      const res = await getLikes(targetType, targetId);
      return Array.isArray(res.data) ? res.data : []; // ✅ normalize
    },
  });

  const userId = localStorage.getItem('userId');
  const isLiked = likes.some((like) => like.userId === userId);

  const likeMutation = useMutation({
    mutationFn: async () => createLike({ targetType, targetId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['likes', targetType, targetId] }),
  });

  const unlikeMutation = useMutation({
    mutationFn: async () => deleteLike(targetType, targetId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['likes', targetType, targetId] }),
  });

  const handleClick = () => {
    if (isLiked) unlikeMutation.mutate();
    else likeMutation.mutate();
  };

  return (
    <button
      onClick={handleClick}
      disabled={likeMutation.isPending || unlikeMutation.isPending}
      className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs 
                 text-zinc-400 hover:text-red-400 transition-colors
                 hover:bg-zinc-800/50 disabled:opacity-50"
    >
      {isLiked ? (
        <FaHeart className="text-red-500 w-3.5 h-3.5" />
      ) : (
        <FaRegHeart className="w-3.5 h-3.5" />
      )}
      <span className="text-[11px]">{likes.length}</span>
    </button>
  );
};

export default LikeButton;
