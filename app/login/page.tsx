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
  const { signIn, loading, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  const handleGuestLogin = useCallback(async () => {
    setIsLoading(true);

    try {
      console.log("ゲストログイン試行: admin@guest.com");
      console.log("ゲストユーザー情報:");
      console.log("  - ID: admin@guest.com");
      console.log("  - UID: 7AvuE3bjD6ZASXMZKxTfewsWsIO2");
      console.log("  - パスワード: 33443344");

      await signIn("admin@guest.com", "33443344");
      console.log("ゲストログイン成功");
      // 成功時はuseEffectでリダイレクトされる
    } catch (error: unknown) {
      console.error("ゲストログインエラーの詳細:", error);

      let errorMessage = "ゲストログインに失敗しました。";

      // Firebase認証エラーの型チェック
      if (error && typeof error === "object" && "code" in error) {
        const firebaseError = error as { code: string; message: string };
        console.error("エラーコード:", firebaseError.code);
        console.error("エラーメッセージ:", firebaseError.message);

        if (firebaseError.code === "auth/invalid-credential") {
          errorMessage =
            "ゲストユーザーが存在しないか、パスワードが正しくありません。\n\n" +
            "ゲストユーザー情報:\n" +
            "  - ID: admin@guest.com\n" +
            "  - UID: 7AvuE3bjD6ZASXMZKxTfewsWsIO2\n" +
            "  - パスワード: 33443344\n\n" +
            "解決方法:\n" +
            "1. Firebase Consoleでゲストユーザー（admin@guest.com）を作成\n" +
            "2. パスワードを「33443344」に設定\n" +
            "3. または新規アカウント作成から始める";
        } else if (firebaseError.code === "auth/user-not-found") {
          errorMessage =
            "ゲストユーザー（admin@guest.com）が見つかりません。\n\n" +
            "解決方法:\n" +
            "1. Firebase Consoleでユーザーを作成\n" +
            "2. または新規アカウント作成から始める";
        } else if (firebaseError.code === "auth/wrong-password") {
          errorMessage =
            "パスワードが正しくありません。\n\n" +
            "正しいパスワード: 33443344\n\n" +
            "解決方法:\n" +
            "1. Firebase Consoleでパスワードをリセット\n" +
            "2. または新規アカウント作成から始める";
        } else if (firebaseError.code === "auth/network-request-failed") {
          errorMessage =
            "ネットワークエラーが発生しました。\n\n" +
            "解決方法:\n" +
            "1. インターネット接続を確認\n" +
            "2. Firebase設定を確認\n" +
            "3. しばらく待ってから再試行";
        }
      }

      setToastMessage(errorMessage);
      setToastType("error");
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  }, [signIn]);

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

            {/* ゲストログインボタン */}
            <Button
              type="button"
              variant="outline"
              className="w-full text-lg py-3 bg-blue-500 hover:bg-blue-600 text-white border-blue-500 hover:border-blue-600"
              onClick={handleGuestLogin}
              disabled={isLoading}
            >
              {isLoading ? "ログイン中..." : "ゲストユーザーでログイン"}
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
