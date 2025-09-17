import { useState, useCallback } from "react";
import { usePost, usePut, useDelete } from "./useSWRAPI";
import { mutate } from "swr";

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
  // ミューテーション用のフック
  const postData = usePost<Post>();
  const putData = usePut<Post>();
  const deleteData = useDelete();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 投稿を作成（画像なし）
  const createPost = useCallback(
    async (postDataInput: CreatePostData) => {
      try {
        setLoading(true);
        setError(null);
        const data = await postData("/posts", { post: postDataInput });
        // キャッシュを更新
        mutate("/posts");
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
    [postData]
  );

  // 投稿を作成（画像付き）- TODO: FormData対応が必要
  const createPostWithImage = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: FormDataを使用した画像アップロード機能の実装が必要
      // 現在はSWRのpostFormData相当の機能が未実装
      throw new Error("画像付き投稿機能は現在開発中です");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "投稿の作成に失敗しました";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 投稿を更新
  const updatePost = useCallback(
    async (id: number, postDataInput: Partial<CreatePostData>) => {
      try {
        setLoading(true);
        setError(null);
        const data = await putData(`/posts/${id}`, { post: postDataInput });
        // キャッシュを更新
        mutate("/posts");
        mutate(`/posts/${id}`);
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
    [putData]
  );

  // 投稿を削除
  const deletePost = useCallback(
    async (id: number) => {
      try {
        setLoading(true);
        setError(null);
        await deleteData(`/posts/${id}`);
        // キャッシュを更新
        mutate("/posts");
        return;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "投稿の削除に失敗しました";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [deleteData]
  );

  return {
    loading,
    error,
    createPost,
    createPostWithImage,
    updatePost,
    deletePost,
  };
};
