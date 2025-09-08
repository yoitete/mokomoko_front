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
  created_at?: string;
  updated_at?: string;
};

// 投稿作成用の型定義
export type CreatePostData = {
  user_id: number;
  title: string;
  price?: number;
  description?: string;
  season: string;
};

// 画像付き投稿作成用の型定義
export type CreatePostWithImageData = {
  user_id: number;
  title: string;
  price?: number;
  description?: string;
  season: string;
  image?: File;
};

// 投稿作成のリクエスト型
export type CreatePostRequest = {
  post: CreatePostData;
};

// 投稿作成のレスポンス型
export type CreatePostResponse = {
  id: number;
  user_id: number;
  title: string;
  price?: number;
  description?: string;
  season: string;
  created_at: string;
  updated_at: string;
};

export const usePosts = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { post, postFormData } = useAPI();

  // 投稿を作成（画像なし）
  const createPost = useCallback(
    async (postData: CreatePostData): Promise<CreatePostResponse> => {
      try {
        setLoading(true);
        setError(null);

        const requestData: CreatePostRequest = {
          post: postData,
        };

        const response = await post<CreatePostResponse>("/posts", requestData);
        return response;
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

  // 画像付き投稿を作成
  const createPostWithImage = useCallback(
    async (postData: CreatePostWithImageData): Promise<CreatePostResponse> => {
      try {
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("post[user_id]", postData.user_id.toString());
        formData.append("post[title]", postData.title);
        formData.append("post[description]", postData.description || "");
        formData.append("post[season]", postData.season);
        
        if (postData.price) {
          formData.append("post[price]", postData.price.toString());
        }
        
        if (postData.image) {
          formData.append("post[images][]", postData.image);
        }

        const response = await postFormData<CreatePostResponse>("/posts", formData);
        return response;
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

  // エラーをクリア
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    createPost,
    createPostWithImage,
    clearError,
  };
};
