// src/components/comments/Comment.tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteComment, createComment } from '../../apis/commentsApi';
import LikeButton from './LikeButton';
import type { Comment as CommentType } from '../../apis/commentsApi';
import {
  Trash2,
  Reply,
  Share2,
  Paperclip,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import { useAuth } from '../../hooks/useAuth';

interface CommentProps {
  comment: CommentType;
  depth?: number;
}

/**
 * Helper: extract real media URL before '|' or '%' if present
 */
const extractRealMediaUrl = (mediaUrl?: string | null): string | null => {
  if (!mediaUrl) return null;
  const parts = mediaUrl.split(/[|%]/);
  const first = parts[0]?.trim();
  return first && first.length > 0 ? first : null;
};

/** Helper: basic image extension check */
const isImageUrl = (url: string) =>
  /\.(jpe?g|png|gif|webp|svg|bmp|tiff|heic)(\?.*)?$/i.test(url);

/** Helper: basic video extension check */
const isVideoUrl = (url: string) =>
  /\.(mp4|webm|ogg|mov|m4v|mkv)(\?.*)?$/i.test(url);

const Comment = ({ comment, depth = 0 }: CommentProps) => {
  const queryClient = useQueryClient();
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [replyText, setReplyText] = useState('');
  const { user } = useAuth();
  // delete comment mutation
  const deleteMutation = useMutation({
    mutationFn: () => deleteComment(comment.$id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['comments', comment.challengeId],
      });
    },
  });

  // create reply mutation
  const replyMutation = useMutation({
    mutationFn: (formData: FormData) => createComment(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['comments', comment.challengeId],
      });
      setReplyText('');
      setFile(null);
      setFilePreview(null);
      setShowReplyBox(false);
    },
  });

  // parse media url (split by | or %)
  let mediaUrl: string | null = null;
  if (comment.mediaUrl) {
    const parts = comment.mediaUrl.split(/[\|%]/);
    if (parts.length > 0) {
      mediaUrl = parts[0];
    }
  }

  // preview selected file
  useEffect(() => {
    if (!file) {
      setFilePreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setFilePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleShare = () => {
  const commentLink = `${window.location.origin}/challenges/${comment.challengeId}`;
  alert("Comment link copied to clipboard!");
};

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const handleReplySubmit = () => {

    console.log("parent comment is ",comment)
    if (!replyText.trim() && !file) return;

    const formData = new FormData();
    formData.append('challengeId', comment.challengeId);
    formData.append('text', replyText);
   formData.append('parentCommentId', comment.$id);

    if (file) formData.append('media', file);

    replyMutation.mutate(formData);
  };

  return (
    <div className="flex flex-col">
      {/* main comment row */}
      <div
        className="flex items-start gap-2 p-2 rounded-lg bg-zinc-900/40 border border-zinc-800"
        style={{ marginLeft: depth * 20 }}
      >
        {/* Avatar */}
        <Avatar
          name={comment?.userId}
          size={28}
          className="flex-shrink-0 "
        />

        {/* content */}
        <div className="flex-1">
          {/* user name */}
          <p className="text-xs font-semibold text-zinc-400">
            {comment.user?.name || 'Guest'}
          </p>

          {/* comment text */}
          <p className="text-sm leading-snug text-zinc-200">{comment.text}</p>

          {/* comment media (image/video) */}
          {mediaUrl && (
            <div className="mt-2 max-w-xs rounded-md overflow-hidden border border-zinc-700">
              {mediaUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                <img
                  src={mediaUrl}
                  alt="comment media"
                  className="w-full h-auto object-cover"
                />
              ) : (
                <video
                  src={mediaUrl}
                  className="w-full h-auto object-cover"
                  controls
                />
              )}
            </div>
          )}

          {/* actions */}
          <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
            {/* reply */}
            <button
              onClick={() => setShowReplyBox((s) => !s)}
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <Reply size={12} />
              Reply
            </button>

            {/* like */}
            <LikeButton targetId={comment.$id} targetType="comment" />

            {/* share */}
            <button   onClick={handleShare} className="flex items-center gap-1 hover:text-white transition-colors">
              <Share2 size={12} />
              Share
            </button>

            {/* delete */}
            <button
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
              className="p-1 rounded hover:bg-zinc-800 transition-colors"
            >
              <Trash2 size={14} className="text-zinc-400 hover:text-red-400" />
            </button>
          </div>

          {/* reply input box */}
          {showReplyBox && (
            <div className="mt-2 space-y-2">
              {/* file preview if selected (for reply attachment) */}
              {filePreview && (
                <div className="w-40 h-24 rounded-md overflow-hidden border border-zinc-700">
                  {file && file.type.startsWith('image') ? (
                    <img
                      src={filePreview}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={filePreview}
                      className="w-full h-full object-cover"
                      controls
                    />
                  )}
                </div>
              )}

              {/* input row */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="flex-1 rounded-md bg-zinc-800 text-sm p-1.5 text-zinc-200"
                />
                {/* hidden file input */}
                <input
                  type="file"
                  accept="image/*,video/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                {/* clip icon */}
                <button
                  type="button"
                  onClick={handleFileClick}
                  className="p-2 rounded hover:bg-zinc-800 transition-colors"
                >
                  <Paperclip size={16} className="text-zinc-400" />
                </button>
                {/* submit reply */}
                <Button
                  type="button"
                  onClick={handleReplySubmit}
                  disabled={replyMutation.isPending}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md text-xs"
                >
                  {replyMutation.isPending ? 'Posting...' : 'Post'}
                </Button>
              </div>
            </div>
          )}

          {/* nested replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2 space-y-2 border-l border-zinc-800 pl-4 ml-2">
              {comment.replies.map((reply) => (
                <Comment key={reply.id} comment={reply} depth={depth + 1} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;
