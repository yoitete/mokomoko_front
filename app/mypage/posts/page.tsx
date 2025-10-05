"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useMyPosts } from "@/hooks/useMyPosts";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import Button from "@/components/Button/Button";
import { SimpleBox } from "@/components/SimpleBox/SimpleBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPlus } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function MyPostsPage() {
  const router = useRouter();
  const { isUnauthenticated, loading } = useCurrentUser();
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  const {
    posts,
    pagination,
    isLoading: postsLoading,
    deletePost,
    isDeleting,
    error: postsError,
  } = useMyPosts(currentPage, postsPerPage);

  const handleGoBack = useCallback(() => {
    router.push("/mypage");
  }, [router]);

  // ページ変更時にトップにスクロール
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
    <div className="min-h-screen bg-[#E2D8D8]">
      <div className="mt-10 mx-4 space-y-4">
        {/* ヘッダー */}
        <div className="flex items-center mb-6">
          <button onClick={handleGoBack} className="mr-4">
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="text-[#7E6565] hover:text-[#6B5555] transition-colors cursor-pointer"
              size="lg"
            />
          </button>
          <h2
            className="text-2xl font-semibold text-[#5A4A4A]"
            style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
          >
            投稿管理
          </h2>
        </div>
      </div>

      {/* 投稿一覧 */}
      <div className="mt-10 mx-4 space-y-4">
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
          posts.map((post) => (
            <SimpleBox
              key={post.id}
              className="flex flex-col md:flex-row items-start p-4"
            >
              {/* 左：画像 */}
              <div className="md:w-1/3 w-full">
                <Link href={`/post/${post.id}`}>
                  {post.images?.[0] ? (
                    <div className="w-full h-[118px] overflow-hidden relative cursor-pointer hover:opacity-80 transition-opacity">
                      <img
                        src={post.images[0]}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-[118px] bg-gray-200 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity">
                      No Image
                    </div>
                  )}
                </Link>
              </div>

              {/* 右：タイトル＋本文サマリー */}
              <div className="md:w-2/3 w-full md:ml-4 mt-2 md:mt-0">
                <p className="text-lg font-semibold text-black">{post.title}</p>
                <p className="text-sm text-black line-clamp-3 mt-1 whitespace-pre-wrap">
                  {post.description}
                </p>

                {post.price && (
                  <p className="text-xl font-bold text-red-600 mb-2">
                    ¥{post.price.toLocaleString()}
                  </p>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
                  <div className="flex items-center gap-4">
                    <span>
                      {new Date(post.created_at || "").toLocaleDateString(
                        "ja-JP"
                      )}
                    </span>
                    <span>♥ {post.favorites_count || 0}</span>
                  </div>
                  <div className="flex gap-3">
                    <Link
                      href={`/post/edit/${post.id}`}
                      className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs rounded-md transition-colors font-medium"
                    >
                      編集
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
                      className="px-3 py-1.5 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white text-xs rounded-md transition-colors font-medium cursor-pointer disabled:cursor-not-allowed"
                    >
                      {isDeleting ? "削除中..." : "削除"}
                    </button>
                  </div>
                </div>
              </div>
            </SimpleBox>
          ))
        )}
      </div>

      {/* ページネーション */}
      {pagination && pagination.total_pages > 1 && (
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
              {currentPage} / {pagination.total_pages}
            </span>
          </div>

          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pagination.total_pages}
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
