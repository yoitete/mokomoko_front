"use client";

import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { Post } from "@/hooks/usePosts";
import Button from "@/components/Button/Button";

export type ScoredPost = {
  post: Post;
  score: number;
  maxScore: number;
  matchPercentage: number;
};

interface DiagnosisResultProps {
  results: ScoredPost[];
  isAuthenticated: boolean;
  isFavorite: (postId: number) => boolean;
  toggleFavorite: (postId: number) => void;
  currentUserId?: number;
  onRestart: () => void;
}

export default function DiagnosisResult({
  results,
  isAuthenticated,
  isFavorite,
  toggleFavorite,
  currentUserId,
  onRestart,
}: DiagnosisResultProps) {
  if (results.length === 0) {
    return (
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
        <Button onClick={onRestart} className="cursor-pointer">
          <FontAwesomeIcon icon={faRotateRight} className="mr-2" />
          もう一度診断する
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-4 space-y-4">
      {/* ヘッダー */}
      <div className="text-center">
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
          {results.length}件の枕が見つかりました
        </p>
      </div>

      {/* 結果カード */}
      {results.map(({ post, matchPercentage }, index) => {
        const imageUrl = post.images?.[0];
        if (!imageUrl) return null;
        const isOwnPost = currentUserId && post.user_id === currentUserId;

        return (
          <Link key={post.id || index} href={`/post/${post.id}`}>
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

      {/* アクションボタン */}
      <div className="pt-2">
        <Button
          onClick={onRestart}
          variant="outline"
          className="w-full cursor-pointer"
        >
          <FontAwesomeIcon icon={faRotateRight} className="mr-2" />
          もう一度診断する
        </Button>
      </div>
    </div>
  );
}
