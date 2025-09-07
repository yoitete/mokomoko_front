/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

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

  const handleChange = <K extends keyof Combination>(
    field: K,
    value: Combination[K]
  ) => setCombination({ ...combination, [field]: value });

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
          <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden hover:border-gray-400 transition-colors">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="選択された画像"
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => {
                  inputRef.current?.click();
                }}
              />
            ) : (
              <label
                htmlFor="imageUpload"
                className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <FontAwesomeIcon
                  icon={faUpload}
                  className="text-gray-400 text-3xl mb-2"
                />
                <span className="text-sm text-gray-500">画像を選択</span>
              </label>
            )}
          </div>
        </div>
        <input
          type="file"
          accept="image/*"
          ref={inputRef}
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

      {/* 詳細情報 */}
      <div className="space-y-4">
        {/* カテゴリー */}
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={combination.category ?? ""}
          onChange={(e) => handleChange("category", e.target.value)}
        >
          <option value="">カテゴリーを選択</option>
          <optgroup label="素材">
            <option value="fleece">フリース</option>
            <option value="microfiber">マイクロファイバー</option>
            <option value="cotton">コットン</option>
            <option value="wool">ウール</option>
            <option value="gauze">ガーゼ</option>
          </optgroup>
          <optgroup label="厚さ・暖かさ">
            <option value="thin">薄手（夏用）</option>
            <option value="medium">普通（春秋用）</option>
            <option value="thick">厚手（冬用）</option>
            <option value="light">軽量</option>
            <option value="warm">暖かい</option>
          </optgroup>
          <optgroup label="サイズ・用途">
            <option value="single">シングル</option>
            <option value="double">ダブル</option>
            <option value="lap">ひざ掛け</option>
          </optgroup>
        </select>

        {/* 値段 */}
        <input
          type="number"
          placeholder="価格（例：3000）"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={combination.price ?? ""}
          onChange={(e) => handleChange("price", Number(e.target.value))}
        />

        {/* 説明 */}
        <textarea
          placeholder="説明"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={4}
          value={combination.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>
    </div>
  );
}
