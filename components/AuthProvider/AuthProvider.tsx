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

    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        setUser(user);
        setError(null);

        // ユーザーがいる場合のみトークンを取得
        if (user) {
          try {
            const token = await user.getIdToken();
            setToken(token);
          } catch (error) {
            console.error("トークンの取得に失敗しました:", error);
            setError("認証トークンの取得に失敗しました");
            setToken(null);
          }
        } else {
          // ユーザーがいない場合はトークンをクリア
          setToken(null);
        }

        setLoading(false);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
        setUser(null);
        setToken(null);
      }
    );

    return () => unsubscribe();
  }, [setUser, setLoading, setError, setToken]);

  return <>{children}</>;
};
