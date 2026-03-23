import { getCurrentUser } from "@/lib/auth";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <section className="rounded-xl border border-slate-800 p-4">
        <h2 className="font-medium mb-2">Profile</h2>
        <p className="text-sm text-slate-400">Email: {user?.email ?? "Demo mode user"}</p>
      </section>

      <section className="rounded-xl border border-slate-800 p-4">
        <h2 className="font-medium mb-2">API Configuration</h2>
        <p className="text-sm text-slate-400">
          Configure `GOOGLE_PLACES_API_KEY` in your deployment environment to enable live Google Places search.
        </p>
      </section>

      <section className="rounded-xl border border-slate-800 p-4">
        <h2 className="font-medium mb-2">Plan & Usage</h2>
        <p className="text-sm text-slate-400">Current plan: Free. Upgrade controls can be added next.</p>
      </section>
    </div>
  );
}
