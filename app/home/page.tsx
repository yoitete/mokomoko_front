"use client";

import React, { useEffect, useMemo } from "react";
import { SimpleBox } from "@/components/SimpleBox/SimpleBox";
import { BoxImage } from "@/components/BoxImage/BoxImage";
import { Post } from "@/hooks/usePosts";
import { useGet } from "@/hooks/useSWRAPI";
import { useFavorites } from "@/hooks/useFavorites";
import { PostList } from "@/components/PostList/PostList";
import { SectionHeader } from "@/components/SectionHeader/SectionHeader";
import Link from "next/link";
import Button from "@/components/Button/Button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { SeasonalCampaign, getColorClasses } from "@/hooks/useSeasonalCampaign";

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
    console.log("postsResponse:", postsResponse);
    console.log(
      "Posts with images:",
      posts.filter((post) => post.images && post.images.length > 0)
    );
    console.log(
      "Posts without images:",
      posts.filter((post) => !post.images || post.images.length === 0)
    );
  }, [posts, isLoading, error, postsResponse]);

  // 新着投稿を取得（API側で既にソート済み）
  const newPosts = (posts || []).slice(0, 6);

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
      <div className="mt-10">
        <div className="mb-4">
          <SectionHeader title="投稿新着一覧" />
        </div>
        <div className="relative">
          <SectionHeader subtitle="New" noBorder={true} />
          <div className="absolute top-2 right-0">
            <Link href="/posts/all?sort=newest">
              <Button
                variant="outline"
                size="sm"
                className="mr-4 text-blue-600 border-blue-300 hover:bg-blue-50 hover:text-blue-600"
              >
                全て表示
              </Button>
            </Link>
          </div>
        </div>
        <PostList
          posts={newPosts}
          showRanking={false}
          isAuthenticated={isAuthenticated}
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
          currentUserId={userId || undefined}
        />
      </div>

      <div className="mt-10"></div>
      <div className="mb-4">
        <SectionHeader
          title="投稿人気ランキング"
          gradientFrom="from-blue-900"
          gradientTo="to-slate-800"
        />
      </div>
      <div className="relative">
        <SectionHeader subtitle="春・夏" borderColor="border-orange-500" />
        <div className="absolute -top-1 right-0">
          <Link href="/posts/all?sort=popular&season=spring-summer">
            <Button
              variant="outline"
              size="sm"
              className="mr-4 text-blue-600 border-blue-300 hover:bg-blue-50 hover:text-blue-600"
            >
              全て表示
            </Button>
          </Link>
        </div>
      </div>
      <PostList
        posts={springSummerPosts || []}
        showRanking={true}
        isAuthenticated={isAuthenticated}
        isFavorite={isFavorite}
        toggleFavorite={toggleFavorite}
        isLoading={springSummerLoading}
        emptyMessage="人気の投稿がありません"
        currentUserId={userId || undefined}
      />

      <div className="relative">
        <SectionHeader subtitle="秋・冬" borderColor="border-orange-500" />
        <div className="absolute -top-1 right-0">
          <Link href="/posts/all?sort=popular&season=autumn-winter">
            <Button
              variant="outline"
              size="sm"
              className="mr-4 text-blue-600 border-blue-300 hover:bg-blue-50 hover:text-blue-600"
            >
              全て表示
            </Button>
          </Link>
        </div>
      </div>
      <PostList
        posts={autumnWinterPosts || []}
        showRanking={true}
        isAuthenticated={isAuthenticated}
        isFavorite={isFavorite}
        toggleFavorite={toggleFavorite}
        isLoading={autumnWinterLoading}
        emptyMessage="人気の投稿がありません"
        currentUserId={userId || undefined}
      />
      {/* 特集セクション：特集が存在する場合のみ表示 */}
      {(currentCampaign || secondCampaign) && (
        <>
          <div className="mt-10"></div>
          <div
            className="mt-5 mb-10 text-center text-3xl font-bold tracking-wide bg-gradient-to-r from-amber-700 to-orange-800 bg-clip-text text-transparent"
            style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
          ></div>
        </>
      )}
      {/* 第1特集は存在する場合のみ表示 */}
      {currentCampaign && colorClasses && (
        <div className="mx-4 mb-5">
          <SimpleBox className="h-145 flex flex-col justify-start items-center p-4 relative">
            <p
              className={`text-center text-xl font-semibold ${colorClasses.title} mb-6 mt-4`}
              style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
            >
              {currentCampaign.name}
            </p>

            <div className="flex-grow">
              <div className="grid grid-cols-2 gap-2 w-full mt-4">
                {/* 第1特集用の固定画像4種類 */}
                <div>
                  <BoxImage
                    src="/images/blanket_beige_1.png"
                    alt="ベージュブランケット"
                  />
                </div>
                <div>
                  <BoxImage
                    src="/images/blanket_brown_1.png"
                    alt="ブラウンブランケット"
                  />
                </div>
                <div>
                  <BoxImage
                    src="/images/blanket_gray_1.png"
                    alt="グレーブランケット"
                  />
                </div>
                <div>
                  <BoxImage
                    src="/images/blanket_white_1.png"
                    alt="ホワイトブランケット"
                  />
                </div>
              </div>
              <div className="mt-6 px-4 pb-16">
                <p
                  className="text-center text-gray-600 text-base leading-relaxed font-medium"
                  style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                >
                  <span className={`${colorClasses.highlight} font-semibold`}>
                    {currentCampaign.description.split("、")[0]}
                  </span>
                  、{currentCampaign.description.split("、")[1]}
                </p>
                <p
                  className="text-center text-gray-600 text-sm leading-relaxed mt-2"
                  style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                >
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
                <p
                  className="text-center text-gray-500 text-sm mt-3"
                  style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                >
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
          <SimpleBox className="h-145 flex flex-col justify-start items-center p-4 relative">
            <p
              className={`text-center text-xl font-semibold ${secondColorClasses.title} mb-6 mt-4`}
              style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
            >
              {secondCampaign.name}
            </p>

            <div className="flex-grow">
              <div className="grid grid-cols-2 gap-2 w-full mt-4">
                {/* 第2特集用の固定画像4種類 */}
                <div>
                  <BoxImage
                    src="/images/blanket_black_1.png"
                    alt="ブラックブランケット"
                  />
                </div>
                <div>
                  <BoxImage
                    src="/images/blanket_lightgray_1.png"
                    alt="ライトグレーブランケット"
                  />
                </div>
                <div>
                  <BoxImage
                    src="/images/blanket_pattern_1.png"
                    alt="パターンブランケット"
                  />
                </div>
                <div>
                  <BoxImage
                    src="/images/blanket_white2_1.png"
                    alt="ホワイト2ブランケット"
                  />
                </div>
              </div>
              <div className="mt-6 px-4 pb-16">
                <p
                  className="text-center text-gray-600 text-base leading-relaxed font-medium"
                  style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                >
                  <span
                    className={`${secondColorClasses.highlight} font-semibold`}
                  >
                    {secondCampaign.description.split("、")[0]}
                  </span>
                  、{secondCampaign.description.split("、")[1]}
                </p>
                <p
                  className="text-center text-gray-600 text-sm leading-relaxed mt-2"
                  style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                >
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
                <p
                  className="text-center text-gray-500 text-sm mt-3"
                  style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                >
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
