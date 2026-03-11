"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button/Button";
import { usePosts, CreatePostWithImageData } from "@/hooks/usePosts";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import Link from "next/link";
import { PostForm, PostFormData } from "@/components/PostForm/PostForm";
import Toast from "@/components/Toast/Toast";

export default function Post() {
  const router = useRouter();

  // ホーム画面をプリフェッチして投稿後の遷移を高速化
  useEffect(() => {
    router.prefetch("/home");
  }, [router]);

  const {
    isUnauthenticated,
    loading: authLoading,
    userId,
    isUserDataReady,
  } = useCurrentUser();

  const { createPostWithImage, loading, error } = usePosts();

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleSubmit = async (formData: PostFormData) => {
    if (!isUserDataReady || !userId) {
      throw new Error(
        "ユーザー情報の取得に失敗しました。ページを再読み込みしてください。",
      );
    }

    const postData: CreatePostWithImageData = {
      user_id: userId,
      title: formData.title,
      description: formData.description || "",
      price: formData.price,
      tags: formData.tags,
      images: formData.images.length > 0 ? formData.images : undefined,
      material: formData.material,
      sleeping_position: formData.sleeping_position,
      height: formData.height,
      order_type: formData.order_type,
    };

    await createPostWithImage(postData);
  };

  const handleSuccess = () => {
    setToastMessage("投稿しました");
    setShowToast(true);
    setTimeout(() => {
      router.push("/home");
    }, 800);
  };

  // ローディング中の表示
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
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

  return (
    <div className="min-h-screen bg-[#E2D8D8]">
      {/* ヘッダー */}
      <section className="mt-8">
        <h2
          className="text-center text-3xl font-bold tracking-wide bg-gradient-to-r from-red-700 to-red-900 bg-clip-text text-transparent"
          style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
        >
          新規投稿
        </h2>
      </section>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <PostForm
          onSubmit={handleSubmit}
          onSuccess={handleSuccess}
          loading={loading}
          error={error}
          submitButtonText="投稿する"
          showImageUpload={true}
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
