import React from "react";

export type PostFormData = {
  title: string;
  description: string;
  price?: number;
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

export const DescriptionSection: React.FC<PostFormSectionProps> = ({
  data,
  onChange,
}) => {
  return (
    <div className="space-y-2">
      <label
        className="block text-lg font-semibold text-gray-800"
        style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
      >
        説明 <span className="text-red-500">*</span>
      </label>
      <textarea
        placeholder="低反発タイプの枕を購入しました。頭と首にフィットしてくれる感じがあり、朝起きたときの首の疲れが軽減された気がします。高さもちょうど良く、仰向けでも横向きでも寝やすいです。（必須）"
        className="w-full px-4 py-3 border border-[#C4B5B5] rounded-lg focus:border-[#7E6565] focus:ring-[#7E6565] transition-all duration-200 resize-none text-lg"
        style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
        rows={5}
        value={data.description}
        onChange={(e) => onChange("description", e.target.value)}
      />
    </div>
  );
};
