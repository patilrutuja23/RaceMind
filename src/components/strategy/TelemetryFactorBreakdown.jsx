const impactColor = { high: "bg-red-500", medium: "bg-yellow-500", low: "bg-green-500" };
const impactWidth = { high: "w-full", medium: "w-2/3", low: "w-1/3" };

export default function TelemetryFactorBreakdown({ factors }) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-zinc-500 uppercase tracking-wider">Telemetry Factors</p>
      {factors.map((f) => (
        <div key={f.label} className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-zinc-300">{f.label}</span>
            <span className="font-mono text-zinc-400">
              {f.value}
              <span className="text-zinc-600 ml-0.5">{f.unit}</span>
            </span>
          </div>
          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${impactColor[f.impact]} ${impactWidth[f.impact]}`} />
          </div>
        </div>
      ))}
    </div>
  );
}
