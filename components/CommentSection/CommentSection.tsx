"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useComments, Comment } from "@/hooks/useComments";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faComment,
  faPaperPlane,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/Button/Button";

interface CommentSectionProps {
  postId: number;
  currentUserId: number | null;
  isAuthenticated: boolean;
}

function DrawerPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

export default function CommentSection({
  postId,
  currentUserId,
  isAuthenticated,
}: CommentSectionProps) {
  const { comments, isLoading, addComment, removeComment } =
    useComments(postId);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // ドロワーが開いている間はbodyスクロールを無効化
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    setIsSubmitting(true);
    try {
      await addComment(newComment.trim());
      setNewComment("");
    } catch {
      // error logged in hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    try {
      await removeComment(commentId);
    } catch {
      // error logged in hook
    }
  };

  return (
    <>
      {/* フローティングボタン（ページフロー内で右寄せ・sticky） */}
      <div className="sticky bottom-20 z-40 flex justify-end mt-4 pointer-events-none">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#7E6565] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-[#6B5555] transition-colors cursor-pointer pointer-events-auto mr-2"
        >
          <div className="relative">
            <FontAwesomeIcon icon={faComment} className="text-xl" />
            {comments.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                {comments.length}
              </span>
            )}
          </div>
        </button>
      </div>

      {/* ドロワー（ポータルでbody直下に描画） */}
      <DrawerPortal>
        {/* オーバーレイ */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-[60] transition-opacity"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* ドロワー本体 */}
        <div
          className={`fixed bottom-0 left-0 right-0 z-[60] transform transition-transform duration-300 ease-out lg:w-1/3 lg:mx-auto ${
            isOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="bg-white rounded-t-2xl shadow-2xl max-h-[70vh] flex flex-col">
            {/* ドラッグハンドル */}
            <div className="flex justify-center pt-2">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* ヘッダー */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h3
                className="text-base font-semibold text-[#5A4A4A] flex items-center"
                style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
              >
                <FontAwesomeIcon icon={faComment} className="mr-2 text-sm" />
                コメント ({comments.length})
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer"
              >
                <FontAwesomeIcon icon={faXmark} className="text-lg" />
              </button>
            </div>

            {/* コメントリスト */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
              {isLoading ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  読み込み中...
                </p>
              ) : comments.length === 0 ? (
                <p
                  className="text-sm text-[#7E6565] py-8 text-center"
                  style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                >
                  まだコメントはありません
                </p>
              ) : (
                <div className="space-y-3">
                  {comments.map((comment: Comment) => (
                    <div
                      key={comment.id}
                      className="border-b border-gray-100 pb-3 last:border-b-0"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className="text-sm font-medium text-[#5A4A4A]"
                          style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
                        >
                          {comment.user_nickname ||
                            comment.user_name ||
                            "ユーザー"}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#7E6565]">
                            {new Date(comment.created_at).toLocaleString(
                              "ja-JP",
                              {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                          {currentUserId === comment.user_id && (
                            <button
                              onClick={() => handleDelete(comment.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                              title="コメントを削除"
                            >
                              <FontAwesomeIcon
                                icon={faTrash}
                                className="text-xs"
                              />
                            </button>
                          )}
                        </div>
                      </div>
                      <p
                        className="text-sm text-gray-700 whitespace-pre-wrap"
                        style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                      >
                        {comment.body}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 入力フォーム */}
            {isAuthenticated && (
              <div className="border-t border-gray-100 px-4 py-3">
                <div className="flex gap-2">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="コメントを入力..."
                    maxLength={1000}
                    rows={2}
                    className="flex-1 border border-[#C4B5B5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#7E6565] focus:ring-1 focus:ring-[#7E6565] resize-none"
                    style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                    disabled={isSubmitting}
                  />
                  <Button
                    size="sm"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !newComment.trim()}
                    className="self-end"
                  >
                    <FontAwesomeIcon icon={faPaperPlane} />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DrawerPortal>
    </>
  );
}
