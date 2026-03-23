"use client";

import { useState } from "react";
import type { SearchResult } from "@/lib/types";
import { ProposalPreviewModal } from "@/components/ProposalPreviewModal";

export default function SearchPage() {
  const [query, setQuery] = useState("restaurant");
  const [location, setLocation] = useState("Chennai");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [onlyNoWebsite, setOnlyNoWebsite] = useState(true);
  const [onlyNoSocial, setOnlyNoSocial] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [source, setSource] = useState<"google" | "openstreetmap" | "demo" | "">("");
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);

  async function runSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, location }),
    });
    const data = await res.json();
    setResults(data.results ?? []);
    setSource(data.source ?? "");
    setLoading(false);
  }

  const filtered = results.filter((r) => {
    if (onlyNoWebsite && r.hasWebsite) return false;
    if (onlyNoSocial && r.hasSocialMedia) return false;
    return true;
  });

  async function saveLead(result: SearchResult) {
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        place_id: result.placeId,
        name: result.name,
        address: result.formattedAddress,
        phone: result.nationalPhoneNumber,
        website: result.websiteUri,
        rating: result.rating,
        has_online_presence: result.hasOnlinePresence,
        status: "new",
      }),
    });
    setSaveMsg(`Saved: ${result.name}`);
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-black tracking-tight tracking-tighter">Lead <span className="gradient-text">Search</span></h1>
        <p className="text-sm text-slate-400 font-medium">Find your next high-ticket client with precision.</p>
      </div>
      {source ? (
        <p className="text-xs text-slate-400">
          Data source:{" "}
          {source === "google"
            ? "Google Places API"
            : source === "openstreetmap"
              ? "OpenStreetMap (real public data)"
              : "Demo data mode"}
        </p>
      ) : null}
      {saveMsg ? <p className="text-sm text-emerald-400">{saveMsg}</p> : null}
      <form onSubmit={runSearch} className="glass-card p-6 rounded-2xl grid md:grid-cols-4 gap-4 items-center border border-white/5">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="px-4 py-3 rounded-xl bg-surface-900 border border-white/10 focus:border-primary/50 outline-none transition text-sm font-medium"
          placeholder="Business type (e.g. Clinic)"
        />
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="px-4 py-3 rounded-xl bg-surface-900 border border-white/10 focus:border-primary/50 outline-none transition text-sm font-medium"
          placeholder="Location (e.g. London)"
        />
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-3 text-xs font-bold text-slate-400 cursor-pointer group">
            <input type="checkbox" className="accent-primary" checked={onlyNoWebsite} onChange={(e) => setOnlyNoWebsite(e.target.checked)} />
            NO WEBSITE
          </label>
          <label className="flex items-center gap-3 text-xs font-bold text-slate-400 cursor-pointer group">
            <input type="checkbox" className="accent-primary" checked={onlyNoSocial} onChange={(e) => setOnlyNoSocial(e.target.checked)} />
            NO SOCIAL
          </label>
        </div>
        <button disabled={loading} className="w-full py-3.5 rounded-xl bg-white text-black font-black hover:scale-[1.02] active:scale-[0.98] transition shadow-xl disabled:opacity-50">
          {loading ? "SCANNING..." : "SCAN AREA"}
        </button>
      </form>

      <div className="glass rounded-2xl overflow-hidden border border-white/5">
        <table className="w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              <th className="text-left p-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Business</th>
              <th className="text-left p-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Location</th>
              <th className="text-left p-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Assets</th>
              <th className="text-left p-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Rating</th>
              <th className="text-right p-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((item) => (
              <tr key={item.placeId} className="group hover:bg-white/[0.02] transition">
                <td className="p-5">
                  <div className="font-bold text-slate-200">{item.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">{item.nationalPhoneNumber ?? "N/A"}</div>
                </td>
                <td className="p-5 text-slate-400 font-medium">{item.formattedAddress}</td>
                <td className="p-5">
                  <div className="flex gap-2">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${item.hasWebsite ? 'bg-slate-800 text-slate-500' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                      WEB: {item.hasWebsite ? 'YES' : 'NONE'}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${item.hasSocialMedia ? 'bg-slate-800 text-slate-500' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                      SOC: {item.hasSocialMedia ? 'YES' : 'NONE'}
                    </span>
                  </div>
                </td>
                <td className="p-5 font-bold text-slate-300">{item.rating ?? "-"}</td>
                <td className="p-5">
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => saveLead(item)} className="px-4 py-2 rounded-lg bg-surface-800 hover:bg-surface-700 text-xs font-bold transition">
                      SAVE
                    </button>
                    <button onClick={() => setSelectedResult(item)} className="px-4 py-2 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 text-xs font-black transition">
                      PITCH
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 ? (
              <tr>
                <td className="p-4 text-slate-500" colSpan={5}>
                  Run a search to get leads.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {selectedResult && (
        <ProposalPreviewModal 
          result={selectedResult} 
          onClose={() => setSelectedResult(null)} 
        />
      )}
    </div>
  );
}
