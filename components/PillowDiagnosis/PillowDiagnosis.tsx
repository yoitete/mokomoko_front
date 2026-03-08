"use client";

import { useState, useMemo, useCallback } from "react";
import { useGet } from "@/hooks/useSWRAPI";
import { Post } from "@/hooks/usePosts";
import DiagnosisQuestion from "./DiagnosisQuestion";
import DiagnosisResult, { ScoredPost } from "./DiagnosisResult";
import {
  DiagnosisAnswers,
  QUESTIONS,
  MATERIAL_MAP,
  PRICE_RANGES,
  INITIAL_ANSWERS,
} from "./types";
import Button from "@/components/Button/Button";

interface PillowDiagnosisProps {
  isAuthenticated: boolean;
  isFavorite: (postId: number) => boolean;
  toggleFavorite: (postId: number) => void;
  currentUserId?: number;
}

function scorePosts(posts: Post[], answers: DiagnosisAnswers): ScoredPost[] {
  return posts
    .map((post) => {
      let score = 0;
      let maxScore = 0;

      // 寝姿勢 (3点)
      if (answers.sleeping_position) {
        maxScore += 3;
        const vals = (post.sleeping_position || "")
          .split(",")
          .map((s) => s.trim());
        if (vals.includes(answers.sleeping_position)) score += 3;
      }

      // 高さ (3点)
      if (answers.height) {
        maxScore += 3;
        const vals = (post.height || "").split(",").map((s) => s.trim());
        if (vals.includes(answers.height)) score += 3;
      }

      // 素材 (2点)
      if (answers.material_preference) {
        maxScore += 2;
        const targets = MATERIAL_MAP[answers.material_preference] || [];
        const vals = (post.material || "").split(",").map((s) => s.trim());
        if (targets.some((t) => vals.includes(t))) score += 2;
      }

      // オーダーメイド (1点)
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

      // 予算 (2点)
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
    })
    .slice(0, 5);
}

export default function PillowDiagnosis({
  isAuthenticated,
  isFavorite,
  toggleFavorite,
  currentUserId,
}: PillowDiagnosisProps) {
  const [isStarted, setIsStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<DiagnosisAnswers>(INITIAL_ANSWERS);

  // 診断開始時にのみ投稿データを取得
  const { data: postsResponse } = useGet<{ posts: Post[] }>(
    isStarted ? "/posts?per_page=100&with_images=true" : null,
  );
  const allPosts = useMemo(
    () => postsResponse?.posts || [],
    [postsResponse],
  );

  const showResults = currentStep >= QUESTIONS.length;

  const results = useMemo(() => {
    if (!showResults) return [];
    return scorePosts(allPosts, answers);
  }, [allPosts, answers, showResults]);

  const handleAnswer = useCallback(
    (questionId: string, value: string) => {
      setAnswers((prev) => ({ ...prev, [questionId]: value }));
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 200);
    },
    [],
  );

  const handleBack = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  }, []);

  const handleRestart = useCallback(() => {
    setCurrentStep(0);
    setAnswers(INITIAL_ANSWERS);
  }, []);

  // 開始前: CTAカード
  if (!isStarted) {
    return (
      <div className="bg-white rounded-2xl shadow p-8 mx-4 text-center">
        <h3
          className="text-xl font-bold text-[#5A4A4A] mb-2"
          style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
        >
          あなたにぴったりの
          <br />
          枕を診断しよう！
        </h3>
        <p
          className="text-sm text-[#7E6565] mb-6"
          style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
        >
          5つの質問に答えるだけで
          <br />
          あなたに合った枕が見つかります
        </p>
        <Button
          onClick={() => setIsStarted(true)}
          className="px-8 cursor-pointer"
        >
          診断スタート
        </Button>
      </div>
    );
  }

  // 結果表示
  if (showResults) {
    return (
      <DiagnosisResult
        results={results}
        isAuthenticated={isAuthenticated}
        isFavorite={isFavorite}
        toggleFavorite={toggleFavorite}
        currentUserId={currentUserId}
        onRestart={handleRestart}
      />
    );
  }

  // 質問中
  return (
    <DiagnosisQuestion
      question={QUESTIONS[currentStep]}
      currentStep={currentStep}
      selectedValue={answers[QUESTIONS[currentStep].id]}
      onAnswer={handleAnswer}
      onBack={handleBack}
    />
  );
}
