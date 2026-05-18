import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from "recharts";
import { useLiveTelemetry } from "../../hooks/useLiveTelemetry";
import { lapData as mockLapData } from "../../data/mockData";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  const color = val > 70 ? "#ef4444" : val > 45 ? "#f59e0b" : "#22c55e";
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs">
      <p className="text-zinc-400 mb-1">Lap {label}</p>
      <p className="font-mono font-bold" style={{ color }}>{val}%</p>
    </div>
  );
};

export default function TireWearChart() {
  const { history, connected } = useLiveTelemetry();
  const chartData = connected && history.length > 1 ? history : mockLapData;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">
          🔄 Tire Wear
          {connected && <span className="ml-2 text-[10px] text-green-400 font-normal">● LIVE</span>}
        </h3>
        <div className="flex gap-3 text-xs">
          <span className="text-green-400">● Safe</span>
          <span className="text-yellow-400">● Warn</span>
          <span className="text-red-400">● Critical</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="tireGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis dataKey="lap" stroke="#52525b" tick={{ fontSize: 11 }} />
          <YAxis stroke="#52525b" tick={{ fontSize: 11 }} domain={[0, 100]} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="4 4" label={{ value: "Critical", fill: "#ef4444", fontSize: 10 }} />
          <ReferenceLine y={45} stroke="#f59e0b" strokeDasharray="4 4" />
          <Area type="monotone" dataKey="tire_wear" stroke="#f59e0b" strokeWidth={2} fill="url(#tireGrad)" dot={false} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
