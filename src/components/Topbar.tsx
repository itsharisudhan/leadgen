"use client";

import { useRouter } from "next/navigation";

export function Topbar({ email }: { email?: string }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between px-4 md:px-6">
      <div className="text-sm text-slate-400">Lead Generation Workspace</div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-400 hidden sm:inline">{email ?? "Demo mode"}</span>
        <button
          onClick={logout}
          className="px-3 py-1.5 text-sm rounded-md bg-slate-800 hover:bg-slate-700"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
