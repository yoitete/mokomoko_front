"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { usePosts, CreatePostWithImageData } from "@/hooks/usePosts";
import { useGet } from "@/hooks/useSWRAPI";
import { Post } from "@/hooks/usePosts";
import Button from "@/components/Button/Button";
import Link from "next/link";
import { PostForm, PostFormData } from "@/components/PostForm/PostForm";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import Toast from "@/components/Toast/Toast";

export default function EditPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const postId = resolvedParams.id;
  const {
    isUnauthenticated,
    loading: authLoading,
    userId,
    isUserDataReady,
  } = useCurrentUser();

  const { updatePostWithImage, loading, error } = usePosts();

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // 既存の投稿データを取得
  const {
    data: postData,
    error: postError,
    isLoading: postLoading,
  } = useGet<Post>(`/posts/${postId}`);

  // 権限チェック：投稿の所有者のみ編集可能
  useEffect(() => {
    if (postData && userId && postData.user_id !== userId) {
      router.push("/mypage/posts");
    }
  }, [postData, userId, router]);

  const handleSubmit = async (formData: PostFormData) => {
    if (!isUserDataReady || !userId) {
      throw new Error(
        "ユーザー情報の取得に失敗しました。ページを再読み込みしてください。"
      );
    }

    const postUpdateData: CreatePostWithImageData = {
      user_id: userId,
      title: formData.title,
      description: formData.description || "",
      price: formData.price,
      tags: formData.tags,
      image: formData.image || undefined,
    };

    await updatePostWithImage(parseInt(postId), postUpdateData);
  };

  const handleSuccess = () => {
    setToastMessage("投稿を更新しました");
    setShowToast(true);
    setTimeout(() => {
      router.push("/mypage/posts");
    }, 1500);
  };

  // 初期データを準備
  const initialData: Partial<PostFormData> = postData
    ? {
        title: postData.title || "",
        description: postData.description || "",
        price: postData.price,
        tags: postData.tags || [],
        image: null,
      }
    : {};

  // ローディング中の表示
  if (authLoading || postLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">読み込み中...</p>
        </div>
      </div>
    );
  }

  // ログイン前の表示
  if (isUnauthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
            このページはログイン後に表示されます
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            投稿編集機能をご利用いただくには
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

  // エラー表示
  if (postError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
          <h2 className="text-xl font-bold text-red-600 mb-4 text-center">
            エラーが発生しました
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            投稿の読み込みに失敗しました。
            <br />
            投稿が存在しないか、アクセス権限がありません。
          </p>
          <Link href="/mypage/posts">
            <Button className="w-full">投稿管理に戻る</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E2D8D8]">
      {/* ヘッダー */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <PageHeader title="投稿編集" backHref="/mypage/posts" />
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <PostForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onSuccess={handleSuccess}
          loading={loading}
          error={error}
          submitButtonText="投稿を更新"
          showImageUpload={true}
          currentImageUrl={postData?.images?.[0]}
        />
      </main>

      <Toast
        message={toastMessage}
        type="success"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
