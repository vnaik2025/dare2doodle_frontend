import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { getChallenge, deleteChallenge } from "../apis/challengesApi";
import { getComments, createComment } from "../apis/commentsApi";
import {
  createBookmark,
  deleteBookmark,
  getBookmarks,
} from "../apis/bookmarksApi";
import type { RootState } from "../store";
import type { Comment as CommentType } from "../apis/commentsApi";
import type { Bookmark } from "../apis/bookmarksApi";
import ChallengeCard from "../components/features/ChallengeCard";
import Comment from "../components/features/Comment";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import {
  Paperclip,
  ChevronLeft,
  Bookmark as BookmarkIcon,
  BookmarkCheck,
} from "lucide-react";

interface CommentForm {
  text: string;
}

const formatDate = (iso?: string) => {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
};

const ChallengeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useSelector((s: RootState) => s.auth);
  const queryClient = useQueryClient();

  // local file state for main comment input
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // fetch challenge
  const {
    data: challenge,
    isLoading: challengeLoading,
    error: challengeError,
  } = useQuery({
    queryKey: ["challenge", id],
    queryFn: () => getChallenge(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 2,
  });

  // fetch comments
  const {
    data: comments = [],
    isLoading: commentsLoading,
    error: commentsError,
  } = useQuery({
    queryKey: ["comments", id],
    queryFn: () => getComments(id!),
    enabled: !!id,
    staleTime: 1000 * 30,
  });

  // fetch bookmarks
  const { data: bookmarks = [], isLoading: bookmarksLoading } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: () => getBookmarks(),
    enabled: !!user, // only fetch if logged in
  });

  const isBookmarked = bookmarks?.some((b: Bookmark) => b.challengeId === id);

  // bookmark mutations
  const addBookmarkMutation = useMutation({
    mutationFn: () => createBookmark({ challengeId: id! }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookmarks"] }),
  });

  const removeBookmarkMutation = useMutation({
    mutationFn: () => deleteBookmark(id!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookmarks"] }),
  });

  // form
  const { register, handleSubmit, reset } = useForm<CommentForm>();

  const createCommentMutation = useMutation({
    mutationFn: (data: FormData) => createComment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", id] });
      reset();
      setFile(null);
      setFilePreview(null);
    },
  });

  // delete challenge
  const deleteMutation = useMutation({
    mutationFn: () => deleteChallenge(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
      navigate("/");
    },
  });

  // create file preview
  useEffect(() => {
    if (!file) {
      setFilePreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setFilePreview(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  // derive challengeId (some backends use $id)
  const challengeId =
    (challenge && ((challenge as any).id || (challenge as any).$id)) || id;

  // on submit
  const onSubmit = useCallback(
    (data: CommentForm) => {
      const formData = new FormData();
      formData.append("challengeId", challengeId!);
      formData.append("text", data.text);
      if (file) formData.append("media", file);
      if (user) formData.append("userId", user.id);
      createCommentMutation.mutate(formData);
    },
    [file, user, createCommentMutation, challengeId]
  );

  const handleDelete = useCallback(() => {
    if (!window.confirm("Delete this challenge? This cannot be undone."))
      return;
    deleteMutation.mutate();
  }, [deleteMutation]);


  const extractImageUrl = (urlWithId?: string) => {
  if (!urlWithId) return null;
  return urlWithId.split("|")[0]; // only keep the actual URL
};


  const handleToggleBookmark = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (isBookmarked) {
      removeBookmarkMutation.mutate();
    } else {
      addBookmarkMutation.mutate();
    }
  };

  if (challengeLoading || commentsLoading || bookmarksLoading)
    return <Loader />;

  if (challengeError || commentsError)
    return <ErrorMessage message="Failed to load challenge or comments" />;

  if (!challenge) return <ErrorMessage message="Challenge not found" />;

  return (
    <div className="min-h-screen bg-black text-white pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: compact card */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 shadow-sm">
              <div className="mb-3">
                <ChallengeCard challenge={challenge as any} />
              </div>

              <div className="mt-2 text-sm text-zinc-300 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-400">Creator</span>
                  <span className="font-medium truncate">
                    {(challenge as any).creatorName ||
                      (challenge as any).creator ||
                      "Unknown"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-400">Created</span>
                  <span className="text-xs text-zinc-300">
                    {formatDate((challenge as any).createdAt)}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-zinc-400">Tags</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {((challenge as any).tags || []).length ? (
                      ((challenge as any).tags || []).map((t: string) => (
                        <span
                          key={t}
                          className="text-xs bg-zinc-800 px-2 py-1 rounded-full"
                        >
                          {t}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-zinc-500">No tags</span>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex gap-3">
                  {user && (
                    <Button
                      variant="ghost"
                      onClick={() =>
                        navigate(`/challenge/${challengeId}/participate`)
                      }
                      className="text-sm px-3 py-1"
                    >
                      Participate
                    </Button>
                  )}

                  {user && user.id === (challenge as any).creatorId && (
                    <Button
                      variant="outline"
                      className="text-sm px-3 py-1"
                      onClick={handleDelete}
                      disabled={deleteMutation.isLoading}
                    >
                      {deleteMutation.isLoading ? "Deleting..." : "Delete"}
                    </Button>
                  )}

                  {user && (
                    <button
                      onClick={handleToggleBookmark}
                      className="ml-auto text-zinc-400 hover:text-white"
                      aria-label="Toggle bookmark"
                      disabled={
                        addBookmarkMutation.isLoading ||
                        removeBookmarkMutation.isLoading
                      }
                    >
                      {isBookmarked ? (
                        <BookmarkCheck size={20} className="text-blue-400" />
                      ) : (
                        <BookmarkIcon size={20} />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Right: description + comments */}
        <main className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Link
                to="/"
                className="text-sm flex flex-row justify-items-start items-center text-zinc-400 hover:text-white"
              >
                <ChevronLeft /> <p>Back to feed</p>
              </Link>
              <h1 className="text-xl md:text-2xl font-semibold mt-2">
                {(challenge as any).title || "Untitled"}
              </h1>
              <p className="text-sm text-zinc-300 mt-1 line-clamp-4">
                {(challenge as any).description || ""}
              </p>
            </div>
            <div className="text-sm text-zinc-400">
              <span className="hidden sm:inline">ID:</span>{" "}
              <span className="font-mono text-xs">{challengeId}</span>
            </div>
          </div>

          {/* Comment form */}
          <section className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                {user ? (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    {/* preview above input */}
                    {filePreview && (
                      <div className="mt-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="text-xs text-zinc-400">Preview</div>
                          <button
                            type="button"
                            className="text-xs text-zinc-400 hover:text-white"
                            onClick={() => setFile(null)}
                          >
                            Remove
                          </button>
                        </div>

                        <div className="mt-2 w-48 h-28 rounded-md overflow-hidden border border-zinc-800">
                          {file && file.type.startsWith("image") ? (
                            // eslint-disable-next-line jsx-a11y/img-redundant-alt
                            <img
                              src={filePreview}
                              alt="file preview"
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
                      </div>
                    )}
                    {/* input row */}
                    <div className="flex items-center w-full gap-2">
                      {/* Input field (80%) */}
                      <div className="flex-[0.8]">
                        <Input
                          placeholder="Add a comment with submission art image..."
                          register={register("text", {
                            required: "Comment is required",
                          })}
                          className="bg-zinc-800 text-sm w-full pr-10"
                        />
                      </div>

                      {/* hidden file input */}
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

                      {/* Paperclip (5%) */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-[0.05] flex items-center justify-center text-zinc-400 hover:text-white"
                        aria-label="Attach file"
                      >
                        <Paperclip size={18} />
                      </button>

                      {/* Post button (15%) */}
                      <div className="flex-[0.15]">
                        <Button
                          type="submit"
                          disabled={createCommentMutation.isLoading}
                          className="w-full h-full text-sm bg-blue-400"
                        >
                          {createCommentMutation.isLoading
                            ? "Posting..."
                            : "Post"}
                        </Button>
                      </div>
                    </div>

                    {createCommentMutation.error && (
                      <ErrorMessage message="Failed to post comment" />
                    )}
                  </form>
                ) : (
                  <div className="text-sm text-zinc-400">
                    <Link to="/login" className="underline">
                      Login
                    </Link>{" "}
                    to post a comment.
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Comments list */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">
              Comments{" "}
              <span className="text-sm text-zinc-400">
                ({comments?.length || 0})
              </span>
            </h2>

            {comments.length === 0 ? (
              <div className="bg-zinc-900/50 border border-dashed border-zinc-800 rounded-lg p-6 text-center text-zinc-400">
                No comments yet — be the first to share a thought.
              </div>
            ) : (
              <div className="space-y-3">
                {comments.map((c: CommentType) => (
                  <div key={(c as any).id} className=" rounded-xl p-0">
                    <Comment comment={c as any} />
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default ChallengeDetail;
