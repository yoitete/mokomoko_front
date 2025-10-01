"use client";

import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAtomValue, useSetAtom } from "jotai";
import { profileAtom, updateProfileAtom } from "@/lib/profileAtoms";
import { useProfile } from "@/hooks/useProfile";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { mutate } from "swr";
import Button from "@/components/Button/Button";
import ProfileImage from "@/components/ProfileImage/ProfileImage";
import IconSelector from "@/components/IconSelector/IconSelector";
import BioSection from "@/components/BioSection/BioSection";
import {
  faUser,
  faCat,
  faDog,
  faStar,
  faLeaf,
  faArrowLeft,
  faSave,
  faPaw,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function EditProfile() {
  const profile = useAtomValue(profileAtom);
  const updateProfile = useSetAtom(updateProfileAtom);
  const { updateProfile: updateProfileAPI } = useProfile();
  const { userData, userId, firebaseUID } = useCurrentUser();
  const [nickname, setNickname] = useState(profile.nickname);
  const [bio, setBio] = useState(profile.bio);
  const [profileImage, setProfileImage] = useState<string | null>(
    profile.profileImage
  );
  const [selectedIcon, setSelectedIcon] = useState<string>(
    profile.selectedIcon
  );
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const router = useRouter();

  // プロフィール情報が変更されたらローカル状態を更新
  useEffect(() => {
    setNickname(profile.nickname);
    setBio(profile.bio);
    setProfileImage(profile.profileImage);
    setSelectedIcon(profile.selectedIcon);
  }, [profile]);

  // API側のデータが取得できたら、それを優先して表示
  useEffect(() => {
    if (userData && userData.nickname !== undefined) {
      console.log("編集ページでAPI側のデータを反映:", userData);
      setNickname(userData.nickname || "ユーザー名");
      setBio(userData.bio || "自己紹介が設定されていません");
      setProfileImage(userData.profile_image || null);
      setSelectedIcon(userData.selected_icon || "user");
    }
  }, [userData]);

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

  const handleIconSelect = useCallback((iconName: string) => {
    setSelectedIcon(iconName);
    setProfileImage(null);
  }, []);

  const handleNicknameChange = useCallback((value: string) => {
    setNickname(value);
  }, []);

  const handleBioChange = useCallback((value: string) => {
    setBio(value);
  }, []);

  const handleSave = useCallback(async () => {
    setIsLoading(true);
    setFormError("");

    try {
      // ローカル状態を更新
      updateProfile({
        nickname,
        bio,
        profileImage,
        selectedIcon,
      });

      // API側にも更新を送信
      if (firebaseUID && userId) {
        console.log("Firebase UID:", firebaseUID, "User ID:", userId);

        await updateProfileAPI(userId, {
          nickname,
          bio,
          profile_image: profileImage,
          selected_icon: selectedIcon,
        });
        console.log("プロフィールをAPI側にも更新完了:", {
          nickname,
          bio,
          selectedIcon,
        });

        // SWRキャッシュを強制的に再検証
        await mutate(`/users/${userId}`);
        await mutate(`/users/by_firebase_uid/${firebaseUID}`);

        console.log("SWRキャッシュを更新しました");
      } else {
        console.warn(
          "ユーザーIDが取得できませんでした。ローカルのみ更新されました。",
          { firebaseUID, userId, userData }
        );
      }

      router.push("/mypage");
    } catch (err) {
      console.error("プロフィール更新エラー:", err);
      setFormError("プロフィールの更新に失敗しました");
    } finally {
      setIsLoading(false);
    }
  }, [
    nickname,
    bio,
    profileImage,
    selectedIcon,
    updateProfile,
    updateProfileAPI,
    firebaseUID,
    userId,
    userData,
    router,
  ]);

  const handleCancel = useCallback(() => {
    router.push("/mypage");
  }, [router]);

  const iconOptions = [
    // FontAwesomeアイコン
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

    // カスタム画像アイコン
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
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* ヘッダー */}
          <div className="flex items-center mb-6">
            <Link href="/mypage" className="mr-4">
              <FontAwesomeIcon
                icon={faArrowLeft}
                className="text-[#7E6565] hover:text-[#6B5555] transition-colors cursor-pointer"
                size="lg"
              />
            </Link>
            <h2 
              className="text-2xl font-semibold text-[#5A4A4A]"
              style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
            >
              プロフィール編集
            </h2>
          </div>

          {/* プロフィール画像とニックネーム */}
          <div className="flex items-center mb-6">
            <ProfileImage
              profileImage={profileImage}
              selectedIcon={selectedIcon}
              iconOptions={iconOptions}
              isEditing={true}
              onImageUpload={handleImageUpload}
            />
            <div className="ml-4 flex-1">
              <input
                type="text"
                value={nickname}
                onChange={(e) => handleNicknameChange(e.target.value)}
                className="text-lg font-semibold text-[#5A4A4A] bg-transparent border-b border-[#7E6565] focus:outline-none focus:border-[#5A4A4A] w-full"
                placeholder="ニックネームを入力"
              />
              <p className="text-sm text-[#7E6565]">プロフィール</p>
            </div>
          </div>

          {/* アイコン選択 */}
          <IconSelector
            iconOptions={iconOptions}
            selectedIcon={selectedIcon}
            onIconSelect={handleIconSelect}
          />

          {/* 自己紹介欄 */}
          <BioSection
            bio={bio}
            isEditing={true}
            onBioChange={handleBioChange}
            onEdit={() => {}}
            onSave={() => {}}
            onCancel={() => {}}
            showActions={false}
          />

          {/* エラーメッセージ */}
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
              <p className="text-red-600 text-sm">{formError}</p>
            </div>
          )}

          {/* アクションボタン */}
          <div className="flex space-x-3 mt-6">
            <Button
              onClick={handleSave}
              className="flex-1 cursor-pointer"
              disabled={isLoading || !nickname.trim()}
            >
              <FontAwesomeIcon icon={faSave} className="mr-2" />
              {isLoading ? "保存中..." : "保存"}
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1 cursor-pointer"
              disabled={isLoading}
            >
              キャンセル
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
