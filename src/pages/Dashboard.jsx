import TelemetryStatCards from "../components/telemetry/TelemetryStatCards";
import LapTimeChart from "../components/telemetry/LapTimeChart";
import TireWearChart from "../components/telemetry/TireWearChart";
import SpeedTelemetryChart from "../components/telemetry/SpeedTelemetryChart";
import RaceStatusCard from "../components/telemetry/RaceStatusCard";
import AIStrategyWidget from "../components/strategy/AIStrategyWidget";
import WhatIfSimulationCard from "../components/strategy/WhatIfSimulationCard";
import AICopilotPreview from "../components/strategy/AICopilotPreview";

export default function Dashboard({ onNavigate }) {
  return (
    <div className="space-y-6 max-w-screen-2xl mx-auto animate-slide-up">

      {/* ── Row 1: Stat cards ─────────────────────────────────────────── */}
      <TelemetryStatCards />

      {/* ── Row 2: Charts + right column ─────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Charts — 2/3 width */}
        <div className="xl:col-span-2 space-y-6">
          <LapTimeChart />
          <TireWearChart />
          <SpeedTelemetryChart />
        </div>

        {/* Right column — 1/3 width */}
        <div className="space-y-6">
          <RaceStatusCard />
          <AIStrategyWidget />
        </div>
      </div>

      {/* ── Row 3: Simulation + Copilot preview ───────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <WhatIfSimulationCard />
        </div>
        <div className="lg:col-span-2">
          <AICopilotPreview onOpenChat={() => onNavigate?.("strategy")} />
        </div>
      </div>

    </div>
  );
}
