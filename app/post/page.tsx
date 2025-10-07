"use client";

import React from "react";
import Button from "@/components/Button/Button";
import { usePosts, CreatePostWithImageData } from "@/hooks/usePosts";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import Link from "next/link";
import { PostForm, PostFormData } from "@/components/PostForm/PostForm";

export default function Post() {
  const {
    isUnauthenticated,
    loading: authLoading,
    userId,
    isUserDataReady,
  } = useCurrentUser();

  const { createPostWithImage, loading, error } = usePosts();

  const handleSubmit = async (formData: PostFormData) => {
    if (!isUserDataReady || !userId) {
      throw new Error(
        "ユーザー情報の取得に失敗しました。ページを再読み込みしてください。"
      );
    }

    // 投稿データを準備
    const postData: CreatePostWithImageData = {
      user_id: userId,
      title: formData.title,
      description: formData.description || "",
      price: formData.price,
      season: formData.category,
      tags: formData.tags,
      image: formData.image || undefined,
    };

    // 投稿を作成
    await createPostWithImage(postData);
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
      <div className="mt-10">
        <div className="mb-4">
          <div
            className="mt-5 text-center text-3xl font-bold tracking-wide text-[#5A4A4A]"
            style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
          >
            新規投稿
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <PostForm
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
          submitButtonText="投稿する"
          showImageUpload={true}
        />
      </main>
    </div>
  );
}
