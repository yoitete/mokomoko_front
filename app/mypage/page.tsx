"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAtomValue, useSetAtom } from "jotai";
import { profileAtom, updateProfileAtom } from "@/lib/profileAtoms";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAuth } from "@/hooks/useAuth";
import { useMyPosts } from "@/hooks/useMyPosts";
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
  const { isUnauthenticated, loading, userData } = useCurrentUser();
  const profile = useAtomValue(profileAtom);
  const updateProfile = useSetAtom(updateProfileAtom);
  const router = useRouter();
  const { posts } = useMyPosts();

  // APIから取得したプロフィールデータをローカル状態に同期
  useEffect(() => {
    if (userData && userData.nickname !== undefined) {
      console.log("API側のデータでローカル状態を更新:", userData);
      updateProfile({
        nickname: userData.nickname || "ユーザー名",
        bio: userData.bio || "自己紹介が設定されていません",
        profileImage: userData.profile_image,
        selectedIcon: userData.selected_icon || "user",
      });
    }
  }, [userData, updateProfile]);

  // ページ表示時にキャッシュを再検証（プロフィール編集から戻った場合など）
  useEffect(() => {
    if (userData?.id) {
      // プロフィールデータを最新に更新
      import("swr").then(({ mutate }) => {
        mutate(`/users/${userData.id}`);
        mutate(`/users/by_firebase_uid/${userData.firebase_uid}`);
      });
    }
  }, [userData?.id, userData?.firebase_uid]);

  // デバッグ用ログ（必要に応じてコメントアウト）
  // console.log("Mypage - profile:", profile);
  // console.log("Mypage - selectedIcon:", profile.selectedIcon);
  // console.log("Mypage - userData:", userData);
  // console.log("Mypage - userError:", userError);

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
            認証状態を確認中...
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
              <h3
                className="text-lg font-semibold text-[#5A4A4A]"
                style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
              >
                {profile.nickname}
              </h3>
              <p
                className="text-sm text-[#7E6565]"
                style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              >
                プロフィール
              </p>
            </div>
          </div>

          {/* 自己紹介欄 */}
          <div className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium text-[#5A4A4A] mb-2"
                style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
              >
                <FontAwesomeIcon icon={faUser} className="mr-2" />
                自己紹介
              </label>
              <div className="p-3 bg-gray-50 border border-[#C4B5B5] rounded-lg min-h-[150px]">
                <p
                  className="text-[#5A4A4A] whitespace-pre-wrap"
                  style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                >
                  {profile.bio}
                </p>
              </div>
            </div>
          </div>

          {/* 区切り線 */}
          <div className="border-t border-gray-200 my-6"></div>

          {/* 投稿管理セクション */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <label
                className="block text-sm font-medium text-[#5A4A4A]"
                style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
              >
                <FontAwesomeIcon icon={faUser} className="mr-2" />
                投稿管理
              </label>
              <span
                className="text-sm text-gray-500"
                style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              >
                {posts ? `${posts.length}件` : ""}
              </span>
            </div>
            <div className="space-y-2">
              <Link href="/mypage/posts">
                <Button className="w-full bg-sky-100 hover:bg-sky-200 text-sky-700 border border-sky-200">
                  投稿一覧・管理
                </Button>
              </Link>
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
