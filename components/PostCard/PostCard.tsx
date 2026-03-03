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
    <div className="inline-block mr-3 w-44 snap-start shrink-0 group">
      <Link href={`/post/${post.id}`} className="block">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm transition-all duration-200 group-hover:shadow-lg group-hover:-translate-y-0.5">
          <div className="relative w-full h-[140px] overflow-hidden">
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              unoptimized={true}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {!isOwnPost && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!isAuthenticated) return;
                  toggleFavorite(post.id!);
                }}
                className={`absolute top-2 right-2 p-1.5 rounded-full bg-white/70 backdrop-blur-sm transition-all duration-200 ${
                  isAuthenticated
                    ? "hover:bg-white hover:scale-110 cursor-pointer"
                    : "cursor-not-allowed opacity-60"
                }`}
                title={
                  !isAuthenticated ? "ログインが必要です" : "お気に入りに追加"
                }
              >
                <FontAwesomeIcon
                  icon={faHeart}
                  className={`text-sm ${
                    !isAuthenticated
                      ? "text-gray-300"
                      : isFavorite(post.id!)
                        ? "text-red-500"
                        : "text-gray-400 group-hover:text-red-300"
                  }`}
                />
              </button>
            )}
          </div>
          <div className="px-3 py-2.5">
            {showRanking ? (
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0">
                  <RankingDisplay index={index} />
                </div>
                <h3 className="text-sm font-semibold text-[#5A4A4A] line-clamp-2 leading-snug flex-1">
                  {post.title}
                </h3>
              </div>
            ) : (
              <h3 className="text-sm font-semibold text-[#5A4A4A] line-clamp-2 leading-snug">
                {post.title}
              </h3>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};
