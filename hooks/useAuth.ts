import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useCallback } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { auth } from "@/lib/firebase";
import {
  authStateAtom,
  authLoadingAtom,
  authErrorAtom,
  authTokenAtom,
} from "@/lib/authAtoms";

export const useAuth = (): {
  user: import("firebase/auth").User | null;
  loading: boolean;
  error: string | null;
  token: string | null;
  isAuthenticated: boolean;
  isUnauthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshToken: () => Promise<string>;
} => {
  // Jotaiのatomから認証状態を取得
  const { user, loading, error, token } = useAtomValue(authStateAtom);
  const setLoading = useSetAtom(authLoadingAtom);
  const setError = useSetAtom(authErrorAtom);
  const setToken = useSetAtom(authTokenAtom);

  const signIn = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(null);
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (err: any) {
        console.error("Firebase認証エラー:", err);
        
        // エラーメッセージを日本語に変換
        let errorMessage = "ログインに失敗しました";
        if (err.code === "auth/invalid-credential") {
          errorMessage = "メールアドレスまたはパスワードが正しくありません";
        } else if (err.code === "auth/user-not-found") {
          errorMessage = "このメールアドレスのユーザーが見つかりません";
        } else if (err.code === "auth/wrong-password") {
          errorMessage = "パスワードが正しくありません";
        } else if (err.code === "auth/too-many-requests") {
          errorMessage = "ログイン試行回数が多すぎます。しばらく待ってから再試行してください";
        } else if (err.code === "auth/network-request-failed") {
          errorMessage = "ネットワークエラーが発生しました。接続を確認してください";
        }
        
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  const signUp = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(null);
      try {
        await createUserWithEmailAndPassword(auth, email, password);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "アカウント作成に失敗しました"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await signOut(auth);
      // ログアウト成功時はAuthProviderのonAuthStateChangedでuserがnullに設定される
    } catch (err) {
      setError(err instanceof Error ? err.message : "ログアウトに失敗しました");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const resetPassword = useCallback(
    async (email: string) => {
      setError(null);
      try {
        await sendPasswordResetEmail(auth, email);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "パスワードリセットメールの送信に失敗しました"
        );
        throw err;
      }
    },
    [setError]
  );

  // トークンをリフレッシュする関数
  const refreshToken = useCallback(async () => {
    if (!user) {
      throw new Error("ユーザーがログインしていません");
    }

    try {
      const newToken = await user.getIdToken(true); // forceRefresh = true
      setToken(newToken);
      return newToken;
    } catch (error) {
      console.error("トークンのリフレッシュに失敗しました:", error);
      setError("トークンのリフレッシュに失敗しました");
      throw error;
    }
  }, [user, setToken, setError]);

  // ユーザーがログインしているかどうかを判定するヘルパー関数
  const isAuthenticated = !!user && !loading;
  const isUnauthenticated = !user && !loading;

  return {
    user,
    loading,
    error,
    token,
    isAuthenticated,
    isUnauthenticated,
    signIn,
    signUp,
    logout,
    resetPassword,
    refreshToken,
  };
};
