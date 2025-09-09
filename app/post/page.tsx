/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/Button/Button";
import { usePosts, CreatePostWithImageData } from "@/hooks/usePosts";

interface Combination {
  title: string;
  description?: string;
  image?: File;
  price?: number;
  category?: string;
}

export default function Post() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [combination, setCombination] = useState<Combination>({
    title: "",
    description: "",
    price: undefined,
    category: "",
  });
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { createPostWithImage, loading, error } = usePosts();

  const handleChange = <K extends keyof Combination>(
    field: K,
    value: Combination[K]
  ) => setCombination({ ...combination, [field]: value });

  const handleSubmit = async () => {
    // バリデーション
    if (!combination.title.trim()) {
      alert("タイトルを入力してください");
      return;
    }

    if (!combination.category) {
      alert("季節を選択してください");
      return;
    }

    try {
      // 投稿データを準備
      const postData: CreatePostWithImageData = {
        user_id: 1, // TODO: 実際のユーザーIDに置き換え
        title: combination.title,
        description: combination.description || "",
        price: combination.price,
        season: combination.category,
        image: combination.image, // 画像ファイルを追加
      };

      // 投稿を作成
      await createPostWithImage(postData);

      alert("投稿が完了しました！");

      // フォームをリセット
      setCombination({
        title: "",
        description: "",
        price: undefined,
        category: "",
      });
      setPreviewUrl(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch (err) {
      console.error("投稿エラー:", err);
      alert("投稿中にエラーが発生しました。");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="bg-white border-b border-gray-200 py-6 text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">新規投稿</h1>
      </header>

      <main className="max-w-4xl mx-auto space-y-6">
        {/* タイトル */}
        <div>
          <label className="block font-semibold mb-2">タイトル</label>
          <input
            type="text"
            maxLength={20}
            placeholder="タイトルを入力してください（20文字以内）"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={combination.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />
          <p className="text-xs text-right text-gray-500 mt-1">
            {combination.title.length}/20文字
          </p>
        </div>
      </main>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          投稿画像
        </label>
        <div className="flex justify-center">
          <div
            className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden hover:border-gray-400 transition-colors cursor-pointer"
            onClick={() => {
              inputRef.current?.click();
            }}
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="選択された画像"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
                <FontAwesomeIcon
                  icon={faUpload}
                  className="text-gray-400 text-3xl mb-2"
                />
                <span className="text-sm text-gray-500">画像を選択</span>
              </div>
            )}
          </div>
        </div>
        <input
          type="file"
          accept="image/*"
          ref={inputRef}
          id="imageUpload"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleChange("image", file);
              setPreviewUrl(URL.createObjectURL(file));
            }
          }}
        />
      </div>

      <div className="space-y-4">
        {/* 季節カテゴリー */}
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={combination.category ?? ""}
          onChange={(e) => handleChange("category", e.target.value)}
        >
          <option value="">季節を選択</option>
          <option value="spring">春 </option>
          <option value="summer">夏 </option>
          <option value="autumn">秋 </option>
          <option value="winter">冬 </option>
          <option value="all-season">通年 </option>
        </select>

        {/* 値段 */}
        <input
          type="number"
          min="0"
          inputMode="numeric"
          placeholder="価格（例：3000）"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        {/* 説明 */}
        <textarea
          placeholder="説明"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={4}
          value={combination.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />

        {/* エラー表示 */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* 投稿ボタン */}
        <div className="flex justify-center mt-8">
          <Button
            onClick={handleSubmit}
            size="lg"
            className="min-w-[200px] cursor-pointer"
            disabled={loading}
          >
            {loading ? "投稿中..." : "投稿する"}
          </Button>
        </div>
      </div>
    </div>
  );
}
