import { useGameStore } from "@/stores/gameStore";
import { Star, Cloud, Wind } from "lucide-react";

export function HUD() {
  const { flight, gameMode, starsCollected } = useGameStore();

  return (
    <div className="pointer-events-none absolute inset-0 z-20 select-none">
      <div className="absolute top-6 left-6 space-y-3">
        <div
          className="backdrop-blur-md bg-slate-900/55 rounded-xl px-5 py-3 border border-slate-700/60 shadow-lg shadow-black/30"
          style={{ textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}
        >
          <div className="text-xs text-slate-300 tracking-widest uppercase mb-1">
            Altitude
          </div>
          <div
            className="text-3xl font-light tracking-wider text-amber-100"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {Math.round(flight.altitude)}
            <span className="text-base text-slate-300 ml-2 tracking-normal">
              m
            </span>
          </div>
        </div>
        <div
          className="backdrop-blur-md bg-slate-900/55 rounded-xl px-5 py-3 border border-slate-700/60 shadow-lg shadow-black/30"
          style={{ textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}
        >
          <div className="text-xs text-slate-300 tracking-widest uppercase mb-1">
            Airspeed
          </div>
          <div
            className="text-3xl font-light tracking-wider text-amber-100"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {Math.round(flight.speed)}
            <span className="text-base text-slate-300 ml-2 tracking-normal">
              km/h
            </span>
          </div>
        </div>
      </div>

      <div className="absolute top-6 right-6 space-y-3">
        <div className="backdrop-blur-md bg-slate-900/55 rounded-xl px-5 py-3 border border-slate-700/60 shadow-lg shadow-black/30 flex items-center gap-3">
          {gameMode === "relax" ? (
            <Cloud className="w-5 h-5 text-sky-300" />
          ) : (
            <Star className="w-5 h-5 text-amber-300 fill-amber-300" />
          )}
          <span
            className="text-sm tracking-wider text-slate-100"
            style={{ textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}
          >
            {gameMode === "relax" ? "放松模式" : "收集模式"}
          </span>
        </div>
        {gameMode === "collect" && (
          <div className="backdrop-blur-md bg-slate-900/55 rounded-xl px-5 py-3 border border-slate-700/60 shadow-lg shadow-black/30">
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 text-amber-300 fill-amber-300" />
              <span
                className="text-2xl font-light tracking-wider text-amber-100"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  textShadow: "0 1px 3px rgba(0,0,0,0.6)",
                }}
              >
                {starsCollected}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <div className="backdrop-blur-md bg-slate-900/55 rounded-full px-6 py-2 border border-slate-700/60 shadow-lg shadow-black/30 flex items-center gap-3">
          <Wind
            className={`w-4 h-4 transition-all ${
              flight.inUpdraft ? "text-amber-300" : "text-slate-400"
            }`}
          />
          <div className="w-40 h-2 rounded-full bg-slate-800/60 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                flight.inUpdraft
                  ? "bg-gradient-to-r from-amber-400 to-amber-200"
                  : "bg-slate-500/60"
              }`}
              style={{ width: `${flight.updraftStrength * 100}%` }}
            />
          </div>
          <Wind
            className={`w-4 h-4 transition-all ${
              flight.inUpdraft ? "text-amber-300" : "text-slate-400"
            }`}
          />
        </div>
        {flight.inUpdraft && (
          <div
            className="text-center mt-2 text-amber-200 text-sm tracking-widest animate-pulse font-medium"
            style={{ textShadow: "0 0 8px rgba(251,191,36,0.5)" }}
          >
            ↑ 上升气流 ↑
          </div>
        )}
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="relative w-8 h-8 opacity-70">
          <div className="absolute left-1/2 top-0 w-px h-full bg-amber-100/80 -translate-x-1/2 shadow-[0_0_4px_rgba(0,0,0,0.8)]" />
          <div className="absolute top-1/2 left-0 h-px w-full bg-amber-100/80 -translate-y-1/2 shadow-[0_0_4px_rgba(0,0,0,0.8)]" />
        </div>
      </div>

      <div
        className="absolute bottom-6 left-6 text-slate-300/90 text-xs tracking-wider"
        style={{ textShadow: "0 1px 3px rgba(0,0,0,0.7)" }}
      >
        点击画面锁定鼠标 · ESC 暂停
      </div>
    </div>
  );
}
