"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Users, FileText, Settings } from "lucide-react";

const items = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/dashboard/search", label: "Search", icon: Search },
  { href: "/dashboard/leads", label: "Saved Leads", icon: Users },
  { href: "/dashboard/proposals", label: "Proposals", icon: FileText },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-64 border-r border-slate-800 bg-slate-950/70 md:min-h-screen">
      <div className="p-5 border-b border-slate-800 text-lg font-bold">LeadGen</div>
      <nav className="p-3 space-y-1">
        {items.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                active ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
