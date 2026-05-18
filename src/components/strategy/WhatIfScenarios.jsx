export default function WhatIfScenarios({ scenarios }) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-zinc-500 uppercase tracking-wider">What-If Scenarios</p>
      <div className="grid gap-2">
        {scenarios.map((s, i) => (
          <div
            key={i}
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg border text-xs ${
              i === 0
                ? "bg-red-600/10 border-red-600/30"
                : "bg-zinc-800/50 border-zinc-700/50"
            }`}
          >
            <div className="flex items-center gap-2">
              {i === 0 && <span className="text-red-400 font-bold text-[10px] uppercase">Recommended</span>}
              <span className="text-zinc-300 font-medium">{s.label}</span>
            </div>
            <div className="flex items-center gap-3 text-right">
              <span className="text-zinc-400">P{s.projected_pos}</span>
              <span className={i === 0 ? "text-green-400 font-mono" : i === 1 ? "text-red-400 font-mono" : "text-zinc-400 font-mono"}>
                {s.delta}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
