"use client";

import { useState } from "react";

/* ───────────────── icon components (inline SVGs, no deps) ───────────────── */

function SearchIcon() {
  return (
    <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
    </svg>
  );
}

function RocketIcon() {
  return (
    <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
    </svg>
  );
}

function CheckCircle() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
  );
}

/* ───────────────────────── main page component ───────────────────────────── */

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection.");
    }
    setLoading(false);
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* ── Background Blobs ── */}
      <div className="blob top-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-500/20" />
      <div className="blob top-[40%] right-[-10%] w-[400px] h-[400px] bg-cyan-500/15" style={{ animationDelay: "3s" }} />
      <div className="blob bottom-[-5%] left-[30%] w-[350px] h-[350px] bg-purple-500/15" style={{ animationDelay: "5s" }} />

      {/* ── Navigation ── */}
      <nav className="glass-strong fixed top-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
              L
            </div>
            <span className="text-xl font-bold">
              Lead<span className="gradient-text">Gen</span>
            </span>
          </div>
          <a
            href="#waitlist"
            className="px-5 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Join Waitlist
          </a>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="hero-gradient relative pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="animate-fade-in-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-cyan-400 mb-8">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Launching Soon — Join the Waitlist
          </div>

          {/* Headline */}
          <h1 className="animate-fade-in-up-delay-1 text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-6">
            Stop Hunting for Leads.
            <br />
            <span className="gradient-text">Start Closing Deals.</span>
          </h1>

          {/* Subheadline */}
          <p className="animate-fade-in-up-delay-2 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            LeadGen finds local businesses <strong className="text-white">without websites or social media</strong> in
            any region — so freelancers like you can pitch them first with a
            ready-made proposal.
          </p>

          {/* CTA / Waitlist Form */}
          <div className="animate-fade-in-up-delay-3" id="waitlist">
            {!submitted ? (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 w-full px-5 py-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  id="waitlist-email"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="glow-button w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
                  id="waitlist-submit"
                >
                  {loading ? (
                    <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <>
                      Get Early Access <ArrowRight />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="glass rounded-2xl p-6 max-w-md mx-auto text-center">
                <div className="text-4xl mb-3">🎉</div>
                <h3 className="text-xl font-bold text-white mb-2">
                  You&apos;re on the list!
                </h3>
                <p className="text-slate-400">
                  We&apos;ll notify you when LeadGen launches. Get ready to land
                  more clients.
                </p>
              </div>
            )}
            {error && (
              <p className="text-sm text-red-400 mt-3 animate-fade-in-up">{error}</p>
            )}
            <p className="text-xs text-slate-500 mt-4">
              No spam. Unsubscribe anytime. Join freelancers already waiting.
            </p>
          </div>
        </div>
      </section>

      {/* ── Problem Section ── */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-2xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
              Sound familiar? 😩
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                "Spending hours Googling businesses in an area",
                "Manually checking if each one has a website",
                "Searching Instagram & Facebook for their handles",
                "Building proposals from scratch every single time",
              ].map((pain, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 text-slate-300"
                >
                  <span className="text-red-400 text-xl mt-0.5">✗</span>
                  <span>{pain}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-8 border-t border-slate-700 text-center">
              <p className="text-lg text-slate-300">
                Freelancers waste{" "}
                <strong className="text-white">5–10 hours per week</strong> on
                lead research.
                <br />
                <span className="gradient-text font-semibold">
                  LeadGen does it in seconds.
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How <span className="gradient-text">LeadGen</span> Works
            </h2>
            <p className="text-slate-400 text-lg max-w-lg mx-auto">
              Three steps. Zero wasted hours. More clients.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <SearchIcon />,
                step: "01",
                title: "Search Any Region",
                desc: "Enter a business type and location. LeadGen scans Google Maps for every matching business in that area.",
              },
              {
                icon: <FilterIcon />,
                step: "02",
                title: "Filter The Goldmines",
                desc: "Instantly see which businesses have no website, no Instagram, no Facebook. These are YOUR leads.",
              },
              {
                icon: <RocketIcon />,
                step: "03",
                title: "Send a Proposal",
                desc: "Generate a preview website or social profile for any business and send it as a pitch — in one click.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="feature-card glass rounded-2xl p-8 group cursor-default"
              >
                <div className="text-indigo-400 mb-4 group-hover:text-cyan-400 transition-colors">
                  {feature.icon}
                </div>
                <div className="text-xs font-mono text-slate-500 mb-2 tracking-widest">
                  STEP {feature.step}
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">
                  {feature.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── For Who Section ── */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Built for <span className="gradient-text">Freelancers</span> Who
            Hustle
          </h2>
          <p className="text-slate-400 text-lg mb-12 max-w-lg mx-auto">
            Whether you build websites, manage social media, or design brands —
            LeadGen finds your next client.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
            {[
              "Web designers & developers",
              "Social media managers",
              "Digital marketing freelancers",
              "Brand & graphic designers",
              "SEO consultants",
              "Small agency owners",
            ].map((who, i) => (
              <div
                key={i}
                className="flex items-center gap-3 glass rounded-xl px-5 py-4"
              >
                <span className="text-emerald-400">
                  <CheckCircle />
                </span>
                <span className="text-slate-200">{who}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass rounded-3xl p-10 md:p-14 relative overflow-hidden">
            {/* background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 pointer-events-none" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Land More Clients?
              </h2>
              <p className="text-slate-400 text-lg mb-8 max-w-lg mx-auto">
                Join the waitlist and be the first to access LeadGen when we
                launch. Early adopters get{" "}
                <strong className="text-white">free Pro access</strong> for the
                first month.
              </p>
              {!submitted ? (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto"
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 w-full px-5 py-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    id="cta-email"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="glow-button w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
                    id="cta-submit"
                  >
                    {loading ? (
                      <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <>
                        Join Free <ArrowRight />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="text-emerald-400 font-semibold text-lg flex items-center justify-center gap-2">
                  <CheckCircle /> You&apos;re on the list! 🚀
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-800 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs">
              L
            </div>
            <span className="font-semibold">LeadGen</span>
          </div>
          <p className="text-sm text-slate-500">
            © 2026 LeadGen. Built for freelancers, by freelancers.
          </p>
        </div>
      </footer>
    </main>
  );
}
