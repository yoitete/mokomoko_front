"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePost } from "@/hooks/useSWRAPI";
import { mutate } from "swr";
import DiagnosisQuestion from "./DiagnosisQuestion";
import {
  DiagnosisAnswers,
  QUESTIONS,
  INITIAL_ANSWERS,
  SESSION_KEY,
} from "./types";
import Button from "@/components/Button/Button";
import Link from "next/link";

interface PillowDiagnosisProps {
  isAuthenticated: boolean;
  currentUserId?: number;
}

export default function PillowDiagnosis({
  isAuthenticated,
}: PillowDiagnosisProps) {
  const router = useRouter();
  const [isQuestion, setIsQuestion] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<DiagnosisAnswers>(INITIAL_ANSWERS);
  const postData = usePost();

  // ?diagnosis=start で自動開始
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("diagnosis") === "start") {
      setIsQuestion(true);
      setCurrentStep(0);
      setAnswers(INITIAL_ANSWERS);
      window.history.replaceState({}, "", "/home");
    }
  }, []);

  // 全問回答後 → API保存 + 結果ページへ遷移
  useEffect(() => {
    if (!isQuestion || currentStep < QUESTIONS.length) return;
    const allAnswered = Object.values(answers).every((v) => v !== null);
    if (!allAnswered) return;

    // sessionStorageに回答を保存
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(answers));

    // 認証済みならAPIに保存
    if (isAuthenticated) {
      postData("/pillow_diagnoses", {
        pillow_diagnosis: {
          sleeping_position: answers.sleeping_position,
          height: answers.height,
          material_preference: answers.material_preference,
          order_interest: answers.order_interest,
          price_range: answers.price_range,
        },
      })
        .then(() => mutate("/pillow_diagnoses"))
        .catch((err) => console.error("診断結果の保存に失敗:", err));
    }

    // 結果ページへ遷移
    router.push("/diagnosis/result");
  }, [isQuestion, currentStep, answers, isAuthenticated, postData, router]);

  const handleAnswer = useCallback((questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, 200);
  }, []);

  const handleBack = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  }, []);

  // 開始前: CTAカード
  if (!isQuestion) {
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
          onClick={() => setIsQuestion(true)}
          className="px-8 cursor-pointer"
        >
          診断スタート
        </Button>
        {isAuthenticated && (
          <div className="mt-4">
            <Link href="/diagnosis/history">
              <button
                className="text-sm text-[#7E6565] hover:text-[#5A4A4A] transition-colors cursor-pointer underline"
                style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              >
                過去の診断結果を見る
              </button>
            </Link>
          </div>
        )}
      </div>
    );
  }

  // 質問中
  if (currentStep < QUESTIONS.length) {
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

  // 結果ページへの遷移中
  return (
    <div className="bg-white rounded-2xl shadow p-8 mx-4 text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7E6565] mx-auto" />
      <p
        className="mt-3 text-sm text-[#7E6565]"
        style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
      >
        結果ページへ移動中...
      </p>
    </div>
  );
}
