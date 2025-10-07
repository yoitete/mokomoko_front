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

export const TitleSection: React.FC<PostFormSectionProps> = ({
  data,
  onChange,
}) => {
  return (
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
        value={data.title}
        onChange={(e) => onChange("title", e.target.value)}
      />
      <div className="flex justify-end items-center">
        <p className="text-sm font-medium text-gray-600">
          {data.title.length}/20文字
        </p>
      </div>
    </div>
  );
};
