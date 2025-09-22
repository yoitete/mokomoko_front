"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Post } from "@/hooks/usePosts";
import { useGet } from "@/hooks/useSWRAPI";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import Button from "@/components/Button/Button";

export default function PostDetail() {
  const params = useParams();
  const router = useRouter();
  const { isUnauthenticated, loading } = useAuth();

  // SWRを使用してデータを取得
  const {
    data: post,
    error,
    isLoading,
  } = useGet<Post>(params.id ? `/posts/${params.id}` : null, {
    revalidateOnFocus: true, // 詳細ページでは頻繁な再検証は不要
    dedupingInterval: 0, // 詳細ページは長めのキャッシュ
  });

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error || (!isLoading && !post)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">
            {error?.message || "投稿が見つかりません"}
          </p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            戻る
          </button>
        </div>
      </div>
    );
  }

  // postが存在しない場合の早期リターンは上で処理済み
  // ここに到達した時点でpostは必ず存在する
  if (!post) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-200 py-4 px-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold">投稿詳細</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {/* 投稿内容 */}
        <div className="bg-white overflow-hidden">
          {/* 画像 */}
          {post.images && post.images.length > 0 && (
            <div className="relative">
              <Image
                src={post.images[0]}
                alt={post.title}
                width={800}
                height={400}
                className="w-full h-64 object-cover"
                unoptimized={true}
              />
            </div>
          )}

          {/* 投稿情報 */}
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {post.title}
            </h2>

            {post.price && (
              <p className="text-xl font-semibold text-red-600 mb-4">
                ¥{post.price.toLocaleString()}
              </p>
            )}

            {post.description && (
              <p className="text-gray-700 mb-4 leading-relaxed">
                {post.description}
              </p>
            )}

            {/* カテゴリー */}
            <div className="mb-4">
              <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                {post.season === "new-arrivals" && "新着情報"}
                {post.season === "spring-summer" && "春・夏"}
                {post.season === "autumn-winter" && "秋・冬"}
                {post.season === "christmas" && "クリスマス"}
                {post.season === "exam-support" && "受験応援"}
                {post.season === "mothers-day" && "母の日"}
                {post.season === "new-life-support" && "新生活応援"}
                {post.season === "fathers-day" && "父の日"}
                {post.season === "halloween" && "ハロウィン"}
                {![
                  "new-arrivals",
                  "spring-summer",
                  "autumn-winter",
                  "christmas",
                  "exam-support",
                  "mothers-day",
                  "new-life-support",
                  "fathers-day",
                  "halloween",
                ].includes(post.season) && post.season}
              </span>
            </div>

            {/* タグ */}
            {post.tags && post.tags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">タグ</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 投稿日時 */}
            <div className="mt-4 text-sm text-gray-500">
              投稿日:{" "}
              {new Date(post.created_at || "").toLocaleDateString("ja-JP")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
