"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { SimpleBox } from "@/components/SimpleBox/SimpleBox";
import { useAPI } from "@/hooks/useAPI";
import { useFavorites } from "@/hooks/useFavorites";
import { Post } from "@/hooks/usePosts";
import Link from "next/link";
import Button from "@/components/Button/Button";

export default function FavoritePage() {
  const { get } = useAPI();
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // お気に入り機能
  const { favorites, isLoading: favoritesLoading } = useFavorites(1);

  // 投稿データ取得
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await get<Post[]>("/posts");
        setPosts(data);
      } catch (err) {
        console.error("投稿の取得に失敗しました", err);
      }
    };
    fetchPosts();
  }, [get]);

  // お気に入り投稿のみ抽出
  const favoritePosts = posts.filter((post) => favorites.includes(post.id!));

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

  // ローディング状態
  if (favoritesLoading) {
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
