"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { SlideBox } from "@/components/SlideBox/SlideBox";
import { SimpleBox } from "@/components/SimpleBox/SimpleBox";
import { BoxImage } from "@/components/BoxImage/BoxImage";
import { Post } from "@/hooks/usePosts";
import { useGet } from "@/hooks/useSWRAPI";
import { useFavorites } from "@/hooks/useFavorites";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Button from "@/components/Button/Button";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { user } = useAuth();

  // SWRを使用してデータを取得（デフォルト設定を使用）
  const { data: posts, error, isLoading } = useGet<Post[]>("/posts");

  // お気に入り機能
  const { toggleFavorite, isFavorite } = useFavorites(1);

  // 一時的にログを出す（ログインしているかどうかを確認）
  useEffect(() => {
    console.log("user:", user);
  }, [user]);

  // デバッグ用のログ
  useEffect(() => {
    console.log("SWR posts data:", posts);
    console.log("SWR loading:", isLoading);
    console.log("SWR error:", error);
  }, [posts, isLoading, error]);

  // 新着投稿を取得（作成日時でソート）
  const newPosts = (posts || [])
    .sort(
      (a, b) =>
        new Date(b.created_at || 0).getTime() -
        new Date(a.created_at || 0).getTime()
    )
    .slice(0, 6);

  // 春・夏の投稿を取得
  const springSummerPosts = (posts || [])
    .filter((post) => post.season === "spring" || post.season === "summer")
    .slice(0, 4);

  // 秋・冬の投稿を取得
  const autumnWinterPosts = (posts || [])
    .filter((post) => post.season === "autumn" || post.season === "winter")
    .slice(0, 4);

  // 画像がある投稿のみをフィルタリング
  const postsWithImages = (posts || []).filter(
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
      <div className="text-center mt-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2">読み込み中...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mt-10">
        <div className="mt-5 text-center text-3xl font-medium font-sans tracking-wide bg-gradient-to-r from-red-700 to-red-900 bg-clip-text text-transparent">
          投稿新着一覧
        </div>
        <p className="text-lg font-semibold ml-4 text-orange-600">New</p>
        <div className="flex justify-end">
          <SlideBox>
            <div className="gap-4">
              {newPosts.map((post, index) => {
                const imageUrl = post.images?.[0];

                // 画像が存在する場合のみ表示
                if (!imageUrl) {
                  return null;
                }

                return (
                  <div
                    key={post.id || index}
                    className="relative inline-block mr-4 w-40 h-[118px] overflow-hidden rounded-lg"
                  >
                    <Link href={`/post/${post.id}`}>
                      <Image
                        src={imageUrl}
                        alt={post.title}
                        fill
                        unoptimized={true}
                        className="cursor-pointer"
                      />
                    </Link>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(post.id!);
                      }}
                      className="absolute bottom-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white transition-colors"
                    >
                      <FontAwesomeIcon
                        icon={faHeart}
                        className={`text-lg ${
                          isFavorite(post.id!)
                            ? "text-red-500"
                            : "text-gray-400 hover:text-red-500"
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </SlideBox>
        </div>
      </div>

      <div className="mt-8 text-center text-3xl font-medium font-sans tracking-wide bg-gradient-to-r from-blue-900 to-slate-800 bg-clip-text text-transparent">
        投稿人気ランキング
      </div>
      <div className="mt-5 ml-4 text-left font-semibold text-gray-700 border-l-4 border-green-500 pl-3">
        春・夏
      </div>
      <div className="flex justify-end">
        <SlideBox>
          <div className="gap-4">
            {springSummerPosts.map((post, index) => {
              const imageUrl = post.images?.[0];

              // 画像が存在する場合のみ表示
              if (!imageUrl) {
                return null;
              }

              return (
                <div
                  key={post.id || index}
                  className="relative inline-block mr-4 w-40 h-[118px] overflow-hidden rounded-lg"
                >
                  <Link href={`/post/${post.id}`}>
                    <Image
                      src={imageUrl}
                      alt={post.title}
                      fill
                      unoptimized={true}
                      className="cursor-pointer"
                    />
                  </Link>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite(post.id!);
                    }}
                    className="absolute bottom-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white transition-colors"
                  >
                    <FontAwesomeIcon
                      icon={faHeart}
                      className={`text-lg ${
                        isFavorite(post.id!)
                          ? "text-red-500"
                          : "text-gray-400 hover:text-red-500"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </SlideBox>
      </div>

      <div className="mt-5 ml-4 text-left font-semibold text-gray-700 border-l-4 border-orange-500 pl-3">
        秋・冬
      </div>
      <div className="flex justify-end">
        <SlideBox>
          <div className="gap-4">
            {autumnWinterPosts.map((post, index) => {
              const imageUrl = post.images?.[0];

              // 画像が存在する場合のみ表示
              if (!imageUrl) {
                return null;
              }

              return (
                <div
                  key={post.id || index}
                  className="relative inline-block mr-4 w-40 h-[118px] overflow-hidden rounded-lg"
                >
                  <Link href={`/post/${post.id}`}>
                    <Image
                      src={imageUrl}
                      alt={post.title}
                      fill
                      unoptimized={true}
                      className="cursor-pointer"
                    />
                  </Link>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite(post.id!);
                    }}
                    className="absolute bottom-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white transition-colors"
                  >
                    <FontAwesomeIcon
                      icon={faHeart}
                      className={`text-lg ${
                        isFavorite(post.id!)
                          ? "text-red-500"
                          : "text-gray-400 hover:text-red-500"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </SlideBox>
      </div>
      {/* https://tailwindcss.com/docs/font-size */}
      <div className="mt-10"></div>
      <div className="mt-5 mb-10 text-center text-3xl font-medium font-sans tracking-wide bg-gradient-to-r from-amber-700 to-orange-800 bg-clip-text text-transparent">
        特集
      </div>
      <div className="mx-4 mb-5">
        <SimpleBox className="h-137 flex flex-col justify-start items-center p-4">
          <p className="text-center text-xl font-semibold text-red-600 mb-4">
            クリスマス特集
          </p>

          <div className="grid grid-cols-2 gap-2 w-full">
            {postsWithImages.slice(0, 4).map((post, index) => {
              const imageUrl = post.images?.[0];

              // 画像が存在する場合のみ表示
              if (!imageUrl) {
                return null;
              }

              return (
                <div key={post.id || index}>
                  <BoxImage src={imageUrl} alt={post.title} />
                </div>
              );
            })}
          </div>
          <div className="mt-6 px-4">
            <p className="text-center text-gray-600 text-base leading-relaxed font-medium">
              <span className="text-red-500 font-semibold">心まで温まる</span>
              、クリスマス限定のふわもこ毛布
            </p>
            <p className="text-center text-gray-600 text-sm leading-relaxed mt-2">
              冬の夜をやさしく包み込む、
              <br />
              とっておきのブランケットをご用意しました
            </p>
            <p className="text-center text-gray-500 text-sm mt-3">
              <span className="bg-red-50 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
                大切な人へのギフトにも、自分へのご褒美にもぴったり！
              </span>
            </p>
            <div className="mt-4 text-right">
              <Link href="/christmas">
                <Button
                  variant="primary"
                  size="sm"
                  className="min-w-[150px] cursor-pointer"
                >
                  詳しくはこちら →
                </Button>
              </Link>
            </div>
          </div>
        </SimpleBox>
      </div>

      <div className="mx-4 mb-4">
        <SimpleBox className="h-150 flex flex-col justify-start items-center p-4">
          <div className="text-center text-xl font-semibold text-indigo-800 mb-4">
            <p>受験応援！</p>
            <p>あったか毛布特集</p>
          </div>
          <div className="grid grid-cols-2 gap-2 w-full">
            {postsWithImages.slice(0, 4).map((post, index) => {
              const imageUrl = post.images?.[0];

              // 画像が存在する場合のみ表示
              if (!imageUrl) {
                return null;
              }

              return (
                <div key={post.id || index}>
                  <BoxImage src={imageUrl} alt={post.title} />
                </div>
              );
            })}
          </div>
          <div className="mt-6 px-4">
            <p className="text-center text-gray-600 text-base leading-relaxed font-medium">
              <span className="text-indigo-600 font-semibold">
                合格への道を
              </span>
              、あたたかさで支える
            </p>
            <p className="text-center text-gray-600 text-sm leading-relaxed mt-2">
              冬の受験勉強は、寒さとの戦いでもあります。
              <br />
              深夜まで机に向かうあなたの背中をやさしく包み込み、
              <br />
              心までほっと落ち着ける&ldquo;あったか毛布&rdquo;をご用意しました
            </p>
            <p className="text-center text-gray-500 text-sm mt-3">
              <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full text-xs font-medium">
                集中力を高める、あなただけの学習パートナー
              </span>
            </p>
            <div className="mt-4 text-right">
              <Link href="/exam-support">
                <Button
                  variant="primary"
                  size="sm"
                  className="min-w-[150px] cursor-pointer"
                >
                  詳しくはこちら →
                </Button>
              </Link>
            </div>
          </div>
        </SimpleBox>
      </div>
    </div>
  );
}
