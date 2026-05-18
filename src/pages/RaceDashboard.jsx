import { useEffect, useRef } from "react";
import TelemetryStatCards from "../components/telemetry/TelemetryStatCards";
import LapTimeChart from "../components/telemetry/LapTimeChart";
import TireWearChart from "../components/telemetry/TireWearChart";
import SpeedTelemetryChart from "../components/telemetry/SpeedTelemetryChart";
import RaceStatusCard from "../components/telemetry/RaceStatusCard";
import RaceEventsBar from "../components/telemetry/RaceEventsBar";
import RaceCommentaryFeed from "../components/telemetry/RaceCommentaryFeed";
import AIStrategyWidget from "../components/strategy/AIStrategyWidget";
import WhatIfSimulationCard from "../components/strategy/WhatIfSimulationCard";
import AICopilotPreview from "../components/strategy/AICopilotPreview";
import AICopilotChat from "../components/chat/AICopilotChat";
import RiskAnalysisPanel from "../components/strategy/RiskAnalysisPanel";

/* ── Section wrapper ──────────────────────────────────────────── */
function Section({ id, label, icon, children, className = "" }) {
  return (
    <section id={id} className={`scroll-mt-4 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-base">{icon}</span>
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">{label}</h2>
        <div className="flex-1 h-px bg-gradient-to-r from-zinc-800 to-transparent" />
      </div>
      {children}
    </section>
  );
}

/* ── Main dashboard ───────────────────────────────────────────── */
export default function RaceDashboard({ onSectionVisible }) {
  const containerRef = useRef(null);

  /* IntersectionObserver — sync sidebar active state with scroll */
  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          const id = visible[0].target.id.replace("section-", "");
          onSectionVisible?.(id);
        }
      },
      { threshold: 0.25, rootMargin: "-60px 0px -40% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [onSectionVisible]);

  return (
    <div ref={containerRef} className="p-5 space-y-8 max-w-screen-2xl mx-auto animate-fade-in">

      {/* ── OVERVIEW ──────────────────────────────────────────────── */}
      <section id="section-overview" className="scroll-mt-4 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-base">⚡</span>
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Telemetry Overview</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-zinc-800 to-transparent" />
        </div>

        {/* Race events */}
        <RaceEventsBar />

        <TelemetryStatCards />

        {/* Overview grid: race status + mini metrics + commentary */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-1">
            <RaceStatusCard />
          </div>
          <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-3">
            <MiniMetric label="Best Lap"       value="88.743" unit="s"    color="text-blue-400"   icon="🏆" />
            <MiniMetric label="Avg Speed"      value="293.4"  unit="km/h" color="text-green-400"  icon="📈" />
            <MiniMetric label="Pit Window"     value="Lap 21" unit=""     color="text-red-400"    icon="🔧" />
            <MiniMetric label="Laps Left"      value="37"     unit="laps" color="text-zinc-300"   icon="🏁" />
            <MiniMetric label="Wear Rate"      value="+4.8"   unit="%/lap"color="text-yellow-400" icon="📉" />
            <MiniMetric label="Risk Score"     value="0.74"   unit=""     color="text-orange-400" icon="⚠️" />
          </div>
          <div className="lg:col-span-1">
            <RaceCommentaryFeed />
          </div>
        </div>
      </section>

      {/* ── TELEMETRY CHARTS ──────────────────────────────────────── */}
      <Section id="section-telemetry" label="Live Charts" icon="📡">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <LapTimeChart />
          <TireWearChart />
        </div>
        <div className="mt-4">
          <SpeedTelemetryChart />
        </div>
      </Section>

      {/* ── AI STRATEGY ───────────────────────────────────────────── */}
      <Section id="section-strategy" label="AI Strategy Recommendations" icon="🧠">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2">
            <AIStrategyWidget />
          </div>
          <div>
            <AICopilotPreview />
          </div>
        </div>
      </Section>

      {/* ── RISK ANALYSIS ─────────────────────────────────────────── */}
      <Section id="section-risk" label="Risk Analysis" icon="⚠️">
        <RiskAnalysisPanel />
      </Section>

      {/* ── SIMULATION ────────────────────────────────────────────── */}
      <Section id="section-simulation" label="What-If Simulation" icon="🔮">
        <WhatIfSimulationCard />
      </Section>

      {/* ── AI COPILOT CHAT ───────────────────────────────────────── */}
      <Section id="section-copilot" label="AI Copilot Chat" icon="💬">
        <div className="h-[560px]">
          <AICopilotChat />
        </div>
      </Section>

    </div>
  );
}

/* ── Mini metric card ─────────────────────────────────────────── */
function MiniMetric({ label, value, unit, color, icon }) {
  return (
    <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl px-4 py-3 flex items-center gap-3
                    hover:border-zinc-700 transition-colors">
      <span className="text-lg">{icon}</span>
      <div>
        <p className="text-[9px] text-zinc-600 uppercase tracking-[0.15em]">{label}</p>
        <p className={`text-sm font-black font-mono tabular-nums ${color}`}>
          {value}
          {unit && <span className="text-xs font-normal text-zinc-600 ml-1">{unit}</span>}
        </p>
      </div>
    </div>
  );
}
