"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Post } from "@/hooks/usePosts";
import { useAPI } from "@/hooks/useAPI";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faHeart,
  faShare,
} from "@fortawesome/free-solid-svg-icons";

export default function PostDetail() {
  const params = useParams();
  const router = useRouter();
  const { get } = useAPI();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await get<Post>(`/posts/${params.id}`);
        setPost(data);
      } catch (err) {
        console.error("Failed to fetch post:", err);
        setError(
          err instanceof Error ? err.message : "投稿の取得に失敗しました"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchPost();
    }
  }, [params.id, get]);

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

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">
            エラー: {error || "投稿が見つかりません"}
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
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
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
              <p className="text-xl font-semibold text-blue-600 mb-4">
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
                {post.season === "spring-summer" && "春夏"}
                {post.season === "autumn-winter" && "秋冬"}
                {post.season === "christmas" && "クリスマス特集"}
                {post.season === "exam-support" && "受験応援"}
                {![
                  "new-arrivals",
                  "spring-summer",
                  "autumn-winter",
                  "christmas",
                  "exam-support",
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

            {/* アクションボタン */}
            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <button className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                <FontAwesomeIcon icon={faHeart} />
                いいね
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                <FontAwesomeIcon icon={faShare} />
                シェア
              </button>
            </div>

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
