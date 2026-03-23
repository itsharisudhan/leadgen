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
    <div className="glass-card rounded-2xl p-5 group">
      <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{label}</p>
      <div className="flex items-baseline gap-2 mt-2">
        <p className="text-3xl font-bold bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">{value}</p>
      </div>
      {hint ? <p className="text-[10px] text-slate-500 mt-2 font-medium italic">{hint}</p> : null}
    </div>
  );
}
