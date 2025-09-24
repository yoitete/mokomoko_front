import { useGet } from "./useSWRAPI";
import { useAPI } from "./useAPI";
import { Post } from "./usePosts";
import { mutate } from "swr";
import { useState } from "react";

export const useMyPosts = () => {
  const {
    data: postsResponse,
    error,
    isLoading,
  } = useGet<{ posts: Post[] }>("/posts/my", { requireAuth: true });

  // APIレスポンスからposts配列を抽出
  const posts = postsResponse?.posts || [];
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
    error,
    isLoading,
    deletePost: handleDeletePost,
    isDeleting,
  };
};
