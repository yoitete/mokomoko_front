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
  <div className="w-full h-[118px] overflow-hidden rounded-lg">
    <Image
      src={src}
      alt={alt}
      width={160}
      height={118}
      className={`w-full h-full object-cover ${className}`}
      style={{ width: "auto", height: "auto" }}
      unoptimized={true}
    />
  </div>
);
