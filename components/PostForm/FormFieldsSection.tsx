import React from "react";
import { PostFormSectionProps } from "./types";

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
      {/* 価格 */}
      <div className="space-y-2">
        <label
          className="block text-sm font-semibold text-[#5A4A4A]"
          style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
        >
          価格（円） <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
            ¥
          </span>
          <input
            type="number"
            min="1"
            max="1000000"
            inputMode="numeric"
            placeholder="価格を入力"
            className="w-full pl-7 pr-3 py-2.5 border border-[#C4B5B5] rounded-xl focus:border-[#7E6565] focus:ring-[#7E6565] transition-all duration-200 text-sm"
            style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
            value={data.price ?? ""}
            onChange={(e) => handlePriceChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
