import { useGameStore } from "@/stores/gameStore";
import { Star, Cloud, Wind, MousePointer2, Lock, Unlock } from "lucide-react";

export function HUD() {
  const { flight, gameMode, starsCollected, pointerLocked } = useGameStore();

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
        <div
          className="backdrop-blur-md bg-slate-900/55 rounded-xl px-5 py-3 border border-slate-700/60 shadow-lg shadow-black/30 flex items-center gap-3"
          style={{ textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}
        >
          {gameMode === "relax" ? (
            <Cloud className="w-5 h-5 text-sky-300" />
          ) : (
            <Star className="w-5 h-5 text-amber-300 fill-amber-300" />
          )}
          <span className="text-sm tracking-wider text-slate-100">
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
        <div
          className={`backdrop-blur-md rounded-xl px-4 py-2 border shadow-lg shadow-black/30 flex items-center gap-2 ${
            pointerLocked
              ? "bg-emerald-900/40 border-emerald-500/40"
              : "bg-rose-900/40 border-rose-400/40"
          }`}
          style={{ textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}
        >
          {pointerLocked ? (
            <Lock className="w-4 h-4 text-emerald-300" />
          ) : (
            <Unlock className="w-4 h-4 text-rose-300" />
          )}
          <span
            className={`text-xs tracking-wider ${
              pointerLocked ? "text-emerald-200" : "text-rose-200"
            }`}
          >
            {pointerLocked ? "已锁定 · 操控中" : "未锁定 · 点击画面"}
          </span>
        </div>
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
        <div className="relative w-8 h-8 opacity-80">
          <div className="absolute left-1/2 top-0 w-px h-full bg-amber-100/90 -translate-x-1/2 shadow-[0_0_4px_rgba(0,0,0,0.8)]" />
          <div className="absolute top-1/2 left-0 h-px w-full bg-amber-100/90 -translate-y-1/2 shadow-[0_0_4px_rgba(0,0,0,0.8)]" />
        </div>
      </div>

      <div
        className="absolute bottom-6 left-6 text-slate-300/90 text-xs tracking-wider flex items-center gap-2"
        style={{ textShadow: "0 1px 3px rgba(0,0,0,0.7)" }}
      >
        <MousePointer2 className="w-3.5 h-3.5" />
        <span>上下:俯仰 &nbsp;·&nbsp; 左右:转向 &nbsp;·&nbsp; ESC:暂停</span>
      </div>
    </div>
  );
}
