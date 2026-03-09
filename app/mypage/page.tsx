"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAtomValue, useSetAtom } from "jotai";
import { profileAtom, updateProfileAtom } from "@/lib/profileAtoms";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAuth } from "@/hooks/useAuth";
import { useAPI } from "@/hooks/useAPI";
import { useProfile } from "@/hooks/useProfile";
import { useMyPosts } from "@/hooks/useMyPosts";
import { mutate } from "swr";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import PasswordInput from "@/components/PasswordInput/PasswordInput";
import Toast from "@/components/Toast/Toast";
import ProfileImage from "@/components/ProfileImage/ProfileImage";
import IconSelector from "@/components/IconSelector/IconSelector";
import BioSection from "@/components/BioSection/BioSection";
import {
  faUser,
  faCat,
  faDog,
  faStar,
  faLeaf,
  faPaw,
  faPen,
  faEnvelope,
  faSave,
  faLock,
  faShieldAlt,
  faTrash,
  faNewspaper,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function Mypage() {
  const { logout, user: firebaseUser } = useAuth();
  const { isUnauthenticated, loading, userData, userId, firebaseUID } =
    useCurrentUser();
  const { put } = useAPI();
  const { updateProfile: updateProfileAPI } = useProfile();
  const profile = useAtomValue(profileAtom);
  const updateProfileState = useSetAtom(updateProfileAtom);
  const router = useRouter();
  const { posts } = useMyPosts();

  // プロフィール編集
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedIcon, setSelectedIcon] = useState("user");

  // 個人情報
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // セキュリティ
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // アカウント管理
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // アコーディオン開閉（複数セクション同時に開ける）
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  const toggleSection = (section: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  // UI状態
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">(
    "success"
  );

  // APIから取得したプロフィールデータをローカル状態に同期
  useEffect(() => {
    if (userData && userData.nickname !== undefined) {
      updateProfileState({
        nickname: userData.nickname || "ユーザー名",
        bio: userData.bio || "自己紹介が設定されていません",
        profileImage: userData.profile_image,
        selectedIcon: userData.selected_icon || "user",
      });
    }
  }, [userData, updateProfileState]);

  // ページ表示時にキャッシュを再検証
  useEffect(() => {
    if (userData?.id) {
      mutate(`/users/${userData.id}`);
      mutate(`/users/by_firebase_uid/${userData.firebase_uid}`);
    }
  }, [userData?.id, userData?.firebase_uid]);

  // ユーザー情報を初期化
  useEffect(() => {
    if (firebaseUser) {
      setEmail(firebaseUser.email || "");
    }
  }, [firebaseUser]);

  useEffect(() => {
    if (userData?.name) {
      setName(userData.name);
    }
  }, [userData]);

  // プロフィール編集用のローカル状態を同期
  useEffect(() => {
    if (userData && userData.nickname !== undefined) {
      setNickname(userData.nickname || "ユーザー名");
      setBio(userData.bio || "自己紹介が設定されていません");
      setProfileImage(userData.profile_image || null);
      setSelectedIcon(userData.selected_icon || "user");
    }
  }, [userData]);

  // プロフィール編集開始
  const handleEditProfile = useCallback(() => {
    setNickname(profile.nickname);
    setBio(profile.bio);
    setProfileImage(profile.profileImage);
    setSelectedIcon(profile.selectedIcon);
    setIsEditingProfile(true);
  }, [profile]);

  // プロフィール編集キャンセル
  const handleProfileCancel = useCallback(() => {
    setIsEditingProfile(false);
  }, []);

  // 画像アップロード
  const handleImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setProfileImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  // アイコン選択
  const handleIconSelect = useCallback((iconName: string) => {
    setSelectedIcon(iconName);
    setProfileImage(null);
  }, []);

  // プロフィール保存
  const handleProfileSave = useCallback(async () => {
    setIsLoading(true);
    try {
      updateProfileState({ nickname, bio, profileImage, selectedIcon });

      if (firebaseUID && userId) {
        await updateProfileAPI(userId, {
          nickname,
          bio,
          profile_image: profileImage,
          selected_icon: selectedIcon,
        });
        await mutate(`/users/${userId}`);
        await mutate(`/users/by_firebase_uid/${firebaseUID}`);
      }

      setIsEditingProfile(false);
      setToastMessage("プロフィールを更新しました");
      setToastType("success");
      setShowToast(true);
    } catch {
      setToastMessage("プロフィールの更新に失敗しました");
      setToastType("error");
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  }, [
    nickname,
    bio,
    profileImage,
    selectedIcon,
    updateProfileState,
    updateProfileAPI,
    firebaseUID,
    userId,
  ]);

  // 個人情報保存
  const handleSave = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      await put(`/users/${userId}`, {
        user: {
          name: name,
          nickname: userData?.nickname || "",
          bio: userData?.bio || "",
          profile_image: userData?.profile_image || null,
          selected_icon: userData?.selected_icon || "user",
        },
      });
      if (userData?.firebase_uid) {
        await mutate(`/users/by_firebase_uid/${userData.firebase_uid}`);
      }
      if (userId) {
        await mutate(`/users/${userId}`);
      }
      setToastMessage("情報が正常に更新されました");
      setToastType("success");
      setShowToast(true);
    } catch {
      setToastMessage("情報の更新に失敗しました");
      setToastType("error");
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  }, [name, userId, userData, put]);

  // パスワード変更
  const handlePasswordChange = useCallback(async () => {
    if (newPassword !== confirmPassword) {
      setToastMessage("新しいパスワードが一致しません");
      setToastType("error");
      setShowToast(true);
      return;
    }
    if (newPassword.length < 6) {
      setToastMessage("パスワードは6文字以上で入力してください");
      setToastType("error");
      setShowToast(true);
      return;
    }
    setIsLoading(true);
    try {
      console.log("パスワードを変更:", { currentPassword, newPassword });
      setToastMessage("パスワードが正常に変更されました");
      setToastType("success");
      setShowToast(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setOpenSections((prev) => {
        const next = new Set(prev);
        next.delete("security");
        return next;
      });
    } catch {
      setToastMessage("パスワードの変更に失敗しました");
      setToastType("error");
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  }, [currentPassword, newPassword, confirmPassword]);

  // アカウント削除
  const handleDeleteAccount = useCallback(async () => {
    setIsLoading(true);
    try {
      await logout();
      router.push("/login");
    } catch {
      setToastMessage("アカウントの削除に失敗しました");
      setToastType("error");
      setShowToast(true);
      setIsLoading(false);
    }
  }, [logout, router]);

  // ログアウト
  const handleLogout = useCallback(async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("ログアウトに失敗しました:", error);
    }
  }, [logout, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E2D8D8] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p
            className="mt-2"
            style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
          >
            認証状態を確認中...
          </p>
        </div>
      </div>
    );
  }

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

  const iconOptions = [
    {
      name: "user",
      icon: faUser,
      label: "ユーザー",
      type: "fontawesome" as const,
    },
    { name: "cat", icon: faCat, label: "猫", type: "fontawesome" as const },
    { name: "dog", icon: faDog, label: "犬", type: "fontawesome" as const },
    { name: "paw", icon: faPaw, label: "肉球", type: "fontawesome" as const },
    { name: "star", icon: faStar, label: "星", type: "fontawesome" as const },
    { name: "leaf", icon: faLeaf, label: "葉", type: "fontawesome" as const },
    {
      name: "neko",
      image: "/icons/neko.png",
      label: "ねこ",
      type: "image" as const,
    },
    {
      name: "kuma",
      image: "/icons/kuma.png",
      label: "熊",
      type: "image" as const,
    },
    {
      name: "shirokuma",
      image: "/icons/shirokuma.png",
      label: "白熊",
      type: "image" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-[#E2D8D8]">
      <section className="mt-8">
        <h2
          className="text-center text-3xl font-bold tracking-wide bg-gradient-to-r from-red-700 to-red-900 bg-clip-text text-transparent"
          style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
        >
          マイページ
        </h2>
      </section>

      <main className="max-w-md w-full mx-auto px-4 py-6 space-y-6">
        {/* プロフィールカード */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <ProfileImage
                profileImage={
                  isEditingProfile ? profileImage : profile.profileImage
                }
                selectedIcon={
                  isEditingProfile ? selectedIcon : profile.selectedIcon
                }
                iconOptions={iconOptions}
                isEditing={isEditingProfile}
                onImageUpload={handleImageUpload}
              />
              {!isEditingProfile && (
                <div>
                  <h3
                    className="text-xl font-semibold text-[#5A4A4A]"
                    style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
                  >
                    {profile.nickname}
                  </h3>
                  <p
                    className="text-sm text-[#7E6565]"
                    style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                  >
                    {firebaseUser?.email}
                  </p>
                </div>
              )}
            </div>
            {!isEditingProfile && (
              <button
                onClick={handleEditProfile}
                className="text-[#7E6565] hover:text-[#5A4A4A] transition-colors cursor-pointer"
              >
                <FontAwesomeIcon icon={faPen} />
              </button>
            )}
          </div>

          {isEditingProfile ? (
            <>
              {/* 編集モード */}
              <div className="mb-4">
                <label
                  className="block text-sm font-medium text-[#5A4A4A] mb-2"
                  style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
                >
                  ニックネーム
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="text-lg font-semibold text-[#5A4A4A] bg-transparent border-b border-[#7E6565] focus:outline-none focus:border-[#5A4A4A] w-full"
                  placeholder="ニックネームを入力"
                />
              </div>

              <IconSelector
                iconOptions={iconOptions}
                selectedIcon={selectedIcon}
                onIconSelect={handleIconSelect}
              />

              <BioSection
                bio={bio}
                isEditing={true}
                onBioChange={(value) => setBio(value)}
                onEdit={() => {}}
                onSave={() => {}}
                onCancel={() => {}}
                showActions={false}
              />

              <div className="flex space-x-3 mt-6">
                <Button
                  onClick={handleProfileSave}
                  className="flex-1 cursor-pointer"
                  disabled={isLoading || !nickname.trim()}
                >
                  <FontAwesomeIcon icon={faSave} className="mr-2" />
                  {isLoading ? "保存中..." : "保存"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleProfileCancel}
                  className="flex-1 cursor-pointer"
                  disabled={isLoading}
                >
                  キャンセル
                </Button>
              </div>
            </>
          ) : (
            <div className="p-3 bg-gray-50 rounded-lg min-h-[60px]">
              <p
                className="text-[#5A4A4A] text-sm whitespace-pre-wrap"
                style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              >
                {profile.bio}
              </p>
            </div>
          )}
        </div>

        {/* 投稿管理カード */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-3">
            <h3
              className="text-lg font-semibold text-[#5A4A4A] flex items-center"
              style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
            >
              <FontAwesomeIcon icon={faNewspaper} className="mr-2" />
              投稿管理
            </h3>
            {posts && (
              <span className="bg-[#7E6565] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                {posts.length}件
              </span>
            )}
          </div>
          <Link href="/mypage/posts">
            <Button className="w-full bg-sky-100 hover:bg-sky-200 text-sky-700 border border-sky-200">
              投稿一覧・管理
            </Button>
          </Link>
        </div>

        {/* 設定カード */}
        <div className="bg-white rounded-lg shadow p-6">
          {/* 個人情報セクション */}
          <button
            onClick={() => toggleSection("personal")}
            className="w-full flex items-center justify-between cursor-pointer"
          >
            <h3
              className="text-lg font-semibold text-[#5A4A4A] flex items-center"
              style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
            >
              <FontAwesomeIcon icon={faUser} className="mr-2" />
              個人情報
            </h3>
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`text-[#7E6565] text-sm transition-transform duration-200 ${
                openSections.has("personal") ? "rotate-180" : ""
              }`}
            />
          </button>
          {openSections.has("personal") && (
            <div className="space-y-4 mt-4">
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
              <Button
                onClick={handleSave}
                disabled={isLoading || !name.trim() || !email.trim()}
                className="w-full"
              >
                <FontAwesomeIcon icon={faSave} className="mr-2" />
                {isLoading ? "保存中..." : "個人情報を保存"}
              </Button>
            </div>
          )}

          <div className="border-t border-gray-200 my-6"></div>

          {/* セキュリティセクション */}
          <button
            onClick={() => toggleSection("security")}
            className="w-full flex items-center justify-between cursor-pointer"
          >
            <h3
              className="text-lg font-semibold text-[#5A4A4A] flex items-center"
              style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
            >
              <FontAwesomeIcon icon={faShieldAlt} className="mr-2" />
              セキュリティ
            </h3>
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`text-[#7E6565] text-sm transition-transform duration-200 ${
                openSections.has("security") ? "rotate-180" : ""
              }`}
            />
          </button>
          {openSections.has("security") && (
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
              <Button
                onClick={handlePasswordChange}
                disabled={
                  isLoading ||
                  !currentPassword.trim() ||
                  !newPassword.trim() ||
                  !confirmPassword.trim()
                }
                className="w-full"
              >
                <FontAwesomeIcon icon={faLock} className="mr-2" />
                パスワードを変更
              </Button>
            </div>
          )}

          <div className="border-t border-gray-200 my-6"></div>

          {/* アカウント管理セクション */}
          <button
            onClick={() => toggleSection("account")}
            className="w-full flex items-center justify-between cursor-pointer"
          >
            <h3
              className="text-lg font-semibold text-[#5A4A4A] flex items-center"
              style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
            >
              <FontAwesomeIcon icon={faTrash} className="mr-2" />
              アカウント管理
            </h3>
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`text-[#7E6565] text-sm transition-transform duration-200 ${
                openSections.has("account") ? "rotate-180" : ""
              }`}
            />
          </button>
          {openSections.has("account") && (
            <div className="mt-4">
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
                    className="w-full !text-red-600 !border-red-300 hover:!bg-red-50 hover:!text-red-700"
                    disabled={isLoading}
                  >
                    <FontAwesomeIcon icon={faTrash} className="mr-2" />
                    アカウントを削除
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="w-full !text-gray-600 !border-gray-300 hover:!bg-gray-50 hover:!text-gray-700"
                    disabled={isLoading}
                  >
                    ログアウト
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

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
