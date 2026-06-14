import { Play, Home, RefreshCw } from "lucide-react";
import { useGameStore, type GameMode } from "@/stores/gameStore";
import { useNavigate } from "react-router-dom";

export function PausePanel() {
  const { gameStatus, gameMode, resumeFlight, endFlight, setMode } =
    useGameStore();
  const navigate = useNavigate();

  if (gameStatus !== "paused") return null;

  const handleBack = () => {
    endFlight();
    navigate("/");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md" />
      <div className="relative z-10 w-96 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 p-10 shadow-2xl">
        <h2
          className="text-center text-4xl text-white/90 tracking-[0.25em] mb-10"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          暂 停
        </h2>

        <div className="space-y-3 mb-8">
          <div className="text-white/50 text-xs tracking-widest uppercase mb-3 text-center">
            切换模式
          </div>
          <div className="flex gap-2">
            {(["relax", "collect"] as GameMode[]).map((mode) => {
              const selected = gameMode === mode;
              return (
                <button
                  key={mode}
                  onClick={() => setMode(mode)}
                  className={`flex-1 py-3 rounded-xl text-sm tracking-wider transition-all ${
                    selected
                      ? "bg-amber-300/20 border border-amber-300/50 text-amber-100"
                      : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
                  }`}
                >
                  {mode === "relax" ? "放松模式" : "收集星星"}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={resumeFlight}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-white/15 border border-white/25 text-white tracking-widest hover:bg-white/25 hover:border-white/40 transition-all"
          >
            <Play className="w-5 h-5" />继 续 飞 行
          </button>
          <button
            onClick={handleBack}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-white/5 border border-white/10 text-white/70 tracking-widest hover:bg-white/10 transition-all"
          >
            <Home className="w-5 h-5" />返 回 主 菜 单
          </button>
        </div>

        <div className="mt-8 text-center text-white/30 text-xs tracking-wider">
          ESC 继续
        </div>
      </div>
    </div>
  );
}
