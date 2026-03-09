"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faRotateRight,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useGet } from "@/hooks/useSWRAPI";
import { Post } from "@/hooks/usePosts";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useFavorites } from "@/hooks/useFavorites";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import Button from "@/components/Button/Button";
import {
  DiagnosisAnswers,
  MATERIAL_MAP,
  PRICE_RANGES,
  SESSION_KEY,
} from "@/components/PillowDiagnosis/types";

const RESULTS_PER_PAGE = 5;

type ScoredPost = {
  post: Post;
  score: number;
  maxScore: number;
  matchPercentage: number;
};

function scorePosts(posts: Post[], answers: DiagnosisAnswers): ScoredPost[] {
  return posts
    .map((post) => {
      let score = 0;
      let maxScore = 0;

      if (answers.sleeping_position) {
        maxScore += 3;
        const vals = (post.sleeping_position || "")
          .split(",")
          .map((s) => s.trim());
        if (vals.includes(answers.sleeping_position)) score += 3;
      }

      if (answers.height) {
        maxScore += 3;
        const vals = (post.height || "").split(",").map((s) => s.trim());
        if (vals.includes(answers.height)) score += 3;
      }

      if (answers.material_preference) {
        maxScore += 2;
        const targets = MATERIAL_MAP[answers.material_preference] || [];
        const vals = (post.material || "").split(",").map((s) => s.trim());
        if (targets.some((t) => vals.includes(t))) score += 2;
      }

      if (answers.order_interest) {
        maxScore += 1;
        const orderType = (post.order_type || "").trim();
        if (answers.order_interest === "yes") {
          if (
            orderType === "フルオーダーメイド" ||
            orderType === "セミオーダーメイド"
          )
            score += 1;
        } else if (answers.order_interest === "no") {
          if (
            orderType !== "フルオーダーメイド" &&
            orderType !== "セミオーダーメイド"
          )
            score += 1;
        } else {
          score += 1;
        }
      }

      if (answers.price_range && post.price != null) {
        maxScore += 2;
        const range = PRICE_RANGES[answers.price_range];
        if (range && post.price >= range.min && post.price <= range.max)
          score += 2;
      }

      const matchPercentage =
        maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
      return { post, score, maxScore, matchPercentage };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (b.post.favorites_count || 0) - (a.post.favorites_count || 0);
    });
}

