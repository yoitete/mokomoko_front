"use client";

import { useState } from "react";
import Image from "next/image";
import { SimpleBox } from "@/components/SimpleBox/SimpleBox";
import { useGet } from "@/hooks/useSWRAPI";
import { useFavorites } from "@/hooks/useFavorites";
import { Post } from "@/hooks/usePosts";
import Link from "next/link";
import Button from "@/components/Button/Button";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function FavoritePage() {
  const { isUnauthenticated, loading, userId, firebaseUID, error } =
    useCurrentUser();

  // デバッグログ（必要に応じてコメントアウト）
  // console.log("FavoritePage - User ID:", userId);
  // console.log("FavoritePage - Firebase UID:", firebaseUID);
  // console.log("FavoritePage - Error:", error);

  // SWRを使用してデータを取得（デフォルト設定を使用）
  const {
    data: postsResponse,
    error: postsError,
    isLoading: postsLoading,
  } = useGet<{ posts: Post[] }>("/posts");

  // APIレスポンスからposts配列を抽出
  const posts = postsResponse?.posts || [];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // お気に入り機能（ログインユーザーのIDを使用）
  const { favorites, isLoading: favoritesLoading } = useFavorites(userId || 0);

  // お気に入り投稿のみ抽出
  const favoritePosts = (posts || []).filter((post) =>
    favorites.includes(post.id!)
  );

  // ページネーション計算
  const totalPages = Math.ceil(favoritePosts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPosts = favoritePosts.slice(startIndex, endIndex);

  // ページ変更時の処理
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
          {firebaseUID && (
            <p className="mt-1 text-sm text-gray-600">
              Firebase UID: {firebaseUID}
            </p>
          )}
        </div>
      </div>
    );
  }

  // ユーザーデータ取得エラーの表示
  if (error && firebaseUID) {
    return (
      <div className="min-h-screen bg-[#E2D8D8] flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
            ユーザーデータの取得に失敗しました
          </h2>
          <p className="text-gray-600 mb-4 text-center">
            Firebase UID: {firebaseUID}
          </p>
          <p className="text-red-600 mb-6 text-center text-sm">
            エラー: {error?.message || "不明なエラー"}
          </p>
          <div className="space-y-3">
            <Button onClick={() => window.location.reload()} className="w-full">
              ページを再読み込み
            </Button>
          </div>
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

  // ローディング状態
  if (postsLoading || favoritesLoading) {
    return (
      <div className="text-center mt-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2">お気に入りを読み込み中...</p>
      </div>
    );
  }

  // エラー状態
  if (postsError) {
    return (
      <div className="text-center mt-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2">お気に入りを読み込み中...</p>
      </div>
    );
  }

  if (favoritePosts.length === 0) {
    return (
      <p className="text-center mt-10 text-gray-600">
        お気に入りはまだありません
      </p>
    );
  }

  return (
    <div className="mt-10 mx-4 space-y-4">
      <h1 className="text-2xl font-light text-center mb-6 text-gray-600">
        お気に入り一覧
      </h1>

      {/* ページ情報表示 */}
      <div className="text-center text-sm text-gray-500 mb-4">
        {favoritePosts.length}件中 {startIndex + 1}-
        {Math.min(endIndex, favoritePosts.length)}件を表示
      </div>

      {currentPosts.map((post) => (
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
