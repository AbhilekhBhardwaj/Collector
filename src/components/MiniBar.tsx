type MiniBarProps = {
  values: number[];
  labels?: string[];
  max?: number;
  className?: string;
};

export default function MiniBar({ values, labels, max, className }: MiniBarProps) {
  const mx = Math.max(1, max ?? Math.max(0, ...values));
  return (
    <div className={className}>
      <div className="flex items-end gap-2 h-24">
        {values.map((v, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div
              className="w-6 rounded-sm bg-gradient-to-t from-indigo-500 to-emerald-400"
              style={{ height: `${(v / mx) * 100}%` }}
              title={`${labels?.[i] ?? i + 1}: ${v}`}
            />
            {labels && (
              <div className="text-[10px] text-black/60 dark:text-white/60">{labels[i]}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


