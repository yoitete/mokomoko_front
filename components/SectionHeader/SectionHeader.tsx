import React from "react";

interface SectionHeaderProps {
  title?: string;
  subtitle?: string;
  gradientFrom?: string;
  gradientTo?: string;
  borderColor?: string;
  noBorder?: boolean;
}

export const SectionHeader = ({
  title,
  subtitle,
  gradientFrom = "from-red-700",
  gradientTo = "to-red-900",
  borderColor = "border-green-500",
  noBorder = false,
}: SectionHeaderProps) => {
  return (
    <>
      {title && (
        <div
          className={`mt-5 text-center text-3xl font-bold tracking-wide bg-gradient-to-r ${gradientFrom} ${gradientTo} bg-clip-text text-transparent`}
          style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
        >
          {title}
        </div>
      )}
      {subtitle && (
        <div
          className={`mt-5 ml-4 text-left font-bold ${
            noBorder
              ? "py-2 text-orange-600 text-2xl"
              : `text-[#5A4A4A] border-l-4 ${borderColor} pl-3`
          }`}
          style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
        >
          {subtitle}
        </div>
      )}
    </>
  );
};
