"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@daracademy/ui";

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: "📊" },
  { href: "/dashboard/students", label: "Students", icon: "👤" },
  { href: "/dashboard/guardians", label: "Guardians", icon: "👨‍👩‍👧" },
  { href: "/dashboard/sessions", label: "Sessions", icon: "📅" },
  { href: "/dashboard/titles", label: "Titles", icon: "⭐" },
  { href: "/dashboard/messages", label: "Messages", icon: "💬" },
  { href: "/dashboard/analytics", label: "Analytics", icon: "📈" },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-navy text-ivory border-r border-slate-blue/20 h-screen flex flex-col">
      {/* Logo */}
      <div className="px-6 py-8 border-b border-slate-blue/20">
        <h1 className="text-2xl font-bold">DarAcademy</h1>
        <p className="text-sm text-slate-blue/60 mt-1">Admin Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                isActive
                  ? "bg-slate-blue text-ivory font-medium"
                  : "text-slate-blue/70 hover:bg-slate-blue/10 hover:text-ivory",
              )}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-6 border-t border-slate-blue/20">
        <p className="text-xs text-slate-blue/50 text-center">
          © 2024 DarAcademy
        </p>
      </div>
    </aside>
  );
};
