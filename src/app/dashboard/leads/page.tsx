"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Lead } from "@/lib/types";

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [q, setQ] = useState("");

  async function load() {
    const res = await fetch("/api/leads");
    const data = await res.json();
    setLeads(data.leads ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(
    () => leads.filter((l) => l.name.toLowerCase().includes(q.toLowerCase()) || l.address.toLowerCase().includes(q.toLowerCase())),
    [leads, q],
  );

  async function remove(id: string) {
    await fetch("/api/leads", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await load();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center gap-3 md:justify-between">
        <h1 className="text-2xl font-semibold">Saved Leads</h1>
        <div className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search leads"
            className="px-3 py-2 rounded bg-slate-900 border border-slate-700"
          />
          <a href="/api/leads/export" className="px-3 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-sm">
            Export CSV
          </a>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-900/80">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Rating</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((lead) => (
              <tr key={lead.id} className="border-t border-slate-800">
                <td className="p-3">
                  <div>{lead.name}</div>
                  <div className="text-xs text-slate-500">{lead.address}</div>
                </td>
                <td className="p-3 capitalize">{lead.status.replace("_", " ")}</td>
                <td className="p-3">{lead.rating ?? "-"}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <Link href={`/dashboard/leads/${lead.id}`} className="px-2 py-1 rounded bg-slate-800">
                      Open
                    </Link>
                    <button onClick={() => remove(lead.id)} className="px-2 py-1 rounded bg-red-700/80">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td className="p-4 text-slate-500" colSpan={4}>
                  No leads found yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
