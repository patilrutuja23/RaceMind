import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import { useLiveTelemetry } from "../../hooks/useLiveTelemetry";
import { currentTelemetry as mock } from "../../data/mockData";

export default function RaceStatusCard() {
  const { data, connected } = useLiveTelemetry();
  const t = data ?? mock;

  const current_lap = t.lap         ?? t.current_lap ?? mock.current_lap;
  const total_laps  = t.total_laps  ?? mock.total_laps;
  const fuel        = t.fuel        ?? t.fuel_remaining ?? mock.fuel;
  const position    = t.position    ?? mock.position;
  const driver      = t.driver      ?? mock.driver;
  const team        = t.team        ?? mock.team;
  const tire_wear   = t.tire_wear   ?? mock.tire_wear;

  const progress    = Math.round((current_lap / total_laps) * 100);
  const radialData  = [{ value: progress, fill: "#e10600" }];
  const tireColor   = tire_wear > 70 ? "#ef4444" : tire_wear > 45 ? "#f59e0b" : "#22c55e";

  return (
    <div className="card neon-border relative overflow-hidden">
      <div className="absolute -top-6 -right-6 w-28 h-28 bg-red-600/8 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm">🏁</span>
          <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-[0.15em]">Race Status</h3>
        </div>
        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
          connected
            ? "bg-green-500/10 border-green-500/30 text-green-400"
            : "bg-zinc-800 border-zinc-700 text-zinc-600"
        }`}>
          {connected ? "● LIVE" : "○ MOCK"}
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Radial progress */}
        <div className="relative w-20 h-20 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart cx="50%" cy="50%" innerRadius="62%" outerRadius="100%"
              startAngle={90} endAngle={-270} data={radialData} barSize={7}>
              <RadialBar background={{ fill: "#1c1c1e" }} dataKey="value" cornerRadius={4} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-base font-black text-white tabular-nums">{progress}%</span>
            <span className="text-[9px] text-zinc-600 uppercase tracking-wider">Race</span>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 flex-1 text-xs">
          <div>
            <p className="text-zinc-600 text-[9px] uppercase tracking-wider">Driver</p>
            <p className="font-black text-white">{driver}</p>
          </div>
          <div>
            <p className="text-zinc-600 text-[9px] uppercase tracking-wider">Position</p>
            <p className="font-black text-red-500 text-base leading-tight">P{position}</p>
          </div>
          <div>
            <p className="text-zinc-600 text-[9px] uppercase tracking-wider">Lap</p>
            <p className="font-bold text-white tabular-nums">{current_lap}/{total_laps}</p>
          </div>
          <div>
            <p className="text-zinc-600 text-[9px] uppercase tracking-wider">Fuel</p>
            <p className="font-bold text-orange-400 tabular-nums">{fuel} kg</p>
          </div>
          <div className="col-span-2">
            <p className="text-zinc-600 text-[9px] uppercase tracking-wider">Tire Wear</p>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700"
                     style={{ width: `${tire_wear}%`, backgroundColor: tireColor }} />
              </div>
              <span className="font-mono font-bold text-[10px] tabular-nums" style={{ color: tireColor }}>
                {tire_wear}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="mt-3 pt-3 border-t border-zinc-800/60">
        <p className="text-[9px] text-zinc-600 uppercase tracking-wider">Team</p>
        <p className="text-xs font-semibold text-zinc-400 mt-0.5">{team}</p>
      </div>
    </div>
  );
}
