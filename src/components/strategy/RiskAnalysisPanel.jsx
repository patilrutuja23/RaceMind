import { useEffect } from "react";
import { useRiskScore, usePitStrategy, useTireAnalysis, usePerformanceDrop } from "../../hooks/api/useTelemetry";
import { SkeletonCard } from "../ui/Skeleton";

const riskMeta = {
  low:      { color: "#22c55e", label: "LOW",      bg: "bg-green-500/10  border-green-500/25" },
  medium:   { color: "#f59e0b", label: "MEDIUM",   bg: "bg-yellow-500/10 border-yellow-500/25" },
  high:     { color: "#f97316", label: "HIGH",     bg: "bg-orange-500/10 border-orange-500/25" },
  critical: { color: "#ef4444", label: "CRITICAL", bg: "bg-red-500/10    border-red-500/25" },
};

function GaugeBar({ label, value, max = 1, color }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-zinc-400">{label}</span>
        <span className="font-mono font-bold tabular-nums" style={{ color }}>
          {pct}%
        </span>
      </div>
      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700"
             style={{ width: `${pct}%`, backgroundColor: color,
                      boxShadow: `0 0 8px ${color}60` }} />
      </div>
    </div>
  );
}

export default function RiskAnalysisPanel() {
  const { data: risk,  loading: rLoading,  execute: fetchRisk  } = useRiskScore();
  const { data: pit,   loading: pLoading,  execute: fetchPit   } = usePitStrategy();
  const { data: tire,  loading: tLoading,  execute: fetchTire  } = useTireAnalysis();
  const { data: perf,  loading: perfLoad,  execute: fetchPerf  } = usePerformanceDrop();

  useEffect(() => {
    fetchRisk(); fetchPit(); fetchTire(); fetchPerf();
  }, []);

  const loading = rLoading || pLoading || tLoading || perfLoad;
  if (loading) return <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
    {[0,1,2,3].map(i => <SkeletonCard key={i} rows={4} />)}
  </div>;

  const overall   = risk?.overall_risk   ?? 0.74;
  const riskLevel = risk?.risk_level     ?? "high";
  const meta      = riskMeta[riskLevel]  ?? riskMeta.medium;

  return (
    <div className="space-y-4">
      {/* Overall risk banner */}
      <div className={`rounded-xl border p-4 ${meta.bg} flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-zinc-900/60 flex items-center justify-center text-2xl">⚠️</div>
          <div>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Overall Risk Score</p>
            <p className="text-2xl font-black tabular-nums" style={{ color: meta.color }}>
              {Math.round(overall * 100)}
              <span className="text-sm font-normal text-zinc-500 ml-1">/ 100</span>
            </p>
          </div>
        </div>
        <span className={`text-xs font-black px-3 py-1.5 rounded-full border ${meta.bg}`}
              style={{ color: meta.color }}>
          {meta.label} RISK
        </span>
      </div>

      {/* Risk breakdown grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

        {/* Tire risk */}
        <div className="card space-y-3">
          <div className="flex items-center gap-2">
            <span>🔄</span>
            <p className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Tire Risk</p>
          </div>
          <GaugeBar label="Wear" value={risk?.tire_risk ?? 0.91} color="#f59e0b" />
          <div className="text-xs space-y-1 pt-1 border-t border-zinc-800">
            <div className="flex justify-between">
              <span className="text-zinc-600">Status</span>
              <span className="text-yellow-400 font-semibold">{tire?.status ?? "critical"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-600">Laps left</span>
              <span className="text-white font-mono">{tire?.laps_remaining ?? "2.1"}</span>
            </div>
          </div>
        </div>

        {/* Brake risk */}
        <div className="card space-y-3">
          <div className="flex items-center gap-2">
            <span>🌡️</span>
            <p className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Brake Risk</p>
          </div>
          <GaugeBar label="Thermal" value={risk?.brake_risk ?? 0.68} color="#ef4444" />
          <div className="text-xs space-y-1 pt-1 border-t border-zinc-800">
            <div className="flex justify-between">
              <span className="text-zinc-600">Temp</span>
              <span className="text-red-400 font-mono">531°C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-600">Threshold</span>
              <span className="text-zinc-400 font-mono">510°C</span>
            </div>
          </div>
        </div>

        {/* Performance risk */}
        <div className="card space-y-3">
          <div className="flex items-center gap-2">
            <span>📉</span>
            <p className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Performance</p>
          </div>
          <GaugeBar label="Degradation" value={risk?.performance_risk ?? 0.55} color="#6366f1" />
          <div className="text-xs space-y-1 pt-1 border-t border-zinc-800">
            <div className="flex justify-between">
              <span className="text-zinc-600">Drop detected</span>
              <span className={perf?.detected ? "text-red-400" : "text-green-400"}>
                {perf?.detected ? "Yes" : "No"}
              </span>
            </div>
            {perf?.detected && (
              <div className="flex justify-between">
                <span className="text-zinc-600">Cause</span>
                <span className="text-orange-400 capitalize">{perf?.cause?.replace(/_/g, " ")}</span>
              </div>
            )}
          </div>
        </div>

        {/* Pit strategy */}
        <div className="card space-y-3">
          <div className="flex items-center gap-2">
            <span>🔧</span>
            <p className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Pit Strategy</p>
          </div>
          <GaugeBar label="Urgency" value={pit?.should_pit ? 0.88 : 0.3} color="#e10600" />
          <div className="text-xs space-y-1 pt-1 border-t border-zinc-800">
            <div className="flex justify-between">
              <span className="text-zinc-600">Pit now?</span>
              <span className={pit?.should_pit ? "text-red-400 font-bold" : "text-green-400"}>
                {pit?.should_pit ? "YES" : "No"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-600">Window</span>
              <span className="text-white font-mono">Lap {pit?.recommended_lap ?? 21}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Recommendation */}
      {risk?.recommendation && (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 flex items-center gap-3">
          <span className="text-lg shrink-0">🧠</span>
          <p className="text-sm text-zinc-300">{risk.recommendation}</p>
        </div>
      )}
    </div>
  );
}
