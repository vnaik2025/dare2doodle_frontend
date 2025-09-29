import { MessageCircle } from "lucide-react";
import ActionButton from "../common/ActionButton";
import { useQuery } from "@tanstack/react-query";
import { getComments } from "../../apis/commentsApi";
import { useEffect } from "react";

interface CommentButtonProps {
  isOpen: boolean;
  toggle: () => void;
  challengeId: string;
}

const isTopLevelComment = (c: any) => {
  // treat as top-level if no obvious parent fields exist
  return !(
    c?.parentId ||
    c?.parent ||
    c?.replyTo ||
    c?.parentCommentId ||
    c?.parent_comment_id ||
    c?.isReply
  );
};

const CommentButton = ({ isOpen, toggle, challengeId }: CommentButtonProps) => {
  // reuse same query key as CommentsSection so we hit cache if already fetched
  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["comments", challengeId],
    queryFn: () => getComments(challengeId).then((res: any) => res.data ?? res),
    staleTime: 1000 * 30,
  });

  const topLevelCount = Array.isArray(comments)
    ? comments.filter((c: any) => isTopLevelComment(c)).length
    : 0;

    useEffect(()=>
    {
    console.log("top level comment ",topLevelCount)


    },[topLevelCount])

  return (
    <ActionButton
      aria-label={isOpen ? "Hide comments" : "Show comments"}
      icon={
        <MessageCircle
          className={
            "w-5 h-5 transition-colors " + (isOpen ? "text-blue-500" : "text-gray-400")
          }
        />
      }
      count={topLevelCount}
      active={isOpen}
      onClick={toggle}
      // don't disable while loading — still allow toggling; optional: disabled={isLoading}
    />
  );
};

export default CommentButton;
