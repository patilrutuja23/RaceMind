import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { useLiveTelemetry } from "../../hooks/useLiveTelemetry";
import { lapData as mockLapData } from "../../data/mockData";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs space-y-1">
      <p className="text-zinc-400">Lap {label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-mono font-bold">
          {p.name}: {p.value}{p.dataKey === "speed" ? " km/h" : " °C"}
        </p>
      ))}
    </div>
  );
};

export default function SpeedTelemetryChart() {
  const { history, connected } = useLiveTelemetry();
  const chartData = connected && history.length > 1 ? history : mockLapData;

  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-4">
        🚀 Speed & Brake Temperature
        {connected && <span className="ml-2 text-[10px] text-green-400 font-normal">● LIVE</span>}
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis dataKey="lap" stroke="#52525b" tick={{ fontSize: 11 }} />
          <YAxis yAxisId="speed" stroke="#52525b" tick={{ fontSize: 11 }} domain={[250, 340]} />
          <YAxis yAxisId="brake" orientation="right" stroke="#52525b" tick={{ fontSize: 11 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 11, color: "#a1a1aa" }} />
          <Bar yAxisId="brake" dataKey="brake_temperature" name="Brake Temp" fill="#ef4444" opacity={0.4} radius={[2, 2, 0, 0]} isAnimationActive={false} />
          <Line yAxisId="speed" type="monotone" dataKey="speed" name="Speed" stroke="#22c55e" strokeWidth={2} dot={false} isAnimationActive={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
