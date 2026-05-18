const riskConfig = {
  low: { color: "text-green-400", bg: "bg-green-500/10 border-green-500/30", label: "LOW RISK", icon: "🟢" },
  medium: { color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/30", label: "MEDIUM RISK", icon: "🟡" },
  high: { color: "text-red-400", bg: "bg-red-500/10 border-red-500/30", label: "HIGH RISK", icon: "🔴" },
};

export default function RiskIndicator({ level }) {
  const cfg = riskConfig[level] ?? riskConfig.medium;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${cfg.bg} ${cfg.color}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
}
