import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faXmark } from "@fortawesome/free-solid-svg-icons";
import { PostFormSectionProps } from "./types";

const MAX_IMAGES = 5;

interface ImageSectionProps extends PostFormSectionProps {
  currentImageUrls?: string[];
  removedExistingIndexes?: number[];
  onRemoveExisting?: (index: number) => void;
}

export const ImageSection: React.FC<ImageSectionProps> = ({
  data,
  onChange,
  onImageChange,
  previewUrls = [],
  currentImageUrls = [],
  removedExistingIndexes = [],
  onRemoveExisting,
  showImageUpload = true,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  // 表示中の既存画像（削除されたものを除外）
  const visibleExisting = currentImageUrls
    .map((url, i) => ({ url, index: i }))
    .filter(({ index }) => !removedExistingIndexes.includes(index));

  const totalCount = visibleExisting.length + data.images.length;
  const canAddMore = totalCount < MAX_IMAGES;
  const remainingSlots = MAX_IMAGES - totalCount;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const newFiles = Array.from(fileList);

    if (remainingSlots <= 0) {
      setWarning(`画像は最大${MAX_IMAGES}枚までです`);
      e.target.value = "";
      return;
    }

    if (newFiles.length > remainingSlots) {
      setWarning(`あと${remainingSlots}枚まで追加できます（${newFiles.length}枚中${remainingSlots}枚を追加しました）`);
    } else {
      setWarning(null);
    }

    const filesToAdd = newFiles.slice(0, remainingSlots);
    const updated = [...data.images, ...filesToAdd];
    onChange("images", updated);
    onImageChange?.(updated);

    e.target.value = "";
  };

  const handleRemoveNew = (index: number) => {
    const updated = data.images.filter((_, i) => i !== index);
    onChange("images", updated);
    onImageChange?.(updated);
    setWarning(null);
  };

  if (!showImageUpload) {
    return null;
  }

  return (
    <div className="space-y-3">
      <label
        className="block text-sm font-semibold text-[#5A4A4A]"
        style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
      >
        投稿画像 <span className="text-red-500">*</span>
        <span className={`text-xs font-normal ml-2 ${totalCount >= MAX_IMAGES ? "text-red-500" : "text-[#7E6565]"}`}>
          {totalCount}/{MAX_IMAGES}枚
        </span>
      </label>

      {warning && (
        <p className="text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg">
          {warning}
        </p>
      )}

      <div className="grid grid-cols-3 gap-2">
        {/* 既存画像 */}
        {visibleExisting.map(({ url, index }) => (
          <div key={`existing-${index}`} className="relative aspect-square rounded-xl overflow-hidden border-2 border-[#C4B5B5]">
            <img
              src={url}
              alt={`既存画像${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => {
                onRemoveExisting?.(index);
                setWarning(null);
              }}
              className="absolute top-1 right-1 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer"
            >
              <FontAwesomeIcon icon={faXmark} className="text-xs" />
            </button>
            <div className="absolute bottom-1 left-1 bg-black/50 text-white px-1.5 py-0.5 rounded text-[10px]">
              現在
            </div>
          </div>
        ))}

        {/* 新規画像 */}
        {data.images.map((_, index) => (
          <div key={`new-${index}`} className="relative aspect-square rounded-xl overflow-hidden border-2 border-[#7E6565]">
            <img
              src={previewUrls[index] || ""}
              alt={`新規画像${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemoveNew(index)}
              className="absolute top-1 right-1 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer"
            >
              <FontAwesomeIcon icon={faXmark} className="text-xs" />
            </button>
            <div className="absolute bottom-1 left-1 bg-[#7E6565]/80 text-white px-1.5 py-0.5 rounded text-[10px]">
              新規
            </div>
          </div>
        ))}

        {/* 追加ボタン（枠が残っている場合のみ） */}
        {canAddMore && (
          <div
            className="aspect-square border-2 border-dashed border-[#C4B5B5] rounded-xl overflow-hidden hover:border-[#7E6565] hover:bg-[#F5F0F0] transition-all duration-200 cursor-pointer group flex flex-col items-center justify-center"
            onClick={() => inputRef.current?.click()}
          >
            <FontAwesomeIcon
              icon={faUpload}
              className="text-[#C4B5B5] text-xl mb-1 group-hover:text-[#7E6565] transition-colors duration-200"
            />
            <span className="text-[10px] text-gray-400 group-hover:text-[#7E6565] transition-colors duration-200">
              画像を追加
            </span>
            <span className="text-[10px] text-gray-300 mt-0.5">
              あと{remainingSlots}枚
            </span>
          </div>
        )}
      </div>

      <input
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        multiple
        ref={inputRef}
        id="imageUpload"
        className="hidden"
        onChange={handleImageChange}
      />
    </div>
  );
};
