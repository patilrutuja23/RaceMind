import { useEffect } from "react";

export default function SettingsModal({ open, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative glass-dark rounded-2xl p-6 w-full max-w-md mx-4 neon-border-blue animate-slide-up">
        {/* Glow */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-24 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            <h2 className="text-base font-bold text-white">Configuration</h2>
          </div>
          <button onClick={onClose}
            className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white
                       flex items-center justify-center text-sm transition-colors">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* IBM Granite / HF */}
          <div>
            <p className="section-label mb-2">IBM Granite via Hugging Face</p>
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 space-y-2 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="text-zinc-600 w-28 shrink-0">HF_API_KEY</span>
                <span className="text-violet-400">hf_your_key_here</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-zinc-600 w-28 shrink-0">HF_MODEL_ID</span>
                <span className="text-blue-400">ibm-granite/granite-3.3-8b-instruct</span>
              </div>
            </div>
            <p className="text-[10px] text-zinc-600 mt-1.5">
              Get a free key at{" "}
              <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noreferrer"
                 className="text-violet-400 hover:text-violet-300 underline">
                huggingface.co/settings/tokens
              </a>
            </p>
          </div>

          {/* WebSocket */}
          <div>
            <p className="section-label mb-2">Live Telemetry</p>
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="text-zinc-600 w-28 shrink-0">VITE_WS_URL</span>
                <span className="text-green-400">ws://localhost:8000/ws/telemetry</span>
              </div>
            </div>
          </div>

          {/* Backend */}
          <div>
            <p className="section-label mb-2">Backend</p>
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 font-mono text-xs space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-zinc-600 w-28 shrink-0">API URL</span>
                <span className="text-orange-400">http://localhost:8000</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-zinc-600 w-28 shrink-0">Swagger UI</span>
                <span className="text-orange-400">http://localhost:8000/docs</span>
              </div>
            </div>
          </div>
        </div>

        <button onClick={onClose}
          className="w-full mt-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-colors">
          Close
        </button>
      </div>
    </div>
  );
}
