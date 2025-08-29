"use client";

import { faHouse, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Footer() {
  return (
    <div className="sticky bg-[#7E6565] p-4 flex justify-between items-center z-50 bottom-0">
      <FontAwesomeIcon
        icon={faHouse}
        size="2x"
        className="cursor-pointer text-[#F1F6F7]"
      />
      <FontAwesomeIcon
        icon={faMagnifyingGlass}
        size="2x"
        className="cursor-pointer text-[#F1F6F7]"
      />
      <FontAwesomeIcon
        icon={faHeart}
        size="2x"
        className="cursor-pointer text-[#F1F6F7]"
      />
      <FontAwesomeIcon
        icon={faPenToSquare}
        size="2x"
        className="cursor-pointer text-[#F1F6F7]"
      />
      <FontAwesomeIcon
        icon={faUser}
        size="2x"
        className="cursor-pointer text-[#F1F6F7]"
      />
    </div>
  );
}
