"use client";

import { useState } from "react";
import NavMenu from "./NavMenu";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-1/2 z-50 bg-white shadow-md w-[600px] -translate-x-1/2">
      <div className="flex items-center justify-between p-4">
        <div className="w-8" />
        <h1 className="flex-1 text-center text-xl font-bold text-gray-800">
          MokoMoko
        </h1>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          <span className="block w-6 h-0.5 bg-current mb-1"></span>
          <span className="block w-6 h-0.5 bg-current mb-1"></span>
          <span className="block w-6 h-0.5 bg-current"></span>
        </button>
      </div>
      <NavMenu open={open} />
    </header>
  );
}
