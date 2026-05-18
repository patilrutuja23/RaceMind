import { useState, useEffect } from "react";
import { useLiveTelemetry } from "../../hooks/useLiveTelemetry";

const BASE_COMMENTS = [
  { text: "Sector 2 pace dropping due to tire degradation.", type: "warning" },
  { text: "Undercut opportunity detected against P2.", type: "strategy" },
  { text: "Brake temperatures approaching critical threshold.", type: "warning" },
  { text: "Fuel load nominal — no fuel saving required.", type: "info" },
  { text: "Gap to P2 closing — DRS range in 2 laps.", type: "strategy" },
  { text: "Rear-left tire showing highest degradation rate.", type: "warning" },
  { text: "Lap time delta improving after sector 1 correction.", type: "info" },
  { text: "Pit crew on standby — window opens next lap.", type: "strategy" },
];

const TYPE_STYLE = {
  warning:  { color: "text-yellow-400", dot: "bg-yellow-400", icon: "⚠" },
  strategy: { color: "text-blue-400",   dot: "bg-blue-400",   icon: "🧠" },
  info:     { color: "text-zinc-400",   dot: "bg-zinc-500",   icon: "ℹ" },
  critical: { color: "text-red-400",    dot: "bg-red-400",    icon: "🔴" },
};

function generateComment(telemetry) {
  if (!telemetry) return BASE_COMMENTS[Math.floor(Math.random() * BASE_COMMENTS.length)];
  const { tire_wear, brake_temperature, speed } = telemetry;
  if (tire_wear > 80)  return { text: `Tire wear critical at ${tire_wear}% — pit stop overdue.`, type: "critical" };
  if (tire_wear > 65)  return { text: `Tire degradation accelerating — ${tire_wear}% wear detected.`, type: "warning" };
  if (brake_temperature > 510) return { text: `Brake temp ${brake_temperature}°C — exceeds 510°C threshold.`, type: "critical" };
  if (brake_temperature > 480) return { text: `Brake temperatures elevated at ${brake_temperature}°C.`, type: "warning" };
  if (speed < 285)     return { text: `Speed down to ${speed} km/h — grip loss confirmed.`, type: "warning" };
  return BASE_COMMENTS[Math.floor(Math.random() * BASE_COMMENTS.length)];
}

export default function RaceCommentaryFeed() {
  const { data } = useLiveTelemetry();
  const [feed, setFeed] = useState(() =>
    BASE_COMMENTS.slice(0, 3).map((c, i) => ({ ...c, id: i, ts: new Date() }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const comment = generateComment(data);
      setFeed((prev) => [
        { ...comment, id: Date.now(), ts: new Date() },
        ...prev,
      ].slice(0, 6));
    }, 5000);
    return () => clearInterval(interval);
  }, [data]);

  return (
    <div className="card space-y-0 overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm">📻</span>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">AI Commentary</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[9px] text-red-400 font-bold uppercase tracking-wider">Live</span>
        </div>
      </div>

      <div className="space-y-1.5 max-h-[180px] overflow-hidden">
        {feed.map((item, i) => {
          const s = TYPE_STYLE[item.type] ?? TYPE_STYLE.info;
          return (
            <div key={item.id}
              className={`flex items-start gap-2.5 px-3 py-2 rounded-lg bg-zinc-800/30 border border-zinc-800/60
                          transition-all duration-500 ${i === 0 ? "animate-alert-slide" : ""}`}
              style={{ opacity: Math.max(0.3, 1 - i * 0.15) }}>
              <span className={`w-1.5 h-1.5 rounded-full ${s.dot} shrink-0 mt-1.5`} />
              <p className={`text-xs leading-relaxed ${i === 0 ? s.color : "text-zinc-500"}`}>
                {item.text}
              </p>
              <span className="text-[9px] text-zinc-700 shrink-0 ml-auto tabular-nums">
                {item.ts.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
