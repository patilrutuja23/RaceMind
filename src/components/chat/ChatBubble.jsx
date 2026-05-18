const VALUE_COLORS = {
  red:    "text-red-400 bg-red-500/10 border border-red-500/30",
  yellow: "text-yellow-400 bg-yellow-500/10 border border-yellow-500/30",
  orange: "text-orange-400 bg-orange-500/10 border border-orange-500/30",
  green:  "text-green-400 bg-green-500/10 border border-green-500/30",
  blue:   "text-blue-400 bg-blue-500/10 border border-blue-500/30",
};

const ALERT_STYLES = {
  critical: { bg: "bg-red-500/10 border-red-500/40",    icon: "🔴", text: "text-red-300" },
  warning:  { bg: "bg-yellow-500/10 border-yellow-500/40", icon: "🟡", text: "text-yellow-300" },
  info:     { bg: "bg-blue-500/10 border-blue-500/40",   icon: "🔵", text: "text-blue-300" },
};

function BlockAlert({ block }) {
  const s = ALERT_STYLES[block.level] ?? ALERT_STYLES.info;
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${s.bg} mb-2`}>
      <span className="text-sm shrink-0">{s.icon}</span>
      <span className={`text-xs font-bold ${s.text}`}>{block.text}</span>
    </div>
  );
}

function BlockSection({ block }) {
  return (
    <div className="flex items-center gap-2 mt-3 mb-1.5">
      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">{block.label}</span>
      <div className="flex-1 h-px bg-zinc-700/50" />
    </div>
  );
}

function BlockBullets({ block }) {
  return (
    <ul className="space-y-1.5">
      {block.items.map((item, i) => (
        <li key={i} className="flex items-center gap-2 text-xs">
          <span className="w-1 h-1 rounded-full bg-zinc-600 shrink-0 mt-0.5" />
          <span className="text-zinc-400">{item.text}</span>
          <span className={`font-mono font-bold px-1.5 py-0.5 rounded text-[11px] ${VALUE_COLORS[item.color] ?? VALUE_COLORS.blue}`}>
            {item.value}{item.unit}
          </span>
          {item.suffix && <span className="text-zinc-500">{item.suffix}</span>}
        </li>
      ))}
    </ul>
  );
}

function BlockRecommendation({ block }) {
  return (
    <div className="bg-red-600/8 border border-red-600/20 rounded-lg px-3 py-2.5">
      <p className="text-xs text-zinc-200 leading-relaxed">{block.text}</p>
    </div>
  );
}

function BlockConfidence({ block }) {
  const pct = block.value;
  const color = pct >= 80 ? "#22c55e" : pct >= 60 ? "#f59e0b" : "#ef4444";
  const label = pct >= 80 ? "High" : pct >= 60 ? "Medium" : "Low";
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-zinc-500">AI Confidence</span>
        <span className="font-black font-mono" style={{ color }}>{pct}% <span className="text-zinc-600 font-normal">{label}</span></span>
      </div>
      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div className="h-full rounded-full animate-bar-fill"
             style={{ width: `${pct}%`, backgroundColor: color, boxShadow: `0 0 8px ${color}80`, transition: "width 1s ease-out" }} />
      </div>
    </div>
  );
}

function BlockWhatIf({ block }) {
  return (
    <div className="space-y-1.5">
      {block.items.map((item, i) => (
        <div key={i} className="flex items-center justify-between text-xs bg-zinc-800/50 rounded-lg px-3 py-2 border border-zinc-700/40">
          <span className="text-zinc-400 font-medium">{item.label}</span>
          <div className="flex items-center gap-2">
            <span className="text-zinc-300">{item.outcome}</span>
            <span className={`font-mono font-bold text-[11px] ${
              item.positive === true ? "text-green-400" :
              item.positive === false ? "text-red-400" : "text-zinc-500"
            }`}>{item.delta}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function renderBlock(block, i) {
  switch (block.type) {
    case "alert":          return <BlockAlert key={i} block={block} />;
    case "section":        return <BlockSection key={i} block={block} />;
    case "bullets":        return <BlockBullets key={i} block={block} />;
    case "recommendation": return <BlockRecommendation key={i} block={block} />;
    case "confidence":     return <BlockConfidence key={i} block={block} />;
    case "whatif":         return <BlockWhatIf key={i} block={block} />;
    default:               return null;
  }
}

export default function ChatBubble({ message, streaming }) {
  const isUser = message.role === "user";
  const time   = message.ts.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className={`flex gap-3 animate-slide-up ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 mt-0.5 ${
        isUser ? "bg-zinc-700" : "bg-gradient-to-br from-red-600 to-red-800"
      }`}>
        {isUser ? "👤" : "🧠"}
      </div>

      {/* Bubble */}
      <div className={`max-w-[82%] flex flex-col space-y-1 ${isUser ? "items-end" : "items-start"}`}>
        {isUser ? (
          <div className="bg-red-600 text-white px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm leading-relaxed">
            {message.text}
          </div>
        ) : (
          <div className={`bg-zinc-900 border border-zinc-700/60 rounded-2xl rounded-tl-sm px-4 py-3 space-y-0.5 w-full
            ${streaming ? "stream-cursor" : ""}`}>
            {message.blocks?.map((b, i) => renderBlock(b, i))}
          </div>
        )}
        <span className="text-[10px] text-zinc-700 px-1">{time}</span>
      </div>
    </div>
  );
}
