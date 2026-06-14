import { useEffect, useCallback } from "react";
import { Scene } from "@/components/three/Scene";
import { HUD } from "@/components/ui/HUD";
import { PausePanel } from "@/components/ui/PausePanel";
import { MousePointer2, X } from "lucide-react";
import { useGameStore } from "@/stores/gameStore";
import { useNavigate } from "react-router-dom";

export default function Fly() {
  const {
    gameStatus,
    pauseFlight,
    resumeFlight,
    pointerLocked,
    setPointerLocked,
  } = useGameStore();
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (gameStatus === "flying") {
          pauseFlight();
          if (document.pointerLockElement) {
            document.exitPointerLock();
          }
        } else if (gameStatus === "paused") {
          resumeFlight();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [gameStatus, pauseFlight, resumeFlight]);

  useEffect(() => {
    if (gameStatus === "menu") {
      navigate("/");
    }
  }, [gameStatus, navigate]);

  const handleRequestLock = useCallback(() => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      canvas.requestPointerLock();
    }
  }, []);

  const showGuide = !pointerLocked && gameStatus === "flying";

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-900">
      <Scene onPointerLockChange={setPointerLocked} />
      <HUD />
      <PausePanel />

      {showGuide && (
        <div
          className="pointer-events-auto absolute inset-0 z-30 flex items-center justify-center cursor-pointer"
          onClick={handleRequestLock}
        >
          <div className="absolute inset-0 bg-slate-900/55 backdrop-blur-[2px]" />
          <div
            className="relative z-10 text-center px-10 py-14 rounded-3xl bg-slate-900/60 border border-amber-200/30 shadow-2xl shadow-black/40 max-w-lg"
            onClick={(e) => {
              e.stopPropagation();
              handleRequestLock();
            }}
          >
            <div className="flex justify-center mb-6">
              <div className="p-5 rounded-full bg-amber-200/15 border border-amber-200/30">
                <MousePointer2 className="w-12 h-12 text-amber-200" />
              </div>
            </div>
            <h2
              className="text-4xl text-amber-100 tracking-[0.25em] mb-4"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              点 击 开 始 飞 行
            </h2>
            <p className="text-slate-300 leading-relaxed mb-2">
              点击画面任意位置锁定鼠标
            </p>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              鼠标上下 — 控制俯仰 &nbsp;·&nbsp; 鼠标左右 — 控制转向
            </p>
            <button
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-amber-200/10 border border-amber-200/30 text-amber-100 tracking-widest animate-pulse hover:bg-amber-200/20 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleRequestLock();
              }}
            >
              点 击 画 面
            </button>
            <div className="mt-8 flex items-center justify-center gap-2 text-slate-500 text-xs">
              <X className="w-3.5 h-3.5" />
              <span>ESC 暂停并解锁鼠标</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
