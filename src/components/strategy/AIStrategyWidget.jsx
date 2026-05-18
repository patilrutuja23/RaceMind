import { useEffect } from "react";
import { useAIStrategy, useRiskScore, usePitStrategy } from "../../hooks/api/useTelemetry";
import ConfidenceMeter from "./ConfidenceMeter";
import RiskIndicator from "./RiskIndicator";
import { SkeletonCard } from "../ui/Skeleton";
import { strategyRecommendation as mock } from "../../data/mockData";

const CRITICAL_METRICS = [
  { label: "Tire Wear",   key: "tire_wear",          value: "67.4%",  color: "text-red-400",    bg: "bg-red-500/8    border-red-500/20" },
  { label: "Brake Temp",  key: "brake_temperature",  value: "487°C",  color: "text-orange-400", bg: "bg-orange-500/8 border-orange-500/20" },
  { label: "Fuel Load",   key: "fuel",               value: "28.6kg", color: "text-yellow-400", bg: "bg-yellow-500/8 border-yellow-500/20" },
  { label: "Gap Ahead",   key: "gap_ahead",          value: "+1.84s", color: "text-blue-400",   bg: "bg-blue-500/8   border-blue-500/20" },
];

export default function AIStrategyWidget() {
  const { data: ai, loading: aiLoading, execute: fetchAI } = useAIStrategy();
  const { data: risk, execute: fetchRisk } = useRiskScore();
  const { data: pit,  execute: fetchPit  } = usePitStrategy();

  useEffect(() => { fetchAI(); fetchRisk(); fetchPit(); }, []);

  const recommendation = ai?.recommendation ?? mock.recommendation;
  const explanation    = ai?.explanation    ?? mock.explanation;
  const confidence     = ai ? Math.round((ai.confidence_score ?? 0.87) * 100) : mock.confidence;
  const riskLevel      = risk?.risk_level   ?? mock.risk_level;
  const strategyType   = pit?.strategy_type ?? mock.strategy_type;
  const pitWindow      = pit ? `Lap ${pit.recommended_lap}` : mock.pit_window;
  const compound       = pit?.compound_switch ?? mock.compound_switch;
  const whatIf         = ai?.what_if_analysis;

  if (aiLoading) return <SkeletonCard rows={6} />;

  return (
    <div className="card-hover relative overflow-hidden animate-slide-up" style={{
      boxShadow: "0 0 30px rgba(225,6,0,0.1), 0 0 60px rgba(225,6,0,0.04)",
    }}>
      {/* Ambient glows */}
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-red-600/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-600/15 border border-red-600/25 flex items-center justify-center text-base">
            🧠
          </div>
          <div>
            <p className="text-[9px] text-zinc-600 uppercase tracking-[0.2em]">IBM Granite AI</p>
            <p className="text-sm font-black text-white">Strategy Analysis</p>
          </div>
        </div>
        <RiskIndicator level={riskLevel} />
      </div>

      {/* ── Strategy type + pit window ──────────────────────────── */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs bg-zinc-800 border border-zinc-700 px-2.5 py-1 rounded-lg text-zinc-300 font-semibold capitalize">
          {strategyType}
        </span>
        <span className="text-xs text-zinc-600">→</span>
        <span className="text-xs bg-red-600/10 border border-red-600/25 px-2.5 py-1 rounded-lg text-red-400 font-semibold">
          🕐 {pitWindow}
        </span>
        <span className="text-xs bg-zinc-800/60 border border-zinc-700/50 px-2.5 py-1 rounded-lg text-zinc-400">
          🔧 {compound}
        </span>
      </div>

      {/* ── Main recommendation ─────────────────────────────────── */}
      <div className="bg-red-600/8 border border-red-600/20 rounded-xl px-4 py-3.5 mb-4 animate-border-flow">
        <p className="text-[10px] text-red-400/70 uppercase tracking-widest font-bold mb-1">AI Recommendation</p>
        <p className="text-sm text-white font-medium leading-relaxed">{recommendation}</p>
      </div>

      {/* ── Confidence ──────────────────────────────────────────── */}
      <div className="mb-4">
        <ConfidenceMeter value={confidence} />
      </div>

      {/* ── Critical metrics grid ───────────────────────────────── */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {CRITICAL_METRICS.map((m) => (
          <div key={m.key} className={`rounded-lg border px-3 py-2 ${m.bg}`}>
            <p className="text-[9px] text-zinc-600 uppercase tracking-wider">{m.label}</p>
            <p className={`text-sm font-black font-mono tabular-nums ${m.color}`}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* ── AI Reasoning ────────────────────────────────────────── */}
      <div className="bg-zinc-800/40 border border-zinc-700/30 rounded-xl p-3 mb-4">
        <p className="text-[9px] text-zinc-600 uppercase tracking-[0.18em] font-bold mb-1.5">AI Reasoning</p>
        <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">{explanation}</p>
      </div>

      {/* ── What-if ─────────────────────────────────────────────── */}
      {whatIf && (
        <div className="space-y-1.5">
          <p className="text-[9px] text-zinc-600 uppercase tracking-[0.18em] font-bold">What-If Scenarios</p>
          {Object.entries(whatIf).filter(([, v]) => v).slice(0, 3).map(([key, val]) => (
            <div key={key} className="flex gap-2 text-xs bg-zinc-800/30 rounded-lg px-3 py-2 border border-zinc-700/30">
              <span className="text-zinc-600 shrink-0 capitalize w-24 truncate">{key.replace(/_/g, " ")}</span>
              <span className="text-zinc-300">{val}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
