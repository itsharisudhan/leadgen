"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      router.push("/dashboard");
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    const nextPath = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("next") : null;
    router.push(nextPath || "/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-surface-950 flex items-center justify-center px-4 relative overflow-hidden font-sans">
      {/* Background Blobs */}
      <div className="blob w-[400px] h-[400px] bg-primary/20 top-[-100px] left-[-100px]" />
      <div className="blob w-[300px] h-[300px] bg-accent/10 bottom-[10%] right-[-50px]" />

      <Link href="/" className="absolute top-12 left-12 text-2xl font-black tracking-tighter hover:opacity-80 transition z-20">
        LEAD<span className="gradient-text">GEN</span>
      </Link>

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        <form onSubmit={onSubmit} className="glass-card rounded-[2rem] p-10 border border-white/5 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tight">Welcome <span className="gradient-text">Back</span></h1>
            <p className="text-sm text-slate-400 font-medium">Initialize your session to resume operations.</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email Protocol</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="w-full px-5 py-3.5 rounded-xl bg-surface-900 border border-white/10 focus:border-primary/50 outline-none transition text-sm font-medium"
                placeholder="operator@network.xyz" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Security Key</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="w-full px-5 py-3.5 rounded-xl bg-surface-900 border border-white/10 focus:border-primary/50 outline-none transition text-sm font-medium"
                placeholder="••••••••" 
              />
            </div>
          </div>

          {error ? (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs font-bold text-rose-400 animate-pulse">
              SIGNAL ERROR: {error}
            </div>
          ) : null}

          <button 
            disabled={loading} 
            className="w-full py-4 rounded-xl bg-white text-black font-black hover:scale-[1.02] active:scale-[0.98] transition shadow-[0_20px_40px_rgba(255,255,255,0.1)] disabled:opacity-70 text-sm uppercase tracking-widest"
          >
            {loading ? "AUTHENTICATING..." : "START SESSION"}
          </button>

          <p className="text-center text-xs text-slate-500 font-medium pt-2">
            New operator? <Link className="text-primary hover:underline font-bold" href="/signup">Establish Signal</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
