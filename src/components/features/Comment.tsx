import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteComment } from '../../apis/commentsApi';
import LikeButton from './LikeButton';
import Card from '../common/Card';
import type { Comment as CommentType } from '../../apis/commentsApi';
import Button from '../common/Button';

interface CommentProps {
  comment: CommentType;
}

const Comment = ({ comment }: CommentProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => deleteComment(comment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['comments', comment.challengeId],
      });
    },
  });

  return (
    <Card className="ml-4">
      <p className="text-textPrimary">{comment.text}</p>
      {/* {comment.mediaUrl && (
        // <img
        //   src={comment?.mediaUrl}
        //   alt="comment media"
        //   className="mt-2 max-w-xs rounded"
        // />
      )} */}
      <div className="mt-2 flex gap-2">
        <LikeButton targetId={comment.id} targetType="comment" />
        <Button
          variant="outline"
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
        >
          Delete
        </Button>
      </div>
      {comment.replies && (
        <div className="mt-4">
          {comment.replies.map((reply) => (
            <Comment key={reply.id} comment={reply} />
          ))}
        </div>
      )}
    </Card>
  );
};

export default Comment;
