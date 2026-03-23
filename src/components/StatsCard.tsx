export function StatsCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="text-2xl font-semibold mt-2">{value}</p>
      {hint ? <p className="text-xs text-slate-500 mt-2">{hint}</p> : null}
    </div>
  );
}
