"use client";

import React, { useEffect, useState, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { usePosts } from "@/hooks/usePosts";
import { useGet } from "@/hooks/useSWRAPI";
import { Post } from "@/hooks/usePosts";
import Button from "@/components/Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faPlus,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

interface Combination {
  title: string;
  description: string;
  price?: number;
  category: string;
  tags: string[];
  image?: File;
}

interface PostUpdateData {
  title: string;
  description: string;
  price?: number;
  season: string;
  tags: string[];
  image?: File;
}

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
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { updatePost, loading, error } = usePosts();

  // 既存の投稿データを取得
  const {
    data: postData,
    error: postError,
    isLoading: postLoading,
  } = useGet<Post>(`/posts/${postId}`);

  // 投稿データが読み込まれたらフォームに設定
  useEffect(() => {
    if (postData) {
      setCombination({
        title: postData.title || "",
        description: postData.description || "",
        price: postData.price,
        category: postData.season || "",
        tags: postData.tags || [],
      });
      setTags(postData.tags || []);
    }
  }, [postData]);

  // 権限チェック：投稿の所有者のみ編集可能
  useEffect(() => {
    if (postData && userId && postData.user_id !== userId) {
      alert("この投稿を編集する権限がありません。");
      router.push("/mypage/posts");
    }
  }, [postData, userId, router]);

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

  // 画像選択ハンドラー
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleChange("image", file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

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

    if (!isUserDataReady || !userId) {
      alert(
        "ユーザー情報の取得に失敗しました。ページを再読み込みしてください。"
      );
      return;
    }

    try {
      // 投稿データを準備
      const postData: PostUpdateData = {
        title: combination.title,
        description: combination.description || "",
        price: combination.price,
        season: combination.category,
        tags: combination.tags,
        image: combination.image,
      };

      // 投稿を更新
      await updatePost(parseInt(postId), postData);

      alert("投稿が更新されました！");
      router.push("/mypage/posts");
    } catch (err) {
      console.error("投稿更新エラー:", err);
      alert("投稿の更新中にエラーが発生しました。");
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/mypage/posts")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">投稿を編集</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* タイトル */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              タイトル <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={combination.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="毛布のタイトルを入力してください"
            />
          </div>

          {/* 説明 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              説明
            </label>
            <textarea
              value={combination.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="毛布の詳細な説明を入力してください"
            />
          </div>

          {/* 価格 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              価格（円）
            </label>
            <input
              type="number"
              min="0"
              value={combination.price || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (
                  value === "" ||
                  (parseInt(value) >= 0 && !isNaN(parseInt(value)))
                ) {
                  handleChange("price", value ? parseInt(value) : undefined);
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="価格を入力してください（任意）"
            />
          </div>

          {/* 季節 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              季節 <span className="text-red-500">*</span>
            </label>
            <select
              value={combination.category}
              onChange={(e) => handleChange("category", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">季節を選択してください</option>
              <option value="spring">春</option>
              <option value="summer">夏</option>
              <option value="autumn">秋</option>
              <option value="winter">冬</option>
              <option value="spring-summer">春・夏</option>
              <option value="autumn-winter">秋・冬</option>
            </select>
          </div>

          {/* タグ */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              タグ
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagKeyPress}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="タグを入力してEnterキーを押してください"
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
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* 画像 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              画像
            </label>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {previewUrl && (
              <div className="mt-4">
                <img
                  src={previewUrl}
                  alt="プレビュー"
                  className="w-32 h-32 object-cover rounded-lg"
                />
              </div>
            )}
            {postData?.images?.[0] && !previewUrl && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">現在の画像:</p>
                <img
                  src={postData.images[0]}
                  alt="現在の画像"
                  className="w-32 h-32 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          {/* エラー表示 */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* ボタン */}
          <div className="flex gap-4">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
            >
              {loading ? "更新中..." : "投稿を更新"}
            </Button>
            <Button
              onClick={() => router.push("/mypage/posts")}
              variant="outline"
              className="flex-1"
            >
              キャンセル
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
