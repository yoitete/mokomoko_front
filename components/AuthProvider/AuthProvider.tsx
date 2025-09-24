"use client";

import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  userAtom,
  authLoadingAtom,
  authErrorAtom,
  authTokenAtom,
} from "@/lib/authAtoms";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const setUser = useSetAtom(userAtom);
  const setLoading = useSetAtom(authLoadingAtom);
  const setError = useSetAtom(authErrorAtom);
  const setToken = useSetAtom(authTokenAtom);

  useEffect(() => {
    // 初期状態ではローディング中に設定
    setLoading(true);

    try {
      const unsubscribe = onAuthStateChanged(
        auth,
        async (user) => {
          console.log("AuthProvider: onAuthStateChanged called, user:", user);
          setUser(user);
          setError(null);

          // ユーザーがいる場合のみトークンを取得
          if (user) {
            try {
              console.log("AuthProvider: トークン取得開始");
              const token = await user.getIdToken();
              console.log("AuthProvider: トークン取得成功:", token);
              setToken(token);
            } catch (error) {
              console.error("トークンの取得に失敗しました:", error);
              setError("認証トークンの取得に失敗しました");
              setToken(null);
            }
          } else {
            // ユーザーがいない場合はトークンをクリア
            console.log("AuthProvider: ユーザーなし、トークンクリア");
            setToken(null);
          }

          console.log("AuthProvider: 認証状態更新完了");
          setLoading(false);
        },
        (error) => {
          console.error("AuthProvider: 認証状態変更エラー:", error);
          setError(error.message);
          setLoading(false);
          setUser(null);
          setToken(null);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error("AuthProvider: 初期化エラー:", error);
      setError("認証の初期化に失敗しました");
      setLoading(false);
      setUser(null);
      setToken(null);
    }
  }, [setUser, setLoading, setError, setToken]);

  return <>{children}</>;
};
