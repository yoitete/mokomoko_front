import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/Button/Button";
import Toast from "@/components/Toast/Toast";
import { TitleSection } from "./TitleSection";
import { DescriptionSection } from "./DescriptionSection";
import { FormFieldsSection } from "./FormFieldsSection";
import { TagsSection } from "./TagsSection";
import { ImageSection } from "./ImageSection";

export type PostFormData = {
  title: string;
  description: string;
  price?: number;
  category: string;
  tags: string[];
  image?: File | null;
};

export type PostFormProps = {
  initialData?: Partial<PostFormData>;
  onSubmit: (data: PostFormData) => Promise<void>;
  loading?: boolean;
  error?: string | null;
  submitButtonText?: string;
  showImageUpload?: boolean;
  currentImageUrl?: string;
};

export const PostForm: React.FC<PostFormProps> = ({
  initialData = {},
  onSubmit,
  loading = false,
  error,
  submitButtonText = "投稿する",
  showImageUpload = true,
  currentImageUrl,
}) => {
  const [formData, setFormData] = useState<PostFormData>({
    title: "",
    description: "",
    price: undefined,
    category: "",
    tags: [],
    image: null,
    ...initialData,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">(
    "success"
  );

  const handleChange = <K extends keyof PostFormData>(
    field: K,
    value: PostFormData[K]
  ) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleImageChange = (file: File | null) => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setToastMessage("タイトルを入力してください");
      setToastType("error");
      setShowToast(true);
      return false;
    }

    if (!formData.category) {
      setToastMessage("カテゴリーを選択してください");
      setToastType("error");
      setShowToast(true);
      return false;
    }

    if (showImageUpload && (!formData.image || formData.image === null)) {
      setToastMessage("画像を選択してください");
      setToastType("error");
      setShowToast(true);
      return false;
    }

    if (!formData.price || formData.price <= 0) {
      setToastMessage("価格を入力してください（1円以上）");
      setToastType("error");
      setShowToast(true);
      return false;
    }

    if (formData.price > 1000000) {
      setToastMessage("価格は100万円以内で入力してください");
      setToastType("error");
      setShowToast(true);
      return false;
    }

    if (!formData.description || !formData.description.trim()) {
      setToastMessage("説明を入力してください");
      setToastType("error");
      setShowToast(true);
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      console.error("投稿エラー:", err);
      setToastMessage("投稿中にエラーが発生しました。");
      setToastType("error");
      setShowToast(true);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8 space-y-8">
          {/* タイトルセクション */}
          <TitleSection data={formData} onChange={handleChange} />

          {/* 画像アップロードセクション */}
          <ImageSection
            data={formData}
            onChange={handleChange}
            onImageChange={handleImageChange}
            previewUrl={previewUrl}
            currentImageUrl={currentImageUrl}
            showImageUpload={showImageUpload}
          />

          {/* フォームセクション */}
          <FormFieldsSection data={formData} onChange={handleChange} />

          {/* タグ入力セクション */}
          <TagsSection data={formData} onChange={handleChange} />

          {/* 説明セクション */}
          <DescriptionSection data={formData} onChange={handleChange} />

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
                  {submitButtonText.replace("する", "中...")}
                </div>
              ) : (
                submitButtonText
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* トースト通知 */}
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        duration={5000}
      />
    </>
  );
};
