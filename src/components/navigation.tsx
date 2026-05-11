"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Overview", href: "/" },
  { label: "Modules & Tasks", href: "/modules" },
  { label: "Handoffs", href: "/handoffs" },
  { label: "Workspaces", href: "/workspaces" },
  { label: "Replanning", href: "/replanning" },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-4">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            pathname === item.href
              ? "bg-gray-100 text-gray-900"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
