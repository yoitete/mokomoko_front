"use client";

import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Header() {
  return (
    <div className="bg-[#7E6565] p-4 flex justify-between items-center relative z-50">
      <h1 className="text-5xl font-sans text-[#F1F6F7] mx-auto text-center tracking-wide pl-9 ">
        MokoMoko
      </h1>
      <button className="p-2 rounded-md hover:bg-gray-100">
        <FontAwesomeIcon icon={faBars} size="2x" className="cursor-pointer" />
      </button>
    </div>
  );
}
