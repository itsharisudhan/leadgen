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
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-slate-400 mt-1">Track your searches, leads, and proposals in one place.</p>
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

      <section className="grid md:grid-cols-3 gap-3">
        <Link href="/dashboard/search" className="rounded-lg border border-slate-800 p-4 hover:bg-slate-900">
          New Search
        </Link>
        <Link href="/dashboard/leads" className="rounded-lg border border-slate-800 p-4 hover:bg-slate-900">
          View Saved Leads
        </Link>
        <Link href="/dashboard/proposals/new" className="rounded-lg border border-slate-800 p-4 hover:bg-slate-900">
          Create Proposal
        </Link>
      </section>

      <section className="rounded-xl border border-slate-800 p-4">
        <h2 className="font-medium">Recent Searches</h2>
        <div className="mt-3 space-y-2">
          {searches.length === 0 ? (
            <p className="text-sm text-slate-500">No searches yet. Start from the Search page.</p>
          ) : (
            searches.map((item) => (
              <div key={item.id} className="text-sm text-slate-300 flex justify-between">
                <span>
                  {item.query} in {item.location}
                </span>
                <span className="text-slate-500">{item.result_count} results</span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
