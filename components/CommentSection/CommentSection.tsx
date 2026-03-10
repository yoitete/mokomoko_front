"use client";

import { useState } from "react";
import { useComments, Comment } from "@/hooks/useComments";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faComment,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/Button/Button";

interface CommentSectionProps {
  postId: number;
  currentUserId: number | null;
  isAuthenticated: boolean;
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
    <div className="bg-white rounded-lg shadow-lg p-6 mt-4">
      <h3
        className="text-lg font-semibold text-[#5A4A4A] mb-4 flex items-center"
        style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
      >
        <FontAwesomeIcon icon={faComment} className="mr-2" />
        コメント ({comments.length})
      </h3>

      {isLoading ? (
        <p className="text-sm text-gray-500">読み込み中...</p>
      ) : comments.length === 0 ? (
        <p
          className="text-sm text-[#7E6565] py-4 text-center"
          style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
        >
          まだコメントはありません
        </p>
      ) : (
        <div className="space-y-4 mb-6">
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
                  {comment.user_nickname || comment.user_name || "ユーザー"}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#7E6565]">
                    {new Date(comment.created_at).toLocaleString("ja-JP", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {currentUserId === comment.user_id && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                      title="コメントを削除"
                    >
                      <FontAwesomeIcon icon={faTrash} className="text-xs" />
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

      {isAuthenticated && (
        <div className="flex gap-2 mt-4">
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
      )}
    </div>
  );
}
