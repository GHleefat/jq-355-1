import { useEffect } from "react";
import { Scene } from "@/components/three/Scene";
import { HUD } from "@/components/ui/HUD";
import { PausePanel } from "@/components/ui/PausePanel";
import { useGameStore } from "@/stores/gameStore";
import { useNavigate } from "react-router-dom";

export default function Fly() {
  const { gameStatus, pauseFlight, resumeFlight, endFlight } = useGameStore();
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

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-900">
      <Scene />
      <HUD />
      <PausePanel />
    </div>
  );
}
