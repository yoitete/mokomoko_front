"use client";

import { useAuth } from "@/hooks/useAuth";
import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "@/components/Input/Input";
import PasswordInput from "@/components/PasswordInput/PasswordInput";
import Button from "@/components/Button/Button";
import PasswordResetModal from "@/components/PasswordResetModal/PasswordResetModal";
import Toast from "@/components/Toast/Toast";

export default function Login() {
  const { signIn, loading, error, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">(
    "error"
  );
  const router = useRouter();

  // ログイン済みの場合はホームページにリダイレクト
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/home");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!email.trim() || !password.trim()) {
        setToastMessage("メールアドレスとパスワードを入力してください");
        setToastType("error");
        setShowToast(true);
        return;
      }

      setIsLoading(true);
      setFormError("");

      try {
        await signIn(email, password);
        // 成功時はuseEffectでリダイレクトされる
      } catch {
        setToastMessage(
          "ログインに失敗しました。メールアドレスとパスワードをご確認ください。"
        );
        setToastType("error");
        setShowToast(true);
      } finally {
        setIsLoading(false);
      }
    },
    [email, password, signIn]
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
          <h1
            className="text-2xl text-[#7E6565] mx-auto text-center pl-4"
            style={{ fontFamily: "Pomeranian, cursive" }}
          >
            MokoMoko
          </h1>
          <p className="text-[#7E6565] pl-2">もこもこで見つける小さな幸せ</p>
        </div>

        {/* ログインフォーム */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2
            className="text-2xl font-semibold text-[#5A4A4A] text-center mb-6"
            style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
          >
            ログイン
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="パスワードを入力"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-[#C4B5B5] focus:border-[#7E6565] focus:ring-[#7E6565]"
                disabled={isLoading}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !email.trim() || !password.trim()}
            >
              {isLoading ? "ログイン中..." : "ログイン"}
            </Button>
          </form>

          {/* パスワードリセット */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setShowResetModal(true)}
              className="text-red-500 hover:text-red-600 text-sm underline"
              disabled={isLoading}
            >
              パスワードを忘れた方はこちら
            </button>
          </div>

          {/* アカウント作成リンク */}
          <div className="mt-6 text-center border-t pt-4">
            <p className="text-cyan-500 text-sm mb-3">
              アカウントをお持ちでない方は
            </p>
            <Link href="/signup">
              <Button variant="outline" className="w-full" disabled={isLoading}>
                新規アカウント作成
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* パスワードリセットモーダル */}
      <PasswordResetModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
      />

      {/* トースト通知 */}
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        duration={5000}
      />
    </div>
  );
}
