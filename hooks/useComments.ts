import { useCallback } from "react";
import { useGet, usePost, useDelete } from "./useSWRAPI";
import { mutate } from "swr";

export type Comment = {
  id: number;
  user_id: number;
  post_id: number;
  body: string;
  user_name?: string;
  user_nickname?: string | null;
  user_selected_icon?: string | null;
  created_at: string;
  updated_at: string;
};

export const useComments = (postId: number | null = null) => {
  const {
    data: comments,
    error,
    isLoading,
  } = useGet<Comment[]>(postId ? `/comments?post_id=${postId}` : null, {
    requireAuth: false,
    revalidateOnFocus: false,
  });

  const postData = usePost();
  const deleteData = useDelete();

  const addComment = useCallback(
    async (body: string) => {
      if (!postId) return;
      try {
        await postData(`/comments`, {
          post_id: postId,
          body: body,
        });
        mutate(`/comments?post_id=${postId}`);
      } catch (err) {
        console.error("Failed to add comment:", err);
        throw err;
      }
    },
    [postData, postId]
  );

  const removeComment = useCallback(
    async (commentId: number) => {
      if (!postId) return;
      try {
        await deleteData(`/comments/${commentId}`);
        mutate(`/comments?post_id=${postId}`);
      } catch (err) {
        console.error("Failed to remove comment:", err);
        throw err;
      }
    },
    [deleteData, postId]
  );

  return {
    comments: comments || [],
    isLoading,
    error: error?.message || null,
    addComment,
    removeComment,
  };
};
