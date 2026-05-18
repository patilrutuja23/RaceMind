import { useLiveTelemetry } from "../../hooks/useLiveTelemetry";

const cards = [
  {
    label: "Lap Time", key: "lap_time", unit: "s", icon: "⏱️",
    color: "text-blue-400", border: "border-blue-500/25", glow: "hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]",
    accent: "bg-blue-500",
  },
  {
    label: "Speed", key: "speed", unit: "km/h", icon: "🚀",
    color: "text-green-400", border: "border-green-500/25", glow: "hover:shadow-[0_0_20px_rgba(34,197,94,0.2)]",
    accent: "bg-green-500",
  },
  {
    label: "Tire Wear", key: "tire_wear", unit: "%", icon: "🔄",
    color: "text-yellow-400", border: "border-yellow-500/25", glow: "hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]",
    accent: "bg-yellow-500",
  },
  {
    label: "Fuel", key: "fuel", unit: "kg", icon: "⛽",
    color: "text-orange-400", border: "border-orange-500/25", glow: "hover:shadow-[0_0_20px_rgba(249,115,22,0.2)]",
    accent: "bg-orange-500",
  },
  {
    label: "Brake Temp", key: "brake_temperature", unit: "°C", icon: "🌡️",
    color: "text-red-400", border: "border-red-500/25", glow: "hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]",
    accent: "bg-red-500",
  },
];

function StatCard({ label, value, unit, icon, color, border, glow, accent, live }) {
  return (
    <div className={`
      relative bg-zinc-900/80 border ${border} rounded-xl p-4
      transition-all duration-300 ${glow} overflow-hidden group cursor-default
    `}>
      {/* Top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-px ${accent} opacity-40 group-hover:opacity-80 transition-opacity`} />

      {/* Live dot */}
      {live && (
        <span className={`absolute top-3 right-3 w-1.5 h-1.5 rounded-full ${accent} animate-pulse`} />
      )}

      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-lg bg-zinc-800/80 flex items-center justify-center text-lg shrink-0`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-[10px] text-zinc-500 uppercase tracking-[0.15em] truncate">{label}</p>
          <p className={`text-xl font-black font-mono ${color} tabular-nums leading-tight`}>
            {value ?? "—"}
            <span className="text-xs font-normal text-zinc-600 ml-1">{unit}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function TelemetryStatCards() {
  const { data, connected } = useLiveTelemetry();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {cards.map((c) => (
        <StatCard key={c.key} {...c} value={data?.[c.key]} live={connected} />
      ))}
    </div>
  );
}
