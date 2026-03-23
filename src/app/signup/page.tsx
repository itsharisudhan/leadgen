"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function SignupPage() {
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

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-xl border border-slate-800 p-6 bg-slate-900/70 space-y-4">
        <h1 className="text-2xl font-semibold">Create account</h1>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700" placeholder="Email" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700" placeholder="Password" />
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <button disabled={loading} className="w-full px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500 disabled:opacity-70">
          {loading ? "Creating account..." : "Sign up"}
        </button>
        <p className="text-sm text-slate-400">
          Already have an account? <Link className="text-indigo-400" href="/login">Login</Link>
        </p>
      </form>
    </main>
  );
}
