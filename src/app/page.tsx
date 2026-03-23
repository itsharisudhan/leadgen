"use client";

import Link from "next/link";
import { useState } from "react";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "ok" | "error">("idle");

  async function joinWaitlist(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setState(res.ok ? "ok" : "error");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <nav className="border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-xl font-bold">
            Lead<span className="gradient-text">Gen</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-900">
              Login
            </Link>
            <a href="#waitlist" className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500">
              Join Waitlist
            </a>
          </div>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Find Local Businesses
            <br />
            <span className="gradient-text">That Need Your Service</span>
          </h1>
          <p className="mt-5 text-slate-400">
            Search by niche and location, detect businesses without websites, save high-intent leads, and generate pitch-ready proposals.
          </p>
          <div className="mt-6 flex gap-3">
            <Link href="/signup" className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500">
              Start Free
            </Link>
            <Link href="/dashboard" className="px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-900">
              Open Dashboard
            </Link>
          </div>
        </div>
        <div className="rounded-xl border border-slate-800 p-5 bg-slate-900/60">
          <h3 className="font-medium">What you can do now</h3>
          <ul className="mt-3 text-sm text-slate-300 space-y-2 list-disc pl-5">
            <li>Search leads from Google Places API (or demo data fallback)</li>
            <li>Save, update, and export leads</li>
            <li>Create and export proposals to PDF</li>
            <li>Use with Supabase auth + database</li>
          </ul>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-semibold mb-4">Pricing</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-800 p-6 bg-slate-900/40">
            <h3 className="font-medium text-lg">Free</h3>
            <p className="text-slate-400 mt-1">For solo freelancers getting started.</p>
            <p className="mt-4 text-3xl font-bold">$0</p>
            <ul className="mt-4 text-sm text-slate-300 space-y-2">
              <li>Basic lead search</li>
              <li>Save up to 100 leads</li>
              <li>CSV export</li>
            </ul>
          </div>
          <div className="rounded-xl border border-indigo-600 p-6 bg-indigo-950/30">
            <h3 className="font-medium text-lg">Pro</h3>
            <p className="text-slate-300 mt-1">For agencies and serious outbound.</p>
            <p className="mt-4 text-3xl font-bold">$29/mo</p>
            <ul className="mt-4 text-sm text-slate-200 space-y-2">
              <li>Unlimited searches</li>
              <li>Advanced filters</li>
              <li>Proposal templates + PDF export</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="waitlist" className="max-w-3xl mx-auto px-6 pb-20">
        <form onSubmit={joinWaitlist} className="rounded-xl border border-slate-800 p-6 bg-slate-900/60 space-y-3">
          <h2 className="text-xl font-semibold">Join the waitlist</h2>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
            placeholder="you@example.com"
            className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700"
          />
          <button className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500" disabled={state === "loading"}>
            {state === "loading" ? "Submitting..." : "Join"}
          </button>
          {state === "ok" ? <p className="text-sm text-emerald-400">You are on the list.</p> : null}
          {state === "error" ? <p className="text-sm text-red-400">Could not submit right now.</p> : null}
        </form>
      </section>
    </main>
  );
}
