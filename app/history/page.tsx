"use client";

import { useState } from "react";
import Image from "next/image";
import { SimpleBox } from "@/components/SimpleBox/SimpleBox";
import Link from "next/link";
import Button from "@/components/Button/Button";
import { useViewingHistory } from "@/hooks/useViewingHistory";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function HistoryPage() {
  const { history, removeFromHistory, clearHistory } = useViewingHistory();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ページネーション計算
  const totalPages = Math.ceil(history.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = history.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearAll = () => {
    clearHistory();
    setCurrentPage(1);
  };

  if (history.length === 0) {
    return (
      <div className="mt-10 mx-4">
        <h1
          className="text-3xl font-bold text-center mb-6 text-[#7E6565] tracking-wide"
          style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
        >
          閲覧履歴
        </h1>
        <p className="text-center text-[#7E6565]">閲覧履歴がありません</p>
      </div>
    );
  }

  return (
    <div className="mt-10 mx-4 space-y-4">
      <h1
        className="text-3xl font-bold text-center mb-6 text-[#7E6565] tracking-wide"
        style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
      >
        閲覧履歴
      </h1>

      {/* ページ情報 + 全件クリア */}
      <div className="flex justify-between items-center">
        <span
          className="text-sm text-gray-500"
          style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
        >
          {history.length}件中 {startIndex + 1}-
          {Math.min(endIndex, history.length)}件を表示
        </span>
        <button
          onClick={handleClearAll}
          className="text-sm text-red-400 hover:text-red-600 transition-colors flex items-center gap-1"
          style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
        >
          <FontAwesomeIcon icon={faTrash} size="xs" />
          全件クリア
        </button>
      </div>

      {currentItems.map((item) => (
        <div key={item.postId} className="relative">
          <Link href={`/post/${item.postId}`} className="block">
            <SimpleBox className="flex flex-col md:flex-row items-start p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              {/* 左：画像 */}
              <div className="md:w-1/3 w-full">
                {item.image ? (
                  <div className="w-full h-[118px] overflow-hidden relative rounded-lg">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover rounded-lg"
                      unoptimized={true}
                    />
                  </div>
                ) : (
                  <div className="h-[118px] bg-gray-200 flex items-center justify-center rounded-lg">
                    No Image
                  </div>
                )}
              </div>

              {/* 右：タイトル＋閲覧日時 */}
              <div className="md:w-2/3 w-full md:ml-4 mt-2 md:mt-0">
                <p className="text-lg font-semibold text-[#5A4A4A] pr-8">
                  {item.title}
                </p>
                <p className="text-xs text-[#7E6565] mt-2">
                  閲覧日時:{" "}
                  {new Date(item.viewedAt).toLocaleString("ja-JP", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </SimpleBox>
          </Link>

          {/* 削除ボタン */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              removeFromHistory(item.postId);
              if (currentItems.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
              }
            }}
            className="absolute top-4 right-4 p-1.5 text-[#C4B5B5] hover:text-red-400 transition-colors"
            title="履歴から削除"
          >
            <FontAwesomeIcon icon={faXmark} size="sm" />
          </button>
        </div>
      ))}

      {/* ページネーション */}
      {totalPages >= 1 && (
        <div className="flex justify-center items-center space-x-4 mt-8 mb-3">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            variant="outline"
            size="md"
            className="min-w-[100px]"
          >
            前へ
          </Button>

          <div className="flex items-center space-x-2">
            <span
              className="text-sm text-gray-900 font-semibold"
              style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
            >
              {currentPage} / {totalPages}
            </span>
          </div>

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
    </div>
  );
}
