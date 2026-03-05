import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/Button/Button";
import { PostFormSectionProps } from "./types";

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
        className="block text-sm font-semibold text-[#5A4A4A]"
        style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
      >
        タグ
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="低反発 羽毛 ポリエステル"
          className="flex-1 px-3 py-2.5 border border-[#C4B5B5] rounded-xl focus:border-[#7E6565] focus:ring-[#7E6565] transition-all duration-200 text-sm"
          style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyPress={handleTagKeyPress}
        />
        <Button
          onClick={addTag}
          size="sm"
          className="px-4"
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F5F0F0] text-[#7E6565] text-xs rounded-full hover:bg-[#E2D8D8] transition-colors duration-200"
            >
              #{tag}
              <button
                onClick={() => removeTag(index)}
                className="text-[#7E6565] hover:text-[#5A4A4A] transition-colors duration-200"
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
