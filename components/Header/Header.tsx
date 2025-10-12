"use client";

import {
  faBars,
  faSignOutAlt,
  faUser,
  faSignInAlt,
  faCog,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const { user, isAuthenticated, logout, signIn } = useAuth();
  const { name, nickname, userData } = useCurrentUser();
  const [showMenu, setShowMenu] = useState(false);

  // デバッグログ（プロフィール編集後の反映確認用）
  console.log("Header - name:", name);
  console.log("Header - nickname:", nickname);
  console.log("Header - userData:", userData);
  console.log("Header - user?.email:", user?.email);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/login";
      setShowMenu(false);
    } catch (error) {
      console.error("ログアウトに失敗しました:", error);
    }
  };

  const handleGuestLogin = async () => {
    try {
      await signIn("admin@guest.com", "123456");
      setShowMenu(false);
    } catch (error) {
      console.error("ゲストログインに失敗しました:", error);
    }
  };

  return (
    <div className="sticky top-0 bg-[#7E6565] p-4 flex justify-between items-center z-50">
      <h1
        className="text-4xl text-[#F1F6F7] mx-auto text-center pl-9"
        style={{ fontFamily: "Pomeranian, cursive" }}
      >
        MokoMoko
      </h1>

      {/* ハンバーガーメニュー */}
      <div className="relative">
        <button
          className="p-2 rounded-md hover:bg-[#6B5555] transition-colors"
          onClick={() => setShowMenu(!showMenu)}
        >
          <FontAwesomeIcon
            icon={faBars}
            size="2x"
            className="cursor-pointer text-[#F1F6F7]"
          />
        </button>

        {/* ドロップダウンメニュー */}
        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
            {isAuthenticated ? (
              <>
                {/* ログイン済みの場合 */}
                <div className="px-4 py-2 border-b border-gray-200">
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon={faUser}
                      className="text-[#7E6565] mr-2"
                    />
                    <span
                      className="text-sm text-[#5A4A4A] truncate"
                      style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
                    >
                      {nickname ||
                        userData?.nickname ||
                        name ||
                        userData?.name ||
                        user?.email}
                    </span>
                  </div>
                </div>

                <Link href="/mypage">
                  <button
                    className="w-full text-left px-4 py-2 text-[#5A4A4A] hover:bg-gray-50 transition-colors flex items-center"
                    style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
                    onClick={() => setShowMenu(false)}
                  >
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    マイページ
                  </button>
                </Link>

                <Link href="/settings">
                  <button
                    className="w-full text-left px-4 py-2 text-[#5A4A4A] hover:bg-gray-50 transition-colors flex items-center"
                    style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
                    onClick={() => setShowMenu(false)}
                  >
                    <FontAwesomeIcon icon={faCog} className="mr-2" />
                    設定
                  </button>
                </Link>

                <button
                  className="w-full text-left px-4 py-2 text-[#5A4A4A] hover:bg-gray-50 transition-colors flex items-center"
                  style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
                  onClick={() => setShowMenu(false)}
                >
                  <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                  お問い合わせ
                </button>

                <div className="border-t border-gray-200 my-1"></div>

                <button
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors flex items-center"
                  style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
                  onClick={handleLogout}
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                  ログアウト
                </button>
              </>
            ) : (
              <>
                {/* ログイン前の場合 */}
                <Link href="/login">
                  <button
                    className="w-full text-left px-4 py-2 text-[#5A4A4A] hover:bg-gray-50 transition-colors flex items-center"
                    style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
                    onClick={() => setShowMenu(false)}
                  >
                    <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
                    ログイン
                  </button>
                </Link>

                <button
                  className="w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-50 transition-colors flex items-center"
                  style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
                  onClick={handleGuestLogin}
                >
                  <FontAwesomeIcon
                    icon={faUser}
                    className="mr-2 text-blue-600"
                  />
                  ゲストユーザーでログイン
                </button>

                <Link href="/settings">
                  <button
                    className="w-full text-left px-4 py-2 text-[#5A4A4A] hover:bg-gray-50 transition-colors flex items-center"
                    style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
                    onClick={() => setShowMenu(false)}
                  >
                    <FontAwesomeIcon icon={faCog} className="mr-2" />
                    設定
                  </button>
                </Link>

                <button
                  className="w-full text-left px-4 py-2 text-[#5A4A4A] hover:bg-gray-50 transition-colors flex items-center"
                  style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
                  onClick={() => setShowMenu(false)}
                >
                  <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                  お問い合わせ
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* メニューが開いている時の背景クリック用オーバーレイ */}
      {showMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
}
