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
      <label className="block text-sm font-medium text-[#5A4A4A] mb-3">
        アイコンを選択
      </label>
      <div className="grid grid-cols-3 gap-3 ml-4">
        {iconOptions.map((option) => (
          <button
            key={option.name}
            onClick={() => onIconSelect(option.name)}
            className={`p-3 rounded-lg border-2 transition-colors cursor-pointer w-28 h-20 flex flex-col items-center justify-center ${
              selectedIcon === option.name
                ? "border-[#7E6565] bg-[#7E6565] text-white"
                : "border-gray-300 hover:border-[#7E6565] hover:bg-gray-50"
            }`}
          >
            {option.type === "fontawesome" ? (
              <div className="w-10 h-10 flex items-center justify-center mb-1">
                <FontAwesomeIcon
                  icon={option.icon!}
                  size="lg"
                />
              </div>
            ) : (
              <div className="w-14 h-14 flex items-center justify-center mb-1">
                <Image
                  src={option.image!}
                  alt={option.label}
                  width={44}
                  height={44}
                  className="object-contain"
                />
              </div>
            )}
            <span className="text-xs text-center leading-tight">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
