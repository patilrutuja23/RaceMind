import { useState } from "react";
import { strategyRecommendation } from "../../data/mockData";
import ConfidenceMeter from "./ConfidenceMeter";
import RiskIndicator from "./RiskIndicator";
import TelemetryFactorBreakdown from "./TelemetryFactorBreakdown";
import WhatIfScenarios from "./WhatIfScenarios";

export default function StrategyRecommendationPanel() {
  const [expanded, setExpanded] = useState(false);
  const s = strategyRecommendation;

  return (
    <div className="glass rounded-2xl p-5 space-y-5 relative overflow-hidden">
      {/* Glow accent */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">🧠</span>
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest">AI Strategy</p>
            <p className="text-sm font-bold text-white">{s.strategy_type}</p>
          </div>
        </div>
        <RiskIndicator level={s.risk_level} />
      </div>

      {/* Recommendation */}
      <div className="bg-red-600/10 border border-red-600/20 rounded-xl px-4 py-3">
        <p className="text-sm text-white font-medium leading-relaxed">
          💬 {s.recommendation}
        </p>
        <div className="flex gap-4 mt-2 text-xs text-zinc-400">
          <span>🕐 {s.pit_window}</span>
          <span>🔧 {s.compound_switch}</span>
        </div>
      </div>

      {/* Confidence */}
      <ConfidenceMeter value={s.confidence} />

      {/* Factors */}
      <TelemetryFactorBreakdown factors={s.factors} />

      {/* Expandable explanation */}
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors w-full"
        >
          <span className={`transition-transform duration-200 ${expanded ? "rotate-90" : ""}`}>▶</span>
          <span className="uppercase tracking-wider">AI Explanation</span>
        </button>
        {expanded && (
          <div className="mt-3 bg-zinc-900/60 border border-zinc-700/50 rounded-xl p-3">
            <p className="text-xs text-zinc-400 leading-relaxed">{s.explanation}</p>
          </div>
        )}
      </div>

      {/* What-if */}
      <WhatIfScenarios scenarios={s.scenarios} />
    </div>
  );
}
