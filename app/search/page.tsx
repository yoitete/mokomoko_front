"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { useGet } from "@/hooks/useSWRAPI";
import { Post } from "@/hooks/usePosts";
import { SimpleBox } from "@/components/SimpleBox/SimpleBox";
import Button from "@/components/Button/Button";
import { faHeart, faList, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useFavorites } from "@/hooks/useFavorites";
import {
  DiagnosisAnswers,
  SESSION_KEY,
  scorePosts,
} from "@/components/PillowDiagnosis/types";

type SortType = "newest" | "popular" | "recommended";

const SORT_LABELS: Record<SortType, string> = {
  newest: "新着順",
  popular: "人気順",
  recommended: "おすすめ順",
};

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
  const { isUnauthenticated, loading, userId } = useCurrentUser();
  const { toggleFavorite, isFavorite } = useFavorites(userId);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortType>("newest");
  const [diagnosisAnswers, setDiagnosisAnswers] =
    useState<DiagnosisAnswers | null>(null);

  const isRecommended = selectedSort === "recommended";
  const perPage = 10;

  // sessionStorageから診断結果を読み込み
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (stored) {
        setDiagnosisAnswers(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 2000);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // サーバーサイド用パラメータ（新着順・人気順）
  const buildSearchParams = useCallback(() => {
    const params = new URLSearchParams();
    if (debouncedSearchQuery.trim()) {
      params.append("search", debouncedSearchQuery.trim());
    }
    if (!isRecommended) {
      params.append("sort", selectedSort);
      params.append("page", currentPage.toString());
      params.append("per_page", perPage.toString());
    } else {
      // おすすめ順: 全件取得してクライアントでソート
      params.append("per_page", "100");
    }
    params.append("with_images", "true");
    return params.toString();
  }, [debouncedSearchQuery, selectedSort, currentPage, isRecommended]);

  const {
    data: searchData,
    error,
    isLoading,
  } = useGet<SearchResponse>(`/posts?${buildSearchParams()}`);

  // おすすめ順: クライアントサイドでスコアリング＆ページネーション
  const recommendedResults = useMemo(() => {
    if (!isRecommended || !diagnosisAnswers || !searchData?.posts) return null;
    return scorePosts(searchData.posts, diagnosisAnswers);
  }, [isRecommended, diagnosisAnswers, searchData?.posts]);

  // 診断なしの場合は人気順（お気に入り数順）にフォールバック
  const fallbackPopularPosts = useMemo(() => {
    if (!isRecommended || recommendedResults || !searchData?.posts) return null;
    return [...searchData.posts].sort(
      (a, b) => (b.favorites_count || 0) - (a.favorites_count || 0)
    );
  }, [isRecommended, recommendedResults, searchData?.posts]);

  const displayPosts = useMemo(() => {
    if (isRecommended && recommendedResults) {
      const start = (currentPage - 1) * perPage;
      return recommendedResults.slice(start, start + perPage).map((r) => r.post);
    }
    if (isRecommended && fallbackPopularPosts) {
      const start = (currentPage - 1) * perPage;
      return fallbackPopularPosts.slice(start, start + perPage);
    }
    return searchData?.posts || [];
  }, [isRecommended, recommendedResults, fallbackPopularPosts, searchData?.posts, currentPage]);

  // ページネーション情報
  const paginationInfo = useMemo(() => {
    if (isRecommended && recommendedResults) {
      const totalCount = recommendedResults.length;
      const totalPages = Math.max(1, Math.ceil(totalCount / perPage));
      return { currentPage, totalPages, totalCount };
    }
    if (isRecommended && fallbackPopularPosts) {
      const totalCount = fallbackPopularPosts.length;
      const totalPages = Math.max(1, Math.ceil(totalCount / perPage));
      return { currentPage, totalPages, totalCount };
    }
    if (searchData?.pagination) {
      const p = searchData.pagination;
      return {
        currentPage: p.current_page,
        totalPages: p.total_pages,
        totalCount: p.total_count,
      };
    }
    return null;
  }, [isRecommended, recommendedResults, fallbackPopularPosts, searchData?.pagination, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, selectedSort]);

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

  // 件数テキスト
  const pageInfoText = (() => {
    if (!paginationInfo || displayPosts.length === 0) {
      return searchQuery
        ? `"${searchQuery}" の検索結果: 0件`
        : "0件";
    }
    const { totalCount, currentPage: cp } = paginationInfo;
    const startNum = (cp - 1) * perPage + 1;
    const endNum = Math.min(cp * perPage, totalCount);
    return `${totalCount}件中 ${startNum}-${endNum}件を表示`;
  })();

  return (
    <div>
      <section className="mt-8">
        <h2
          className="text-center text-3xl font-bold tracking-wide bg-gradient-to-r from-red-700 to-red-900 bg-clip-text text-transparent"
          style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
        >
          検索
        </h2>
        {/* 検索バー */}
        <div className="px-4 mt-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 pl-10 border border-[#C4B5B5] rounded-lg focus:border-[#7E6565] focus:ring-[#7E6565] bg-white"
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              placeholder="タグ、タイトル、説明で検索..."
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7E6565]"
            />
          </div>
        </div>

        {/* 絞り込み・件数 */}
        <div className="flex items-center justify-between px-4 mt-3 mb-3">
          <p
            className="text-sm text-gray-500"
            style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
          >
            {pageInfoText}
          </p>
          <div className="relative dropdown-container">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 border border-[#C4B5B5] rounded-lg hover:bg-[#7E6565] hover:text-white text-sm text-[#5A4A4A] transition-colors"
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
            >
              <FontAwesomeIcon icon={faList} className="text-xs" />
              <span>{SORT_LABELS[selectedSort]}</span>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white border border-[#C4B5B5] rounded-lg shadow-lg z-10">
                <div className="py-1">
                  {(Object.keys(SORT_LABELS) as SortType[]).map((sort) => (
                    <button
                      key={sort}
                      onClick={() => {
                        setSelectedSort(sort);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                        selectedSort === sort
                          ? "text-[#7E6565] font-semibold"
                          : "text-gray-700"
                      }`}
                      style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                    >
                      {SORT_LABELS[sort]}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 投稿一覧 */}
      <div className="mx-4 space-y-4">
        {displayPosts.length === 0 ? (
          <p className="text-center mt-10 text-[#7E6565]">
            {isRecommended && diagnosisAnswers
              ? "おすすめの投稿が見つかりませんでした"
              : searchQuery
                ? "検索結果が見つかりませんでした"
                : "投稿がありません"}
          </p>
        ) : (
          displayPosts.map((post) => (
            <Link key={post.id} href={`/post/${post.id}`} className="block">
              <SimpleBox
                className="flex flex-col md:flex-row items-start p-4 !rounded-2xl !shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="md:w-1/3 w-full">
                  {post.images?.[0] ? (
                    <div className="w-full h-[140px] overflow-hidden relative rounded-2xl">
                      <Image
                        src={post.images[0]}
                        alt={post.title}
                        fill
                        className="object-cover rounded-2xl"
                        unoptimized={true}
                      />
                      {post.user_id !== userId && post.id && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (post.id) {
                              toggleFavorite(post.id);
                            }
                          }}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/70 backdrop-blur-sm transition-all duration-200 hover:bg-white hover:scale-110 cursor-pointer"
                          title="お気に入りに追加"
                        >
                          <FontAwesomeIcon
                            icon={faHeart}
                            className={`text-sm ${
                              post.id && isFavorite(post.id)
                                ? "text-red-500"
                                : "text-gray-400 hover:text-red-300"
                            }`}
                          />
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="h-[140px] bg-gray-200 flex items-center justify-center rounded-2xl text-sm text-gray-400 relative">
                      No Image
                      {post.user_id !== userId && post.id && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (post.id) {
                              toggleFavorite(post.id);
                            }
                          }}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/70 backdrop-blur-sm transition-all duration-200 hover:bg-white hover:scale-110 cursor-pointer"
                          title="お気に入りに追加"
                        >
                          <FontAwesomeIcon
                            icon={faHeart}
                            className={`text-sm ${
                              post.id && isFavorite(post.id)
                                ? "text-red-500"
                                : "text-gray-400 hover:text-red-300"
                            }`}
                          />
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <div className="md:w-2/3 w-full md:ml-4 mt-2 md:mt-0">
                  <p className="text-lg font-semibold text-[#5A4A4A]">
                    {post.title}
                  </p>
                  {post.price != null && (
                    <p className="text-sm font-bold text-red-600 mt-1">
                      ¥{post.price.toLocaleString()}
                    </p>
                  )}
                  <p className="text-sm text-black line-clamp-3 mt-1 whitespace-pre-wrap">
                    {post.description}
                  </p>
                  <p className="text-xs text-[#5A4A4A] mt-2">
                    {post.created_at &&
                      new Date(post.created_at).toLocaleString("ja-JP", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    {post.user_name && ` ・ ${post.user_name}`}
                  </p>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {post.tags.slice(0, 5).map((tag, index) => (
                        <span
                          key={index}
                          className="bg-[#F5F0F0] text-[#7E6565] px-2 py-1 rounded-full text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </SimpleBox>
            </Link>
          ))
        )}
      </div>

      {/* ページネーション */}
      {paginationInfo && paginationInfo.totalPages >= 1 && (
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
              style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
            >
              {paginationInfo.currentPage} / {paginationInfo.totalPages}
            </span>
          </div>

          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === paginationInfo.totalPages}
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
