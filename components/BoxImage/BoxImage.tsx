import Image, { StaticImageData } from "next/image";

// 共通化した画像コンポーネント
export const BoxImage = ({
  src,
  alt,
  className = "",
}: {
  src: string | StaticImageData;
  alt: string;
  className?: string;
}) => (
  <Image
    src={src}
    alt={alt}
    width={160}
    height={118}
    className={`object-cover rounded-lg ${className}`}
  />
);
