"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import Image from "next/image";

interface IconOption {
  name: string;
  icon?: IconDefinition;
  image?: string;
  label: string;
  type: "fontawesome" | "image";
}

interface IconSelectorProps {
  iconOptions: IconOption[];
  selectedIcon: string;
  onIconSelect: (iconName: string) => void;
}

export default function IconSelector({
  iconOptions,
  selectedIcon,
  onIconSelect,
}: IconSelectorProps) {
  return (
    <div className="mb-6">
      <label
        className="block text-sm font-medium text-[#5A4A4A] mb-3"
        style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
      >
        アイコンを選択
      </label>
      <div className="grid grid-cols-3 gap-3">
        {iconOptions.map((option) => (
          <button
            key={option.name}
            onClick={() => onIconSelect(option.name)}
            className={`p-2 rounded-lg transition-colors cursor-pointer flex flex-col items-center justify-center ${
              selectedIcon === option.name
                ? "bg-[#7E6565] text-white"
                : "bg-gray-100 text-[#5A4A4A] hover:bg-gray-200"
            }`}
          >
            <div className="w-8 h-8 flex items-center justify-center">
              {option.type === "fontawesome" ? (
                <FontAwesomeIcon icon={option.icon!} size="lg" />
              ) : (
                <Image
                  src={option.image!}
                  alt={option.label}
                  width={28}
                  height={28}
                  className="object-contain"
                />
              )}
            </div>
            <span className="text-xs leading-tight mt-1">
              {option.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
