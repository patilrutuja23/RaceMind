import { useState, useEffect, useCallback } from "react";

const EVENT_POOL = [
  { id: "yellow",   icon: "🟡", label: "Yellow Flag",          detail: "Incident at Turn 8 — reduce pace",                color: "#f59e0b", bg: "bg-yellow-500/10", border: "border-yellow-500/40" },
  { id: "rain",     icon: "🌧️", label: "Rain Detected",        detail: "Track surface wetting — consider Intermediates",   color: "#60a5fa", bg: "bg-blue-500/10",   border: "border-blue-500/40"   },
  { id: "sc",       icon: "🚗", label: "Safety Car Deployed",  detail: "Pit window open — free stop opportunity",          color: "#a78bfa", bg: "bg-violet-500/10", border: "border-violet-500/40" },
  { id: "drs",      icon: "⚡", label: "DRS Enabled",          detail: "DRS zone active — gap to P2 now +1.1s",            color: "#22c55e", bg: "bg-green-500/10",  border: "border-green-500/40"  },
  { id: "tire_crit",icon: "🔴", label: "Tire Critical Warning", detail: "Rear-left wear at 91% — pit immediately",         color: "#ef4444", bg: "bg-red-500/10",    border: "border-red-500/40"    },
];

export default function RaceEventsBar() {
  const [events, setEvents] = useState([EVENT_POOL[3], EVENT_POOL[4]]); // start with 2
  const [dismissed, setDismissed] = useState(new Set());

  // Simulate new events arriving
  useEffect(() => {
    const interval = setInterval(() => {
      const next = EVENT_POOL[Math.floor(Math.random() * EVENT_POOL.length)];
      setEvents((prev) => {
        if (prev.find((e) => e.id === next.id)) return prev;
        return [next, ...prev].slice(0, 4);
      });
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const dismiss = useCallback((id) => {
    setDismissed((prev) => new Set([...prev, id]));
    setTimeout(() => setEvents((prev) => prev.filter((e) => e.id !== id)), 300);
  }, []);

  if (events.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {events.map((ev) => (
        <div key={ev.id}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border ${ev.bg} ${ev.border}
                      animate-alert-slide animate-event-glow transition-all duration-300`}
          style={{ "--event-color": `${ev.color}60` }}>
          <span className="text-base shrink-0">{ev.icon}</span>
          <div className="min-w-0">
            <p className="text-xs font-bold" style={{ color: ev.color }}>{ev.label}</p>
            <p className="text-[10px] text-zinc-500 truncate max-w-[200px]">{ev.detail}</p>
          </div>
          <button onClick={() => dismiss(ev.id)}
            className="text-zinc-600 hover:text-zinc-400 text-xs ml-1 shrink-0 transition-colors">✕</button>
        </div>
      ))}
    </div>
  );
}
