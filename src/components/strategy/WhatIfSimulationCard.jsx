import { useEffect, useState } from "react";
import { useSimulation } from "../../hooks/api/useTelemetry";
import { SkeletonCard } from "../ui/Skeleton";
import SectionHeader from "../ui/SectionHeader";

const riskCfg = {
  low:      { text: "text-green-400",  bar: "bg-green-500",  border: "border-green-500/25",  bg: "bg-green-500/5"  },
  medium:   { text: "text-yellow-400", bar: "bg-yellow-500", border: "border-yellow-500/25", bg: "bg-yellow-500/5" },
  high:     { text: "text-orange-400", bar: "bg-orange-500", border: "border-orange-500/25", bg: "bg-orange-500/5" },
  critical: { text: "text-red-400",    bar: "bg-red-500",    border: "border-red-500/25",    bg: "bg-red-500/5"    },
};

const MOCK = [
  { scenario: "Delayed Pit (+5 laps)", lap_time_impact: 1.24, tire_impact: 18.3, position_risk: "high",     ai_explanation: "Wear exceeds critical threshold. Lap time penalty +1.24s. Risk of dropping 2 positions.", confidence: 0.84, pos_delta: +2 },
  { scenario: "Rain Conditions",       lap_time_impact: 9.87, tire_impact:-22.1, position_risk: "medium",   ai_explanation: "Lap times +12%. Tire wear −40%. Switch to Intermediates immediately.", confidence: 0.79, pos_delta: 0  },
  { scenario: "Aggressive Driving",    lap_time_impact: -0.4, tire_impact: 24.6, position_risk: "high",     ai_explanation: "Short-term −0.4s gain. Stint reduced 3–4 laps. Brake temps +18%.", confidence: 0.81, pos_delta: -1 },
  { scenario: "Degradation +30%",      lap_time_impact: 0.89, tire_impact: 14.2, position_risk: "critical", ai_explanation: "Pit window moves forward 2–3 laps. High position loss risk.", confidence: 0.77, pos_delta: +3 },
];

function AnimatedValue({ value, suffix = "", positive }) {
  const [shown, setShown] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShown(true), 200); return () => clearTimeout(t); }, []);
  const color = positive === true ? "text-green-400" : positive === false ? "text-red-400" : "text-zinc-400";
  return (
    <span className={`font-mono font-black tabular-nums transition-all duration-700 ${color} ${shown ? "opacity-100" : "opacity-0"}`}>
      {value}{suffix}
    </span>
  );
}

function RiskMeter({ value, color }) {
  return (
    <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color} transition-all duration-1000 ease-out`}
           style={{ width: `${value}%`, boxShadow: `0 0 6px currentColor` }} />
    </div>
  );
}

function ScenarioCard({ s, index }) {
  const cfg = riskCfg[s.position_risk] ?? riskCfg.medium;
  const impactPct = Math.min(100, (Math.abs(s.lap_time_impact) / 12) * 100);
  const isGain = s.lap_time_impact < 0;
  const confPct = Math.round((s.confidence ?? 0.8) * 100);

  return (
    <div className={`rounded-xl border ${cfg.border} ${cfg.bg} p-3.5 space-y-3 animate-slide-up`}
         style={{ animationDelay: `${index * 80}ms` }}>

      {/* Title + risk badge */}
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-bold text-zinc-200 leading-tight">{s.scenario}</p>
        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border shrink-0 ${cfg.border} ${cfg.bg} ${cfg.text}`}>
          {s.position_risk}
        </span>
      </div>

      {/* Lap time impact */}
      <div className="space-y-1">
        <div className="flex justify-between items-center text-[10px]">
          <span className="text-zinc-600">Lap Time Δ</span>
          <AnimatedValue value={isGain ? s.lap_time_impact : `+${s.lap_time_impact}`}
                         suffix="s" positive={isGain} />
        </div>
        <RiskMeter value={impactPct} color={isGain ? "bg-green-500" : cfg.bar} />
      </div>

      {/* Tire + position row */}
      <div className="grid grid-cols-2 gap-2 text-[10px]">
        <div className="bg-zinc-900/60 rounded-lg px-2 py-1.5 border border-zinc-800/60">
          <p className="text-zinc-600 mb-0.5">Tire Δ</p>
          <AnimatedValue value={s.tire_impact > 0 ? `+${s.tire_impact}` : s.tire_impact}
                         suffix="%" positive={s.tire_impact < 0} />
        </div>
        <div className="bg-zinc-900/60 rounded-lg px-2 py-1.5 border border-zinc-800/60">
          <p className="text-zinc-600 mb-0.5">Pos Risk</p>
          <span className={`font-bold ${s.pos_delta > 0 ? "text-red-400" : s.pos_delta < 0 ? "text-green-400" : "text-zinc-400"}`}>
            {s.pos_delta > 0 ? `+${s.pos_delta}` : s.pos_delta === 0 ? "±0" : s.pos_delta} pos
          </span>
        </div>
      </div>

      {/* Confidence bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-[10px]">
          <span className="text-zinc-600">Confidence</span>
          <span className="text-zinc-400 font-mono">{confPct}%</span>
        </div>
        <RiskMeter value={confPct} color="bg-violet-500" />
      </div>

      <p className="text-[10px] text-zinc-500 leading-relaxed border-t border-zinc-800/50 pt-2">
        {s.ai_explanation}
      </p>
    </div>
  );
}

export default function WhatIfSimulationCard() {
  const { data, loading, execute } = useSimulation();
  useEffect(() => { execute(); }, []);
  const scenarios = data?.scenarios ?? MOCK;

  return (
    <div className="card">
      <SectionHeader icon="🔮" title="What-If Simulation"
        action={
          <button onClick={execute}
            className="text-[10px] text-zinc-500 hover:text-white border border-zinc-700 hover:border-zinc-500
                       px-2.5 py-1 rounded-lg transition-all duration-200 hover:bg-zinc-800/60">
            ↻ Refresh
          </button>
        }
      />
      {loading ? (
        <div className="grid grid-cols-2 gap-3">{[0,1,2,3].map(i => <SkeletonCard key={i} rows={4} />)}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {scenarios.slice(0, 4).map((s, i) => <ScenarioCard key={i} s={s} index={i} />)}
        </div>
      )}
    </div>
  );
}
