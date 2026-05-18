import { useState } from "react";

const navItems = [
  { icon: "⚡", label: "Overview",    id: "overview",    section: "section-overview" },
  { icon: "📡", label: "Telemetry",   id: "telemetry",   section: "section-telemetry" },
  { icon: "🧠", label: "AI Strategy", id: "strategy",    section: "section-strategy" },
  { icon: "⚠️", label: "Risk",        id: "risk",        section: "section-risk" },
  { icon: "🔮", label: "Simulation",  id: "simulation",  section: "section-simulation" },
  { icon: "💬", label: "AI Copilot",  id: "copilot",     section: "section-copilot" },
];

const bottomItems = [
  { icon: "⚙️", label: "Settings", id: "settings" },
];

export default function Sidebar({ active, onNavigate, onSettings }) {
  const [collapsed, setCollapsed] = useState(false);

  const scrollTo = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleNav = (item) => {
    if (item.id === "settings") { onSettings?.(); return; }
    onNavigate?.(item.id);
    if (item.section) scrollTo(item.section);
  };

  return (
    <aside className={`
      flex flex-col glass-dark border-r border-white/[0.06]
      transition-all duration-300 ease-in-out shrink-0
      ${collapsed ? "w-[60px]" : "w-[220px]"}
      min-h-screen relative z-20
    `}>
      {/* Subtle scan-line overlay */}
      <div className="absolute inset-0 scan-line pointer-events-none rounded-none" />

      {/* ── Logo ──────────────────────────────────────────────────── */}
      <div className={`flex items-center border-b border-white/[0.06] shrink-0
        ${collapsed ? "justify-center px-0 py-5" : "gap-3 px-4 py-5"}`}>
        <div className="relative shrink-0">
          <span className="text-2xl">🏎️</span>
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-pulse-slow" />
        </div>
        {!collapsed && (
          <div>
            <span className="font-black text-base tracking-[0.2em] text-white uppercase">
              Race<span className="text-red-500">Mind</span>
            </span>
            <p className="text-[9px] text-zinc-600 tracking-widest uppercase mt-0.5">AI Platform</p>
          </div>
        )}
      </div>

      {/* ── Nav label ─────────────────────────────────────────────── */}
      {!collapsed && (
        <p className="px-4 pt-4 pb-1 text-[9px] font-bold tracking-[0.2em] text-zinc-600 uppercase">
          Navigation
        </p>
      )}

      {/* ── Nav items ─────────────────────────────────────────────── */}
      <nav className="flex-1 py-2 space-y-0.5 px-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item)}
              title={collapsed ? item.label : undefined}
              className={`
                w-full flex items-center rounded-lg text-sm font-medium
                transition-all duration-200 group relative
                ${collapsed ? "justify-center px-0 py-3" : "gap-3 px-3 py-2.5"}
                ${isActive
                  ? "bg-red-600/15 text-white border border-red-600/30"
                  : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.05] border border-transparent"
                }
              `}
            >
              {/* Active left bar */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-red-500 rounded-full" />
              )}

              {/* Hover glow */}
              {!isActive && (
                <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ background: "radial-gradient(ellipse at left center, rgba(255,255,255,0.03) 0%, transparent 70%)" }} />
              )}

              <span className={`text-base shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? "drop-shadow-[0_0_6px_rgba(225,6,0,0.8)]" : ""}`}>
                {item.icon}
              </span>
              {!collapsed && (
                <span className="truncate">{item.label}</span>
              )}
              {!collapsed && isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse-slow shrink-0" />
              )}
            </button>
          );
        })}

        {/* Divider */}
        <div className="my-2 border-t border-white/[0.05]" />

        {bottomItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNav(item)}
            title={collapsed ? item.label : undefined}
            className={`
              w-full flex items-center rounded-lg text-sm font-medium
              transition-all duration-200 text-zinc-600 hover:text-zinc-300
              hover:bg-white/[0.04] border border-transparent
              ${collapsed ? "justify-center px-0 py-3" : "gap-3 px-3 py-2.5"}
            `}
          >
            <span className="text-base shrink-0">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* ── IBM Granite branding pill ──────────────────────────────── */}
      <div className={`shrink-0 p-3 border-t border-white/[0.05] ${collapsed ? "px-2" : ""}`}>
        {!collapsed ? (
          <div className="gradient-pill rounded-xl p-3 cursor-default animate-glow-pulse transition-all duration-300 group">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-base">⚡</span>
              <span className="gradient-text text-xs font-black tracking-wide">IBM Granite</span>
            </div>
            <p className="text-[9px] text-zinc-500 leading-relaxed">
              Powered by <span className="text-violet-400 font-semibold">granite-3.3-8b-instruct</span>
              {" "}via Hugging Face
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              <span className="text-[9px] text-violet-400/70 font-medium tracking-wider uppercase">AI Active</span>
            </div>
          </div>
        ) : (
          <div className="gradient-pill rounded-xl p-2 flex items-center justify-center animate-glow-pulse cursor-default"
               title="IBM Granite AI">
            <span className="text-base">⚡</span>
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full mt-2 py-1.5 rounded-lg text-zinc-600 hover:text-zinc-400
                     hover:bg-white/[0.04] text-xs transition-colors flex items-center justify-center gap-1"
        >
          {collapsed ? "→" : (
            <>
              <span className="text-[10px]">←</span>
              <span className="text-[10px] tracking-wider">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
