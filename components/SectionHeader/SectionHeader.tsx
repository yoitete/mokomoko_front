import React from "react";

interface SectionHeaderProps {
  title?: string;
  subtitle?: string;
  gradientFrom?: string;
  gradientTo?: string;
  borderColor?: string;
}

export const SectionHeader = ({
  title,
  subtitle,
  gradientFrom = "from-red-700",
  gradientTo = "to-red-900",
  borderColor = "border-green-500",
}: SectionHeaderProps) => {
  return (
    <>
      {title && (
        <div
          className={`mt-5 text-center text-3xl font-medium font-sans tracking-wide bg-gradient-to-r ${gradientFrom} ${gradientTo} bg-clip-text text-transparent`}
        >
          {title}
        </div>
      )}
      {subtitle && (
        <div
          className={`mt-5 ml-4 text-left font-semibold text-gray-700 border-l-4 ${borderColor} pl-3`}
        >
          {subtitle}
        </div>
      )}
    </>
  );
};
