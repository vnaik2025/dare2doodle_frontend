// src/pages/Bookmarks.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBookmarks, deleteBookmark } from "../apis/bookmarksApi";
import type { Bookmark } from "../apis/bookmarksApi";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import { Trash2, Eye } from "lucide-react";
import { extractImageUrl } from "../utils/url";


const formatDate = (iso?: string) => {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
};

const Bookmarks: React.FC = () => {
  const queryClient = useQueryClient();
  const {
    data: bookmarks = [],
    isLoading,
    error,
  } = useQuery<Bookmark[]>({
    queryKey: ["bookmarks"],
    queryFn: getBookmarks,
    // keepPreviousData: true, // optional
  });

  const removeMutation = useMutation({
    mutationFn: (challengeId: string) => deleteBookmark(challengeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});


  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage message="Failed to load bookmarks" />;

  return (
    <div className="min-h-screen bg-black text-white px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold mb-4 text-gray-100">Your Bookmarks</h1>
        <p className="text-sm text-zinc-400 mb-8">
          Saved challenges you can revisit anytime. Click a card to open the challenge.
        </p>

        {bookmarks.length === 0 ? (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-8 text-center text-zinc-400">
            No bookmarks yet — click the bookmark icon on a challenge to save it.
          </div>
        ) : (
          <div className="space-y-4">
            {bookmarks.map((bm) => {
              const ch = (bm as any).challenge;
              const challengeId = ch?.$id || ch?.id || (bm.challengeId as string);
              const bookmarkId = (bm as any).$id || (bm as any).challengeId || challengeId;
              const isExpanded = !!expanded[bookmarkId];

              return (
                <article
                  key={bookmarkId}
                  className="flex gap-4 items-start bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:shadow-lg transition-shadow"
                >
                  {/* thumbnail */}
                  {/* thumbnail */}
<div className="w-24 h-16 flex-shrink-0 rounded-md overflow-hidden bg-zinc-800 border border-zinc-800">
  {ch?.imageUrl ? (
    // eslint-disable-next-line jsx-a11y/img-redundant-alt
    <img
      src={extractImageUrl(ch.imageUrl)}   // ✅ use extractImageUrl here
      alt={`${ch.title} thumbnail`}
      className="w-full h-full object-cover"
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center text-xs text-zinc-500 px-1 text-center">
      No image
    </div>
  )}
</div>


                  {/* main text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="text-lg font-semibold text-gray-100 truncate">
                          {ch?.title || "Untitled challenge"}
                        </h2>

                        <div className="text-xs text-zinc-400 mt-1">
                          <span className="inline-block mr-2">
                            <span className="text-zinc-300">Creator:</span>{" "}
                            <span className="font-medium">
                              {(ch?.creatorName || ch?.creator || "Unknown")}
                            </span>
                          </span>

                          <span className="inline-block mr-2">
                            <span className="text-zinc-300">Created:</span>{" "}
                            <span>{formatDate(ch?.createdAt)}</span>
                          </span>

                          <span className="inline-block">
                            <span className="text-zinc-300">Bookmarked:</span>{" "}
                            <span>{formatDate((bm as any).createdAt || (bm as any).$createdAt)}</span>
                          </span>
                        </div>
                      </div>

                      {/* actions */}
                      <div className="flex flex-col items-end gap-2">
                        <Link
                          to={`/challenge/${challengeId}`}
                          className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-zinc-800 border border-zinc-700 text-sm text-zinc-200 hover:bg-zinc-700"
                          aria-label="View challenge"
                        >
                          <Eye size={14} /> View
                        </Link>

                        <button
                          onClick={() => {
                            if (!window.confirm("Remove bookmark?")) return;
                            removeMutation.mutate(challengeId);
                          }}
                          disabled={removeMutation.isLoading}
                          className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-transparent border border-zinc-800 text-sm text-zinc-400 hover:text-white hover:border-zinc-600"
                          aria-label="Remove bookmark"
                        >
                          <Trash2 size={14} />
                          Unbookmark
                        </button>
                      </div>
                    </div>

                    {/* description */}
                    <div className="mt-3 text-sm text-zinc-300">
                      <p
                        className={`prose text-sm max-w-full text-zinc-300 ${
                          !isExpanded ? "line-clamp-3" : ""
                        }`}
                      >
                        {ch?.description || "No description provided."}
                      </p>

                      {ch?.description && ch.description.length > 220 && (
                        <button
                          onClick={() =>
                            setExpanded((s) => ({ ...s, [bookmarkId]: !isExpanded }))
                          }
                          className="mt-2 text-xs text-blue-400 hover:underline"
                        >
                          {isExpanded ? "Show less" : "Read more"}
                        </button>
                      )}
                    </div>

                    {/* tags */}
                    {Array.isArray(ch?.tags) && ch.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {ch.tags.map((t: string) => (
                          <span
                            key={t}
                            className="text-xs bg-zinc-800 px-2 py-1 rounded-full text-zinc-200 border border-zinc-700"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
