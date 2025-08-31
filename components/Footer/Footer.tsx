"use client";

import { faHouse, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function Footer() {
  return (
    <div>
      <div className="sticky bg-[#7E6565] p-4 flex justify-between items-center z-50 bottom-0">
        <Link href="/home">
          <FontAwesomeIcon
            icon={faHouse}
            size="2x"
            className="cursor-pointer text-[#F1F6F7]"
          />
        </Link>

        <Link href="/search">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            size="2x"
            className="cursor-pointer text-[#F1F6F7]"
          />
        </Link>

        <Link href="/favorite">
          <FontAwesomeIcon
            icon={faHeart}
            size="2x"
            className="cursor-pointer text-[#F1F6F7]"
          />
        </Link>

        <Link href="/post">
          <FontAwesomeIcon
            icon={faPenToSquare}
            size="2x"
            className="cursor-pointer text-[#F1F6F7]"
          />
        </Link>

        <Link href="/mypage">
          <FontAwesomeIcon
            icon={faUser}
            size="2x"
            className="cursor-pointer text-[#F1F6F7]"
          />
        </Link>
      </div>
    </div>
  );
}
