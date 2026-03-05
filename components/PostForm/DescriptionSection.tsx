import React from "react";
import { PostFormSectionProps } from "./types";

export const DescriptionSection: React.FC<PostFormSectionProps> = ({
  data,
  onChange,
}) => {
  return (
    <div className="space-y-2">
      <label
        className="block text-sm font-semibold text-[#5A4A4A]"
        style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
      >
        説明 <span className="text-red-500">*</span>
      </label>
      <textarea
        placeholder="低反発タイプの枕を購入しました。頭と首にフィットしてくれる感じがあり、朝起きたときの首の疲れが軽減された気がします。高さもちょうど良く、仰向けでも横向きでも寝やすいです。（必須）"
        className="w-full px-3 py-2.5 border border-[#C4B5B5] rounded-xl focus:border-[#7E6565] focus:ring-[#7E6565] transition-all duration-200 resize-none text-sm"
        style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
        rows={5}
        value={data.description}
        onChange={(e) => onChange("description", e.target.value)}
      />
    </div>
  );
};
