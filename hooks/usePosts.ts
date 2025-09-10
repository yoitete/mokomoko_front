import { useState, useCallback } from "react";
import { useAPI } from "./useAPI";

// 投稿の型定義
export type Post = {
  id?: number;
  user_id: number;
  title: string;
  price?: number;
  description?: string;
  season: string;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
  images?: string[];
};

// 投稿作成用の型定義
export type CreatePostData = {
  user_id: number;
  title: string;
  price?: number;
  description?: string;
  season: string;
  tags?: string[];
};

// 画像付き投稿作成用の型定義
export type CreatePostWithImageData = {
  user_id: number;
  title: string;
  price?: number;
  description?: string;
  season: string;
  tags?: string[];
  image?: File;
};

export const usePosts = () => {
  const { get, post, postFormData, delete: del } = useAPI();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 投稿一覧を取得
  const getPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await get<Post[]>("/posts");
      setPosts(data);
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "投稿の取得に失敗しました";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [get]);

  // 投稿を作成（画像なし）
  const createPost = useCallback(
    async (postData: CreatePostData) => {
      try {
        setLoading(true);
        setError(null);
        const data = await post<Post>("/posts", { post: postData });
        setPosts((prev) => [data, ...prev]);
        return data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "投稿の作成に失敗しました";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [post]
  );

  // 投稿を作成（画像付き）
  const createPostWithImage = useCallback(
    async (postData: CreatePostWithImageData) => {
      try {
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("post[user_id]", postData.user_id.toString());
        formData.append("post[title]", postData.title);
        formData.append("post[description]", postData.description || "");
        formData.append("post[season]", postData.season);

        if (postData.price !== undefined) {
          formData.append("post[price]", postData.price.toString());
        }

        if (postData.tags && postData.tags.length > 0) {
          postData.tags.forEach((tag) => {
            formData.append("post[tags][]", tag);
          });
        }

        if (postData.image) {
          formData.append("post[images][]", postData.image);
        }

        const data = await postFormData<Post>("/posts", formData);
        setPosts((prev) => [data, ...prev]);
        return data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "投稿の作成に失敗しました";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [postFormData]
  );

  // 投稿を更新
  const updatePost = useCallback(
    async (id: number, postData: Partial<CreatePostData>) => {
      try {
        setLoading(true);
        setError(null);
        const data = await post<Post>(`/posts/${id}`, { post: postData });
        setPosts((prev) => prev.map((post) => (post.id === id ? data : post)));
        return data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "投稿の更新に失敗しました";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [post]
  );

  // 投稿を削除
  const deletePost = useCallback(
    async (id: number) => {
      try {
        setLoading(true);
        setError(null);
        await del(`/posts/${id}`);
        setPosts((prev) => prev.filter((post) => post.id !== id));
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "投稿の削除に失敗しました";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [del]
  );

  return {
    posts,
    loading,
    error,
    getPosts,
    createPost,
    createPostWithImage,
    updatePost,
    deletePost,
  };
};
