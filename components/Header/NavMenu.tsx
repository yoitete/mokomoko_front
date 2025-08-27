import React from "react";
import Link from "next/link";

type Props = { open: boolean };

const links = [
  { href: "/", label: "ホーム" },
  { href: "/products", label: "商品一覧" },
  { href: "/special", label: "特集" },
  { href: "/contact", label: "ログアウト" },
];

export default function NavMenu({ open }: Props) {
  return (
    <div
      className={`
        fixed top-0 right-0 h-full w-64 bg-white shadow-lg
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"}
      `}
    >
      <nav className="flex flex-col mt-20 text-gray-700">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="px-4 py-3 hover:bg-gray-100"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
