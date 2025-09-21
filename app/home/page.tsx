"use client";

import React, { useEffect, useMemo } from "react";
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
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { SeasonalCampaign, getColorClasses } from "@/hooks/useSeasonalCampaign";

export default function Home() {
  const { userId, isAuthenticated } = useCurrentUser();

  // SWRを使用してデータを取得（デフォルト設定を使用）
  const { data: posts, error, isLoading } = useGet<Post[]>("/posts");

  // お気に入り機能（ログインユーザーのIDを使用）
  const { toggleFavorite, isFavorite } = useFavorites(userId || 0);

  // 有効な特集をすべて取得（API版）
  const {
    data: activeCampaigns,
    isLoading: campaignLoading,
    error: campaignError,
  } = useGet<SeasonalCampaign[]>("/seasonal_campaigns/active");

  // 第1特集と第2特集を分離
  const currentCampaign =
    activeCampaigns?.find((c) => c.campaign_type === "primary") || null;
  const secondCampaign =
    activeCampaigns?.find((c) => c.campaign_type === "secondary") || null;

  // カラークラスを生成
  const colorClasses = useMemo(
    () =>
      currentCampaign ? getColorClasses(currentCampaign.color_theme) : null,
    [currentCampaign]
  );

  const secondColorClasses = useMemo(
    () => (secondCampaign ? getColorClasses(secondCampaign.color_theme) : null),
    [secondCampaign]
  );

  // 一時的にログを出す（ユーザーIDを確認）
  useEffect(() => {
    console.log("userId:", userId);
  }, [userId]);

  // 季節特集のデバッグログ
  useEffect(() => {
    console.log("Seasonal Campaign API Response:", {
      data: currentCampaign,
      loading: campaignLoading,
      error: campaignError,
    });
  }, [currentCampaign, campaignLoading, campaignError]);

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

  // 春・夏の人気投稿を取得（API版）
  const { data: springSummerPosts, isLoading: springSummerLoading } = useGet<
    Post[]
  >("/posts/popular?season=spring-summer&with_images=true&limit=4");

  // 秋・冬の人気投稿を取得（API版）
  const { data: autumnWinterPosts, isLoading: autumnWinterLoading } = useGet<
    Post[]
  >("/posts/popular?season=autumn-winter&with_images=true&limit=4");

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
                    className="inline-block mr-4 w-40 rounded-lg overflow-hidden bg-white shadow-sm"
                  >
                    <Link href={`/post/${post.id}`} className="block">
                      {/* タイトルボックス（上部） */}
                      <div className="p-2 bg-white">
                        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-tight">
                          {post.title}
                        </h3>
                      </div>
                      <div className="relative w-full h-[118px] overflow-hidden">
                        <Image
                          src={imageUrl}
                          alt={post.title}
                          fill
                          unoptimized={true}
                          className="cursor-pointer object-cover"
                        />
                        {/* お気に入りボタン */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (!isAuthenticated) {
                              // 未認証の場合は何もしない
                              return;
                            }
                            toggleFavorite(post.id!);
                          }}
                          className={`absolute bottom-2 right-2 p-1 rounded-full bg-white/80 transition-colors ${
                            isAuthenticated
                              ? "hover:bg-white cursor-pointer"
                              : "cursor-not-allowed opacity-60"
                          }`}
                          title={
                            !isAuthenticated
                              ? "ログインが必要です"
                              : "お気に入りに追加"
                          }
                        >
                          <FontAwesomeIcon
                            icon={faHeart}
                            className={`text-lg ${
                              !isAuthenticated
                                ? "text-gray-300 hover:text-gray-400"
                                : isFavorite(post.id!)
                                ? "text-red-500"
                                : "text-gray-400 hover:text-red-500"
                            }`}
                          />
                        </button>
                      </div>
                    </Link>
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
            {springSummerLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500 mx-auto"></div>
                <p className="mt-2 text-gray-600">読み込み中...</p>
              </div>
            ) : (springSummerPosts || []).length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                人気の投稿がありません
              </div>
            ) : (
              (springSummerPosts || []).map((post, index) => {
                const imageUrl = post.images?.[0];

                // 画像が存在する場合のみ表示
                if (!imageUrl) {
                  return null;
                }

                return (
                  <div
                    key={post.id || index}
                    className="inline-block mr-4 w-40 rounded-lg overflow-hidden bg-white shadow-sm"
                  >
                    <Link href={`/post/${post.id}`} className="block">
                      {/* タイトルボックス（上部） */}
                      <div className="p-2 bg-white">
                        <div className="flex items-start gap-2">
                          {/* 順位表示 */}
                          <div className="flex-shrink-0 mt-0.5">
                            {index === 0 && (
                              <span className="text-yellow-500 text-lg">
                                👑
                              </span>
                            )}
                            {index === 1 && (
                              <span className="text-gray-400 text-lg">👑</span>
                            )}
                            {index === 2 && (
                              <span className="text-amber-600 text-lg">👑</span>
                            )}
                            {index >= 3 && index < 5 && (
                              <span className="text-xs font-bold text-gray-600 bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center">
                                {index + 1}
                              </span>
                            )}
                          </div>
                          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-tight flex-1">
                            {post.title}
                          </h3>
                        </div>
                      </div>
                      <div className="relative w-full h-[118px] overflow-hidden">
                        <Image
                          src={imageUrl}
                          alt={post.title}
                          fill
                          unoptimized={true}
                          className="cursor-pointer object-cover"
                        />
                        {/* お気に入りボタン */}
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
                    </Link>
                  </div>
                );
              })
            )}
          </div>
        </SlideBox>
      </div>

      <div className="mt-5 ml-4 text-left font-semibold text-gray-700 border-l-4 border-orange-500 pl-3">
        秋・冬
      </div>
      <div className="flex justify-end">
        <SlideBox>
          <div className="gap-4">
            {autumnWinterLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500 mx-auto"></div>
                <p className="mt-2 text-gray-600">読み込み中...</p>
              </div>
            ) : (autumnWinterPosts || []).length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                人気の投稿がありません
              </div>
            ) : (
              (autumnWinterPosts || []).map((post, index) => {
                const imageUrl = post.images?.[0];

                // 画像が存在する場合のみ表示
                if (!imageUrl) {
                  return null;
                }

                return (
                  <div
                    key={post.id || index}
                    className="inline-block mr-4 w-40 rounded-lg overflow-hidden bg-white shadow-sm"
                  >
                    <Link href={`/post/${post.id}`} className="block">
                      {/* タイトルボックス（上部） */}
                      <div className="p-2 bg-white">
                        <div className="flex items-start gap-2">
                          {/* 順位表示 */}
                          <div className="flex-shrink-0 mt-0.5">
                            {index === 0 && (
                              <span className="text-yellow-500 text-lg">
                                👑
                              </span>
                            )}
                            {index === 1 && (
                              <span className="text-gray-400 text-lg">👑</span>
                            )}
                            {index === 2 && (
                              <span className="text-amber-600 text-lg">👑</span>
                            )}
                            {index >= 3 && index < 5 && (
                              <span className="text-xs font-bold text-gray-600 bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center">
                                {index + 1}
                              </span>
                            )}
                          </div>
                          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-tight flex-1">
                            {post.title}
                          </h3>
                        </div>
                      </div>
                      <div className="relative w-full h-[118px] overflow-hidden">
                        <Image
                          src={imageUrl}
                          alt={post.title}
                          fill
                          unoptimized={true}
                          className="cursor-pointer object-cover"
                        />
                        {/* お気に入りボタン */}
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
                    </Link>
                  </div>
                );
              })
            )}
          </div>
        </SlideBox>
      </div>
      {/* 特集セクション：特集が存在する場合のみ表示 */}
      {(currentCampaign || secondCampaign) && (
        <>
          <div className="mt-10"></div>
          <div className="mt-5 mb-10 text-center text-3xl font-medium font-sans tracking-wide bg-gradient-to-r from-amber-700 to-orange-800 bg-clip-text text-transparent">
            イベント投稿
          </div>
        </>
      )}
      {/* 第1特集は存在する場合のみ表示 */}
      {currentCampaign && colorClasses && (
        <div className="mx-4 mb-5">
          <SimpleBox className="h-137 flex flex-col justify-start items-center p-4 relative">
            <p
              className={`text-center text-xl font-semibold ${colorClasses.title} mb-4`}
            >
              {currentCampaign.name}
            </p>

            <div className="flex-grow">
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
                  <span className={`${colorClasses.highlight} font-semibold`}>
                    {currentCampaign.description.split("、")[0]}
                  </span>
                  、{currentCampaign.description.split("、")[1]}
                </p>
                <p className="text-center text-gray-600 text-sm leading-relaxed mt-2">
                  {currentCampaign.subtitle
                    .split("、")
                    .map((text, i, array) => (
                      <React.Fragment key={i}>
                        {text}
                        {i < array.length - 1 && (
                          <>
                            、
                            <br />
                          </>
                        )}
                      </React.Fragment>
                    ))}
                </p>
                <p className="text-center text-gray-500 text-sm mt-3">
                  <span
                    className={`${colorClasses.badge} px-2 py-1 rounded-full text-xs font-medium`}
                  >
                    {currentCampaign.highlight_text}
                  </span>
                </p>
              </div>
            </div>
            <div className="absolute bottom-4 right-4">
              <Link href={currentCampaign.link_path}>
                <Button
                  variant="primary"
                  size="sm"
                  className="min-w-[150px] cursor-pointer"
                >
                  {currentCampaign.button_text}
                </Button>
              </Link>
            </div>
          </SimpleBox>
        </div>
      )}

      {/* 第2特集は存在する場合のみ表示 */}
      {secondCampaign && secondColorClasses && (
        <div className="mx-4 mb-4">
          <SimpleBox className="h-137 flex flex-col justify-start items-center p-4 relative">
            <p
              className={`text-center text-xl font-semibold ${secondColorClasses.title} mb-4`}
            >
              {secondCampaign.name}
            </p>

            <div className="flex-grow">
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
                  <span
                    className={`${secondColorClasses.highlight} font-semibold`}
                  >
                    {secondCampaign.description.split("、")[0]}
                  </span>
                  、{secondCampaign.description.split("、")[1]}
                </p>
                <p className="text-center text-gray-600 text-sm leading-relaxed mt-2">
                  {secondCampaign.subtitle.split("、").map((text, i, array) => (
                    <React.Fragment key={i}>
                      {text}
                      {i < array.length - 1 && (
                        <>
                          、
                          <br />
                        </>
                      )}
                    </React.Fragment>
                  ))}
                </p>
                <p className="text-center text-gray-500 text-sm mt-3">
                  <span
                    className={`${secondColorClasses.badge} px-2 py-1 rounded-full text-xs font-medium`}
                  >
                    {secondCampaign.highlight_text}
                  </span>
                </p>
              </div>
            </div>
            <div className="absolute bottom-4 right-4">
              <Link href={secondCampaign.link_path}>
                <Button
                  variant="primary"
                  size="sm"
                  className="min-w-[150px] cursor-pointer"
                >
                  {secondCampaign.button_text}
                </Button>
              </Link>
            </div>
          </SimpleBox>
        </div>
      )}
    </div>
  );
}
