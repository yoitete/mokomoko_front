import React from "react";
import { SlideBox } from "@/components/SlideBox/SlideBox";
import { PostCard } from "@/components/PostCard/PostCard";
import { Post } from "@/hooks/usePosts";

interface PostListProps {
  posts: Post[];
  showRanking?: boolean;
  isAuthenticated: boolean;
  isFavorite: (postId: number) => boolean;
  toggleFavorite: (postId: number) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  currentUserId?: number;
}

export const PostList = ({
  posts,
  showRanking = false,
  isAuthenticated,
  isFavorite,
  toggleFavorite,
  isLoading = false,
  emptyMessage = "投稿がありません",
  currentUserId,
}: PostListProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500 mx-auto"></div>
        <p className="mt-2 text-gray-600">読み込み中...</p>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return <div className="text-center py-4 text-gray-500">{emptyMessage}</div>;
  }

  return (
    <div className="flex justify-end">
      <SlideBox>
        <div className="gap-4">
          {posts.map((post, index) => (
            <PostCard
              key={post.id || index}
              post={post}
              index={index}
              showRanking={showRanking}
              isAuthenticated={isAuthenticated}
              isFavorite={isFavorite}
              toggleFavorite={toggleFavorite}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      </SlideBox>
    </div>
  );
};
