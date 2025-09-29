// // src/components/features/BookmarkButton.tsx
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { Bookmark } from "lucide-react";
// import { createBookmark, deleteBookmark, getBookmarks } from "../../apis/bookmarksApi";
// import ActionButton from "../common/ActionButton";
// import { useAuth } from "../../hooks/useAuth";
// import { useNavigate } from "react-router-dom";
// import clsx from "clsx";

// interface BookmarkButtonProps {
//   challengeId: string;
// }

// const BookmarkButton = ({ challengeId }: BookmarkButtonProps) => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();

//   const { data: bookmarks = [] } = useQuery({
//     queryKey: ["bookmarks"],
//     queryFn: getBookmarks,
//     enabled: !!user,
//   });

//   const isBookmarked = bookmarks.some((b: any) => b.challengeId === challengeId);

//   const addBookmarkMutation = useMutation({
//     mutationFn: () => createBookmark({ challengeId }),
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookmarks"] }),
//   });

//   const removeBookmarkMutation = useMutation({
//     mutationFn: () => deleteBookmark(challengeId),
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookmarks"] }),
//   });

//   const handleClick = () => {
//     if (!user) {
//       navigate("/login");
//       return;
//     }
//     isBookmarked ? removeBookmarkMutation.mutate() : addBookmarkMutation.mutate();
//   };

//   return (
//     <ActionButton
//       icon={
//         <Bookmark
//           className={clsx(
//             "w-5 h-5",
//             isBookmarked ? "text-primary fill-primary" : "text-zinc-400"
//           )}
//         />
//       }
//       label={isBookmarked ? "Saved" : "Save"}
//       active={isBookmarked}
//       onClick={handleClick}
//       disabled={addBookmarkMutation.isPending || removeBookmarkMutation.isPending}
//     />
//   );
// };

// export default BookmarkButton;


// src/components/features/BookmarkButton.tsx
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark } from "lucide-react";
import { createBookmark, deleteBookmark, getBookmarks } from "../../apis/bookmarksApi";
import ActionButton from "../common/ActionButton";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";

interface BookmarkButtonProps {
  challengeId: string;
}

const BookmarkButton = ({ challengeId }: BookmarkButtonProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: bookmarks = [] } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: getBookmarks,
    enabled: !!user,
    staleTime: 1000 * 60, // cache for 1 min
    refetchOnWindowFocus: false, // avoids unnecessary delays
  });

  const isBookmarked = bookmarks.some((b: any) => b.challengeId === challengeId);

  // Add Bookmark Mutation with Optimistic Update
  const addBookmarkMutation = useMutation({
    mutationFn: () => createBookmark({ challengeId }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["bookmarks"] });

      const previousBookmarks = queryClient.getQueryData<any[]>(["bookmarks"]) || [];

      // Optimistically update cache
      queryClient.setQueryData(["bookmarks"], [
        ...previousBookmarks,
        { challengeId, userId: user?.id }, // minimal optimistic object
      ]);

      return { previousBookmarks };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousBookmarks) {
        queryClient.setQueryData(["bookmarks"], context.previousBookmarks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });

  // Remove Bookmark Mutation with Optimistic Update
  const removeBookmarkMutation = useMutation({
    mutationFn: () => deleteBookmark(challengeId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["bookmarks"] });

      const previousBookmarks = queryClient.getQueryData<any[]>(["bookmarks"]) || [];

      // Optimistically update cache by filtering out
      queryClient.setQueryData(
        ["bookmarks"],
        previousBookmarks.filter((b: any) => b.challengeId !== challengeId)
      );

      return { previousBookmarks };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousBookmarks) {
        queryClient.setQueryData(["bookmarks"], context.previousBookmarks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });

  const handleClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    isBookmarked ? removeBookmarkMutation.mutate() : addBookmarkMutation.mutate();
  };

  return (
    <ActionButton
      icon={
        <Bookmark
          className={clsx(
            "w-5 h-5",
            isBookmarked ? "text-primary fill-primary" : "text-zinc-400"
          )}
        />
      }
      label={isBookmarked ? "Saved" : "Save"}
      active={isBookmarked}
      onClick={handleClick}
      disabled={addBookmarkMutation.isPending || removeBookmarkMutation.isPending}
    />
  );
};

export default BookmarkButton;
