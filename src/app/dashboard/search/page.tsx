"use client";

import { useState } from "react";
import type { SearchResult } from "@/lib/types";

export default function SearchPage() {
  const [query, setQuery] = useState("restaurant");
  const [location, setLocation] = useState("Chennai");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [onlyNoWebsite, setOnlyNoWebsite] = useState(true);

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
    setLoading(false);
  }

  const filtered = onlyNoWebsite ? results.filter((r) => !r.hasWebsite) : results;

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
    alert("Lead saved");
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Lead Search</h1>
      <form onSubmit={runSearch} className="grid md:grid-cols-4 gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="px-3 py-2 rounded bg-slate-900 border border-slate-700"
          placeholder="Business type"
        />
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="px-3 py-2 rounded bg-slate-900 border border-slate-700"
          placeholder="Location"
        />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={onlyNoWebsite} onChange={(e) => setOnlyNoWebsite(e.target.checked)} />
          No Website only
        </label>
        <button disabled={loading} className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500 disabled:opacity-70">
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      <div className="rounded-xl border border-slate-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-900/80">
            <tr>
              <th className="text-left p-3">Business</th>
              <th className="text-left p-3">Address</th>
              <th className="text-left p-3">Website</th>
              <th className="text-left p-3">Rating</th>
              <th className="text-left p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.placeId} className="border-t border-slate-800">
                <td className="p-3">
                  <div>{item.name}</div>
                  <div className="text-xs text-slate-500">{item.nationalPhoneNumber ?? "No phone"}</div>
                </td>
                <td className="p-3">{item.formattedAddress}</td>
                <td className="p-3">{item.hasWebsite ? "Yes" : "No (Hot Lead)"}</td>
                <td className="p-3">{item.rating ?? "-"}</td>
                <td className="p-3">
                  <button onClick={() => saveLead(item)} className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700">
                    Save
                  </button>
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
    </div>
  );
}
