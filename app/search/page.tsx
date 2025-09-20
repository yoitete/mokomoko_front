"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useGet } from "@/hooks/useSWRAPI";
import { Post } from "@/hooks/usePosts";
import { SimpleBox } from "@/components/SimpleBox/SimpleBox";
import Button from "@/components/Button/Button";
import { faList, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function Search() {
  const { isUnauthenticated, loading } = useAuth();

  // SWRを使用してデータを取得（デフォルト設定を使用）
  const { data: posts, error, isLoading } = useGet<Post[]>("/posts");

  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState<"newest" | "popular">(
    "newest"
  );

  // postsが更新されたときにfilteredPostsを更新
  useEffect(() => {
    if (posts) {
      setFilteredPosts(posts);
    }
  }, [posts]);

  // 検索機能
  useEffect(() => {
    let filtered = posts || [];

    // テキスト検索
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((post) => {
        return (
          post.title?.toLowerCase().includes(query) ||
          post.description?.toLowerCase().includes(query) ||
          (post.tags &&
            post.tags.some((tag) => tag.toLowerCase().includes(query))) ||
          post.season?.toLowerCase().includes(query)
        );
      });
    }

    // 季節フィルター
    if (selectedSeason) {
      filtered = filtered.filter((post) => {
        if (selectedSeason === "spring") {
          return post.season === "spring-summer";
        } else if (selectedSeason === "summer") {
          return post.season === "spring-summer";
        } else if (selectedSeason === "autumn") {
          return post.season === "autumn-winter";
        } else if (selectedSeason === "winter") {
          return post.season === "autumn-winter";
        }
        return post.season === selectedSeason;
      });
    }

    setFilteredPosts(filtered);
    setCurrentPage(1); // 検索時にページを1にリセット
  }, [searchQuery, posts, selectedSeason]);

  // 並び替え機能
  const sortedPosts = React.useMemo(() => {
    return [...filteredPosts].sort((a, b) => {
      if (selectedSort === "newest") {
        return (
          new Date(b.created_at || 0).getTime() -
          new Date(a.created_at || 0).getTime()
        );
      } else {
        // 人気順（仮実装：価格の高い順）
        return (b.price || 0) - (a.price || 0);
      }
    });
  }, [filteredPosts, selectedSort]);

  // 並び替え変更時にページを1にリセット
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSort]);

  // ドロップダウンメニューの外側クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen) {
        const target = event.target as Element;
        if (!target.closest(".dropdown-container")) {
          setIsDropdownOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // 画像がある投稿のみをフィルタリング
  const postsWithImages = sortedPosts.filter(
    (post) => post.images && post.images.length > 0
  );

  // ページネーション計算
  const totalPages = Math.ceil(postsWithImages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPosts = postsWithImages.slice(startIndex, endIndex);

  // ページ変更時にトップにスクロール
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ローディング中の表示
  if (loading) {
    return (
      <div className="min-h-screen bg-[#E2D8D8] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">認証状態を確認中...</p>
        </div>
      </div>
    );
  }

  // ログイン前の表示
  if (isUnauthenticated) {
    return (
      <div className="min-h-screen bg-[#E2D8D8] flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center whitespace-nowrap">
            このページはログイン後に表示されます
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            この機能をご利用いただくには
            <br />
            ログインまたは新規登録が必要です。
          </p>
          <div className="space-y-3">
            <Link href="/signup">
              <Button className="w-full">新規アカウント作成</Button>
            </Link>
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

  if (isLoading) {
    return (
      <div className="mt-5 mb-5">
        <div className="text-center mt-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-5 mb-5">
        <div className="text-center mt-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5 mb-5">
      <div className="mt-5 ml-7 text-left font-semibold text-2xl">検索</div>

      {/* 検索バー */}
      <div className="ml-6 mt-3 flex items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white p-3 border w-full rounded-xl pr-10"
            placeholder="タグ、タイトル、説明で検索..."
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>

      {/* フィルターと並び替え */}
      <div className="mr-6 mt-2 flex justify-end">
        <div className="relative dropdown-container">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm text-black"
          >
            <FontAwesomeIcon icon={faList} size="lg" className="text-black" />
            <span>
              並べ替え：{selectedSort === "newest" ? "新着順" : "人気順"}
            </span>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <div className="py-1">
                <button
                  onClick={() => {
                    setSelectedSeason(null);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                    !selectedSeason ? "bg-blue-50 text-blue-600" : ""
                  }`}
                >
                  すべて
                </button>
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
                <button
                  onClick={() => {
                    setSelectedSeason("spring");
                    setIsDropdownOpen(false);
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
                    setIsDropdownOpen(false);
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
                    setIsDropdownOpen(false);
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
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                    selectedSeason === "winter"
                      ? "bg-blue-50 text-blue-600"
                      : ""
                  }`}
                >
                  冬
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 検索結果 */}
      <div className="mt-4 ml-6">
        <p className="text-sm text-gray-600">
          {searchQuery
            ? `"${searchQuery}" の検索結果: ${postsWithImages.length}件`
            : `全投稿: ${postsWithImages.length}件`}
        </p>
        {totalPages > 1 && (
          <p className="text-sm text-gray-500 mt-1">
            {currentPage} / {totalPages} ページ
          </p>
        )}
      </div>

      {/* 投稿一覧 */}
      <div className="mt-10 mx-4 space-y-4">
        {postsWithImages.length === 0 ? (
          <p className="text-center mt-10 text-gray-600">
            {searchQuery
              ? "検索結果が見つかりませんでした"
              : "投稿がありません"}
          </p>
        ) : (
          currentPosts.map((post) => (
            <SimpleBox
              key={post.id}
              className="flex flex-col md:flex-row items-start p-4"
            >
              {/* 左：画像 */}
              <div className="md:w-1/3 w-full">
                {post.images?.[0] ? (
                  <div className="w-full h-[118px] overflow-hidden rounded-lg relative">
                    <Image
                      src={post.images[0]}
                      alt={post.title}
                      fill
                      className="object-cover"
                      unoptimized={true}
                    />
                  </div>
                ) : (
                  <div className="h-[118px] bg-gray-200 flex items-center justify-center rounded-lg">
                    No Image
                  </div>
                )}
              </div>

              {/* 右：タイトル＋本文サマリー */}
              <div className="md:w-2/3 w-full md:ml-4 mt-2 md:mt-0">
                <p className="text-lg font-semibold">{post.title}</p>
                <p className="text-sm text-gray-600 line-clamp-3 mt-1">
                  {post.description}
                </p>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {post.tags.slice(0, 5).map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                <Link
                  href={`/post/${post.id}`}
                  className="text-blue-500 text-sm mt-2 inline-block"
                >
                  続きを読む
                </Link>
              </div>
            </SimpleBox>
          ))
        )}
      </div>

      {/* ページネーション */}
      {totalPages >= 1 && (
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
              {currentPage} / {totalPages}
            </span>
          </div>

          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="outline"
            size="md"
            className="min-w-[100px]"
          >
            次へ
          </Button>
        </div>
      )}
    </div>
  );
}
