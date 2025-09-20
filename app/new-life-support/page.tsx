"use client";

import { BoxImage } from "@/components/BoxImage/BoxImage";
import { useGet } from "@/hooks/useSWRAPI";
import { Post } from "@/hooks/usePosts";
import Link from "next/link";
import Button from "@/components/Button/Button";

export default function NewLifeSupportPage() {
  // SWRを使用してデータを取得（デフォルト設定を使用）
  const { data: posts, error, isLoading } = useGet<Post[]>("/posts");

  // 画像がある投稿のみをフィルタリング
  const postsWithImages = (posts || []).filter(
    (post) => post.images && post.images.length > 0
  );

  // 新生活関連の投稿をフィルタリング
  const newLifePostsWithImages = postsWithImages.filter(
    (post) =>
      (post.tags &&
        post.tags.some(
          (tag) =>
            tag.toLowerCase().includes("新生活") ||
            tag.toLowerCase().includes("新学期") ||
            tag.toLowerCase().includes("引越し") ||
            tag.toLowerCase().includes("一人暮らし") ||
            tag.toLowerCase().includes("spring") ||
            tag.toLowerCase().includes("new")
        )) ||
      post.season === "spring" ||
      post.season === "new-life" ||
      post.title?.toLowerCase().includes("新生活") ||
      post.title?.toLowerCase().includes("新学期") ||
      post.title?.toLowerCase().includes("一人暮らし")
  );

  // デバッグ用ログ
  console.log("All posts:", posts);
  console.log("Posts with images:", postsWithImages);
  console.log("New life posts with images:", newLifePostsWithImages);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            #新生活応援特集
          </h1>
          <p className="text-gray-600">
            新生活の始まりに、心地よい毛布で快適な環境を
          </p>
        </div>

        {newLifePostsWithImages.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-bold text-green-600 mb-4">
              新生活応援特集の投稿を準備中です...
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {newLifePostsWithImages.map((post, index) => {
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
                        <span className="text-lg font-bold text-green-600">
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
                            className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors duration-200"
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
        <div className="text-center mt-8 relative z-20">
          <Link href="/home">
            <Button variant="primary" size="md" className="cursor-pointer">
              ホームに戻る
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
