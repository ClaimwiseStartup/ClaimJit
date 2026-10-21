import type { ReactNode } from "react";

// Desktop-app style container: title bar with window controls, module icon,
// title, optional tabs and a status slot on the right.
type Tone = "light" | "dark";

const ICONS: Record<string, ReactNode> = {
  doc: <path d="M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 15h5M10 18h3" />,
  claim: <path d="M5 4h14v16l-3-2-2 2-2-2-2 2-2-2-3 2zM9 9h6M9 12h6" />,
  book: <path d="M5 4h6a3 3 0 013 3v13a2 2 0 00-2-2H5zM19 4h-5M19 4v14h-5" />,
  shield: <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6zM9 12l2 2 4-4" />,
  calendar: <path d="M4 6h16v14H4zM4 10h16M9 3v4M15 3v4" />,
  pulse: <path d="M3 12h4l2-5 4 10 2-5h6" />,
};

export default function WindowPane({
  title,
  icon = "doc",
  meta,
  tabs,
  activeTab = 0,
  tone = "light",
  className = "",
  bodyClassName = "",
  children,
}: {
  title: string;
  icon?: keyof typeof ICONS;
  meta?: ReactNode;
  tabs?: string[];
  activeTab?: number;
  tone?: Tone;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
}) {
  const dark = tone === "dark";
  return (
    <div
      className={`flex flex-col rounded-xl overflow-hidden border ${
        dark
          ? "border-white/10 bg-[#111a2e]/80 backdrop-blur shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]"
          : "border-[#CBD5E1]/70 bg-white shadow-[0_1px_0_rgba(15,23,42,0.04),0_24px_60px_-32px_rgba(15,23,42,0.35)]"
      } ${className}`}
    >
      {/* Title bar */}
      <div
        className={`flex items-center gap-3 h-10 px-3.5 border-b ${
          dark ? "bg-white/[0.03] border-white/[0.07]" : "bg-gradient-to-b from-[#F8FAFC] to-[#F1F5F9] border-[#E2E8F0]"
        }`}
      >
        <div className="flex gap-1.5 shrink-0" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span key={i} className={`w-2.5 h-2.5 rounded-full ${dark ? "bg-white/15" : "bg-[#CBD5E1]"}`} />
          ))}
        </div>
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`shrink-0 ${dark ? "text-[#5EEAD4]" : "text-[#0F766E]"}`}
          aria-hidden
        >
          {ICONS[icon]}
        </svg>
        <span
          className={`font-mono text-[10.5px] tracking-[0.08em] uppercase truncate ${
            dark ? "text-white/70" : "text-[#334155]"
          }`}
        >
          {title}
        </span>
        {tabs && (
          <div className="hidden xl:flex items-end h-full ml-3 gap-0.5">
            {tabs.map((t, i) => (
              <span
                key={t}
                className={`px-3 h-[30px] flex items-center whitespace-nowrap text-[11px] rounded-t-md border-x border-t ${
                  i === activeTab
                    ? dark
                      ? "bg-[#111a2e] border-white/10 text-white/85"
                      : "bg-white border-[#E2E8F0] text-[#1E293B]"
                    : dark
                    ? "border-transparent text-white/35"
                    : "border-transparent text-[#94A3B8]"
                }`}
              >
                {t}
              </span>
            ))}
          </div>
        )}
        {meta && <div className="ml-auto shrink-0 flex items-center">{meta}</div>}
      </div>
      <div className={`flex-1 ${bodyClassName}`}>{children}</div>
    </div>
  );
}

export function StatusPill({ tone, children }: { tone: "ok" | "warn" | "alert" | "info"; children: ReactNode }) {
  const styles = {
    ok: "bg-[#0F766E]/10 text-[#0F766E] ring-[#0F766E]/20",
    warn: "bg-[#B45309]/10 text-[#B45309] ring-[#B45309]/20",
    alert: "bg-[#991B1B]/10 text-[#991B1B] ring-[#991B1B]/20",
    info: "bg-[#1E293B]/[0.06] text-[#334155] ring-[#1E293B]/10",
  }[tone];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10.5px] font-semibold ring-1 ring-inset ${styles}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
