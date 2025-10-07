import React, { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

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

interface ImageSectionProps extends PostFormSectionProps {
  currentImageUrl?: string;
}

export const ImageSection: React.FC<ImageSectionProps> = ({
  onChange,
  onImageChange,
  previewUrl,
  currentImageUrl,
  showImageUpload = true,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    onChange("image", file || null);
    onImageChange?.(file || null);
  };

  if (!showImageUpload) {
    return null;
  }

  return (
    <div className="space-y-4">
      <label
        className="block text-lg font-semibold text-gray-800"
        style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
      >
        投稿画像 <span className="text-red-500">*</span>
      </label>
      <div className="flex justify-center">
        <div
          className="w-64 h-64 border-2 border-dashed border-gray-300 rounded-xl overflow-hidden hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 cursor-pointer group"
          onClick={() => {
            inputRef.current?.click();
          }}
        >
          {previewUrl ? (
            <div className="relative w-full h-full bg-white flex items-center justify-center">
              <img
                src={previewUrl}
                alt="選択された画像"
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                画像選択済み
              </div>
            </div>
          ) : currentImageUrl ? (
            <div className="relative w-full h-full bg-white flex items-center justify-center">
              <img
                src={currentImageUrl}
                alt="現在の画像"
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                現在の画像
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center group-hover:bg-blue-50 transition-colors duration-200">
              <FontAwesomeIcon
                icon={faUpload}
                className="text-gray-400 text-4xl mb-3 group-hover:text-blue-500 transition-colors duration-200"
              />
              <span className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors duration-200">
                画像をクリックして選択
              </span>
              <span className="text-xs text-gray-400 mt-1">
                JPG, PNG, GIF対応
              </span>
            </div>
          )}
        </div>
      </div>
      <input
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        ref={inputRef}
        id="imageUpload"
        className="hidden"
        onChange={handleImageChange}
      />
    </div>
  );
};
