"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGet } from "@/hooks/useSWRAPI";
import { Post } from "@/hooks/usePosts";
import { useFavorites } from "@/hooks/useFavorites";
import { SimpleBox } from "@/components/SimpleBox/SimpleBox";
import Button from "@/components/Button/Button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faSort,
  faFilter,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

interface SearchResponse {
  posts: Post[];
  pagination: {
    current_page: number;
    per_page: number;
    total_count: number;
    total_pages: number;
  };
}

export default function AllPostsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    isUnauthenticated,
    loading: authLoading,
    userId,
    isAuthenticated,
  } = useCurrentUser();

  const [currentPage, setCurrentPage] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState<"newest" | "popular">(
    "newest"
  );
  const [selectedSeason, setSelectedSeason] = useState<string>("");

  // URLパラメータから初期値を設定
  useEffect(() => {
    const sort = searchParams.get("sort");
    if (sort === "popular" || sort === "newest") {
      setSelectedSort(sort);
    }
  }, [searchParams]);

  // お気に入り機能
  const { toggleFavorite, isFavorite } = useFavorites(userId || 0);

  // 検索パラメータを構築
  const buildSearchParams = useCallback(() => {
    const params = new URLSearchParams();
    if (selectedSort) {
      params.append("sort", selectedSort);
    }
    if (selectedSeason) {
      params.append("season", selectedSeason);
    }
    params.append("with_images", "true");
    params.append("page", currentPage.toString());
    params.append("per_page", "12");
    return params.toString();
  }, [selectedSort, selectedSeason, currentPage]);

  // APIから投稿データを取得
  const {
    data: searchData,
    error,
    isLoading,
  } = useGet<SearchResponse>(`/posts?${buildSearchParams()}`);

  const posts = searchData?.posts || [];
  const pagination = searchData?.pagination;

  // ソート変更時にページを1にリセット
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSort, selectedSeason]);

  // ドロップダウンメニューの外側クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen) {
        const target = event.target as Element;
        if (!target.closest(".dropdown-container")) {
          setIsDropdownOpen(false);
        }
      }
      if (isFilterOpen) {
        const target = event.target as Element;
        if (!target.closest(".filter-container")) {
          setIsFilterOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen, isFilterOpen]);

  // ページ変更時にトップにスクロール
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ローディング中の表示
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">読み込み中...</p>
        </div>
      </div>
    );
  }

  // ログイン前の表示
  if (isUnauthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
            このページはログイン後に表示されます
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            投稿一覧機能をご利用いただくには
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
    <>
      <div className="mt-10 mx-4 space-y-4">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-light text-center text-gray-600">
            {selectedSort === "popular" ? "投稿人気ランキング" : "投稿新着一覧"}
          </h1>
          <button
            onClick={() => router.push("/home")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-gray-600" />
          </button>
        </div>

        {/* フィルター・ソート */}
        <div className="flex flex-wrap gap-4 items-center justify-center mb-6">
          {/* 季節フィルター */}
          <div className="relative filter-container">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm text-black"
            >
              <FontAwesomeIcon icon={faFilter} className="text-black" />
              <span>
                季節：
                {selectedSeason
                  ? selectedSeason === "spring"
                    ? "春"
                    : selectedSeason === "summer"
                    ? "夏"
                    : selectedSeason === "autumn"
                    ? "秋"
                    : selectedSeason === "winter"
                    ? "冬"
                    : selectedSeason === "spring-summer"
                    ? "春・夏"
                    : selectedSeason === "autumn-winter"
                    ? "秋・冬"
                    : "全て"
                  : "全て"}
              </span>
            </button>
            {isFilterOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setSelectedSeason("");
                      setIsFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                      selectedSeason === "" ? "bg-blue-50 text-blue-600" : ""
                    }`}
                  >
                    全て
                  </button>
                  <button
                    onClick={() => {
                      setSelectedSeason("spring");
                      setIsFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                      selectedSeason === "spring"
                        ? "bg-blue-50 text-blue-600"
                        : ""
                    }`}
                  >
                    春
                  </button>
                  <button
                    onClick={() => {
                      setSelectedSeason("summer");
                      setIsFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                      selectedSeason === "summer"
                        ? "bg-blue-50 text-blue-600"
                        : ""
                    }`}
                  >
                    夏
                  </button>
                  <button
                    onClick={() => {
                      setSelectedSeason("autumn");
                      setIsFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                      selectedSeason === "autumn"
                        ? "bg-blue-50 text-blue-600"
                        : ""
                    }`}
                  >
                    秋
                  </button>
                  <button
                    onClick={() => {
                      setSelectedSeason("winter");
                      setIsFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                      selectedSeason === "winter"
                        ? "bg-blue-50 text-blue-600"
                        : ""
                    }`}
                  >
                    冬
                  </button>
                  <button
                    onClick={() => {
                      setSelectedSeason("spring-summer");
                      setIsFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                      selectedSeason === "spring-summer"
                        ? "bg-blue-50 text-blue-600"
                        : ""
                    }`}
                  >
                    春・夏
                  </button>
                  <button
                    onClick={() => {
                      setSelectedSeason("autumn-winter");
                      setIsFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                      selectedSeason === "autumn-winter"
                        ? "bg-blue-50 text-blue-600"
                        : ""
                    }`}
                  >
                    秋・冬
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ソート */}
        <div className="relative dropdown-container">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm text-black"
          >
            <FontAwesomeIcon icon={faSort} size="lg" className="text-black" />
            <span>
              絞り込み：{selectedSort === "newest" ? "新着順" : "人気順"}
            </span>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <div className="py-1">
                <button
                  onClick={() => {
                    setSelectedSort("newest");
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                    selectedSort === "newest" ? "bg-blue-50 text-blue-600" : ""
                  }`}
                >
                  新着順
                </button>
                <button
                  onClick={() => {
                    setSelectedSort("popular");
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                    selectedSort === "popular" ? "bg-blue-50 text-blue-600" : ""
                  }`}
                >
                  人気順
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ページ情報表示 */}
      <div className="text-center text-sm text-gray-500 mb-4">
        {pagination
          ? `${pagination.total_count}件中 ${
              (currentPage - 1) * 12 + 1
            }-${Math.min(currentPage * 12, pagination.total_count)}件を表示`
          : ""}
      </div>

      {/* 投稿一覧 */}
      {isLoading ? (
        <div className="text-center mt-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">読み込み中...</p>
        </div>
      ) : error ? (
        <div className="text-center mt-10">
          <p className="text-red-500 mb-4">投稿の読み込みに失敗しました</p>
          <p className="text-gray-600 text-sm mb-4">
            エラー: {error.message || "不明なエラー"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            再読み込み
          </button>
        </div>
      ) : !posts || posts.length === 0 ? (
        <p className="text-center mt-10 text-gray-600">
          条件に合う投稿が見つかりませんでした
        </p>
      ) : (
        <>
          {posts.map((post, index) => (
            <SimpleBox
              key={post.id || index}
              className="flex flex-col md:flex-row items-start p-4"
            >
              {/* 左：画像 */}
              <div className="md:w-1/3 w-full">
                {post.images?.[0] ? (
                  <div className="w-full h-[118px] overflow-hidden relative">
                    <img
                      src={post.images[0]}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-[118px] bg-gray-200 flex items-center justify-center">
                    No Image
                  </div>
                )}
              </div>

              {/* 右：タイトル＋本文サマリー */}
              <div className="md:w-2/3 w-full md:ml-4 mt-2 md:mt-0">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-lg font-semibold">{post.title}</p>
                  {selectedSort === "popular" && (
                    <span className="text-sm text-gray-500 ml-4 flex-shrink-0">
                      #{index + 1}
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-600 line-clamp-3 mt-1">
                  {post.description}
                </p>

                {/* 価格表示 */}
                {post.price && (
                  <p className="text-lg font-bold text-red-600 mt-2">
                    ¥{post.price.toLocaleString()}
                  </p>
                )}

                {/* タグ表示 */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {post.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        +{post.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* 季節・お気に入り数・作成日 */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                  {post.season && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                      {post.season === "spring"
                        ? "春"
                        : post.season === "summer"
                        ? "夏"
                        : post.season === "autumn"
                        ? "秋"
                        : post.season === "winter"
                        ? "冬"
                        : post.season === "spring-summer"
                        ? "春・夏"
                        : post.season === "autumn-winter"
                        ? "秋・冬"
                        : post.season}
                    </span>
                  )}
                  <span>♥ {post.favorites_count || 0}</span>
                  <span>
                    {new Date(post.created_at || "").toLocaleDateString(
                      "ja-JP"
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <Link
                    href={`/post/${post.id}`}
                    className="text-blue-500 text-sm"
                  >
                    続きを読む
                  </Link>

                  {/* お気に入りボタン */}
                  {isAuthenticated && (
                    <button
                      onClick={() => toggleFavorite(post.id!)}
                      className={`p-1 rounded-full transition-colors ${
                        isFavorite(post.id!)
                          ? "text-red-500 bg-red-50"
                          : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                      }`}
                    >
                      <FontAwesomeIcon icon={faHeart} className="text-sm" />
                    </button>
                  )}
                </div>
              </div>
            </SimpleBox>
          ))}

          {/* ページネーション */}
          {pagination && pagination.total_pages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-8 mb-3">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                variant="outline"
                size="md"
                className="min-w-[100px]"
              >
                前へ
              </Button>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-900 font-semibold">
                  {currentPage} / {pagination.total_pages}
                </span>
              </div>

              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.total_pages}
                variant="outline"
                size="md"
                className="min-w-[100px]"
              >
                次へ
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
}
