"use client";

import React, { useState } from "react";
import NavMenu from "./NavMenu";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4 relative">
        <div className="w-8" />
        <h1 className="flex-1 text-center text-xl font-bold text-gray-800">
          MyBlanket
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
