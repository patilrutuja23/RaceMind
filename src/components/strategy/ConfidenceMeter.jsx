import { useEffect, useRef, useState } from "react";

export default function ConfidenceMeter({ value }) {
  const [displayed, setDisplayed] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const start = performance.now();
    const duration = 900;
    const from = 0;
    const to = value;

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(from + (to - from) * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value]);

  const color = value >= 80 ? "#22c55e" : value >= 60 ? "#f59e0b" : "#ef4444";
  const label = value >= 80 ? "High" : value >= 60 ? "Medium" : "Low";
  const glowColor = value >= 80 ? "rgba(34,197,94,0.35)" : value >= 60 ? "rgba(245,158,11,0.35)" : "rgba(239,68,68,0.35)";

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">AI Confidence</span>
        <div className="flex items-center gap-1.5">
          <span className="font-black font-mono text-lg tabular-nums" style={{ color }}>
            {displayed}%
          </span>
          <span className="text-[10px] text-zinc-600 font-medium">{label}</span>
        </div>
      </div>
      <div className="h-2.5 bg-zinc-800/80 rounded-full overflow-hidden relative">
        <div className="h-full rounded-full transition-all duration-1000 ease-out"
             style={{
               width: `${value}%`,
               backgroundColor: color,
               boxShadow: `0 0 12px ${glowColor}, 0 0 24px ${glowColor}`,
             }} />
        {/* Shimmer sweep */}
        <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
          <div className="h-full w-8 bg-gradient-to-r from-transparent via-white/20 to-transparent
                          animate-shimmer absolute top-0" />
        </div>
      </div>
    </div>
  );
}
