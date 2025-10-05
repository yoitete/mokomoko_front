import { useGet } from "./useSWRAPI";
import { useAPI } from "./useAPI";
import { Post } from "./usePosts";
import { mutate } from "swr";
import { useState } from "react";

interface MyPostsResponse {
  posts: Post[];
  pagination: {
    current_page: number;
    per_page: number;
    total_count: number;
    total_pages: number;
  };
}

export const useMyPosts = (page: number = 1, perPage: number = 5) => {
  const {
    data: response,
    error,
    isLoading,
  } = useGet<MyPostsResponse>(`/posts/my?page=${page}&per_page=${perPage}`, {
    requireAuth: true,
  });

  const posts = response?.posts || [];
  const pagination = response?.pagination;

  const { delete: deleteAPI } = useAPI();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeletePost = async (postId: number) => {
    setIsDeleting(true);
    try {
      await deleteAPI(`/posts/${postId}`);
      // キャッシュを更新してリストから削除された投稿を除外
      mutate(
        "/posts/my",
        (currentPosts: Post[] | undefined) => {
          return currentPosts?.filter((post) => post.id !== postId) || [];
        },
        false
      );
      return { success: true };
    } catch (error) {
      console.error("投稿の削除に失敗しました:", error);
      return { success: false, error: error as unknown };
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    posts,
    pagination,
    error,
    isLoading,
    deletePost: handleDeletePost,
    isDeleting,
  };
};
