import { useEffect, useRef, useState } from "react";
import { useChat } from "../../hooks/useChat";
import ChatBubble from "./ChatBubble";
import TypingIndicator from "./TypingIndicator";
import { quickQuestions } from "../../data/chatMockData";

export default function AICopilotChat() {
  const { messages, typing, typingPhase, streamingId, sendMessage } = useChat();
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || typing) return;
    setInput("");
    sendMessage(text);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950/80 border border-zinc-800 rounded-2xl overflow-hidden">

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-800/80 bg-zinc-900/60 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-base">
              🧠
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-zinc-900 animate-pulse" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">RaceMind AI Copilot</p>
            <p className="text-[10px] text-zinc-500">IBM Granite · Live telemetry connected</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px] text-green-400 font-semibold">LIVE</span>
        </div>
      </div>

      {/* ── Messages ────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} streaming={msg.id === streamingId} />
        ))}
        {typing && <TypingIndicator phase={typingPhase} />}
        <div ref={bottomRef} />
      </div>

      {/* ── Quick questions ─────────────────────────────────────── */}
      <div className="px-4 pb-2 pt-1 flex flex-wrap gap-1.5 border-t border-zinc-800/60 shrink-0">
        {quickQuestions.map((q) => (
          <button key={q} onClick={() => sendMessage(q)} disabled={typing}
            className="text-[10px] px-2.5 py-1.5 rounded-full border border-zinc-700 text-zinc-500
                       hover:border-red-500/60 hover:text-red-400 hover:bg-red-500/5
                       transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed">
            {q}
          </button>
        ))}
      </div>

      {/* ── Input ───────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-zinc-800/80 bg-zinc-900/40 shrink-0">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          disabled={typing}
          placeholder="Ask about strategy, tires, lap times..."
          className="flex-1 bg-zinc-800/60 border border-zinc-700/60 rounded-xl px-4 py-2.5 text-sm text-white
                     placeholder-zinc-600 focus:outline-none focus:border-red-500/60 focus:bg-zinc-800
                     transition-all duration-200 disabled:opacity-40"
        />
        <button onClick={handleSend} disabled={!input.trim() || typing}
          className="w-9 h-9 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-30
                     disabled:cursor-not-allowed flex items-center justify-center transition-all
                     duration-200 hover:shadow-[0_0_12px_rgba(225,6,0,0.4)] shrink-0">
          <svg className="w-4 h-4 text-white rotate-90" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
