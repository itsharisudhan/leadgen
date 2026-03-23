"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { Lead, LeadStatus } from "@/lib/types";

const statuses: LeadStatus[] = ["new", "contacted", "proposal_sent", "won", "lost"];

export default function LeadDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<LeadStatus>("new");

  async function load() {
    const res = await fetch("/api/leads");
    const data = await res.json();
    const found = (data.leads ?? []).find((l: Lead) => l.id === params.id) ?? null;
    setLead(found);
    if (found) {
      setNotes(found.notes ?? "");
      setStatus(found.status);
    }
  }

  useEffect(() => {
    load();
  }, [params.id]);

  async function save() {
    if (!lead) return;
    await fetch("/api/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: lead.id, updates: { notes, status } }),
    });
    router.refresh();
  }

  const mapUrl = useMemo(() => {
    if (!lead) return "";
    return `https://www.google.com/maps?q=${encodeURIComponent(lead.address)}&output=embed`;
  }, [lead]);

  if (!lead) return <p className="text-slate-400">Lead not found.</p>;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-800 p-4">
        <h1 className="text-2xl font-semibold">{lead.name}</h1>
        <p className="text-slate-400 mt-1">{lead.address}</p>
        <p className="text-sm mt-2">Phone: {lead.phone ?? "N/A"}</p>
        <p className="text-sm">Website: {lead.website ?? "No website"}</p>
      </div>

      <div className="rounded-xl border border-slate-800 p-4 space-y-3">
        <h2 className="font-medium">Lead Activity</h2>
        <select value={status} onChange={(e) => setStatus(e.target.value as LeadStatus)} className="px-3 py-2 rounded bg-slate-900 border border-slate-700">
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={5}
          className="w-full rounded bg-slate-900 border border-slate-700 p-3"
          placeholder="Add notes about this lead"
        />
        <button onClick={save} className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500">
          Save updates
        </button>
      </div>

      <div className="rounded-xl border border-slate-800 p-4">
        <h2 className="font-medium mb-3">Map</h2>
        <iframe title="map" src={mapUrl} className="w-full h-72 rounded border-0" loading="lazy" />
      </div>
    </div>
  );
}
