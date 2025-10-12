import { useAuth } from "./useAuth";
import { useUserByFirebaseUID } from "./useProfile";

/**
 * 現在ログイン中のユーザー情報を取得するフック
 * Firebase認証とAPI側のユーザーデータを組み合わせて提供
 */
export const useCurrentUser = () => {
  const {
    user,
    loading: authLoading,
    isAuthenticated,
    isUnauthenticated,
  } = useAuth();
  const {
    data: userData,
    error: userError,
    isLoading: userDataLoading,
  } = useUserByFirebaseUID(user?.uid || null);

  // デバッグログ
  console.log("useCurrentUser - Firebase User:", user);
  console.log("useCurrentUser - Firebase UID:", user?.uid);
  console.log("useCurrentUser - API User Data:", userData);
  console.log("useCurrentUser - User ID:", userData?.id);
  console.log("useCurrentUser - Loading states:", { authLoading, userDataLoading });
  console.log("useCurrentUser - Error:", userError);

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
