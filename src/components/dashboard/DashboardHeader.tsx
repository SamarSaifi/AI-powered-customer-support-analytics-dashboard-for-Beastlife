import { useState, useEffect, useRef } from "react";
import { RefreshCw, ChevronDown, Check, Sun, Moon, Printer } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useGetKpis } from "@/hooks/useData";

const INTERVAL_OPTIONS = [
  { label: "Off", ms: 0 },
  { label: "30s", ms: 30 * 1000 },
  { label: "1 min", ms: 60 * 1000 },
  { label: "5 min", ms: 5 * 60 * 1000 },
];

export function DashboardHeader() {
  const queryClient = useQueryClient();
  const [isDark, setIsDark] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedIntervalMs, setSelectedIntervalMs] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const kpisQuery = useGetKpis();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (selectedIntervalMs === 0) return;
    const timer = setInterval(() => handleRefresh(), selectedIntervalMs);
    return () => clearInterval(timer);
  }, [selectedIntervalMs]);

  const handleRefresh = async () => {
    setIsSpinning(true);
    await queryClient.invalidateQueries();
    setTimeout(() => setIsSpinning(false), 600);
  };

  const lastRefreshed = kpisQuery.dataUpdatedAt
    ? (() => {
        const d = new Date(kpisQuery.dataUpdatedAt);
        const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).toLowerCase();
        const date = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        return `${time} on ${date}`;
      })()
    : null;

  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
      <div className="pt-2">
        <h1 className="font-bold text-[32px] tracking-tight">Beastlife Intelligence</h1>
        <p className="text-muted-foreground mt-1 text-[14px]">AI-powered customer support analytics & insights</p>
        {lastRefreshed && <p className="text-[12px] text-muted-foreground mt-3">Last refresh: {lastRefreshed}</p>}
      </div>

      <div className="flex items-center gap-3 pt-2 print:hidden">
        <div className="relative" ref={dropdownRef}>
          <div
            className="flex items-center rounded-[6px] overflow-hidden h-[26px] text-[12px]"
            style={{ backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#F0F1F2", color: isDark ? "#c8c9cc" : "#4b5563" }}
          >
            <button
              onClick={handleRefresh}
              className="flex items-center gap-1 px-2 h-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSpinning ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <div className="w-px h-4 shrink-0" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)" }} />
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="flex items-center justify-center px-1.5 h-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {dropdownOpen && (
            <div className="absolute top-full right-0 mt-1 w-40 bg-popover border border-border rounded-md shadow-md z-50 overflow-hidden py-1">
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground border-b border-border">Auto-refresh</div>
              {INTERVAL_OPTIONS.map((opt) => (
                <button
                  key={opt.label}
                  className="w-full text-left px-3 py-1.5 text-sm flex items-center justify-between hover:bg-muted transition-colors"
                  onClick={() => { setSelectedIntervalMs(opt.ms); setDropdownOpen(false); }}
                >
                  {opt.label}
                  {selectedIntervalMs === opt.ms && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center justify-center w-[26px] h-[26px] rounded-[6px] transition-colors"
          style={{ backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#F0F1F2", color: isDark ? "#c8c9cc" : "#4b5563" }}
          aria-label="Export as PDF"
        >
          <Printer className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setIsDark((d) => !d)}
          className="flex items-center justify-center w-[26px] h-[26px] rounded-[6px] transition-colors"
          style={{ backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#F0F1F2", color: isDark ? "#c8c9cc" : "#4b5563" }}
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}
