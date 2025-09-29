// src/components/features/CommentsSection.tsx
import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getComments, createComment } from "../../apis/commentsApi";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Comment from "./Comment";
import Input from "../common/Input";
import Button from "../common/Button";
import { Paperclip } from "lucide-react";
import Loader from "../common/Loader";
import ErrorMessage from "../common/ErrorMessage";

interface CommentsSectionProps {
  challengeId: string;
}

const CommentsSection = ({ challengeId }: CommentsSectionProps) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [commentText, setCommentText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch comments
  const {
    data: comments = [],
    isLoading: commentsLoading,
    error: commentsError,
  } = useQuery({
    queryKey: ["comments", challengeId],
    queryFn: () => getComments(challengeId),
    staleTime: 1000 * 30,
  });

  // Comment mutation
  const createCommentMutation = useMutation({
    mutationFn: (data: FormData) => createComment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", challengeId] });
      setCommentText("");
      setFile(null);
      setFilePreview(null);
    },
  });

  useEffect(() => {
    if (!file) {
      setFilePreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setFilePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleCommentSubmit = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!commentText.trim() && !file) return;

    const formData = new FormData();
    formData.append("challengeId", challengeId);
    formData.append("text", commentText);
    if (file) formData.append("media", file);
    if (user) formData.append("userId", user.id);
    createCommentMutation.mutate(formData);
  };

  if (commentsLoading) return <Loader />;
  if (commentsError) return <ErrorMessage message="Failed to load comments" />;

  return (
    <div className="mt-3 border-t border-zinc-800 pt-3 space-y-3">
      {/* Existing comments */}
      {comments.length === 0 ? (
        <div className="text-center text-zinc-500 text-sm">No comments yet</div>
      ) : (
        comments.map((comment: any) => (
          <Comment key={comment.$id} comment={comment} />
        ))
      )}

      {/* File preview */}
      {filePreview && (
        <div className="mb-2 w-24 h-16 rounded-md overflow-hidden">
          {file?.type.startsWith("image") ? (
            <img src={filePreview} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <video src={filePreview} className="w-full h-full object-cover" controls />
          )}
        </div>
      )}

      {/* Input row */}
      <div className="flex items-center gap-2">
        <Input
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="bg-zinc-800 text-white text-sm flex-1"
          isComment={true}
        />
        <input
          type="file"
          accept="image/*,video/*"
          ref={fileInputRef}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) setFile(f);
          }}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="text-zinc-400 hover:text-white p-2"
        >
          <Paperclip className="w-5 h-5" />
        </button>
        <Button
          onClick={handleCommentSubmit}
          disabled={createCommentMutation.isLoading}
          className="bg-blue-500 text-white px-4 py-2 text-sm"
        >
          {createCommentMutation.isLoading ? "Posting..." : "Post"}
        </Button>
      </div>
    </div>
  );
};

export default CommentsSection;
