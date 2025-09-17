"use client";

import { faHouse, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  const homePath = ["/home", "/christmas", "/exam-support"];

  return (
    <div className="sticky bg-[#7E6565] p-4 flex justify-between items-center z-50 bottom-0">
      <Link href="/home">
        <FontAwesomeIcon
          icon={faHouse}
          size="2x"
          className={`cursor-pointer text-[#F1F6F7] ${
            homePath.includes(pathname) ? "text-sky-300" : ""
          }`}
        />
      </Link>

      <Link href="/search">
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          size="2x"
          className={`cursor-pointer text-[#F1F6F7] ${
            pathname === "/search" ? "text-sky-300" : ""
          }`}
        />
      </Link>

      <Link href="/favorite">
        <FontAwesomeIcon
          icon={faHeart}
          size="2x"
          className={`cursor-pointer text-[#F1F6F7] ${
            pathname === "/favorite" ? "text-sky-300" : ""
          }`}
        />
      </Link>

      <Link href="/post">
        <FontAwesomeIcon
          icon={faPenToSquare}
          size="2x"
          className={`cursor-pointer text-[#F1F6F7] ${
            pathname === "/post" ? "text-sky-300" : ""
          }`}
        />
      </Link>

      <Link href="/mypage">
        <FontAwesomeIcon
          icon={faUser}
          size="2x"
          className={`cursor-pointer text-[#F1F6F7] ${
            pathname === "/mypage" ? "text-sky-300" : ""
          }`}
        />
      </Link>
    </div>
  );
}
