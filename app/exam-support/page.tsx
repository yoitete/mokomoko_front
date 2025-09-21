"use client";

import { BoxImage } from "@/components/BoxImage/BoxImage";
import { useGet } from "@/hooks/useSWRAPI";
import { Post } from "@/hooks/usePosts";
import Link from "next/link";
import Button from "@/components/Button/Button";

export default function ExamSupportPage() {
  // SWRを使用してデータを取得（デフォルト設定を使用）
  const { data: posts, error, isLoading } = useGet<Post[]>("/posts");

  // 画像がある投稿のみをフィルタリング
  const postsWithImages = (posts || []).filter(
    (post) => post.images && post.images.length > 0
  );

  // 受験応援特集の投稿をフィルタリング
  const examSupportPosts = postsWithImages.filter(
    (post) =>
      post.season === "Exam Support" ||
      post.season === "exam-support" ||
      (post.tags &&
        post.tags.some(
          (tag) =>
            tag.toLowerCase().includes("受験") ||
            tag.toLowerCase().includes("exam") ||
            tag.toLowerCase().includes("応援")
        )) ||
      post.title?.toLowerCase().includes("受験") ||
      post.title?.toLowerCase().includes("exam")
  );

  // デバッグ用ログ
  console.log("All posts:", posts);
  console.log("Posts with images:", postsWithImages);
  console.log("Exam support posts:", examSupportPosts);

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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="mt-10 mx-4">
      {/* ヘッダー */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-800 mb-4">
          受験応援！あったか毛布特集
        </h1>
      </div>

      {/* 商品一覧 */}
      {examSupportPosts.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-xl font-bold text-indigo-600 mb-4">
            投稿を準備中です...
          </h3>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {examSupportPosts.map((post, index) => {
            const imageUrl = post.images?.[0];

            // 画像が存在する場合のみ表示
            if (!imageUrl) {
              return null;
            }

            return (
              <div
                key={post.id}
                className="group bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300 transform hover:-translate-y-1"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* 投稿画像 - ホームページと同じ構造 */}
                <div className="relative">
                  <BoxImage src={imageUrl} alt={post.title} />
                </div>

                {/* 投稿情報 - コンパクト表示 */}
                <div className="p-4 space-y-3">
                  {/* タイトル */}
                  <h3 className="text-base font-semibold text-gray-800 line-clamp-2 group-hover:text-gray-900 transition-colors duration-200">
                    {post.title}
                  </h3>

                  {/* 価格 */}
                  {post.price && (
                    <div className="flex items-baseline space-x-1">
                      <span className="text-lg font-bold text-indigo-600">
                        ¥{post.price.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-400">税込</span>
                    </div>
                  )}

                  {/* タグ - コンパクト */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full text-xs font-medium hover:bg-indigo-200 transition-colors duration-200"
                        >
                          #{tag}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="text-xs text-gray-400 px-2 py-1">
                          +{post.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* 詳細ページへのリンク - カード全体をクリック可能に */}
                <Link
                  href={`/post/${post.id}`}
                  className="absolute inset-0 z-10"
                />
              </div>
            );
          })}
        </div>
      )}

      {/* 戻るボタン */}
      <div className="mt-8 mb-3 text-center relative z-20">
        <Link href="/home">
          <Button variant="primary" size="md" className="cursor-pointer">
            ホームに戻る
          </Button>
        </Link>
      </div>
    </div>
  );
}
