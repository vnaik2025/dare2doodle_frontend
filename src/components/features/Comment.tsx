import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteComment } from '../../apis/commentsApi';
import LikeButton from './LikeButton';
import type { Comment as CommentType } from '../../apis/commentsApi';
import {
  Trash2,
  Reply,
  Share2,
  Paperclip,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Avatar from '../common/Avatar'; // ✅ import reusable avatar

interface CommentProps {
  comment: CommentType;
  depth?: number;
}

const Comment = ({ comment, depth = 0 }: CommentProps) => {
  const queryClient = useQueryClient();
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: () => deleteComment(comment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['comments', comment.challengeId],
      });
    },
  });

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  return (
    <div className="flex flex-col">
      {/* main comment row */}
      <div
        className="flex items-start gap-2 p-2 rounded-lg bg-zinc-900/40 border border-zinc-800"
        style={{ marginLeft: depth * 20 }}
      >
        {/* ✅ Avatar */}
        <Avatar
          name={comment.user?.name || 'Guest'}
          size={28}
          className="flex-shrink-0 "
        />

        {/* content */}
        <div className="flex-1">
          {/* user name */}
          <p className="text-xs font-semibold text-zinc-400">{comment.user?.name || 'Guest'}</p>
          {/* comment text */}
          <p className="text-sm leading-snug text-zinc-200">{comment.text}</p>

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
            <LikeButton targetId={comment.id} targetType="comment" />

            {/* share */}
            <button className="flex items-center gap-1 hover:text-white transition-colors">
              <Share2 size={12} />
              Share
            </button>

            {/* delete */}
            <button
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending}
              className="p-1 rounded hover:bg-zinc-800 transition-colors"
            >
              <Trash2 size={14} className="text-zinc-400 hover:text-red-400" />
            </button>
          </div>

          {/* reply input box */}
          {showReplyBox && (
            <div className="mt-2 space-y-2">
              {/* file preview if exists */}
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
