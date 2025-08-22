import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createLike, deleteLike, getLikes } from '../../apis/likesApi';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import Button from '../common/Button';

// Define the shape of a Like object (based on your API)
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

  // ✅ v5 useQuery requires object form
  const { data: likes = [] } = useQuery<Like[]>({
    queryKey: ['likes', targetType, targetId],
    queryFn: async () => {
      const res = await getLikes(targetType, targetId); // axios response
      return res.data; // ensure we return Like[]
    },
  });

  const userId = localStorage.getItem('userId');
  // const isLiked = likes?.some((like) => like.userId === userId);
  const isLiked = true;


  // ✅ v5 useMutation requires object form
  const likeMutation = useMutation({
    mutationFn: async () => {
      await createLike({ targetType, targetId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['likes', targetType, targetId] });
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: async () => {
      await deleteLike(targetType, targetId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['likes', targetType, targetId] });
    },
  });

  const handleClick = () => {
    if (isLiked) {
      unlikeMutation.mutate();
    } else {
      likeMutation.mutate();
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      disabled={likeMutation.isPending || unlikeMutation.isPending}
    >
      {isLiked ? <FaHeart className="text-error" /> : <FaRegHeart />}
      <span className="ml-2">{likes.length}</span>
    </Button>
  );
};

export default LikeButton;
