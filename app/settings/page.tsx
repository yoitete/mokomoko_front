"use client";

import { useAuth } from "@/hooks/useAuth";
import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import {
  faUser,
  faEnvelope,
  faSave,
  
  faArrowLeft,
  faLock,
  faTrash,
  faShieldAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function Settings() {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const router = useRouter();

  // ユーザー情報を初期化
  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      // 実際の実装では、バックエンドからユーザー名を取得
      setName("");
    }
  }, [user]);

  const handleSave = useCallback(async () => {
    setIsLoading(true);
    setFormError("");
    setSuccessMessage("");

    try {
      // 実際の実装では、ここでユーザー情報を更新
      console.log("ユーザー情報を更新:", { name, email });
      setSuccessMessage("情報が正常に更新されました");
    } catch {
      setFormError("情報の更新に失敗しました");
    } finally {
      setIsLoading(false);
    }
  }, [name, email]);

  const handlePasswordChange = useCallback(async () => {
    if (newPassword !== confirmPassword) {
      setFormError("新しいパスワードが一致しません");
      return;
    }
    if (newPassword.length < 6) {
      setFormError("パスワードは6文字以上で入力してください");
      return;
    }

    setIsLoading(true);
    setFormError("");
    setSuccessMessage("");

    try {
      // 実際の実装では、ここでパスワードを変更
      console.log("パスワードを変更:", { currentPassword, newPassword });
      setSuccessMessage("パスワードが正常に変更されました");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordSection(false);
    } catch {
      setFormError("パスワードの変更に失敗しました");
    } finally {
      setIsLoading(false);
    }
  }, [currentPassword, newPassword, confirmPassword]);

  const handleDeleteAccount = useCallback(async () => {
    setIsLoading(true);
    setFormError("");
    setSuccessMessage("");

    try {
      // 実際の実装では、ここでアカウントを削除
      console.log("アカウントを削除");
      await logout();
      router.push("/login");
    } catch {
      setFormError("アカウントの削除に失敗しました");
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

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* 設定コンテンツ */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* ヘッダー */}
          <div className="flex items-center mb-6">
            <Link href="/mypage" className="mr-4">
              <FontAwesomeIcon
                icon={faArrowLeft}
                className="text-[#7E6565] hover:text-[#6B5555] transition-colors"
                size="lg"
              />
            </Link>
            <h2 className="text-2xl font-semibold text-[#5A4A4A]">設定</h2>
          </div>

          {/* 個人情報セクション */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-[#5A4A4A] mb-4 flex items-center">
                <FontAwesomeIcon icon={faUser} className="mr-2" />
                個人情報
              </h3>
              <div className="space-y-4">
                {/* お名前 */}
                <div>
                  <label className="block text-sm font-medium text-[#5A4A4A] mb-2">
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
                  <label className="block text-sm font-medium text-[#5A4A4A] mb-2">
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
              <h3 className="text-lg font-semibold text-[#5A4A4A] mb-4 flex items-center">
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
                        <label className="block text-sm font-medium text-[#5A4A4A] mb-2">
                          現在のパスワード
                        </label>
                        <Input
                          type="password"
                          placeholder="現在のパスワードを入力"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="border-[#C4B5B5] focus:border-[#7E6565] focus:ring-[#7E6565]"
                          disabled={isLoading}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#5A4A4A] mb-2">
                          新しいパスワード
                        </label>
                        <Input
                          type="password"
                          placeholder="新しいパスワードを入力"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="border-[#C4B5B5] focus:border-[#7E6565] focus:ring-[#7E6565]"
                          disabled={isLoading}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#5A4A4A] mb-2">
                          新しいパスワード（確認）
                        </label>
                        <Input
                          type="password"
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

            {/* 成功メッセージ */}
            {successMessage && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-600 text-sm">{successMessage}</p>
              </div>
            )}

            {/* エラーメッセージ */}
            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{formError}</p>
              </div>
            )}
          </div>

          {/* 区切り線 */}
          <div className="border-t border-gray-200 my-6"></div>

          {/* アカウント管理 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#5A4A4A] mb-4 flex items-center">
              <FontAwesomeIcon icon={faTrash} className="mr-2" />
              アカウント管理
            </h3>

            {/* アカウント削除確認 */}
            {showDeleteConfirm ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm mb-4">
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
                  className="w-full text-red-600 border-red-300 hover:bg-red-50"
                  disabled={isLoading}
                >
                  <FontAwesomeIcon icon={faTrash} className="mr-2" />
                  アカウントを削除
                </Button>

                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full text-gray-600 border-gray-300 hover:bg-gray-50"
                  disabled={isLoading}
                >
                  ログアウト
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
