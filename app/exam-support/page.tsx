"use client";

import { useEffect, useState } from "react";
import { BoxImage } from "@/components/BoxImage/BoxImage";
import { SimpleBox } from "@/components/SimpleBox/SimpleBox";
import { useAPI } from "@/hooks/useAPI";
import { Post } from "@/hooks/usePosts";
import Link from "next/link";
import Button from "@/components/Button/Button";

export default function ExamSupportPage() {
  const { get } = useAPI();
  const [posts, setPosts] = useState<Post[]>([]);

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

  // 受験応援関連の投稿をフィルタリング（seasonが"Exam Support"の投稿）
  const examSupportPosts = posts.filter(
    (post) =>
      post.season === "Exam Support" && post.images && post.images.length > 0
  );

  return (
    <div className="mt-10 mx-4">
      {/* ヘッダー */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-800 mb-4">
          📚 受験応援！あったか毛布特集 📚
        </h1>
        <p className="text-gray-600 text-lg">
          合格への道を、あたたかさで支える
        </p>
        <p className="text-gray-500 text-sm mt-2">
          冬の受験勉強は、寒さとの戦いでもあります。
          <br />
          深夜まで机に向かうあなたの背中をやさしく包み込み、
          <br />
          心までほっと落ち着ける&ldquo;あったか毛布&rdquo;をご用意しました
        </p>
      </div>

      {/* 商品一覧 */}
      {examSupportPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            受験応援特集の商品を準備中です...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {examSupportPosts.map((post) => (
            <SimpleBox
              key={post.id}
              className="p-4 hover:shadow-lg transition-shadow"
            >
              {/* 商品画像 */}
              <div className="mb-4">
                {post.images?.[0] ? (
                  <BoxImage
                    src={post.images[0]}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-lg">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
              </div>

              {/* 商品情報 */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {post.title}
                </h3>

                {post.description && (
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {post.description}
                  </p>
                )}

                {post.price && (
                  <p className="text-indigo-600 font-bold text-lg">
                    ¥{post.price.toLocaleString()}
                  </p>
                )}

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* 詳細ページへのリンク */}
                <div className="mt-4">
                  <Link href={`/post/${post.id}`} className="block w-full">
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full cursor-pointer px-2 py-1 text-xs"
                    >
                      詳細を見る
                    </Button>
                  </Link>
                </div>
              </div>
            </SimpleBox>
          ))}
        </div>
      )}

      {/* 戻るボタン */}
      <div className="mt-8 mb-3 text-center">
        <Link href="/home">
          <Button variant="primary" size="md" className="cursor-pointer">
            ホームに戻る
          </Button>
        </Link>
      </div>
    </div>
  );
}
