import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { listLeads, listProposals, listSearches } from "@/lib/repositories";
import { StatsCard } from "@/components/StatsCard";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const [leads, proposals, searches] = await Promise.all([
    listLeads(user?.id),
    listProposals(user?.id),
    listSearches(user?.id),
  ]);

  return (
    <div className="space-y-8 animate-fade-in-up">
      <section className="flex flex-col gap-1">
        <h1 className="text-4xl font-black tracking-tighter">Dash<span className="gradient-text">board</span></h1>
        <p className="text-sm text-slate-400 font-medium">Overview of your sales pipeline and recent activity.</p>
        <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-surface-800 border border-white/5 text-[10px] font-bold text-slate-500 w-fit uppercase tracking-widest">
          Demo Mode Active
        </div>
      </section>

      <section className="grid md:grid-cols-4 gap-4">
        <StatsCard label="Saved Leads" value={leads.length} />
        <StatsCard label="Proposals" value={proposals.length} />
        <StatsCard label="Recent Searches" value={searches.length} />
        <StatsCard
          label="Profile"
          value={user?.email ?? "Demo"}
          hint={user ? "Authenticated mode" : "No Supabase session"}
        />
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        {[
          { href: "/dashboard/search", label: "START NEW SCAN", desc: "Find high-ticket businesses" },
          { href: "/dashboard/leads", label: "MANAGE LEADS", desc: "Track your sales pipeline" },
          { href: "/dashboard/proposals/new", label: "GENERATE PITCH", desc: "Create AI-powered proposals" }
        ].map((item, i) => (
          <Link key={i} href={item.href} className="glass-card p-6 rounded-2xl group border border-white/5">
            <div className="text-[10px] font-bold text-primary tracking-widest mb-1 group-hover:translate-x-1 transition-transform">{item.label}</div>
            <div className="text-sm text-slate-400 font-medium">{item.desc}</div>
          </Link>
        ))}
      </section>

      <section className="glass-card rounded-2xl overflow-hidden border border-white/5">
        <div className="bg-white/5 p-4 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Recent Activity</h2>
          <Link href="/dashboard/search" className="text-[10px] font-bold text-primary hover:underline transition">VIEW ALL</Link>
        </div>
        <div className="p-4 space-y-3">
          {searches.length === 0 ? (
            <p className="text-sm text-slate-500 italic">No activity yet. Scan an area to begin.</p>
          ) : (
            searches.slice(0, 5).map((item) => (
              <div key={item.id} className="text-sm flex justify-between items-center p-3 rounded-xl hover:bg-white/[0.02] transition">
                <span className="font-bold text-slate-300">
                  {item.query} <span className="text-slate-500 font-normal">in</span> {item.location}
                </span>
                <span className="text-[10px] font-black text-slate-600 px-2 py-1 rounded bg-white/5">
                  {item.result_count} LEADS FOUND
                </span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
