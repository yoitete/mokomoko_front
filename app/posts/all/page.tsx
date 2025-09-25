"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGet } from "@/hooks/useSWRAPI";
import { Post } from "@/hooks/usePosts";
import { SimpleBox } from "@/components/SimpleBox/SimpleBox";
import Button from "@/components/Button/Button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
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
  const { isUnauthenticated, loading: authLoading } = useCurrentUser();

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  // APIから投稿データを取得（URLパラメータをそのまま使用）
  const {
    data: searchData,
    error,
    isLoading,
  } = useGet<SearchResponse>(`/posts?${searchParams.toString()}`);

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
            投稿一覧
          </h1>
          <button
            onClick={() => router.push("/home")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* ページ情報表示 */}
      <div className="text-center text-sm text-gray-500 mb-4">
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
          {/* 投稿一覧 */}
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
                <p className="text-lg font-semibold">{post.title}</p>
                <p className="text-sm text-gray-600 line-clamp-3 mt-1">
                  {post.description}
                </p>
                <Link
                  href={`/post/${post.id}`}
                  className="text-blue-500 text-sm mt-2 inline-block"
                >
                  続きを読む
                </Link>
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
