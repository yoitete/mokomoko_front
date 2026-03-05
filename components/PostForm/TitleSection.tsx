import React from "react";
import { PostFormSectionProps } from "./types";

export const TitleSection: React.FC<PostFormSectionProps> = ({
  data,
  onChange,
}) => {
  return (
    <div className="space-y-2">
      <label
        className="block text-sm font-semibold text-[#5A4A4A]"
        style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
      >
        タイトル <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        maxLength={20}
        placeholder="羽毛枕"
        className="w-full px-3 py-2.5 border border-[#C4B5B5] rounded-xl focus:border-[#7E6565] focus:ring-[#7E6565] transition-all duration-200 text-sm"
        style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
        value={data.title}
        onChange={(e) => onChange("title", e.target.value)}
      />
      <div className="flex justify-end items-center">
        <p className="text-xs text-gray-400">{data.title.length}/20文字</p>
      </div>
    </div>
  );
};
