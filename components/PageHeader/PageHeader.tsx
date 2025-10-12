import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

interface PageHeaderProps {
  title: string;
  backHref: string;
  className?: string;
  centerTitle?: boolean;
}

export const PageHeader = ({
  title,
  backHref,
  className = "",
  centerTitle = false,
}: PageHeaderProps) => {
  if (centerTitle) {
    return (
      <div className={`${className}`}>
        <div className="mt-4">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => window.history.back()}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors ml-4"
              >
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  className="text-[#5A4A4A]"
                  size="lg"
                />
              </button>
              <h1
                className="text-3xl font-bold tracking-wide text-center text-[#5A4A4A]"
                style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
              >
                {title}
              </h1>
              <div className="w-10"></div> {/* 右側のスペーサー */}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="mt-6">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <Link href={backHref} className="mr-4 ml-4">
              <FontAwesomeIcon
                icon={faArrowLeft}
                className="text-[#5A4A4A] hover:text-[#6B5555] transition-colors cursor-pointer p-2 hover:bg-gray-100 rounded-full"
                size="lg"
              />
            </Link>
            <h2
              className="text-3xl font-bold tracking-wide text-center text-[#5A4A4A]"
              style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
            >
              {title}
            </h2>
            <div className="w-10"></div> {/* 右側のスペーサー */}
          </div>
        </div>
      </div>
    </div>
  );
};
