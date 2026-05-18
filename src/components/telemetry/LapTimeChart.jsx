import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from "recharts";
import { useLiveTelemetry } from "../../hooks/useLiveTelemetry";
import { lapData as mockLapData } from "../../data/mockData";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs">
      <p className="text-zinc-400 mb-1">Lap {label}</p>
      <p className="text-blue-400 font-mono font-bold">{payload[0].value}s</p>
    </div>
  );
};

export default function LapTimeChart() {
  const { history, connected } = useLiveTelemetry();
  const chartData = connected && history.length > 1 ? history : mockLapData;
  const best = Math.min(...chartData.map((d) => d.lap_time));

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">
          ⏱️ Lap Times
          {connected && <span className="ml-2 text-[10px] text-green-400 font-normal">● LIVE</span>}
        </h3>
        <span className="text-xs text-blue-400 font-mono">Best: {best.toFixed(3)}s</span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis dataKey="lap" stroke="#52525b" tick={{ fontSize: 11 }} />
          <YAxis stroke="#52525b" tick={{ fontSize: 11 }} domain={["auto", "auto"]} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={best} stroke="#3b82f6" strokeDasharray="4 4" />
          <Line type="monotone" dataKey="lap_time" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 4 }} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
