import { useGameStore } from "@/stores/gameStore";
import { Star, Cloud, Wind, MousePointer2, Lock, Unlock } from "lucide-react";
import { PHYSICS } from "@/utils/constants";

export function HUD() {
  const { flight, gameMode, starsCollected, pointerLocked } = useGameStore();

  const pitchDeg = (flight.pitch * 180) / Math.PI;
  const yawDeg = ((flight.yaw * 180) / Math.PI) % 360;

  const indicatorRange = 40;
  const dotX = flight.inputOffsetX * indicatorRange;
  const dotY = flight.inputOffsetY * indicatorRange;
  const inputMagnitude = Math.min(
    1,
    Math.sqrt(flight.inputOffsetX ** 2 + flight.inputOffsetY ** 2),
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-20 select-none">
      <div className="absolute top-6 left-6 space-y-3">
        <div
          className="backdrop-blur-md bg-slate-900/60 rounded-xl px-5 py-3 border border-slate-700/60 shadow-lg shadow-black/30"
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
          className="backdrop-blur-md bg-slate-900/60 rounded-xl px-5 py-3 border border-slate-700/60 shadow-lg shadow-black/30"
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
        <div
          className="backdrop-blur-md bg-slate-900/60 rounded-xl px-5 py-3 border border-slate-700/60 shadow-lg shadow-black/30"
          style={{ textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}
        >
          <div className="flex gap-6 text-sm">
            <div>
              <div className="text-xs text-slate-400 tracking-wider mb-0.5">
                PITCH
              </div>
              <div className="text-amber-100 font-mono">
                {pitchDeg.toFixed(1)}°
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400 tracking-wider mb-0.5">
                YAW
              </div>
              <div className="text-amber-100 font-mono">
                {yawDeg >= 0 ? yawDeg.toFixed(0) : (yawDeg + 360).toFixed(0)}°
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-6 right-6 space-y-3">
        <div
          className="backdrop-blur-md bg-slate-900/60 rounded-xl px-5 py-3 border border-slate-700/60 shadow-lg shadow-black/30 flex items-center gap-3"
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
          <div className="backdrop-blur-md bg-slate-900/60 rounded-xl px-5 py-3 border border-slate-700/60 shadow-lg shadow-black/30">
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
              ? "bg-emerald-900/50 border-emerald-500/50"
              : "bg-rose-900/50 border-rose-400/50"
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
        <div className="backdrop-blur-md bg-slate-900/60 rounded-full px-6 py-2 border border-slate-700/60 shadow-lg shadow-black/30 flex items-center gap-3">
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
        <div className="relative" style={{ width: 110, height: 110 }}>
          <div
            className="absolute left-1/2 top-0 w-px h-full -translate-x-1/2 bg-amber-100/70"
            style={{ boxShadow: "0 0 6px rgba(0,0,0,0.85)" }}
          />
          <div
            className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-amber-100/70"
            style={{ boxShadow: "0 0 6px rgba(0,0,0,0.85)" }}
          />
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-amber-100/40"
            style={{ width: 88, height: 88 }}
          />
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-100/25"
            style={{ width: 52, height: 52 }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: 14,
              height: 14,
              left: `calc(50% + ${dotX}px - 7px)`,
              top: `calc(50% + ${dotY}px - 7px)`,
              background:
                inputMagnitude > 0.08
                  ? "rgba(251, 191, 36, 0.95)"
                  : "rgba(255, 241, 168, 0.4)",
              boxShadow:
                inputMagnitude > 0.08
                  ? "0 0 14px rgba(251,191,36,0.9), 0 0 4px rgba(255,255,255,0.8)"
                  : "0 0 4px rgba(0,0,0,0.6)",
              transition: "background 120ms, box-shadow 120ms",
            }}
          />
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-50"
            style={{
              width: 4,
              height: 4,
              boxShadow: "0 0 4px rgba(0,0,0,0.8)",
            }}
          />
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
