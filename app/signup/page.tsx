"use client";

import { useAuth } from "@/hooks/useAuth";
import { useAPI } from "@/hooks/useAPI";
import { useCallback, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAtomValue } from "jotai";
import { authTokenAtom } from "@/lib/authAtoms";
import Link from "next/link";
import Input from "@/components/Input/Input";
import PasswordInput from "@/components/PasswordInput/PasswordInput";
import Button from "@/components/Button/Button";

export default function Signup() {
  const { signUp, loading, error, isAuthenticated } = useAuth();
  const { post } = useAPI();
  const currentToken = useAtomValue(authTokenAtom); // 現在のトークン値を直接取得
  const tokenRef = useRef<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const router = useRouter();

  // トークンが更新されたらrefに保存
  useEffect(() => {
    tokenRef.current = currentToken;
  }, [currentToken]);

  // ログイン済みの場合はホームページにリダイレクト
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/home");
    }
  }, [isAuthenticated, router]);

  // トークンが利用可能になるまで待機（refから現在のトークン値を取得）
  const waitForToken = useCallback(
    async (maxWaitTime = 10000): Promise<string> => {
      // 既にトークンがある場合は即座に返す
      if (tokenRef.current) {
        return tokenRef.current;
      }

      return new Promise((resolve, reject) => {
        const startTime = Date.now();

        const checkToken = () => {
          if (tokenRef.current) {
            resolve(tokenRef.current);
          } else if (Date.now() - startTime >= maxWaitTime) {
            reject(new Error("認証トークンの取得がタイムアウトしました"));
          } else {
            setTimeout(checkToken, 100);
          }
        };

        checkToken();
      });
    },
    []
  );

  // ユーザー作成API呼び出し
  const createUserInDatabase = useCallback(
    async (userData: { email: string; name?: string; token: string }) => {
      try {
        const response = await post("/users", userData);
        return response;
      } catch (err) {
        console.error("ユーザー情報の保存に失敗しました:", err);
        throw new Error("ユーザー情報の保存に失敗しました");
      }
    },
    [post]
  );

  const validateForm = useCallback(() => {
    if (!email.trim()) {
      setFormError("メールアドレスを入力してください");
      return false;
    }
    if (!password.trim()) {
      setFormError("パスワードを入力してください");
      return false;
    }
    if (password.length < 6) {
      setFormError("パスワードは6文字以上で入力してください");
      return false;
    }
    if (password !== confirmPassword) {
      setFormError("パスワードが一致しません");
      return false;
    }
    return true;
  }, [email, password, confirmPassword]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      setIsLoading(true);
      setFormError("");

      try {
        // 1. Firebaseでアカウント作成
        await signUp(email, password);

        // 2. トークンが利用可能になるまで待機
        const obtainedToken = await waitForToken();

        // 3. バックエンドにユーザー情報を保存
        await createUserInDatabase({
          email,
          name: name.trim() || undefined,
          token: obtainedToken,
        });

        // 成功時はuseEffectでリダイレクトされる
      } catch (err) {
        setFormError(
          err instanceof Error
            ? err.message
            : "アカウント作成に失敗しました。入力内容をご確認ください。"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [
      email,
      password,
      name,
      signUp,
      validateForm,
      createUserInDatabase,
      waitForToken,
    ]
  );

  // 認証状態の初期読み込み中
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7E6565] mx-auto mb-4"></div>
          <p className="text-[#5A4A4A]">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* ロゴ・タイトル */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#5A4A4A] mb-2">MokoMoko</h1>
          <p className="text-[#7E6565]">毛布共有コミュニティ</p>
        </div>

        {/* アカウント作成フォーム */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-[#5A4A4A] text-center mb-6">
            新規アカウント作成
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-[#5A4A4A] mb-2"
              >
                お名前（任意）
              </label>
              <Input
                id="name"
                type="text"
                placeholder="お名前を入力"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-[#C4B5B5] focus:border-[#7E6565] focus:ring-[#7E6565]"
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#5A4A4A] mb-2"
              >
                メールアドレス
              </label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-[#C4B5B5] focus:border-[#7E6565] focus:ring-[#7E6565]"
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#5A4A4A] mb-2"
              >
                パスワード
              </label>
              <PasswordInput
                id="password"
                placeholder="6文字以上で入力"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-[#C4B5B5] focus:border-[#7E6565] focus:ring-[#7E6565]"
                disabled={isLoading}
                required
              />
              <p className="text-xs text-[#7E6565] mt-1">
                6文字以上で入力してください
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-[#5A4A4A] mb-2"
              >
                パスワード（確認）
              </label>
              <PasswordInput
                id="confirmPassword"
                placeholder="パスワードを再入力"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border-[#C4B5B5] focus:border-[#7E6565] focus:ring-[#7E6565]"
                disabled={isLoading}
                required
              />
            </div>

            {(formError || error) && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{formError || error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={
                isLoading ||
                !email.trim() ||
                !password.trim() ||
                !confirmPassword.trim()
              }
            >
              {isLoading ? "作成中..." : "アカウントを作成"}
            </Button>
          </form>

          {/* 利用規約・プライバシーポリシー */}
          <div className="mt-4 text-center">
            <p className="text-xs text-[#7E6565]">
              アカウントを作成することで、
              <br />
              利用規約とプライバシーポリシーに同意したものとみなします
            </p>
          </div>

          {/* ログインリンク */}
          <div className="mt-6 text-center border-t pt-4">
            <p className="text-[#5A4A4A] text-sm mb-3">
              すでにアカウントをお持ちの方は
            </p>
            <Link href="/login">
              <Button variant="outline" className="w-full" disabled={isLoading}>
                ログイン
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