export default function DiagnosisResultPage() {
  const router = useRouter();
  const { userId, isAuthenticated } = useCurrentUser();
  const { toggleFavorite, isFavorite } = useFavorites(userId);

  const [answers, setAnswers] = useState<DiagnosisAnswers | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [ready, setReady] = useState(false);

  // Read answers from sessionStorage on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved) {
        setAnswers(JSON.parse(saved));
        setReady(true);
      } else {
        router.replace("/home");
      }
    } catch {
      router.replace("/home");
    }
  }, [router]);

  // Fetch posts
  const { data: postsResponse, isLoading } = useGet<{ posts: Post[] }>(
    ready ? "/posts?per_page=100&with_images=true" : null,
  );
  const allPosts = useMemo(
    () => postsResponse?.posts || [],
    [postsResponse],
  );

  // Score and paginate
  const allResults = useMemo(() => {
    if (!answers || isLoading || !postsResponse) return [];
    return scorePosts(allPosts, answers);
  }, [allPosts, answers, isLoading, postsResponse]);

  const totalPages = Math.max(
    1,
    Math.ceil(allResults.length / RESULTS_PER_PAGE),
  );
  const paginatedResults = useMemo(() => {
    const start = (currentPage - 1) * RESULTS_PER_PAGE;
    return allResults.slice(start, start + RESULTS_PER_PAGE);
  }, [allResults, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRestart = () => {
    sessionStorage.removeItem(SESSION_KEY);
    router.push("/home?diagnosis=start");
  };

  const handleClose = () => {
    sessionStorage.removeItem(SESSION_KEY);
    router.push("/home");
  };

  // Loading
  if (!ready || isLoading || !postsResponse) {
    return (
      <div className="min-h-screen bg-[#E2D8D8]">
        <div className="mt-10 mx-4 mb-6">
          <PageHeader title="診断結果" backHref="/home" centerTitle={true} />
        </div>
        <div className="bg-white rounded-2xl shadow p-8 mx-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7E6565] mx-auto" />
          <p
            className="mt-3 text-sm text-[#7E6565]"
            style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
          >
            結果を検索中...
          </p>
        </div>
      </div>
    );
  }

  // No results
  if (allResults.length === 0) {
    return (
      <div className="min-h-screen bg-[#E2D8D8]">
        <div className="mt-10 mx-4 mb-6">
          <PageHeader title="診断結果" backHref="/home" centerTitle={true} />
        </div>
        <div className="bg-white rounded-2xl shadow p-6 mx-4 text-center">
          <p
            className="text-lg font-bold text-[#5A4A4A] mb-2"
            style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
          >
            ぴったりの枕が見つかりませんでした
          </p>
          <p
            className="text-sm text-[#7E6565] mb-4"
            style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
          >
            条件を変えて再診断してみましょう！
          </p>
          <div className="space-y-2">
            <Button onClick={handleRestart} className="w-full cursor-pointer">
              <FontAwesomeIcon icon={faRotateRight} className="mr-2" />
              再診断する
            </Button>
            <button
              onClick={handleClose}
              className="w-full text-sm text-[#7E6565] hover:text-[#5A4A4A] transition-colors cursor-pointer py-2"
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
            >
              <FontAwesomeIcon icon={faXmark} className="mr-1" />
              閉じる
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E2D8D8]">
      <div className="mt-10 mx-4 mb-6">
        <PageHeader title="診断結果" backHref="/home" centerTitle={true} />
      </div>

      {/* ヘッダー */}
      <div className="text-center mb-4">
        <p
          className="text-xl font-bold text-[#5A4A4A]"
          style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
        >
          あなたにおすすめの枕
        </p>
        <p
          className="text-sm text-[#7E6565] mt-1"
          style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
        >
          {allResults.length}件の枕が見つかりました
        </p>
      </div>

      {/* 結果カード */}
      <div className="mx-4 space-y-3">
        {paginatedResults.map(({ post, matchPercentage }, index) => {
          const imageUrl = post.images?.[0];
          if (!imageUrl) return null;
          const isOwnPost = userId && post.user_id === userId;

          return (
            <Link
              key={post.id || index}
              href={`/post/${post.id}?from=diagnosis`}
            >
              <div className="bg-white rounded-2xl shadow overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer mb-3">
                <div className="flex">
                  <div className="relative w-28 h-28 shrink-0">
                    <Image
                      src={imageUrl}
                      alt={post.title}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                    <div className="absolute top-1.5 left-1.5 bg-[#7E6565] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {matchPercentage}%
                    </div>
                  </div>

                  <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
                    <div>
                      <h4
                        className="text-sm font-semibold text-[#5A4A4A] line-clamp-2 leading-snug"
                        style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                      >
                        {post.title}
                      </h4>
                      {post.price != null && (
                        <p className="text-xs text-[#7E6565] mt-1">
                          ¥{post.price.toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      {post.user_name && (
                        <p className="text-xs text-[#7E6565] truncate">
                          {post.user_name}
                        </p>
                      )}
                      {!isOwnPost && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (!isAuthenticated) return;
                            toggleFavorite(post.id!);
                          }}
                          className={`p-1 rounded-full transition-all ${
                            isAuthenticated
                              ? "hover:scale-110 cursor-pointer"
                              : "cursor-not-allowed opacity-60"
                          }`}
                        >
                          <FontAwesomeIcon
                            icon={faHeart}
                            className={`text-sm ${
                              !isAuthenticated
                                ? "text-gray-300"
                                : isFavorite(post.id!)
                                  ? "text-red-500"
                                  : "text-gray-400"
                            }`}
                          />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ページネーション */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-6">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            variant="outline"
            size="md"
            className="min-w-[100px]"
          >
            前へ
          </Button>
          <span
            className="text-sm text-gray-900 font-semibold"
            style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
          >
            {currentPage} / {totalPages}
          </span>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="outline"
            size="md"
            className="min-w-[100px]"
          >
            次へ
          </Button>
        </div>
      )}

      {/* アクションボタン */}
      <div className="mx-4 space-y-2 pt-6 pb-8">
        <Button
          onClick={handleRestart}
          variant="outline"
          className="w-full cursor-pointer"
        >
          <FontAwesomeIcon icon={faRotateRight} className="mr-2" />
          再診断する
        </Button>
        <button
          onClick={handleClose}
          className="w-full text-sm text-[#7E6565] hover:text-[#5A4A4A] transition-colors cursor-pointer py-2"
          style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
        >
          <FontAwesomeIcon icon={faXmark} className="mr-1" />
          閉じる
        </button>
      </div>
    </div>
  );
}
