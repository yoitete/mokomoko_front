"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faUser } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface IconOption {
  name: string;
  icon?: IconDefinition;
  image?: string;
  label: string;
  type: "fontawesome" | "image";
}

interface ProfileImageProps {
  profileImage: string | null;
  selectedIcon: string;
  iconOptions: IconOption[];
  isEditing: boolean;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ProfileImage({
  profileImage,
  selectedIcon,
  iconOptions,
  isEditing,
  onImageUpload,
}: ProfileImageProps) {
  const selectedIconOption = iconOptions.find((opt) => opt.name === selectedIcon);

  // デバッグ用ログ
  console.log("ProfileImage - selectedIcon:", selectedIcon);
  console.log("ProfileImage - iconOptions:", iconOptions);
  console.log("ProfileImage - selectedIconOption:", selectedIconOption);
  console.log("ProfileImage - profileImage:", profileImage);

  return (
    <div className="relative">
      <div className="w-16 h-16 rounded-full border-2 border-black overflow-hidden">
        {profileImage ? (
          <Image
            src={profileImage}
            alt="プロフィール画像"
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {selectedIconOption?.type === "image" ? (
              <div className="w-full h-full flex items-center justify-center">
                <Image
                  src={selectedIconOption.image!}
                  alt={selectedIconOption.label}
                  width={60}
                  height={60}
                  className="object-contain"
                />
              </div>
            ) : (
              <FontAwesomeIcon
                icon={selectedIconOption?.icon || faUser}
                size="2x"
                className="text-[#7E6565]"
              />
            )}
          </div>
        )}
      </div>
      {isEditing && (
        <label className="absolute bottom-0 right-0 bg-[#7E6565] text-white rounded-full p-1 cursor-pointer hover:bg-[#6B5555] transition-colors">
          <FontAwesomeIcon icon={faCamera} size="xs" />
          <input
            type="file"
            accept="image/*"
            onChange={onImageUpload}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}
