"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAPI } from "@/hooks/useAPI";
import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { mutate } from "swr";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import PasswordInput from "@/components/PasswordInput/PasswordInput";
import Toast from "@/components/Toast/Toast";
import {
  faUser,
  faEnvelope,
  faSave,
  faLock,
  faTrash,
  faShieldAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PageHeader } from "@/components/PageHeader/PageHeader";

export default function Settings() {
  const { logout } = useAuth();
  const {
    firebaseUser: user,
    userData,
    userId,
    isUnauthenticated,
    loading,
  } = useCurrentUser();
  const { put } = useAPI();

  const [isLoading, setIsLoading] = useState(false);

  const [, setSuccessMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">(
    "success"
  );

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const router = useRouter();

  // ユーザー情報を初期化
  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
    }
  }, [user]);

  // API側のユーザーデータから名前を設定
  useEffect(() => {
    if (userData?.name) {
      setName(userData.name);
    }
  }, [userData]);

  const handleSave = useCallback(async () => {
    if (!userId) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      ("ユーザー情報が取得できませんでした");
      return;
    }

    setIsLoading(true);
    setSuccessMessage("");

    try {
      // API側のユーザー情報を更新（nameフィールドを含む）
      await put(`/users/${userId}`, {
        user: {
          name: name,
          nickname: userData?.nickname || "",
          bio: userData?.bio || "",
          profile_image: userData?.profile_image || null,
          selected_icon: userData?.selected_icon || "user",
        },
      });

      // SWRキャッシュを再検証してユーザー情報を最新化
      if (userData?.firebase_uid) {
        await mutate(`/users/by_firebase_uid/${userData.firebase_uid}`);
      }
      if (userId) {
        await mutate(`/users/${userId}`);
      }

      // 実際の実装では、ここでFirebaseのemailも更新する必要があります
      console.log("ユーザー情報を更新:", { name, email });
      setToastMessage("情報が正常に更新されました");
      setToastType("success");
      setShowToast(true);
    } catch (err) {
      console.error("ユーザー情報更新エラー:", err);
      setToastMessage("情報の更新に失敗しました");
      setToastType("error");
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  }, [name, email, userId, userData, put]);

  const handlePasswordChange = useCallback(async () => {
    if (newPassword !== confirmPassword) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      ("新しいパスワードが一致しません");
      return;
    }
    if (newPassword.length < 6) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      ("パスワードは6文字以上で入力してください");
      return;
    }

    setIsLoading(true);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    ("");
    setSuccessMessage("");

    try {
      // 実際の実装では、ここでパスワードを変更
      console.log("パスワードを変更:", { currentPassword, newPassword });
      setToastMessage("パスワードが正常に変更されました");
      setToastType("success");
      setShowToast(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordSection(false);
    } catch {
      setToastMessage("パスワードの変更に失敗しました");
      setToastType("error");
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  }, [currentPassword, newPassword, confirmPassword]);

  const handleDeleteAccount = useCallback(async () => {
    setIsLoading(true);
    setSuccessMessage("");

    try {
      // 実際の実装では、ここでアカウントを削除
      console.log("アカウントを削除");
      await logout();
      router.push("/login");
    } catch {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      ("アカウントの削除に失敗しました");
      setIsLoading(false);
    }
  }, [logout, router]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("ログアウトに失敗しました:", error);
    }
  }, [logout, router]);

  // ローディング中の表示
  if (loading) {
    return (
      <div className="min-h-screen bg-[#E2D8D8] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p
            className="mt-2"
            style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
          >
            設定を読み込み中...
          </p>
        </div>
      </div>
    );
  }

  // ログイン前の表示
  if (isUnauthenticated) {
    return (
      <div className="min-h-screen bg-[#E2D8D8] flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
          <h2
            className="text-xl font-bold text-gray-800 mb-4 text-center whitespace-nowrap"
            style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
          >
            このページはログイン後に表示されます
          </h2>
          <p
            className="text-gray-600 mb-6 text-center"
            style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
          >
            この機能をご利用いただくには
            <br />
            ログインまたは新規登録が必要です。
          </p>
          <Link href="/signup">
            <Button className="w-full">新規アカウント作成</Button>
          </Link>
          <div className="mt-4">
            <Link href="/login">
              <Button variant="outline" className="w-full">
                ログイン
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E2D8D8] px-4 pb-8 pt-2">
      {/* ヘッダー */}
      <div className="max-w-md mx-auto pb-8">
        <PageHeader title="設定" backHref="/mypage" />
      </div>

      <div className="max-w-md mx-auto">
        {/* 設定コンテンツ */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* 個人情報セクション */}
          <div className="space-y-6">
            <div>
              <h3
                className="text-lg font-semibold text-[#5A4A4A] mb-4 flex items-center"
                style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
              >
                <FontAwesomeIcon icon={faUser} className="mr-2" />
                個人情報
              </h3>
              <div className="space-y-4">
                {/* お名前 */}
                <div>
                  <label
                    className="block text-sm font-medium text-[#5A4A4A] mb-2"
                    style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                  >
                    お名前
                  </label>
                  <Input
                    type="text"
                    placeholder="お名前を入力"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border-[#C4B5B5] focus:border-[#7E6565] focus:ring-[#7E6565]"
                    disabled={isLoading}
                  />
                </div>

                {/* メールアドレス */}
                <div>
                  <label
                    className="block text-sm font-medium text-[#5A4A4A] mb-2"
                    style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                  >
                    <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                    メールアドレス
                  </label>
                  <Input
                    type="email"
                    placeholder="メールアドレスを入力"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-[#C4B5B5] focus:border-[#7E6565] focus:ring-[#7E6565]"
                    disabled={isLoading}
                  />
                </div>

                {/* 保存ボタン */}
                <Button
                  onClick={handleSave}
                  disabled={isLoading || !name.trim() || !email.trim()}
                  className="w-full"
                >
                  <FontAwesomeIcon icon={faSave} className="mr-2" />
                  {isLoading ? "保存中..." : "個人情報を保存"}
                </Button>
              </div>
            </div>

            {/* セキュリティセクション */}
            <div>
              <h3
                className="text-lg font-semibold text-[#5A4A4A] mb-4 flex items-center"
                style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
              >
                <FontAwesomeIcon icon={faShieldAlt} className="mr-2" />
                セキュリティ
              </h3>
              <div className="space-y-4">
                {/* パスワード変更 */}
                <div>
                  <Button
                    variant="outline"
                    onClick={() => setShowPasswordSection(!showPasswordSection)}
                    className="w-full"
                    disabled={isLoading}
                  >
                    <FontAwesomeIcon icon={faLock} className="mr-2" />
                    パスワードを変更
                  </Button>

                  {showPasswordSection && (
                    <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <label
                          className="block text-sm font-medium text-[#5A4A4A] mb-2"
                          style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                        >
                          現在のパスワード
                        </label>
                        <PasswordInput
                          placeholder="現在のパスワードを入力"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="border-[#C4B5B5] focus:border-[#7E6565] focus:ring-[#7E6565]"
                          disabled={isLoading}
                        />
                      </div>
                      <div>
                        <label
                          className="block text-sm font-medium text-[#5A4A4A] mb-2"
                          style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                        >
                          新しいパスワード
                        </label>
                        <PasswordInput
                          placeholder="新しいパスワードを入力"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="border-[#C4B5B5] focus:border-[#7E6565] focus:ring-[#7E6565]"
                          disabled={isLoading}
                        />
                      </div>
                      <div>
                        <label
                          className="block text-sm font-medium text-[#5A4A4A] mb-2"
                          style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                        >
                          新しいパスワード（確認）
                        </label>
                        <PasswordInput
                          placeholder="新しいパスワードを再入力"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="border-[#C4B5B5] focus:border-[#7E6565] focus:ring-[#7E6565]"
                          disabled={isLoading}
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={handlePasswordChange}
                          disabled={
                            isLoading ||
                            !currentPassword.trim() ||
                            !newPassword.trim() ||
                            !confirmPassword.trim()
                          }
                          className="flex-1"
                        >
                          パスワードを変更
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowPasswordSection(false);
                            setCurrentPassword("");
                            setNewPassword("");
                            setConfirmPassword("");
                          }}
                          className="flex-1"
                        >
                          キャンセル
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 区切り線 */}
          <div className="border-t border-gray-200 my-6"></div>

          {/* アカウント管理 */}
          <div className="space-y-4">
            <h3
              className="text-lg font-semibold text-[#5A4A4A] mb-4 flex items-center"
              style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
            >
              <FontAwesomeIcon icon={faTrash} className="mr-2" />
              アカウント管理
            </h3>

            {/* アカウント削除確認 */}
            {showDeleteConfirm ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p
                  className="text-red-600 text-sm mb-4"
                  style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                >
                  アカウントを削除すると、すべてのデータが永久に失われます。この操作は取り消せません。
                </p>
                <div className="flex space-x-2">
                  <Button
                    onClick={handleDeleteAccount}
                    disabled={isLoading}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  >
                    <FontAwesomeIcon icon={faTrash} className="mr-2" />
                    アカウントを削除
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1"
                  >
                    キャンセル
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full !text-red-600 !border-red-300 !hover:bg-red-50 !hover:text-red-700 hover:!bg-red-50 hover:!text-red-700"
                  disabled={isLoading}
                >
                  <FontAwesomeIcon icon={faTrash} className="mr-2" />
                  アカウントを削除
                </Button>

                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full !text-gray-600 !border-gray-300 !hover:bg-gray-50 !hover:text-gray-700 hover:!bg-gray-50 hover:!text-gray-700"
                  disabled={isLoading}
                >
                  ログアウト
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

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
