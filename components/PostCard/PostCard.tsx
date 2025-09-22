import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { Post } from "@/hooks/usePosts";
import { RankingDisplay } from "@/components/RankingDisplay/RankingDisplay";

interface PostCardProps {
  post: Post;
  index: number;
  showRanking?: boolean;
  isAuthenticated: boolean;
  isFavorite: (postId: number) => boolean;
  toggleFavorite: (postId: number) => void;
  currentUserId?: number;
}

export const PostCard = ({
  post,
  index,
  showRanking = false,
  isAuthenticated,
  isFavorite,
  toggleFavorite,
  currentUserId,
}: PostCardProps) => {
  const imageUrl = post.images?.[0];
  const isOwnPost = currentUserId && post.user_id === currentUserId;

  if (!imageUrl) {
    return null;
  }

  return (
    <div className="inline-block mr-4 w-40 overflow-hidden bg-white">
      <Link href={`/post/${post.id}`} className="block">
        {/* タイトルボックス（上部） */}
        <div className="p-2 bg-white">
          {showRanking ? (
            <div className="flex items-center gap-2">
              {/* 順位表示 */}
              <div className="flex-shrink-0">
                <RankingDisplay index={index} />
              </div>
              <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-tight flex-1">
                {post.title}
              </h3>
            </div>
          ) : (
            <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-tight">
              {post.title}
            </h3>
          )}
        </div>
        <div className="relative w-full h-[118px] overflow-hidden">
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            unoptimized={true}
            className="cursor-pointer object-cover"
          />
          {/* お気に入りボタン（自分の投稿でない場合のみ表示） */}
          {!isOwnPost && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isAuthenticated) {
                  return;
                }
                toggleFavorite(post.id!);
              }}
              className={`absolute bottom-2 right-2 p-1 rounded-full bg-white/80 transition-colors ${
                isAuthenticated
                  ? "hover:bg-white cursor-pointer"
                  : "cursor-not-allowed opacity-60"
              }`}
              title={
                !isAuthenticated ? "ログインが必要です" : "お気に入りに追加"
              }
            >
              <FontAwesomeIcon
                icon={faHeart}
                className={`text-lg ${
                  !isAuthenticated
                    ? "text-gray-300 hover:text-gray-400"
                    : isFavorite(post.id!)
                    ? "text-red-500"
                    : "text-gray-400 hover:text-red-500"
                }`}
              />
            </button>
          )}
        </div>
      </Link>
    </div>
  );
};
