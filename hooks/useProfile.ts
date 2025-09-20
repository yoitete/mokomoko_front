import { useState, useCallback } from "react";
import { usePost, usePut, useGet } from "./useSWRAPI";
import { useAPI } from "./useAPI";
import { mutate } from "swr";

// プロフィールの型定義
export type Profile = {
  id: number;
  firebase_uid?: string;
  name?: string;
  nickname?: string | null;
  bio?: string | null;
  profile_image?: string | null;
  selected_icon?: string | null;
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

  // プロフィール取得用のヘルパー関数（エンドポイントを生成）
  const getProfileEndpoint = useCallback((userId: number) => {
    return `/users/${userId}`;
  }, []);

  // プロフィールを作成
  const createProfile = useCallback(
    async (
      profileData: Omit<
        Profile,
        "id" | "created_at" | "updated_at" | "firebase_uid" | "name"
      >
    ) => {
      try {
        setLoading(true);
        setError(null);
        const data = await postData("/users", { profile: profileData });
        // キャッシュを更新（作成されたユーザーのIDを使用）
        if (data?.id) {
          mutate(`/users/${data.id}`);
        }
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
        const data = await putData(`/users/${userId}`, {
          profile: profileData,
        });
        // キャッシュを更新
        mutate(`/users/${userId}`);
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
          "/users/upload_image",
          formData
        );

        // キャッシュを更新
        mutate(`/users/${uploadData.user_id}`);
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
    getProfileEndpoint,
    createProfile,
    updateProfile,
    uploadProfileImage,
  };
};

// プロフィール取得専用フック
export const useProfileData = (userId: number | null) => {
  const shouldFetch = userId !== null;
  const endpoint = shouldFetch ? `/users/${userId}` : null;

  return useGet<Profile>(endpoint, {
    revalidateOnFocus: false,
    dedupingInterval: 30000, // 30秒間キャッシュ
  });
};

// Firebase UIDからユーザー情報を取得するフック
export const useUserByFirebaseUID = (firebaseUID: string | null) => {
  const shouldFetch = firebaseUID !== null;
  const endpoint = shouldFetch ? `/users/by_firebase_uid/${firebaseUID}` : null;

  return useGet<Profile>(endpoint, {
    revalidateOnFocus: false,
    dedupingInterval: 30000, // 30秒間キャッシュ
  });
};
