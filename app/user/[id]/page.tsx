"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useGet } from "@/hooks/useSWRAPI";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useFollowers, useFollowing } from "@/hooks/useFollows";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import FollowButton from "@/components/FollowButton/FollowButton";
import Button from "@/components/Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Post } from "@/hooks/usePosts";

type UserProfile = {
  id: number;
  name: string;
  nickname?: string | null;
  bio?: string | null;
  profile_image?: string | null;
  selected_icon?: string | null;
  followers_count?: number;
  following_count?: number;
};

type PostsResponse = {
  posts: Post[];
  total_count: number;
};

export default function UserProfilePage() {
  const params = useParams();
  const targetUserId = params.id ? Number(params.id) : null;
  const { isUnauthenticated, loading } = useAuth();
  const { userId, isAuthenticated } = useCurrentUser();
  const { count: followersCount } = useFollowers(targetUserId);
  const { count: followingCount } = useFollowing(targetUserId);

  const {
    data: user,
    error,
    isLoading: isUserLoading,
  } = useGet<UserProfile>(targetUserId ? `/users/${targetUserId}` : null, {
    requireAuth: false,
  });

  const { data: postsData, isLoading: isPostsLoading } =
    useGet<PostsResponse>(
      targetUserId ? `/posts?user_id=${targetUserId}&per_page=100` : null,
      { requireAuth: false }
    );

  const posts = postsData?.posts || [];
  const isOwnProfile = userId === targetUserId;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E2D8D8] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">認証状態を確認中...</p>
        </div>
      </div>
    );
  }

  if (isUnauthenticated) {
    return (
      <div className="min-h-screen bg-[#E2D8D8] flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center whitespace-nowrap">
            このページはログイン後に表示されます
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            この機能をご利用いただくには
            <br />
            ログインまたは新規登録が必要です。
          </p>
          <Link href="/signup">
            <Button className="w-full">新規アカウント作成</Button>
          </Link>
          <div className="mt-4">
            <Link href="/login">
              <Button variant="outline" className="w-full">
                ログイン
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-[#E2D8D8] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-[#7E6565]">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-[#E2D8D8] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">ユーザーが見つかりません</p>
          <Link href="/home">
            <Button>ホームに戻る</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E2D8D8]">
      <PageHeader title="プロフィール" backHref="/home" centerTitle={true} />

      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        {/* プロフィールカード */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-[#F5F0F0] flex items-center justify-center flex-shrink-0 overflow-hidden">
              {user.profile_image ? (
                <Image
                  src={user.profile_image}
                  alt={user.nickname || user.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                  unoptimized={true}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faUser}
                  className="text-[#7E6565] text-2xl"
                />
              )}
            </div>
            <div className="flex-1">
              <h2
                className="text-xl font-semibold text-[#5A4A4A]"
                style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
              >
                {user.nickname || user.name}
              </h2>
            </div>
          </div>

          {/* bio */}
          {user.bio && (
            <div className="p-3 bg-gray-50 rounded-lg mb-4">
              <p
                className="text-[#5A4A4A] text-sm whitespace-pre-wrap"
                style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              >
                {user.bio}
              </p>
            </div>
          )}

          {/* フォロー数 */}
          <div className="flex justify-around py-3 border-t border-gray-100">
            <div className="text-center">
              <p
                className="text-xl font-bold text-[#5A4A4A]"
                style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
              >
                {followersCount}
              </p>
              <p
                className="text-xs text-[#7E6565]"
                style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              >
                フォロワー
              </p>
            </div>
            <div className="border-l border-gray-200" />
            <div className="text-center">
              <p
                className="text-xl font-bold text-[#5A4A4A]"
                style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
              >
                {followingCount}
              </p>
              <p
                className="text-xs text-[#7E6565]"
                style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              >
                フォロー中
              </p>
            </div>
          </div>

          {/* フォローボタン */}
          {isAuthenticated && !isOwnProfile && targetUserId && (
            <div className="mt-4">
              <FollowButton
                currentUserId={userId}
                targetUserId={targetUserId}
              />
            </div>
          )}
        </div>

        {/* 投稿一覧 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3
            className="text-lg font-semibold text-[#5A4A4A] mb-4"
            style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
          >
            投稿一覧
          </h3>
          {isPostsLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
            </div>
          ) : posts.length === 0 ? (
            <p
              className="text-[#7E6565] text-center py-4"
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
            >
              投稿はまだありません
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {posts.map((post) => (
                <Link key={post.id} href={`/post/${post.id}`}>
                  <div className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    {post.images && post.images.length > 0 ? (
                      <Image
                        src={post.images[0]}
                        alt={post.title}
                        width={200}
                        height={150}
                        className="w-full h-28 object-cover"
                        unoptimized={true}
                      />
                    ) : (
                      <div className="w-full h-28 bg-[#F5F0F0] flex items-center justify-center">
                        <p className="text-xs text-[#7E6565]">No Image</p>
                      </div>
                    )}
                    <div className="p-2">
                      <p
                        className="text-xs font-medium text-[#5A4A4A] line-clamp-2"
                        style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                      >
                        {post.title}
                      </p>
                      {post.price && (
                        <p className="text-xs font-bold text-red-600 mt-1">
                          ¥{post.price.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
