"use client";

import { useAuth } from "@/hooks/useAuth";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAtomValue } from "jotai";
import { profileAtom } from "@/lib/profileAtoms";
import Button from "@/components/Button/Button";
import ProfileImage from "@/components/ProfileImage/ProfileImage";
import {
  faUser,
  faCat,
  faDog,
  faStar,
  faLeaf,
  faCog,
  faPaw,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function Mypage() {
  const { logout } = useAuth();
  const profile = useAtomValue(profileAtom);
  const router = useRouter();

  // 一時的にAPI連携を無効化（404エラー回避のため）
  // const {
  //   data: apiProfile,
  //   error: profileError,
  //   isLoading: profileLoading,
  // } = getProfile(user?.uid ? parseInt(user.uid) : 0);

  // APIから取得したプロフィールデータをローカル状態に同期
  // useEffect(() => {
  //   if (apiProfile) {
  //     updateProfile({
  //       nickname: apiProfile.nickname,
  //       bio: apiProfile.bio,
  //       profileImage: apiProfile.profile_image,
  //       selectedIcon: apiProfile.selected_icon,
  //     });
  //   }
  // }, [apiProfile, updateProfile]);

  // デバッグ用ログ
  console.log("Mypage - profile:", profile);
  console.log("Mypage - selectedIcon:", profile.selectedIcon);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("ログアウトに失敗しました:", error);
    }
  }, [logout, router]);

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

  // デバッグ用ログ
  console.log("Mypage - iconOptions:", iconOptions);
  const selectedIconOption = iconOptions.find(
    (opt) => opt.name === profile.selectedIcon
  );
  console.log("Mypage - selectedIconOption:", selectedIconOption);

  // 一時的にローディング・エラー状態を無効化
  // if (profileLoading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center px-4 py-8">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
  //         <p className="mt-2">プロフィールを読み込み中...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // if (profileError) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center px-4 py-8">
  //       <div className="text-center">
  //         <p className="text-red-500 mb-4">
  //           プロフィールの読み込みに失敗しました
  //         </p>
  //         <button
  //           onClick={() => window.location.reload()}
  //           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
  //         >
  //           再読み込み
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* ヘッダー */}
          <div className="flex justify-end mb-6">
            <Link href="/edit-profile">
              <FontAwesomeIcon
                icon={faCog}
                className="text-[#7E6565] hover:text-[#6B5555] transition-colors cursor-pointer"
                size="lg"
              />
            </Link>
          </div>

          {/* プロフィール画像と名前 */}
          <div className="flex items-center mb-6">
            <ProfileImage
              profileImage={profile.profileImage}
              selectedIcon={profile.selectedIcon}
              iconOptions={iconOptions}
              isEditing={false}
              onImageUpload={() => {}}
            />
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-semibold text-[#5A4A4A]">
                {profile.nickname}
              </h3>
              <p className="text-sm text-[#7E6565]">プロフィール</p>
            </div>
          </div>

          {/* 自己紹介欄 */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#5A4A4A] mb-2">
                <FontAwesomeIcon icon={faUser} className="mr-2" />
                自己紹介
              </label>
              <div className="p-3 bg-gray-50 border border-[#C4B5B5] rounded-lg min-h-[150px]">
                <p className="text-[#5A4A4A] whitespace-pre-wrap">
                  {profile.bio}
                </p>
              </div>
            </div>
          </div>

          {/* 区切り線 */}
          <div className="border-t border-gray-200 my-6"></div>

          {/* ログアウトボタン */}
          <div className="text-center">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700 cursor-pointer"
            >
              ログアウト
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
