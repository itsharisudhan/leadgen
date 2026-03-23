"use client";

import { useEffect, useState } from "react";
import type { Proposal } from "@/lib/types";

export default function ProposalsPage() {
  const [items, setItems] = useState<Proposal[]>([]);

  useEffect(() => {
    fetch("/api/proposals")
      .then((res) => res.json())
      .then((data) => setItems(data.proposals ?? []));
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Proposals</h1>
      <div className="rounded-xl border border-slate-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-900/80">
            <tr>
              <th className="text-left p-3">Template</th>
              <th className="text-left p-3">Lead</th>
              <th className="text-left p-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-slate-800">
                <td className="p-3">{item.template}</td>
                <td className="p-3">{item.lead_id}</td>
                <td className="p-3">{new Date(item.created_at).toLocaleString()}</td>
              </tr>
            ))}
            {items.length === 0 ? (
              <tr>
                <td className="p-4 text-slate-500" colSpan={3}>
                  No proposals yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
