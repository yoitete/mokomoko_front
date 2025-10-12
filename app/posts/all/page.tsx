"use client";

import React, { useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGet } from "@/hooks/useSWRAPI";
import { Post } from "@/hooks/usePosts";
import { SimpleBox } from "@/components/SimpleBox/SimpleBox";
import Button from "@/components/Button/Button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useFavorites } from "@/hooks/useFavorites";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { PageHeader } from "@/components/PageHeader/PageHeader";
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

function AllPostsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isUnauthenticated, loading: authLoading, userId } = useCurrentUser();

  // お気に入り機能
  const { toggleFavorite, isFavorite } = useFavorites(userId);

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  // 検索パラメータを構築
  const buildSearchParams = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.set("page", currentPage.toString());
    params.set("per_page", postsPerPage.toString());
    return params.toString();
  }, [searchParams, currentPage, postsPerPage]);

  // APIから投稿データを取得
  const {
    data: searchData,
    error,
    isLoading,
  } = useGet<SearchResponse>(`/posts?${buildSearchParams()}`);

  const posts = searchData?.posts || [];
  const pagination = searchData?.pagination;

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
      <div className="min-h-screen bg-[#E2D8D8] flex items-center justify-center">
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
    <div className="min-h-screen bg-[#E2D8D8]">
      <div className="mt-10 mx-4 space-y-4">
        {/* ヘッダー */}
        <div className="mb-6">
          <PageHeader title="投稿一覧" backHref="/home" centerTitle={true} />
        </div>
      </div>

      {/* ページ情報表示 */}
      <div
        className="text-center text-sm text-gray-500 mb-4"
        style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
      >
        {pagination
          ? `${pagination.total_count}件中 ${
              (currentPage - 1) * postsPerPage + 1
            }-${Math.min(
              currentPage * postsPerPage,
              pagination.total_count
            )}件を表示`
          : ""}
      </div>

      {/* 投稿一覧 */}
      <div className="mt-10 mx-4 space-y-4">
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
          posts.map((post, index) => (
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
                    {/* お気に入りボタン（自分の投稿以外） */}
                    {post.user_id !== userId && post.id && (
                      <button
                        onClick={() => {
                          console.log(
                            "お気に入りボタンクリック - post.id:",
                            post.id
                          );
                          console.log(
                            "お気に入りボタンクリック - userId:",
                            userId
                          );
                          console.log(
                            "お気に入りボタンクリック - isFavorite:",
                            post.id ? isFavorite(post.id) : false
                          );
                          if (post.id) {
                            toggleFavorite(post.id);
                          }
                        }}
                        className="absolute bottom-2 right-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all duration-200 shadow-md hover:shadow-lg"
                        style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
                      >
                        <FontAwesomeIcon
                          icon={faHeart}
                          className={`text-lg ${
                            post.id && isFavorite(post.id)
                              ? "text-red-500"
                              : "text-gray-400 hover:text-red-400"
                          } transition-colors duration-200`}
                        />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="h-[118px] bg-gray-200 flex items-center justify-center">
                    No Image
                  </div>
                )}
              </div>

              {/* 右：タイトル＋本文サマリー */}
              <div className="md:w-2/3 w-full md:ml-4 mt-2 md:mt-0">
                <p className="text-lg font-semibold text-black">{post.title}</p>
                <p className="text-sm text-black line-clamp-3 mt-1 whitespace-pre-wrap">
                  {post.description}
                </p>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {post.tags.slice(0, 5).map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-black px-2 py-1 rounded-full text-xs"
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
      {pagination && (
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
    </div>
  );
}

export default function AllPostsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2">読み込み中...</p>
          </div>
        </div>
      }
    >
      <AllPostsContent />
    </Suspense>
  );
}
