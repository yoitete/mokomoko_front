"use client";

import { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useGet } from "@/hooks/useSWRAPI";
import { useDelete } from "@/hooks/useSWRAPI";
import { mutate } from "swr";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Button from "@/components/Button/Button";
import {
  QUESTIONS,
  DiagnosisRecord,
  recordToAnswers,
  SESSION_KEY,
} from "@/components/PillowDiagnosis/types";

function getLabel(questionId: string, value: string): string {
  const question = QUESTIONS.find((q) => q.id === questionId);
  if (!question) return value;
  const option = question.options.find((o) => o.value === value);
  return option?.label || value;
}

export default function DiagnosisHistoryPage() {
  const router = useRouter();
  const {
    isAuthenticated,
    isUnauthenticated,
    loading: authLoading,
  } = useCurrentUser();
  const deleteData = useDelete();

  const { data: historyData, isLoading } = useGet<DiagnosisRecord[]>(
    isAuthenticated ? "/pillow_diagnoses" : null,
    { revalidateOnFocus: false },
  );
  const history = useMemo(() => historyData || [], [historyData]);

  const handleSelect = useCallback(
    (record: DiagnosisRecord) => {
      const answers = recordToAnswers(record);
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(answers));
      router.push("/diagnosis/result");
    },
    [router],
  );

  const handleDelete = useCallback(
    async (id: number) => {
      try {
        await deleteData(`/pillow_diagnoses/${id}`);
        mutate("/pillow_diagnoses");
      } catch (err) {
        console.error("履歴の削除に失敗:", err);
      }
    },
    [deleteData],
  );

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#E2D8D8] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7E6565] mx-auto" />
          <p className="mt-2 text-sm text-[#7E6565]">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (isUnauthenticated) {
    return (
      <div className="min-h-screen bg-[#E2D8D8] flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            このページはログイン後に表示されます
          </h2>
          <p className="text-gray-600 mb-6">
            診断履歴をご覧いただくには
            <br />
            ログインが必要です。
          </p>
          <Link href="/login">
            <Button className="w-full">ログイン</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E2D8D8]">
      <div className="mt-10 mx-4 mb-6">
        <PageHeader title="回答履歴" backHref="/home" centerTitle={true} />
      </div>

      <div className="mx-4 pb-8">
        {isLoading ? (
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7E6565] mx-auto" />
            <p
              className="mt-3 text-sm text-[#7E6565]"
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
            >
              読み込み中...
            </p>
          </div>
        ) : history.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            <p
              className="text-lg font-bold text-[#5A4A4A] mb-2"
              style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
            >
              診断履歴がありません
            </p>
            <p
              className="text-sm text-[#7E6565]"
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
            >
              まくら診断を行うと履歴がここに表示されます
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((record) => (
              <div
                key={record.id}
                onClick={() => handleSelect(record)}
                className="bg-white rounded-2xl shadow p-4 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-sm text-[#7E6565]"
                    style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                  >
                    {new Date(record.created_at).toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(record.id);
                    }}
                    className="text-[#C4B5B5] hover:text-red-400 transition-colors cursor-pointer p-1"
                  >
                    <FontAwesomeIcon icon={faXmark} size="sm" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="bg-[#F5F0F0] text-[#5A4A4A] text-xs px-2.5 py-1 rounded-full">
                    {getLabel("sleeping_position", record.sleeping_position)}
                  </span>
                  <span className="bg-[#F5F0F0] text-[#5A4A4A] text-xs px-2.5 py-1 rounded-full">
                    {getLabel("height", record.height)}
                  </span>
                  <span className="bg-[#F5F0F0] text-[#5A4A4A] text-xs px-2.5 py-1 rounded-full">
                    {getLabel(
                      "material_preference",
                      record.material_preference,
                    )}
                  </span>
                  <span className="bg-[#F5F0F0] text-[#5A4A4A] text-xs px-2.5 py-1 rounded-full">
                    {getLabel("order_interest", record.order_interest)}
                  </span>
                  <span className="bg-[#F5F0F0] text-[#5A4A4A] text-xs px-2.5 py-1 rounded-full">
                    {getLabel("price_range", record.price_range)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
