import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEye } from "@fortawesome/free-solid-svg-icons";
import { Post } from "@/hooks/usePosts";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal/DeleteConfirmModal";

interface MyPostCardProps {
  post: Post;
  onDelete: (postId: number) => Promise<{ success: boolean; error?: unknown }>;
  isDeleting: boolean;
}

export const MyPostCard = ({ post, onDelete, isDeleting }: MyPostCardProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const imageUrl = post.images?.[0];

  const handleDelete = async () => {
    const result = await onDelete(post.id!);
    if (result.success) {
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* 画像部分 */}
        {imageUrl ? (
          <div className="relative w-full h-48">
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              unoptimized={true}
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">画像なし</span>
          </div>
        )}

        {/* 投稿情報 */}
        <div className="p-4">
          <h3
            className="text-lg font-semibold text-gray-900 mb-2 overflow-hidden"
            style={
              {
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              } as React.CSSProperties & {
                WebkitBoxOrient: "vertical";
                WebkitLineClamp: number;
              }
            }
          >
            {post.title}
          </h3>

          {post.price && (
            <p className="text-xl font-bold text-red-600 mb-2">
              ¥{post.price.toLocaleString()}
            </p>
          )}

          <p
            className="text-gray-600 text-sm mb-3 overflow-hidden"
            style={
              {
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              } as React.CSSProperties & {
                WebkitBoxOrient: "vertical";
                WebkitLineClamp: number;
              }
            }
          >
            {post.description}
          </p>

          {/* タグ */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {post.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
                >
                  #{tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="text-gray-400 text-xs">
                  +{post.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* 投稿日時とお気に入り数 */}
          <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
            <span>
              {new Date(post.created_at || "").toLocaleDateString("ja-JP")}
            </span>
            <span>♥ {post.favorites_count || 0}</span>
          </div>

          {/* アクションボタン */}
          <div className="flex gap-2">
            <Link
              href={`/post/${post.id}`}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium text-center transition-colors"
            >
              <FontAwesomeIcon icon={faEye} className="mr-1" />
              詳細
            </Link>
            <button
              onClick={() => setShowDeleteModal(true)}
              disabled={isDeleting}
              className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
            >
              <FontAwesomeIcon icon={faTrash} className="mr-1" />
              {isDeleting ? "削除中..." : "削除"}
            </button>
          </div>
        </div>
      </div>

      {/* 削除確認モーダル */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title={post.title}
        isDeleting={isDeleting}
      />
    </>
  );
};
