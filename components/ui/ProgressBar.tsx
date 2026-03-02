export default function ProgressBar({ value01 }: { value01: number }) {
  const v = Math.max(0, Math.min(1, Number(value01) || 0));
  return (
    <div className="h-2 w-full rounded-full bg-white/10">
      <div
        className="h-2 rounded-full bg-gradient-to-r from-sky-400 via-emerald-400 to-amber-300 transition-[width] duration-500 ease-out"
        style={{ width: `${Math.round(v * 100)}%` }}
      />
    </div>
  );
}

