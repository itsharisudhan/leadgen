"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, X } from "lucide-react";

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
    <main className="min-h-screen bg-surface-950 text-white selection:bg-primary selection:text-white">
      {/* Background Blobs */}
      <div className="blob w-[500px] h-[500px] bg-primary/20 top-[-100px] left-[-100px]" />
      <div className="blob w-[400px] h-[400px] bg-accent/10 bottom-[10%] right-[-50px]" />

      <nav className="glass sticky top-0 z-50 border-b border-white/5 py-4">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black tracking-tighter hover:opacity-80 transition">
            LEAD<span className="gradient-text">GEN</span>
          </Link>
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link href="/login" className="hover:text-primary transition">Login</Link>
            <a href="#waitlist" className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary-dark transition shadow-lg shadow-primary/25">
              Join Waitlist
            </a>
          </div>
        </div>
      </nav>

      <section className="relative max-w-7xl mx-auto px-6 pt-32 pb-40 overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative z-10 animate-fade-in-up">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black tracking-widest text-primary mb-8 uppercase">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              The Future of Sales Engagement
            </div>
            <h1 className="text-7xl md:text-8xl font-black leading-[0.85] tracking-tighter mb-8">
              UNLEASH<br />
              <span className="gradient-text">HYPER-GROWTH.</span>
            </h1>
            <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-xl mb-12">
              The only platform that identifies hidden business opportunities and generates pitch-perfect proposals in seconds.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link href="/signup" className="px-10 py-5 rounded-full bg-white text-black font-black hover:scale-105 active:scale-95 transition shadow-[0_20px_50px_rgba(255,255,255,0.1)]">
                JOIN THE ELITE
              </Link>
              <Link href="/dashboard" className="px-10 py-5 rounded-full glass border border-white/10 font-bold hover:bg-white/5 transition flex items-center gap-2 group">
                LIVE DEMO <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
            
            <div className="mt-16 flex items-center gap-8 grayscale opacity-50">
              <div className="text-xs font-bold tracking-widest">TRUSTED BY AGENCIES AT</div>
              {/* Mock logos */}
              <div className="flex gap-6 items-center font-black text-lg italic opacity-70">
                <span>FORBES</span>
                <span>WIRED</span>
                <span>TC</span>
              </div>
            </div>
          </div>

          <div className="relative animate-fade-in-up-delay-1">
            <div className="relative z-10 glass-card p-2 rounded-[2.5rem] shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700">
              <div className="rounded-[2.2rem] overflow-hidden">
                <img 
                  src="/hero.png" 
                  alt="LeadGen Dashboard Preview" 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            {/* Background elements */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/20 blur-[120px] rounded-full -z-10" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-accent/20 blur-[100px] rounded-full -z-10" />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-32">
        <div className="text-center mb-16">
          <h2 className="text-[10px] font-black tracking-[0.3em] text-primary uppercase mb-4">The Workflow</h2>
          <h3 className="text-4xl font-bold tracking-tight">Three steps to <span className="gradient-text">Domination.</span></h3>
        </div>
        <div className="grid md:grid-cols-3 gap-12">
          {[
            { step: "01", title: "Scan & Identify", desc: "Our engine crawls local business data to find gaps in their digital presence." },
            { step: "02", title: "Generate Mockups", desc: "A custom landing page and pitch are autonomously generated for your target." },
            { step: "03", title: "Command the Deal", desc: "Send your high-converting proposal and watch the revenue roll in." }
          ].map((item, i) => (
            <div key={i} className="relative group">
              <div className="text-6xl font-black text-white/5 absolute -top-10 -left-4 group-hover:text-primary/10 transition-colors">{item.step}</div>
              <h4 className="text-xl font-bold mb-4 relative z-10">{item.title}</h4>
              <p className="text-slate-400 leading-relaxed text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-32">
        <h2 className="text-3xl font-bold mb-10 text-center tracking-tight">Simple, Transparent <span className="gradient-text">Pricing</span></h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="glass-card rounded-3xl p-8 border border-white/5 bg-white/5">
            <h3 className="text-xl font-bold">Free</h3>
            <p className="text-slate-400 mt-2 text-sm">Perfect for solo freelancers.</p>
            <p className="mt-6 text-4xl font-black">$0<span className="text-sm font-normal text-slate-500">/mo</span></p>
            <ul className="mt-8 space-y-4 text-sm text-slate-300">
              <li className="flex items-center gap-3">
                <Check size={16} className="text-primary" /> 100 Saved Leads
              </li>
              <li className="flex items-center gap-3">
                <Check size={16} className="text-primary" /> Basic Search
              </li>
              <li className="flex items-center gap-3 text-slate-500">
                <X size={16} /> AI Pitch Preview
              </li>
            </ul>
          </div>
          <div className="glass-card rounded-3xl p-8 border border-primary/20 bg-primary/5 relative overflow-hidden">
            <div className="absolute top-4 right-4 px-3 py-1 bg-primary text-[10px] font-bold rounded-full">POPULAR</div>
            <h3 className="text-xl font-bold">Pro</h3>
            <p className="text-slate-400 mt-2 text-sm">For scaling agencies.</p>
            <p className="mt-6 text-4xl font-black">$29<span className="text-sm font-normal text-slate-500">/mo</span></p>
            <ul className="mt-8 space-y-4 text-sm text-slate-200">
              <li className="flex items-center gap-3">
                <Check size={16} className="text-primary" /> Unlimited Leads
              </li>
              <li className="flex items-center gap-3">
                <Check size={16} className="text-primary" /> Advanced Filters
              </li>
              <li className="flex items-center gap-3">
                <Check size={16} className="text-primary" /> AI Pitch Previews
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section id="waitlist" className="max-w-xl mx-auto px-6 pb-32">
        <form onSubmit={joinWaitlist} className="glass-card rounded-[2rem] p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent" />
          <h2 className="text-3xl font-bold tracking-tight">Join the Elite</h2>
          <p className="text-slate-400 mt-3 mb-8">Get early access to LeadGen Pro and start closing more deals.</p>
          <div className="flex flex-col gap-3">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              placeholder="you@example.com"
              className="w-full px-6 py-4 rounded-xl glass border border-white/10 focus:border-primary/50 transition outline-none text-center font-medium"
            />
            <button className="w-full py-4 rounded-xl bg-primary hover:bg-primary-dark transition font-bold shadow-lg shadow-primary/30" disabled={state === "loading"}>
              {state === "loading" ? "Submitting..." : "Get Early Access"}
            </button>
          </div>
          {state === "ok" ? <p className="mt-4 text-emerald-400 animate-fade-in-up">Welcome to the inner circle.</p> : null}
          {state === "error" ? <p className="mt-4 text-rose-400">Something went wrong. Try again.</p> : null}
        </form>
      </section>
    </main>
  );
}
