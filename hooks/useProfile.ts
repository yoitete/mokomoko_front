import { useState, useCallback } from "react";
import { usePost, usePut, useGet } from "./useSWRAPI";
import { useAPI } from "./useAPI";
import { mutate } from "swr";

// プロフィールの型定義
export type Profile = {
  id?: number;
  user_id: number;
  nickname: string;
  bio: string;
  profile_image?: string | null;
  selected_icon: string;
  created_at?: string;
  updated_at?: string;
};

// プロフィール更新用の型定義
export type UpdateProfileData = {
  nickname: string;
  bio: string;
  profile_image?: string | null;
  selected_icon: string;
};

// プロフィール画像アップロード用の型定義
export type UploadProfileImageData = {
  user_id: number;
  profile_image: File;
};

export const useProfile = () => {
  // ミューテーション用のフック
  const postData = usePost<Profile>();
  const putData = usePut<Profile>();
  const { postFormData } = useAPI();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // プロフィールを取得
  const getProfile = useCallback((userId: number) => {
    return useGet<Profile>(`/profiles/${userId}`, {
      revalidateOnFocus: false,
      dedupingInterval: 30000, // 30秒間キャッシュ
    });
  }, []);

  // プロフィールを作成
  const createProfile = useCallback(
    async (profileData: Omit<Profile, "id" | "created_at" | "updated_at">) => {
      try {
        setLoading(true);
        setError(null);
        const data = await postData("/profiles", { profile: profileData });
        // キャッシュを更新
        mutate(`/profiles/${profileData.user_id}`);
        return data;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "プロフィールの作成に失敗しました";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [postData]
  );

  // プロフィールを更新
  const updateProfile = useCallback(
    async (userId: number, profileData: UpdateProfileData) => {
      try {
        setLoading(true);
        setError(null);
        const data = await putData(`/profiles/${userId}`, {
          profile: profileData,
        });
        // キャッシュを更新
        mutate(`/profiles/${userId}`);
        return data;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "プロフィールの更新に失敗しました";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [putData]
  );

  // プロフィール画像をアップロード
  const uploadProfileImage = useCallback(
    async (uploadData: UploadProfileImageData) => {
      try {
        setLoading(true);
        setError(null);

        // FormDataを作成
        const formData = new FormData();
        formData.append("profile[user_id]", uploadData.user_id.toString());
        formData.append("profile[profile_image]", uploadData.profile_image);

        // FormDataを使用してPOST
        const data = await postFormData<Profile>(
          "/profiles/upload_image",
          formData
        );

        // キャッシュを更新
        mutate(`/profiles/${uploadData.user_id}`);
        return data;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "プロフィール画像のアップロードに失敗しました";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [postFormData]
  );

  return {
    loading,
    error,
    getProfile,
    createProfile,
    updateProfile,
    uploadProfileImage,
  };
};
