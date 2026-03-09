import { useEffect, useRef, useCallback } from "react";
import { useAuth } from "./useAuth";
import { useUserByFirebaseUID } from "./useProfile";
import { useAPI } from "./useAPI";
import { mutate } from "swr";

/**
 * 現在ログイン中のユーザー情報を取得するフック
 * Firebase認証とAPI側のユーザーデータを組み合わせて提供
 * APIにユーザーが存在しない場合は自動作成する
 */
export const useCurrentUser = () => {
  const {
    user,
    token,
    loading: authLoading,
    isAuthenticated,
    isUnauthenticated,
  } = useAuth();
  const {
    data: userData,
    error: userError,
    isLoading: userDataLoading,
  } = useUserByFirebaseUID(user?.uid || null);
  const { post } = useAPI();
  const isCreatingRef = useRef(false);

  // APIにユーザーが存在しない場合（404）、自動作成する
  const autoCreateUser = useCallback(async () => {
    if (isCreatingRef.current) return;
    if (!user?.uid || !token) return;

    isCreatingRef.current = true;
    try {
      await post("/users", {
        name: user.displayName || "",
        token: token,
      });
      await mutate(`/users/by_firebase_uid/${user.uid}`);
    } catch (err) {
      console.error("useCurrentUser: APIユーザー自動作成失敗:", err);
    } finally {
      isCreatingRef.current = false;
    }
  }, [user?.uid, user?.displayName, token, post]);

  useEffect(() => {
    // Firebaseユーザーが存在し、トークンがあり、APIユーザーが404の場合
    const is404 =
      userError &&
      typeof userError === "object" &&
      "response" in userError &&
      (userError as { response?: { status?: number } }).response?.status === 404;

    if (user?.uid && token && is404 && !isCreatingRef.current) {
      autoCreateUser();
    }
  }, [user?.uid, token, userError, autoCreateUser]);

  return {
    // Firebase認証情報
    firebaseUser: user,
    firebaseUID: user?.uid || null,

    // API側のユーザーデータ
    userData,
    userId: userData?.id || null,
    name: userData?.name || null,
    nickname: userData?.nickname || null,
    bio: userData?.bio || null,
    profileImage: userData?.profile_image || null,
    selectedIcon: userData?.selected_icon || null,

    // 認証状態
    isAuthenticated,
    isUnauthenticated,

    // ローディング状態
    loading: authLoading || userDataLoading,
    authLoading,
    userDataLoading,

    // エラー
    error: userError,

    // ヘルパー関数
    isUserDataReady: Boolean(userData?.id),
    hasCompleteProfile: Boolean(userData?.nickname && userData?.bio),
  };
};

export type CurrentUser = ReturnType<typeof useCurrentUser>;
