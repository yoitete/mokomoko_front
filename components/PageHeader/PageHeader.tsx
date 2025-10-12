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
        <div className="mb-4">
          <div className="mt-5 flex items-center justify-center relative">
            <button
              onClick={() => window.history.back()}
              className="absolute left-0 p-2 hover:bg-gray-100 rounded-full transition-colors"
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
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="mb-4">
        <div className="mt-5 flex items-center">
          <Link href={backHref} className="mr-4">
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="text-[#7E6565] hover:text-[#6B5555] transition-colors cursor-pointer"
              size="lg"
            />
          </Link>
          <h2
            className="text-3xl font-bold tracking-wide text-[#5A4A4A]"
            style={{ fontFamily: "'Kosugi Maru', sans-serif" }}
          >
            {title}
          </h2>
        </div>
      </div>
    </div>
  );
};
