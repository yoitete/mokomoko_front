import { useState, useCallback } from "react";
import { usePost, usePut, useDelete } from "./useSWRAPI";
import { useAPI } from "./useAPI";
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
  favorites_count?: number;
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
  const { postFormData } = useAPI();

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

  // 投稿を作成（画像付き）
  const createPostWithImage = useCallback(
    async (postDataInput: CreatePostWithImageData) => {
      try {
        setLoading(true);
        setError(null);

        // FormDataを作成
        const formData = new FormData();
        formData.append("post[user_id]", postDataInput.user_id.toString());
        formData.append("post[title]", postDataInput.title);
        formData.append("post[description]", postDataInput.description || "");
        formData.append("post[season]", postDataInput.season);

        if (postDataInput.price !== undefined) {
          formData.append("post[price]", postDataInput.price.toString());
        }

        if (postDataInput.tags && postDataInput.tags.length > 0) {
          postDataInput.tags.forEach((tag) => {
            formData.append("post[tags][]", tag);
          });
        }

        if (postDataInput.image) {
          formData.append("post[images][]", postDataInput.image);
        }

        // FormDataを使用してPOST
        const data = await postFormData<Post>("/posts", formData);

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
    [postFormData]
  );

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
