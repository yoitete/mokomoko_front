"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteLeft } from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/Button/Button";

interface BioSectionProps {
  bio: string;
  isEditing: boolean;
  onBioChange: (value: string) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  showActions?: boolean; // アクションボタンの表示制御
}

export default function BioSection({
  bio,
  isEditing,
  onBioChange,
  onEdit,
  onSave,
  onCancel,
  showActions = true, // デフォルトは表示
}: BioSectionProps) {
  return (
    <div className="space-y-4">
      {/* 自己紹介 */}
      <div>
        <label
          className="block text-sm font-medium text-[#5A4A4A] mb-2"
          style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
        >
          <FontAwesomeIcon icon={faQuoteLeft} className="mr-2" />
          自己紹介
        </label>
        {isEditing ? (
          <textarea
            placeholder="自己紹介を入力してください"
            value={bio}
            onChange={(e) => onBioChange(e.target.value)}
            className="w-full p-3 border border-[#C4B5B5] rounded-lg focus:border-[#7E6565] focus:ring-[#7E6565] resize-none"
            rows={6}
          />
        ) : (
          <div className="p-3 bg-gray-50 border border-[#C4B5B5] rounded-lg min-h-[150px]">
            <p className="text-[#5A4A4A] whitespace-pre-wrap">
              {bio || "自己紹介が設定されていません"}
            </p>
          </div>
        )}
      </div>

      {/* アクションボタン */}
      {showActions && (
        <div className="space-y-3">
          {isEditing ? (
            <div className="flex space-x-3">
              <Button onClick={onSave} className="flex-1">
                保存
              </Button>
              <Button variant="outline" onClick={onCancel} className="flex-1">
                キャンセル
              </Button>
            </div>
          ) : (
            <Button onClick={onEdit} className="w-full">
              自己紹介を編集
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
