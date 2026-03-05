import React, { useState } from "react";
import { PostFormData, PostFormSectionProps } from "./types";

const MATERIAL_OPTIONS = [
  "低反発",
  "高反発",
  "羽毛",
  "ポリエステル",
  "そばがら",
  "ラテックス",
];
const SLEEPING_POSITION_OPTIONS = ["仰向け", "横向き", "うつ伏せ"];
const HEIGHT_OPTIONS = ["低め", "普通", "高め"];
const ORDER_TYPE_OPTIONS = ["フルオーダーメイド", "セミオーダーメイド"];

interface SelectionFieldProps {
  label: string;
  options: string[];
  value: string[] | undefined;
  fieldKey: keyof PostFormData;
  onChange: PostFormSectionProps["onChange"];
}

const SelectionField: React.FC<SelectionFieldProps> = ({
  label,
  options,
  value = [],
  fieldKey,
  onChange,
}) => {
  const otherValues = value.filter((v) => !options.includes(v));
  const [isOther, setIsOther] = useState(otherValues.length > 0);
  const [otherText, setOtherText] = useState(otherValues.join(", "));

  const isSelected = (option: string) => value.includes(option);

  const handleToggle = (option: string) => {
    let newValue: string[];
    if (isSelected(option)) {
      newValue = value.filter((v) => v !== option);
    } else {
      newValue = [...value, option];
    }
    onChange(fieldKey, newValue.length > 0 ? newValue : undefined);
  };

  const handleOtherClick = () => {
    if (isOther) {
      // その他を解除: その他テキストを除外
      setIsOther(false);
      const newValue = value.filter((v) => options.includes(v));
      setOtherText("");
      onChange(fieldKey, newValue.length > 0 ? newValue : undefined);
    } else {
      setIsOther(true);
    }
  };

  const handleOtherTextChange = (text: string) => {
    setOtherText(text);
    const presetValues = value.filter((v) => options.includes(v));
    const otherValues = text
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const newValue = [...presetValues, ...otherValues];
    onChange(fieldKey, newValue.length > 0 ? newValue : undefined);
  };

  return (
    <div className="space-y-2">
      <label
        className="block text-sm font-semibold text-[#5A4A4A]"
        style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
      >
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => handleToggle(option)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
              isSelected(option)
                ? "bg-[#7E6565] text-white shadow-sm"
                : "bg-[#F5F0F0] text-[#5A4A4A] border border-[#C4B5B5] hover:bg-[#E2D8D8]"
            }`}
            style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
          >
            {option}
          </button>
        ))}
        <button
          type="button"
          onClick={handleOtherClick}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
            isOther
              ? "bg-[#7E6565] text-white shadow-sm"
              : "bg-[#F5F0F0] text-[#5A4A4A] border border-[#C4B5B5] hover:bg-[#E2D8D8]"
          }`}
          style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
        >
          その他
        </button>
      </div>
      {isOther && (
        <input
          type="text"
          placeholder="その他"
          className="w-full px-3 py-2.5 border border-[#C4B5B5] rounded-xl focus:border-[#7E6565] focus:ring-[#7E6565] transition-all duration-200 text-sm"
          style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
          value={otherText}
          onChange={(e) => handleOtherTextChange(e.target.value)}
        />
      )}
    </div>
  );
};

// 単一選択フィールド
interface SingleSelectFieldProps {
  label: string;
  options: string[];
  value: string | undefined;
  fieldKey: keyof PostFormData;
  onChange: PostFormSectionProps["onChange"];
}

const SingleSelectField: React.FC<SingleSelectFieldProps> = ({
  label,
  options,
  value,
  fieldKey,
  onChange,
}) => {
  const [isOther, setIsOther] = useState(
    value ? !options.includes(value) : false,
  );
  const [otherText, setOtherText] = useState(
    value && !options.includes(value) ? value : "",
  );

  const handleSelect = (option: string) => {
    if (value === option) {
      onChange(fieldKey, undefined);
    } else {
      setIsOther(false);
      setOtherText("");
      onChange(fieldKey, option);
    }
  };

  const handleOtherClick = () => {
    if (isOther) {
      setIsOther(false);
      setOtherText("");
      onChange(fieldKey, undefined);
    } else {
      setIsOther(true);
      onChange(fieldKey, otherText || undefined);
    }
  };

  const handleOtherTextChange = (text: string) => {
    setOtherText(text);
    onChange(fieldKey, text || undefined);
  };

  return (
    <div className="space-y-2">
      <label
        className="block text-sm font-semibold text-[#5A4A4A]"
        style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
      >
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => handleSelect(option)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
              !isOther && value === option
                ? "bg-[#7E6565] text-white shadow-sm"
                : "bg-[#F5F0F0] text-[#5A4A4A] border border-[#C4B5B5] hover:bg-[#E2D8D8]"
            }`}
            style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
          >
            {option}
          </button>
        ))}
        <button
          type="button"
          onClick={handleOtherClick}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
            isOther
              ? "bg-[#7E6565] text-white shadow-sm"
              : "bg-[#F5F0F0] text-[#5A4A4A] border border-[#C4B5B5] hover:bg-[#E2D8D8]"
          }`}
          style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
        >
          その他
        </button>
      </div>
      {isOther && (
        <input
          type="text"
          placeholder="その他"
          className="w-full px-3 py-2.5 border border-[#C4B5B5] rounded-xl focus:border-[#7E6565] focus:ring-[#7E6565] transition-all duration-200 text-sm"
          style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
          value={otherText}
          onChange={(e) => handleOtherTextChange(e.target.value)}
        />
      )}
    </div>
  );
};

export const SelectionFieldsSection: React.FC<PostFormSectionProps> = ({
  data,
  onChange,
}) => {
  return (
    <div className="space-y-4">
      <SelectionField
        label="素材"
        options={MATERIAL_OPTIONS}
        value={data.material}
        fieldKey="material"
        onChange={onChange}
      />
      <SelectionField
        label="寝姿勢"
        options={SLEEPING_POSITION_OPTIONS}
        value={data.sleeping_position}
        fieldKey="sleeping_position"
        onChange={onChange}
      />
      <SelectionField
        label="高さ"
        options={HEIGHT_OPTIONS}
        value={data.height}
        fieldKey="height"
        onChange={onChange}
      />
      <SingleSelectField
        label="オーダーメイド"
        options={ORDER_TYPE_OPTIONS}
        value={data.order_type}
        fieldKey="order_type"
        onChange={onChange}
      />
    </div>
  );
};
