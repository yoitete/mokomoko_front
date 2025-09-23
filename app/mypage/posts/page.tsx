"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMyPosts } from "@/hooks/useMyPosts";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import Button from "@/components/Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPlus } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function MyPostsPage() {
  const router = useRouter();
  const { isUnauthenticated, loading } = useCurrentUser();
  const {
    posts,
    isLoading: postsLoading,
    deletePost,
    isDeleting,
    error: postsError,
  } = useMyPosts();

  const handleGoBack = useCallback(() => {
    router.push("/mypage");
  }, [router]);

  // ローディング中の表示
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">認証状態を確認中...</p>
        </div>
      </div>
    );
  }

  // ログイン前の表示
  if (isUnauthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
            このページはログイン後に表示されます
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            投稿管理機能をご利用いただくには
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

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleGoBack}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">投稿管理</h1>
                <p className="text-gray-600 text-sm">
                  {posts ? `${posts.length}件の投稿` : ""}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 投稿一覧 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {postsLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-gray-600">投稿を読み込み中...</p>
            </div>
          ) : postsError ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">投稿の読み込みに失敗しました</p>
              <p className="text-gray-600 text-sm mb-4">
                エラー: {postsError.message || "不明なエラー"}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                再読み込み
              </button>
            </div>
          ) : !posts || posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-4">
                <FontAwesomeIcon
                  icon={faPlus}
                  className="text-gray-300 text-4xl mb-4"
                />
              </div>
              <p className="text-gray-500 mb-4 text-lg">まだ投稿がありません</p>
              <p className="text-gray-400 text-sm mb-6">
                投稿ページから最初の投稿を作成しましょう
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post, index) => (
                <div
                  key={post.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    {/* 投稿画像 */}
                    <div className="flex-shrink-0">
                      {post.images?.[0] ? (
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                          <img
                            src={post.images[0]}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400 text-xs">
                            画像なし
                          </span>
                        </div>
                      )}
                    </div>

                    {/* 投稿情報 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {post.title}
                        </h3>
                        <span className="text-sm text-gray-500 ml-4 flex-shrink-0">
                          #{index + 1}
                        </span>
                      </div>

                      {post.price && (
                        <p className="text-xl font-bold text-red-600 mb-2">
                          ¥{post.price.toLocaleString()}
                        </p>
                      )}

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {post.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>
                            {new Date(post.created_at || "").toLocaleDateString(
                              "ja-JP"
                            )}
                          </span>
                          <span>♥ {post.favorites_count || 0}</span>
                        </div>

                        <div className="flex gap-2">
                          <Link
                            href={`/post/${post.id}`}
                            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded transition-colors"
                          >
                            詳細
                          </Link>
                          <button
                            onClick={() => {
                              if (
                                confirm(
                                  `「${post.title}」を削除してもよろしいですか？\n\nこの操作は取り消すことができません。`
                                )
                              ) {
                                deletePost(post.id!);
                              }
                            }}
                            disabled={isDeleting}
                            className="px-3 py-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white text-sm rounded transition-colors"
                          >
                            {isDeleting ? "削除中..." : "削除"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
