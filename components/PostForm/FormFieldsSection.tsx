import React from "react";

export type PostFormData = {
  title: string;
  description: string;
  price?: number;
  category: string;
  tags: string[];
  image?: File | null;
};

export type PostFormSectionProps = {
  data: PostFormData;
  onChange: <K extends keyof PostFormData>(
    field: K,
    value: PostFormData[K]
  ) => void;
  onImageChange?: (file: File | null) => void;
  previewUrl?: string | null;
  showImageUpload?: boolean;
};

export const FormFieldsSection: React.FC<PostFormSectionProps> = ({
  data,
  onChange,
}) => {
  const handlePriceChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    const numValue = numericValue === "" ? undefined : Number(numericValue);
    onChange("price", numValue);
  };

  return (
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
          value={data.category ?? ""}
          onChange={(e) => onChange("category", e.target.value)}
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
            max="1000000"
            inputMode="numeric"
            placeholder="価格を入力してください（1円〜100万円）"
            className="w-full pl-8 pr-4 py-3 border border-[#C4B5B5] rounded-lg focus:border-[#7E6565] focus:ring-[#7E6565] transition-all duration-200 text-lg h-14"
            style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
            value={data.price ?? ""}
            onChange={(e) => handlePriceChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
