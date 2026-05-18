import { useState } from "react";
import { useAIAsk } from "../../hooks/api/useTelemetry";
import { quickQuestions } from "../../data/chatMockData";
import SectionHeader from "../ui/SectionHeader";

function parseMarkdown(text) {
  return text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
    part.startsWith("**")
      ? <strong key={i} className="text-white font-bold">{part.slice(2, -2)}</strong>
      : part
  );
}

export default function AICopilotPreview({ onOpenChat }) {
  const { data, loading, execute } = useAIAsk();
  const [asked, setAsked] = useState(null);

  const handleAsk = (q) => {
    setAsked(q);
    execute(q);
  };

  const displayText = data?.recommendation
    ? `${data.recommendation} ${data.explanation ?? ""}`
    : null;

  return (
    <div className="card-hover relative overflow-hidden">
      <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <SectionHeader icon="💬" title="AI Copilot"
        action={
          <button onClick={onOpenChat}
            className="text-[10px] text-red-400 hover:text-red-300 border border-red-600/30 hover:border-red-500/50 px-2.5 py-1 rounded-lg transition-colors font-semibold">
            Open Chat →
          </button>
        }
      />

      {/* Quick questions */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {quickQuestions.map((q) => (
          <button key={q} onClick={() => handleAsk(q)} disabled={loading}
            className={`text-[10px] px-2.5 py-1 rounded-full border transition-colors disabled:opacity-40 ${
              asked === q
                ? "border-red-500 text-red-400 bg-red-500/10"
                : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
            }`}>
            {q}
          </button>
        ))}
      </div>

      {/* Response area */}
      <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-3 min-h-[80px] flex items-start gap-3">
        <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center text-sm shrink-0 mt-0.5">
          🧠
        </div>
        <div className="flex-1">
          {loading ? (
            <div className="flex items-center gap-1.5 pt-1">
              {[0,1,2].map(i => (
                <span key={i} className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          ) : displayText ? (
            <p className="text-xs text-zinc-300 leading-relaxed animate-slide-up">
              {parseMarkdown(displayText.slice(0, 280))}{displayText.length > 280 ? "…" : ""}
            </p>
          ) : (
            <p className="text-xs text-zinc-600 italic">
              Click a question above to get an AI insight…
            </p>
          )}
        </div>
      </div>

      {/* Confidence badge */}
      {data?.confidence_score && !loading && (
        <div className="flex justify-end mt-2">
          <span className="text-[10px] text-zinc-500 font-mono">
            Confidence: <span className="text-green-400 font-bold">
              {Math.round(data.confidence_score * 100)}%
            </span>
          </span>
        </div>
      )}
    </div>
  );
}
