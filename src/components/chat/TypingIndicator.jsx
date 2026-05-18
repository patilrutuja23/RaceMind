export default function TypingIndicator({ phase = "Analyzing telemetry..." }) {
  return (
    <div className="flex gap-3 animate-slide-up">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-sm shrink-0">
        🧠
      </div>
      <div className="bg-zinc-900 border border-zinc-700/60 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-3">
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <span key={i} className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.18}s` }} />
          ))}
        </div>
        <span className="text-xs text-zinc-500 animate-pulse-slow font-medium">{phase}</span>
      </div>
    </div>
  );
}
