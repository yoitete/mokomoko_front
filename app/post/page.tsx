/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faTimes } from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/Button/Button";
import { usePosts, CreatePostWithImageData } from "@/hooks/usePosts";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import Link from "next/link";
import Toast from "@/components/Toast/Toast";

interface Combination {
  title: string;
  description?: string;
  image?: File;
  price?: number;
  category?: string;
  tags?: string[];
}

export default function Post() {
  const {
    isUnauthenticated,
    loading: authLoading,
    userId,
    isUserDataReady,
  } = useCurrentUser();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [combination, setCombination] = useState<Combination>({
    title: "",
    description: "",
    price: undefined,
    category: "",
    tags: [],
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">(
    "success"
  );
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { createPostWithImage, loading, error } = usePosts();

  const handleChange = <K extends keyof Combination>(
    field: K,
    value: Combination[K]
  ) => setCombination({ ...combination, [field]: value });

  // タグ追加関数
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      handleChange("tags", newTags);
      setTagInput("");
    }
  };

  // タグ削除関数
  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
    handleChange("tags", newTags);
  };

  // Enterキーでタグ追加
  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = async () => {
    // バリデーション
    if (!combination.title.trim()) {
      setToastMessage("タイトルを入力してください");
      setToastType("error");
      setShowToast(true);
      return;
    }

    if (!combination.category) {
      setToastMessage("カテゴリーを選択してください");
      setToastType("error");
      setShowToast(true);
      return;
    }

    if (!combination.image) {
      setToastMessage("画像を選択してください");
      setToastType("error");
      setShowToast(true);
      return;
    }

    if (!combination.price || combination.price <= 0) {
      setToastMessage("価格を入力してください（1円以上）");
      setToastType("error");
      setShowToast(true);
      return;
    }

    if (!combination.description || !combination.description.trim()) {
      setToastMessage("説明を入力してください");
      setToastType("error");
      setShowToast(true);
      return;
    }

    if (!isUserDataReady || !userId) {
      setToastMessage(
        "ユーザー情報の取得に失敗しました。ページを再読み込みしてください。"
      );
      setToastType("error");
      setShowToast(true);
      return;
    }

    try {
      // 投稿データを準備
      const postData: CreatePostWithImageData = {
        user_id: userId, // ログインユーザーのIDを使用
        title: combination.title,
        description: combination.description || "",
        price: combination.price,
        season: combination.category,
        tags: combination.tags,
        image: combination.image, // 画像ファイルを追加
      };

      // 投稿を作成
      await createPostWithImage(postData);

      // トースト通知を表示
      setToastMessage("投稿が完了しました！");
      setToastType("success");
      setShowToast(true);

      // フォームをリセット
      setCombination({
        title: "",
        description: "",
        price: undefined,
        category: "",
        tags: [],
      });
      setTags([]);
      setPreviewUrl(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch (err) {
      console.error("投稿エラー:", err);
      setToastMessage("投稿中にエラーが発生しました。");
      setToastType("error");
      setShowToast(true);
    }
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
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8 space-y-8">
            {/* タイトルセクション */}
            <div className="space-y-2">
              <label
                className="block text-lg font-semibold text-gray-800"
                style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
              >
                タイトル <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={20}
                placeholder="魅力的なタイトルを入力してください"
                className="w-full px-4 py-3 border border-[#C4B5B5] rounded-lg focus:border-[#7E6565] focus:ring-[#7E6565] transition-all duration-200 text-lg"
                style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                value={combination.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
              <div className="flex justify-end items-center">
                <p className="text-sm font-medium text-gray-600">
                  {combination.title.length}/20文字
                </p>
              </div>
            </div>

            {/* 画像アップロードセクション */}
            <div className="space-y-4">
              <label
                className="block text-lg font-semibold text-gray-800"
                style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
              >
                投稿画像 <span className="text-red-500">*</span>
              </label>
              <div className="flex justify-center">
                <div
                  className="w-64 h-64 border-2 border-dashed border-gray-300 rounded-xl overflow-hidden hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 cursor-pointer group"
                  onClick={() => {
                    inputRef.current?.click();
                  }}
                >
                  {previewUrl ? (
                    <div className="relative w-full h-full bg-white flex items-center justify-center">
                      <img
                        src={previewUrl}
                        alt="選択された画像"
                        className="w-full h-full object-cover rounded-lg"
                        onLoad={() =>
                          console.log("画像読み込み成功:", previewUrl)
                        }
                        onError={(e) => {
                          console.log("画像読み込みエラー:", e);
                          console.log("エラーの詳細:", e.target);
                        }}
                      />
                      <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                        画像選択済み
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center group-hover:bg-blue-50 transition-colors duration-200">
                      <FontAwesomeIcon
                        icon={faUpload}
                        className="text-gray-400 text-4xl mb-3 group-hover:text-blue-500 transition-colors duration-200"
                      />
                      <span className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors duration-200">
                        画像をクリックして選択
                      </span>
                      <span className="text-xs text-gray-400 mt-1">
                        JPG, PNG, GIF対応
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                ref={inputRef}
                id="imageUpload"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  console.log("=== ファイル選択開始 ===");
                  console.log("ファイル選択:", file);
                  console.log("previewUrl現在の値:", previewUrl);

                  if (file) {
                    console.log("ファイル名:", file.name);
                    console.log("ファイルサイズ:", file.size, "bytes");
                    console.log("ファイルタイプ:", file.type);
                    console.log("ファイルの最後の変更日:", file.lastModified);

                    handleChange("image", file);
                    const url = URL.createObjectURL(file);
                    console.log("生成されたプレビューURL:", url);
                    console.log(
                      "URLが有効かチェック:",
                      url.startsWith("blob:")
                    );

                    setPreviewUrl(url);
                    console.log("setPreviewUrl実行完了");
                  } else {
                    console.log("ファイルが選択されていません");
                  }
                  console.log("=== ファイル選択終了 ===");
                }}
              />
            </div>

            {/* フォームセクション */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* カテゴリー */}
              <div className="space-y-2">
                <label
                  className="block text-lg font-semibold text-gray-800"
                  style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
                >
                  カテゴリー <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-4 py-3 border border-[#C4B5B5] rounded-lg focus:border-[#7E6565] focus:ring-[#7E6565] transition-all duration-200 text-lg h-14"
                  style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
                  value={combination.category ?? ""}
                  onChange={(e) => handleChange("category", e.target.value)}
                >
                  <option value="">カテゴリーを選択してください</option>
                  <option value="spring-summer">春・夏</option>
                  <option value="autumn-winter">秋・冬</option>
                  <option value="christmas">クリスマス</option>
                  <option value="exam-support">受験応援</option>
                  <option value="mothers-day">母の日</option>
                  <option value="new-life-support">新生活応援</option>
                  <option value="fathers-day">父の日</option>
                  <option value="halloween">ハロウィン</option>
                  <option value="new-arrivals">新着情報</option>
                </select>
              </div>

              {/* 価格 */}
              <div className="space-y-2">
                <label
                  className="block text-lg font-semibold text-gray-800"
                  style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
                >
                  価格（円） <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">
                    ¥
                  </span>
                  <input
                    type="number"
                    min="1"
                    inputMode="numeric"
                    placeholder="価格を入力してください（必須）"
                    className="w-full pl-8 pr-4 py-3 border border-[#C4B5B5] rounded-lg focus:border-[#7E6565] focus:ring-[#7E6565] transition-all duration-200 text-lg h-14"
                    style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                    value={combination.price ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      const numericValue = value.replace(/[^0-9]/g, "");
                      handleChange(
                        "price",
                        numericValue === "" ? undefined : Number(numericValue)
                      );
                    }}
                  />
                </div>
              </div>
            </div>

            {/* タグ入力セクション */}
            <div className="space-y-4">
              <label
                className="block text-lg font-semibold text-gray-800"
                style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
              >
                タグ
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="タグを入力してEnterキーで追加"
                  className="flex-1 px-4 py-3 border border-[#C4B5B5] rounded-lg focus:border-[#7E6565] focus:ring-[#7E6565] transition-all duration-200 text-lg"
                  style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagKeyPress}
                />
                <Button
                  onClick={addTag}
                  size="md"
                  className="px-6"
                  disabled={!tagInput.trim() || tags.includes(tagInput.trim())}
                >
                  追加
                </Button>
              </div>

              {/* タグ表示 */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 text-sm rounded-full hover:bg-blue-200 transition-colors duration-200"
                    >
                      #{tag}
                      <button
                        onClick={() => removeTag(index)}
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                      >
                        <FontAwesomeIcon icon={faTimes} size="xs" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 説明セクション */}
            <div className="space-y-2">
              <label
                className="block text-lg font-semibold text-gray-800"
                style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
              >
                説明 <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="ふわふわの触りごごちでとてもこれ一枚でも暖かい毛布です...（必須）"
                className="w-full px-4 py-3 border border-[#C4B5B5] rounded-lg focus:border-[#7E6565] focus:ring-[#7E6565] transition-all duration-200 resize-none text-lg"
                style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                rows={5}
                value={combination.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>

            {/* エラー表示 */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-lg">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faTimes} className="mr-2" />
                  {error}
                </div>
              </div>
            )}

            {/* 投稿ボタン */}
            <div className="flex justify-center pt-6">
              <Button
                onClick={handleSubmit}
                size="lg"
                className="min-w-[240px] py-4 text-lg font-semibold cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    投稿中...
                  </div>
                ) : (
                  "投稿する"
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* トースト通知 */}
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        duration={5000}
      />
    </div>
  );
}
