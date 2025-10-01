"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useGet } from "@/hooks/useSWRAPI";
import { Post } from "@/hooks/usePosts";
import { SimpleBox } from "@/components/SimpleBox/SimpleBox";
import Button from "@/components/Button/Button";
import { faList, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

interface SearchResponse {
  posts: Post[];
  pagination: {
    current_page: number;
    per_page: number;
    total_count: number;
    total_pages: number;
  };
}

export default function Search() {
  const { isUnauthenticated, loading } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState<"newest" | "popular">(
    "newest"
  );

  // デバウンス機能：2000ms後に検索クエリを更新
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 2000);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 検索パラメータを構築
  const buildSearchParams = useCallback(() => {
    const params = new URLSearchParams();
    if (debouncedSearchQuery.trim()) {
      params.append("search", debouncedSearchQuery.trim());
    }
    if (selectedSort) {
      params.append("sort", selectedSort);
    }
    params.append("with_images", "true");
    params.append("page", currentPage.toString());
    params.append("per_page", "6");
    return params.toString();
  }, [debouncedSearchQuery, selectedSort, currentPage]);

  // APIから検索結果を取得
  const {
    data: searchData,
    error,
    isLoading,
  } = useGet<SearchResponse>(`/posts?${buildSearchParams()}`);

  const posts = searchData?.posts || [];
  const pagination = searchData?.pagination;

  // 検索クエリが変更されたときにページを1にリセット
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, selectedSort]);

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
      <div
        className="mt-5 ml-7 text-left font-semibold text-2xl"
        style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
      >
        検索
      </div>

      {/* 検索バー */}
      <div className="ml-6 mt-3 flex items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 border border-[#C4B5B5] rounded-lg focus:border-[#7E6565] focus:ring-[#7E6565] pr-10 bg-white"
            style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
            placeholder="タグ、タイトル、説明で検索..."
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>

      {/* 絞り込み */}
      <div className="mr-6 mt-2 flex justify-end">
        <div className="relative dropdown-container">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm text-black"
            style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
          >
            <FontAwesomeIcon icon={faList} size="lg" className="text-black" />
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
                  style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
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
                  style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                >
                  人気順
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 検索結果 */}
      <div className="mt-4 ml-6">
        <p
          className="text-sm text-gray-600"
          style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
        >
          {searchQuery
            ? `"${searchQuery}" の検索結果: ${pagination?.total_count || 0}件`
            : `全投稿: ${pagination?.total_count || 0}件`}
        </p>
        {pagination && pagination.total_pages > 1 && (
          <p
            className="text-sm text-gray-500 mt-1"
            style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
          >
            {pagination.current_page} / {pagination.total_pages} ページ
          </p>
        )}
      </div>

      {/* 投稿一覧 */}
      <div className="mt-10 mx-4 space-y-4">
        {posts.length === 0 ? (
          <p className="text-center mt-10 text-gray-600">
            {searchQuery
              ? "検索結果が見つかりませんでした"
              : "投稿がありません"}
          </p>
        ) : (
          posts.map((post) => (
            <SimpleBox
              key={post.id}
              className="flex flex-col md:flex-row items-start p-4"
            >
              {/* 左：画像 */}
              <div className="md:w-1/3 w-full">
                {post.images?.[0] ? (
                  <div className="w-full h-[118px] overflow-hidden relative">
                    <Image
                      src={post.images[0]}
                      alt={post.title}
                      fill
                      className="object-cover"
                      unoptimized={true}
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
            <span
              className="text-sm text-gray-900 font-semibold"
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
            >
              {pagination.current_page} / {pagination.total_pages}
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
    </div>
  );
}
