"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { SlideBox } from "@/components/SlideBox/SlideBox";
import { SimpleBox } from "@/components/SimpleBox/SimpleBox";
import { BoxImage } from "@/components/BoxImage/BoxImage";
import { Post } from "@/hooks/usePosts";
import { useAPI } from "@/hooks/useAPI";

export default function Home() {
  console.log("Home component rendered");
  const { get } = useAPI();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("useEffect triggered - fetching posts");
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log("API call started");
        const data = await get<Post[]>("/posts");
        console.log("API call completed, data:", data);
        setPosts(data);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        setError(
          err instanceof Error ? err.message : "投稿の取得に失敗しました"
        );
      } finally {
        setIsLoading(false);
        console.log("fetchPosts completed");
      }
    };

    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 空の依存配列でマウント時にのみ実行

  // 新着投稿を取得（作成日時でソート）
  const newPosts = posts
    .sort(
      (a, b) =>
        new Date(b.created_at || 0).getTime() -
        new Date(a.created_at || 0).getTime()
    )
    .slice(0, 6);

  // 春・夏の投稿を取得
  const springSummerPosts = posts
    .filter((post) => post.season === "spring" || post.season === "summer")
    .slice(0, 4);

  // 秋・冬の投稿を取得
  const autumnWinterPosts = posts
    .filter((post) => post.season === "autumn" || post.season === "winter")
    .slice(0, 4);

  // 画像がある投稿のみをフィルタリング
  const postsWithImages = posts.filter(
    (post) => post.images && post.images.length > 0
  );

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
      <div className="text-center mt-10 text-red-500">
        <p>エラーが発生しました: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          再読み込み
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mt-10">
        <div className="mt-5 text-center text-2xl font-semibold">新着情報</div>
        <div className="flex justify-end mt-5">
          <SlideBox>
            <div className="flex flex-col gap-2">
              <p className="text-left text-lg font-semibold text-orange-600">
                New
              </p>

              <div className="flex gap-4">
                {newPosts.map((post, index) => {
                  const imageUrl = post.images?.[0];

                  console.log(
                    `Post ${post.id} (${post.title}): 
                    - Image URL: ${imageUrl}
                    - Has image: ${Boolean(imageUrl)}`
                  );

                  // 画像が存在する場合のみ表示
                  if (!imageUrl) {
                    return null;
                  }

                  return (
                    <Image
                      key={post.id || index}
                      src={imageUrl}
                      alt={post.title}
                      height={118}
                      width={160}
                      unoptimized={true}
                    />
                  );
                })}
              </div>
            </div>
          </SlideBox>
        </div>
      </div>

      <div className="mt-8 text-center text-2xl font-semibold">
        人気ランキング
      </div>
      <div className="mt-5 ml-4 text-left font-semibold">春・夏☘️</div>
      <div className="flex justify-end">
        <SlideBox>
          <div className="flex gap-4">
            {springSummerPosts.map((post, index) => {
              const imageUrl = post.images?.[0];

              console.log(
                `Spring/Summer Post ${post.id} (${post.title}): 
                - Image URL: ${imageUrl}
                - Has image: ${Boolean(imageUrl)}`
              );

              // 画像が存在する場合のみ表示
              if (!imageUrl) {
                return null;
              }

              return (
                <Image
                  key={post.id || index}
                  src={imageUrl}
                  alt={post.title}
                  height={118}
                  width={160}
                  unoptimized={true}
                />
              );
            })}
          </div>
        </SlideBox>
      </div>

      <div className="mt-5 ml-4 text-left font-semibold">秋・冬🍁</div>
      <div className="flex justify-end">
        <SlideBox>
          <div className="flex gap-4">
            {autumnWinterPosts.map((post, index) => {
              const imageUrl = post.images?.[0];

              console.log(
                `Autumn/Winter Post ${post.id} (${post.title}): 
                - Image URL: ${imageUrl}
                - Has image: ${Boolean(imageUrl)}`
              );

              // 画像が存在する場合のみ表示
              if (!imageUrl) {
                return null;
              }

              return (
                <Image
                  key={post.id || index}
                  src={imageUrl}
                  alt={post.title}
                  height={118}
                  width={160}
                  unoptimized={true}
                />
              );
            })}
          </div>
        </SlideBox>
      </div>
      {/* https://tailwindcss.com/docs/font-size */}
      <div className="mt-10"></div>
      <div className="mt-5 mb-10 text-center text-2xl font-semibold">特集</div>
      <div className="mx-4 mb-5">
        <SimpleBox className="h-110 flex flex-col justify-start items-center p-4">
          <p className="text-center text-lg font-semibold mb-4">
            クリスマス特集
          </p>

          <div className="grid grid-cols-2 gap-2 w-full">
            {postsWithImages.slice(0, 4).map((post, index) => {
              const imageUrl = post.images?.[0];

              console.log(
                `Christmas Post ${post.id} (${post.title}): 
                - Image URL: ${imageUrl}
                - Has image: ${Boolean(imageUrl)}`
              );

              // 画像が存在する場合のみ表示
              if (!imageUrl) {
                return null;
              }

              return (
                <BoxImage
                  key={post.id || index}
                  src={imageUrl}
                  alt={post.title}
                />
              );
            })}
          </div>
        </SimpleBox>
      </div>

      <div className="mx-4 mb-4">
        <SimpleBox className="h-110 flex flex-col justify-start items-center p-4">
          <div className="text-center font-semibold mb-4">
            <p>受験応援！</p>
            <p>あったか毛布特集</p>
          </div>
          <div className="grid grid-cols-2 gap-2 w-full">
            {postsWithImages.slice(0, 4).map((post, index) => {
              const imageUrl = post.images?.[0];

              console.log(
                `Exam Support Post ${post.id} (${post.title}): 
                - Image URL: ${imageUrl}
                - Has image: ${Boolean(imageUrl)}`
              );

              // 画像が存在する場合のみ表示
              if (!imageUrl) {
                return null;
              }

              return (
                <BoxImage
                  key={post.id || index}
                  src={imageUrl}
                  alt={post.title}
                />
              );
            })}
          </div>
        </SimpleBox>
      </div>
    </div>
  );
}
