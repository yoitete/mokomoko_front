"use client";

import { useEffect, useMemo } from "react";
import { Post } from "@/hooks/usePosts";
import { useGet } from "@/hooks/useSWRAPI";
import { useFavorites } from "@/hooks/useFavorites";
import { PostList } from "@/components/PostList/PostList";
import Link from "next/link";
import Button from "@/components/Button/Button";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function Home() {
  const { userId, isAuthenticated } = useCurrentUser();

  // SWRを使用してデータを取得（デフォルト設定を使用）
  const {
    data: postsResponse,
    error,
    isLoading,
  } = useGet<{ posts: Post[] }>("/posts");

  // APIレスポンスからposts配列を抽出
  const posts = useMemo(() => postsResponse?.posts || [], [postsResponse]);

  // お気に入り機能（ログインユーザーのIDを使用）
  const { toggleFavorite, isFavorite } = useFavorites(userId);

  // 一時的にログを出す（ユーザーIDを確認）
  useEffect(() => {
    console.log("userId:", userId);
  }, [userId]);

  // デバッグ用のログ
  useEffect(() => {
    console.log("SWR posts data:", posts);
    console.log("SWR loading:", isLoading);
    console.log("SWR error:", error);
    console.log("postsResponse:", postsResponse);
    console.log(
      "Posts with images:",
      posts.filter((post) => post.images && post.images.length > 0),
    );
    console.log(
      "Posts without images:",
      posts.filter((post) => !post.images || post.images.length === 0),
    );
  }, [posts, isLoading, error, postsResponse]);

  // 新着投稿を取得（API側で既にソート済み）
  const newPosts = (posts || []).slice(0, 6);

  // 人気投稿を取得（API版・季節区分なし）
  const { data: popularPosts, isLoading: popularLoading } = useGet<Post[]>(
    "/posts/popular?with_images=true&limit=8",
  );

  // 画像がある投稿のみをフィルタリング

  if (isLoading) {
    return (
      <div className="text-center mt-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2">読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10">
        <div className="text-red-500 text-lg font-semibold">
          エラーが発生しました
        </div>
        <p className="mt-2 text-gray-600">
          データの取得に失敗しました。しばらくしてから再度お試しください。
        </p>
        <p className="mt-2 text-sm text-gray-500">
          エラー詳細: {error.message || "不明なエラー"}
        </p>
      </div>
    );
  }

  return (
    <div>
      <section className="mt-8">
        <h2
          className="text-center text-3xl font-bold tracking-wide bg-gradient-to-r from-red-700 to-red-900 bg-clip-text text-transparent"
          style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
        >
          投稿新着一覧
        </h2>
        <div className="flex items-center justify-between px-4 mt-2 mb-3">
          <p
            className="text-sm font-semibold text-[#7E6565] tracking-widest"
            style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
          >
            NEW ARRIVALS
          </p>
          <Link href="/posts/all?sort=newest">
            <Button
              variant="outline"
              size="sm"
              className="text-[#5A4A4A] border-[#C4B5B5] hover:bg-[#7E6565] hover:text-white"
            >
              全て表示
            </Button>
          </Link>
        </div>
        <PostList
          posts={newPosts}
          showRanking={false}
          isAuthenticated={isAuthenticated}
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
          currentUserId={userId || undefined}
        />
      </section>

      <section className="mt-10">
        <h2
          className="text-center text-3xl font-bold tracking-wide bg-gradient-to-r from-red-700 to-red-900 bg-clip-text text-transparent"
          style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
        >
          投稿人気ランキング
        </h2>
        <div className="flex items-center justify-between px-4 mt-2 mb-3">
          <p
            className="text-sm font-semibold text-[#7E6565] tracking-widest"
            style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
          >
            POPULAR
          </p>
          <Link href="/posts/all?sort=popular">
            <Button
              variant="outline"
              size="sm"
              className="text-[#5A4A4A] border-[#C4B5B5] hover:bg-[#7E6565] hover:text-white"
            >
              全て表示
            </Button>
          </Link>
        </div>
        <PostList
          posts={popularPosts || []}
          showRanking={true}
          isAuthenticated={isAuthenticated}
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
          isLoading={popularLoading}
          emptyMessage="人気の投稿がありません"
          currentUserId={userId || undefined}
        />
      </section>
    </div>
  );
}
