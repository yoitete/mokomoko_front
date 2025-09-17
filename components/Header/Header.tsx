"use client";

import {
  faBars,
  faSignOutAlt,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setShowMenu(false);
    } catch (error) {
      console.error("ログアウトに失敗しました:", error);
    }
  };

  return (
    <div className="sticky top-0 bg-[#7E6565] p-4 flex justify-between items-center z-50">
      <h1 className="text-5xl font-sans text-[#F1F6F7] mx-auto text-center tracking-wide pl-9">
        MokoMoko
      </h1>

      {/* 認証状態に応じたメニュー */}
      <div className="relative">
        {isAuthenticated ? (
          <>
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
                <div className="px-4 py-2 border-b border-gray-200">
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon={faUser}
                      className="text-[#7E6565] mr-2"
                    />
                    <span className="text-sm text-[#5A4A4A] truncate">
                      {user?.email}
                    </span>
                  </div>
                </div>

                <Link href="/mypage">
                  <button
                    className="w-full text-left px-4 py-2 text-[#5A4A4A] hover:bg-gray-50 transition-colors"
                    onClick={() => setShowMenu(false)}
                  >
                    マイページ
                  </button>
                </Link>

                <button
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors flex items-center"
                  onClick={handleLogout}
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                  ログアウト
                </button>
              </div>
            )}
          </>
        ) : (
          <Link href="/login">
            <button className="px-4 py-2 bg-[#F1F6F7] text-[#7E6565] rounded-lg hover:bg-gray-100 transition-colors font-medium">
              ログイン
            </button>
          </Link>
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
