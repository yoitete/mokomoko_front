import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/Button/Button";

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

export const TagsSection: React.FC<PostFormSectionProps> = ({
  data,
  onChange,
}) => {
  const [tagInput, setTagInput] = useState("");

  const addTag = () => {
    if (tagInput.trim() && !data.tags.includes(tagInput.trim())) {
      const newTags = [...data.tags, tagInput.trim()];
      onChange("tags", newTags);
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    const newTags = data.tags.filter((_, i) => i !== index);
    onChange("tags", newTags);
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="space-y-4">
      <label
        className="block text-lg font-semibold text-gray-800"
        style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
      >
        タグ
      </label>
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="タグを入力してEnterキーで追加"
          className="flex-1 px-4 py-3 border border-[#C4B5B5] rounded-lg focus:border-[#7E6565] focus:ring-[#7E6565] transition-all duration-200 text-lg"
          style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyPress={handleTagKeyPress}
        />
        <Button
          onClick={addTag}
          size="md"
          className="px-6"
          disabled={!tagInput.trim() || data.tags.includes(tagInput.trim())}
        >
          追加
        </Button>
      </div>

      {/* タグ表示 */}
      {data.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {data.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 text-sm rounded-full hover:bg-blue-200 transition-colors duration-200"
            >
              #{tag}
              <button
                onClick={() => removeTag(index)}
                className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faTimes} size="xs" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
