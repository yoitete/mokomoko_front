import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/Button/Button";
import Toast from "@/components/Toast/Toast";
import { TitleSection } from "./TitleSection";
import { DescriptionSection } from "./DescriptionSection";
import { FormFieldsSection } from "./FormFieldsSection";
import { SelectionFieldsSection } from "./SelectionFieldsSection";
import { TagsSection } from "./TagsSection";
import { ImageSection } from "./ImageSection";
import { PostFormData } from "./types";

export type { PostFormData } from "./types";

export type PostFormProps = {
  initialData?: Partial<PostFormData>;
  onSubmit: (data: PostFormData) => Promise<void>;
  onSuccess?: () => void;
  loading?: boolean;
  error?: string | null;
  submitButtonText?: string;
  showImageUpload?: boolean;
  currentImageUrl?: string;
};

export const PostForm: React.FC<PostFormProps> = ({
  initialData = {},
  onSubmit,
  onSuccess,
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
    tags: [],
    image: null,
    material: [],
    sleeping_position: [],
    height: [],
    order_type: undefined,
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
    setFormData((prev) => ({ ...prev, [field]: value }));
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
      onSuccess?.();
    } catch (err: unknown) {
      console.error("投稿エラー:", err);
      const axiosErr = err as { response?: { status?: number; data?: unknown }; message?: string; code?: string };
      const status = axiosErr?.response?.status;
      const detail = axiosErr?.response?.data;
      const code = axiosErr?.code;
      console.error("投稿エラー詳細:", { status, detail, code, message: axiosErr?.message });

      let message = "投稿中にエラーが発生しました。";
      if (status) {
        message += ` (${status})`;
      } else if (code === "ERR_NETWORK") {
        message = "ネットワークエラー: APIサーバーに接続できません。";
      }
      setToastMessage(message);
      setToastType("error");
      setShowToast(true);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 space-y-5">
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

          {/* 素材・寝姿勢・高さ選択セクション */}
          <SelectionFieldsSection data={formData} onChange={handleChange} />

          {/* 価格セクション */}
          <FormFieldsSection data={formData} onChange={handleChange} />

          {/* タグ入力セクション */}
          <TagsSection data={formData} onChange={handleChange} />

          {/* 説明セクション */}
          <DescriptionSection data={formData} onChange={handleChange} />

          {/* エラー表示 */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faTimes} className="mr-2 text-xs" />
                {error}
              </div>
            </div>
          )}

          {/* 投稿ボタン */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleSubmit}
              size="md"
              className="min-w-[200px] py-3 text-sm font-semibold cursor-pointer shadow-sm hover:shadow-md transition-all duration-200"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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
