"use client";

import { useAuth } from "@/hooks/useAuth";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAPI } from "@/hooks/useAPI";
import { useSeasonalCampaigns } from "@/hooks/useSeasonalCampaign";
import {
  seasonalCampaigns,
  secondSeasonalCampaigns,
} from "@/hooks/useSeasonalCampaign";
import { useCallback, useState, useEffect, useMemo } from "react";
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
  faArrowLeft,
  faLock,
  faTrash,
  faShieldAlt,
  faCog,
  faToggleOn,
  faToggleOff,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

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

  // 静的データを使用（API側のデータが空の場合のフォールバック）
  const allStaticCampaigns = useMemo(
    () => [...seasonalCampaigns, ...secondSeasonalCampaigns],
    []
  );
  const {
    data: apiCampaigns,
    mutate: mutateCampaigns,
    isLoading: campaignsLoading,
  } = useSeasonalCampaigns();

  // API側のデータが利用可能な場合はそれを使用、そうでなければ静的データを使用
  const campaigns =
    apiCampaigns && apiCampaigns.length > 0 ? apiCampaigns : allStaticCampaigns;

  // API側のデータが利用可能かどうか
  const isApiDataAvailable = apiCampaigns && apiCampaigns.length > 0;

  // 現在のキャンペーンデータ（API側のデータのみ使用）
  const currentCampaigns = campaigns;
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

  // ゲストユーザーかどうかを判定（Firebase認証とAPI側の両方を考慮）
  const isGuestUser =
    user?.email === "admin@guest.com" || userData?.name === "admin@guest.com";

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [, setCampaignMessage] = useState("");
  const [, setCampaignError] = useState("");
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

  // 特集の有効/無効切り替え
  const toggleCampaignActive = async (
    campaignId: number,
    currentActive: boolean
  ) => {
    // API側のデータが利用可能な場合のみ更新可能
    if (!isApiDataAvailable) {
      setToastMessage("API側のデータが利用可能になるまで編集はできません");
      setToastType("info");
      setShowToast(true);
      return;
    }

    setIsLoading(true);
    setCampaignError("");

    try {
      await put(`/seasonal_campaigns/${campaignId}`, {
        seasonal_campaign: { active: !currentActive },
      });
      mutateCampaigns(); // データ再取得
      setToastMessage(`特集を${!currentActive ? "有効" : "無効"}にしました`);
      setToastType("success");
      setShowToast(true);
    } catch (error) {
      console.error("特集切り替えエラー:", error);
      setToastMessage("特集の切り替えに失敗しました");
      setToastType("error");
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  // 特集期間の変更
  const updateCampaignPeriod = async (
    campaignId: number,
    startMonth: number,
    endMonth: number
  ) => {
    // API側のデータが利用可能な場合のみ更新可能
    if (!isApiDataAvailable) {
      setToastMessage("API側のデータが利用可能になるまで編集はできません");
      setToastType("info");
      setShowToast(true);
      return;
    }

    setIsLoading(true);
    setCampaignMessage("");
    setCampaignError("");

    try {
      await put(`/seasonal_campaigns/${campaignId}`, {
        seasonal_campaign: {
          start_month: startMonth,
          end_month: endMonth,
        },
      });
      mutateCampaigns(); // データ再取得
      setToastMessage("特集期間を更新しました");
      setToastType("success");
      setShowToast(true);
    } catch (error) {
      console.error("期間更新エラー:", error);
      setToastMessage("期間の更新に失敗しました");
      setToastType("error");
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  // カラーテーマの変更
  const updateCampaignColor = async (
    campaignId: number,
    colorTheme: string
  ) => {
    // API側のデータが利用可能な場合のみ更新可能
    if (!isApiDataAvailable) {
      setToastMessage("API側のデータが利用可能になるまで編集はできません");
      setToastType("info");
      setShowToast(true);
      return;
    }

    setIsLoading(true);
    setCampaignMessage("");
    setCampaignError("");

    try {
      await put(`/seasonal_campaigns/${campaignId}`, {
        seasonal_campaign: {
          color_theme: colorTheme,
          highlight_color: colorTheme,
        },
      });
      mutateCampaigns(); // データ再取得
      setToastMessage("カラーテーマを更新しました");
      setToastType("success");
      setShowToast(true);
    } catch (error) {
      console.error("カラー更新エラー:", error);
      setToastMessage("カラーの更新に失敗しました");
      setToastType("error");
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

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
            <h2
              className="text-2xl font-semibold text-[#5A4A4A]"
              style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
            >
              設定
            </h2>
          </div>

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

          {/* 特集管理セクション - admin@guest.comのみ表示 */}
          {isGuestUser && (
            <>
              <div className="border-t border-gray-200 my-6"></div>

              <div className="space-y-4">
                <h3
                  className="text-lg font-semibold text-[#5A4A4A] mb-4 flex items-center"
                  style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
                >
                  <FontAwesomeIcon icon={faCog} className="mr-2" />
                  特集管理
                </h3>

                {/* ローディング状態 */}
                {campaignsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                    <span
                      className="ml-2 text-gray-600"
                      style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                    >
                      特集データを読み込み中...
                    </span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* 現在の特集表示 */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4
                        className="font-medium text-blue-800 mb-2 flex items-center"
                        style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                      >
                        <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                        現在表示中の特集（最大2つまで表示）
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {currentCampaigns
                          ?.filter((c) => c.active)
                          .slice(0, 2)
                          .map((campaign) => (
                            <div
                              key={campaign.id}
                              className="bg-white p-3 rounded border border-blue-200"
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex flex-col">
                                  <div className="flex items-center flex-wrap">
                                    <span className="font-medium text-blue-800 text-sm">
                                      {campaign.name.length > 12
                                        ? campaign.name.substring(0, 12) + "..."
                                        : campaign.name}
                                    </span>
                                    <span
                                      className={`ml-2 px-2 py-1 rounded text-xs ${
                                        (campaign.campaign_type ||
                                          "primary") === "primary"
                                          ? "bg-blue-100 text-blue-700"
                                          : "bg-purple-100 text-purple-700"
                                      }`}
                                    >
                                      {(campaign.campaign_type || "primary") ===
                                      "primary"
                                        ? "第1特集"
                                        : "第2特集"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* 全特集管理 */}
                    <div className="space-y-3">
                      <h4
                        className="font-medium text-gray-700"
                        style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                      >
                        全特集一覧
                      </h4>
                      {currentCampaigns?.map((campaign) => (
                        <div
                          key={campaign.id}
                          className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                        >
                          {/* 特集基本情報 */}
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h5
                                className="font-medium text-gray-800"
                                style={{
                                  fontFamily: "'Noto Sans JP', sans-serif",
                                }}
                              >
                                {campaign.name}
                              </h5>
                              <p
                                className="text-sm text-gray-600"
                                style={{
                                  fontFamily: "'Noto Sans JP', sans-serif",
                                }}
                              >
                                <span
                                  className={`px-2 py-1 rounded text-xs mr-2 ${
                                    (campaign.campaign_type || "primary") ===
                                    "primary"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-purple-100 text-purple-700"
                                  }`}
                                >
                                  {(campaign.campaign_type || "primary") ===
                                  "primary"
                                    ? "第1特集"
                                    : "第2特集"}
                                </span>
                                {campaign.start_month}月〜{campaign.end_month}月
                                | {campaign.color_theme}
                              </p>
                            </div>

                            {/* 有効/無効切り替え */}
                            <div className="flex items-center space-x-2">
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  campaign.active
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {campaign.active ? "有効" : "無効"}
                              </span>
                              {isGuestUser && isApiDataAvailable ? (
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    toggleCampaignActive(
                                      campaign.id!,
                                      campaign.active ?? true
                                    )
                                  }
                                  disabled={isLoading}
                                  className={`${
                                    campaign.active
                                      ? "bg-red-600 hover:bg-red-700"
                                      : "bg-green-600 hover:bg-green-700"
                                  } text-white`}
                                >
                                  <FontAwesomeIcon
                                    icon={
                                      campaign.active ? faToggleOff : faToggleOn
                                    }
                                    className="mr-1"
                                  />
                                  {campaign.active ? "無効化" : "有効化"}
                                </Button>
                              ) : (
                                <span
                                  className="px-3 py-1 text-xs text-gray-500 bg-gray-100 rounded"
                                  style={{
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                  }}
                                >
                                  {!isApiDataAvailable
                                    ? "APIデータ待機中"
                                    : "変更不可"}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* 編集フォーム */}
                          {isGuestUser && isApiDataAvailable ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 pt-3 border-t border-gray-300">
                              {/* 開始月 */}
                              <div>
                                <label
                                  className="block text-xs font-medium text-gray-600 mb-1"
                                  style={{
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                  }}
                                >
                                  開始月
                                </label>
                                <select
                                  value={campaign.start_month || 1}
                                  onChange={(e) =>
                                    updateCampaignPeriod(
                                      campaign.id!,
                                      parseInt(e.target.value),
                                      campaign.end_month || 1
                                    )
                                  }
                                  disabled={isLoading}
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  {Array.from(
                                    { length: 12 },
                                    (_, i) => i + 1
                                  ).map((month) => (
                                    <option key={month} value={month}>
                                      {month}月
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {/* 終了月 */}
                              <div>
                                <label
                                  className="block text-xs font-medium text-gray-600 mb-1"
                                  style={{
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                  }}
                                >
                                  終了月
                                </label>
                                <select
                                  value={campaign.end_month || 1}
                                  onChange={(e) =>
                                    updateCampaignPeriod(
                                      campaign.id!,
                                      campaign.start_month || 1,
                                      parseInt(e.target.value)
                                    )
                                  }
                                  disabled={isLoading}
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  {Array.from(
                                    { length: 12 },
                                    (_, i) => i + 1
                                  ).map((month) => (
                                    <option key={month} value={month}>
                                      {month}月
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {/* カラーテーマ */}
                              <div>
                                <label
                                  className="block text-xs font-medium text-gray-600 mb-1"
                                  style={{
                                    fontFamily: "'Noto Sans JP', sans-serif",
                                  }}
                                >
                                  カラーテーマ
                                </label>
                                <select
                                  value={campaign.color_theme}
                                  onChange={(e) =>
                                    updateCampaignColor(
                                      campaign.id!,
                                      e.target.value
                                    )
                                  }
                                  disabled={isLoading}
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="red">赤</option>
                                  <option value="pink">ピンク</option>
                                  <option value="blue">青</option>
                                  <option value="orange">オレンジ</option>
                                  <option value="green">緑</option>
                                  <option value="indigo">藍</option>
                                  <option value="yellow">黄</option>
                                </select>
                              </div>
                            </div>
                          ) : (
                            <div className="mt-3 pt-3 border-t border-gray-300">
                              <p
                                className="text-sm text-gray-500 text-center py-2"
                                style={{
                                  fontFamily: "'Noto Sans JP', sans-serif",
                                }}
                              >
                                {!isApiDataAvailable
                                  ? "API側のデータが利用可能になるまで編集はできません"
                                  : "特集設定の変更は管理者のみ可能です"}
                              </p>
                            </div>
                          )}

                          {/* 特集の説明 */}
                          <div className="mt-3 pt-3 border-t border-gray-300">
                            <p
                              className="text-sm text-gray-600"
                              style={{
                                fontFamily: "'Noto Sans JP', sans-serif",
                              }}
                            >
                              <span className="font-medium">説明:</span>{" "}
                              {campaign.description}
                            </p>
                            <p
                              className="text-sm text-gray-600 mt-1"
                              style={{
                                fontFamily: "'Noto Sans JP', sans-serif",
                              }}
                            >
                              <span className="font-medium">リンク:</span>{" "}
                              {campaign.link_path}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
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
