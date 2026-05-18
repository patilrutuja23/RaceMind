import { useState, useEffect } from "react";
import { useLiveTelemetry } from "../../hooks/useLiveTelemetry";
import { currentTelemetry as mock } from "../../data/mockData";

const COMPOUNDS = { soft: { label: "S", color: "bg-red-500",    text: "text-red-100"   },
                    medium:{ label: "M", color: "bg-yellow-400", text: "text-yellow-900" },
                    hard:  { label: "H", color: "bg-zinc-200",   text: "text-zinc-900"  },
                    inter: { label: "I", color: "bg-green-500",  text: "text-green-100" } };

function CompoundBadge({ compound = "medium" }) {
  const c = COMPOUNDS[compound] ?? COMPOUNDS.medium;
  return (
    <div className={`w-6 h-6 rounded-full ${c.color} flex items-center justify-center`}>
      <span className={`text-[10px] font-black ${c.text}`}>{c.label}</span>
    </div>
  );
}

function SectorDelta({ label, delta }) {
  const color = delta < 0 ? "text-green-400" : delta > 0.1 ? "text-red-400" : "text-yellow-400";
  return (
    <div className="text-center">
      <p className="text-[8px] text-zinc-700 uppercase tracking-wider">{label}</p>
      <p className={`text-[10px] font-mono font-bold tabular-nums ${color}`}>
        {delta > 0 ? "+" : ""}{delta.toFixed(2)}s
      </p>
    </div>
  );
}

export default function Header({ onSettings }) {
  const { data, connected } = useLiveTelemetry();
  const t = data ?? mock;

  const driver      = t.driver      ?? mock.driver;
  const team        = t.team        ?? mock.team;
  const position    = t.position    ?? mock.position;
  const current_lap = t.lap         ?? t.current_lap ?? mock.current_lap;
  const total_laps  = t.total_laps  ?? mock.total_laps;
  const gap_ahead   = t.gap_ahead   ?? mock.gap_ahead;
  const lap_time    = t.lap_time    ?? mock.lap_time;
  const speed       = t.speed       ?? mock.speed;
  const tire_wear   = t.tire_wear   ?? mock.tire_wear;

  const lapPct = Math.round((current_lap / total_laps) * 100);

  // Simulated live values
  const [ers, setErs]     = useState(78);
  const [drs, setDrs]     = useState(true);
  const [weather, setWeather] = useState("dry");

  useEffect(() => {
    const t = setInterval(() => {
      setErs((v) => Math.max(20, Math.min(100, v + (Math.random() - 0.4) * 8)));
    }, 3000);
    return () => clearInterval(t);
  }, []);

  const ersColor = ers > 60 ? "text-green-400" : ers > 30 ? "text-yellow-400" : "text-red-400";
  const compound = tire_wear > 70 ? "hard" : tire_wear > 40 ? "medium" : "soft";

  return (
    <header className="shrink-0 glass-dark border-b border-white/[0.06] relative z-10">
      <div className="absolute inset-0 scan-line pointer-events-none" />

      <div className="flex items-center justify-between px-4 py-2 gap-3">

        {/* ── Left: connection + lap progress ─────────────────── */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full shrink-0 ${connected ? "bg-green-400 animate-pulse" : "bg-zinc-600"}`} />
            <span className={`text-[9px] font-bold uppercase tracking-[0.15em] ${connected ? "text-green-400" : "text-zinc-600"}`}>
              {connected ? "Live" : "Offline"}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-xs">
            <span className="text-zinc-600">Lap</span>
            <span className="font-black text-white tabular-nums">{current_lap}</span>
            <span className="text-zinc-700">/</span>
            <span className="text-zinc-600 tabular-nums">{total_laps}</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5">
            <div className="w-20 h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-red-600 rounded-full transition-all duration-1000"
                   style={{ width: `${lapPct}%` }} />
            </div>
            <span className="text-[9px] text-zinc-600 tabular-nums">{lapPct}%</span>
          </div>
        </div>

        {/* ── Center: driver + telemetry ───────────────────────── */}
        <div className="hidden lg:flex items-center gap-3 flex-1 justify-center">
          {/* Driver card */}
          <div className="flex items-center gap-2 bg-zinc-900/60 border border-zinc-800 rounded-lg px-2.5 py-1.5">
            <span className="text-[10px] bg-red-600 text-white font-black px-1.5 py-0.5 rounded">P{position}</span>
            <span className="text-sm font-black text-white tracking-wider">{driver}</span>
            <span className="text-[10px] text-zinc-500">{team}</span>
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-zinc-800" />

          {/* Lap time */}
          <div className="text-center">
            <p className="text-[8px] text-zinc-700 uppercase tracking-wider">Lap Time</p>
            <p className="text-xs font-mono font-bold text-blue-400 tabular-nums">{lap_time}s</p>
          </div>

          {/* Speed */}
          <div className="text-center">
            <p className="text-[8px] text-zinc-700 uppercase tracking-wider">Speed</p>
            <p className="text-xs font-mono font-bold text-green-400 tabular-nums">{speed}</p>
          </div>

          {/* Gap */}
          <div className="text-center">
            <p className="text-[8px] text-zinc-700 uppercase tracking-wider">Gap</p>
            <p className="text-xs font-mono font-bold text-yellow-400">{gap_ahead}</p>
          </div>

          <div className="w-px h-6 bg-zinc-800" />

          {/* Sector deltas */}
          <SectorDelta label="S1" delta={0.08} />
          <SectorDelta label="S2" delta={0.31} />
          <SectorDelta label="S3" delta={-0.04} />

          <div className="w-px h-6 bg-zinc-800" />

          {/* Tire compound */}
          <div className="flex items-center gap-1.5">
            <CompoundBadge compound={compound} />
            <div>
              <p className="text-[8px] text-zinc-700 uppercase tracking-wider">Tyre</p>
              <p className="text-[10px] text-zinc-400 font-semibold capitalize">{compound}</p>
            </div>
          </div>

          {/* DRS */}
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[10px] font-bold transition-all ${
            drs ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-zinc-800 border-zinc-700 text-zinc-600"
          }`}>
            <span>DRS</span>
            <span>{drs ? "ON" : "OFF"}</span>
          </div>

          {/* ERS */}
          <div className="flex items-center gap-1.5">
            <div className="w-12 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-1000 ${
                ers > 60 ? "bg-green-500" : ers > 30 ? "bg-yellow-500" : "bg-red-500"
              }`} style={{ width: `${ers}%` }} />
            </div>
            <span className={`text-[10px] font-mono font-bold tabular-nums ${ersColor}`}>{Math.round(ers)}%</span>
          </div>
        </div>

        {/* ── Right: flag + weather + settings ────────────────── */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Weather */}
          <div className="hidden sm:flex items-center gap-1 bg-zinc-900/60 border border-zinc-800 px-2 py-1 rounded-lg">
            <span className="text-sm">{weather === "dry" ? "☀️" : "🌧️"}</span>
            <span className="text-[9px] text-zinc-500 capitalize">{weather}</span>
          </div>

          {/* Flag */}
          <div className="flex items-center gap-1 bg-green-950/60 border border-green-800/40 px-2 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-[9px] font-bold tracking-wider uppercase hidden sm:inline">Green</span>
          </div>

          <button onClick={onSettings}
            className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-600
                       text-zinc-500 hover:text-white flex items-center justify-center text-sm transition-colors">
            ⚙️
          </button>
        </div>
      </div>
    </header>
  );
}
