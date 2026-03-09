"use client";

import { QuestionDef, QUESTIONS } from "./types";

interface DiagnosisQuestionProps {
  question: QuestionDef;
  currentStep: number;
  selectedValue: string | null;
  onAnswer: (questionId: string, value: string) => void;
  onBack: () => void;
}

export default function DiagnosisQuestion({
  question,
  currentStep,
  selectedValue,
  onAnswer,
  onBack,
}: DiagnosisQuestionProps) {
  const totalSteps = QUESTIONS.length;

  return (
    <div className="bg-white rounded-2xl shadow p-6 mx-4">
      {/* プログレスドット */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              i <= currentStep ? "bg-[#7E6565]" : "bg-[#C4B5B5]"
            }`}
          />
        ))}
        <span
          className="ml-2 text-xs text-[#7E6565]"
          style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
        >
          Q{currentStep + 1} / {totalSteps}
        </span>
      </div>

      {/* 質問 */}
      <h3
        className="text-xl font-bold text-[#5A4A4A] text-center mb-2"
        style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
      >
        {question.question}
      </h3>
      <p
        className="text-sm text-[#7E6565] text-center mb-6"
        style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
      >
        {question.description}
      </p>

      {/* 選択肢 */}
      <div className="space-y-3">
        {question.options.map((option) => (
          <button
            key={option.value}
            onClick={() => onAnswer(question.id, option.value)}
            className={`w-full p-4 rounded-xl text-left transition-all cursor-pointer ${
              selectedValue === option.value
                ? "bg-[#7E6565] text-white shadow-md"
                : "bg-[#F5F0F0] text-[#5A4A4A] hover:bg-[#E2D8D8]"
            }`}
            style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
          >
            <span className="font-medium">{option.label}</span>
          </button>
        ))}
      </div>

      {/* 戻るボタン */}
      <button
        onClick={onBack}
        className="mt-4 text-sm text-[#7E6565] hover:text-[#5A4A4A] transition-colors cursor-pointer"
        style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
      >
        ← 戻る
      </button>
    </div>
  );
}
