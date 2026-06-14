import { Cloud, Star, MousePointer2 } from "lucide-react";
import { useGameStore, type GameMode } from "@/stores/gameStore";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export function MainMenu() {
  const { gameMode, setMode, startFlight } = useGameStore();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    const w = () =>
      (canvas.width = canvas.offsetWidth * window.devicePixelRatio);
    const h = () =>
      (canvas.height = canvas.offsetHeight * window.devicePixelRatio);
    w();
    h();
    const onResize = () => {
      w();
      h();
    };
    window.addEventListener("resize", onResize);

    const clouds: { x: number; y: number; r: number; s: number; o: number }[] =
      [];
    for (let i = 0; i < 14; i++) {
      clouds.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.8,
        r: 40 + Math.random() * 120,
        s: 0.15 + Math.random() * 0.4,
        o: 0.15 + Math.random() * 0.35,
      });
    }

    const draw = (t: number) => {
      const grd = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grd.addColorStop(0, "#1e3a5f");
      grd.addColorStop(0.5, "#6a8fb8");
      grd.addColorStop(0.85, "#f4a261");
      grd.addColorStop(1, "#e76f51");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      clouds.forEach((c) => {
        c.x += c.s;
        if (c.x - c.r * 3 > canvas.width) c.x = -c.r * 3;
        const g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.r * 2.5);
        g.addColorStop(0, `rgba(255,255,255,${c.o})`);
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(c.x, c.y, c.r * 2.5, c.r, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.save();
      ctx.translate(
        canvas.width * 0.75,
        canvas.height * 0.55 + Math.sin(t * 0.0008) * 15,
      );
      ctx.rotate(-0.15 + Math.sin(t * 0.001) * 0.05);
      ctx.fillStyle = "rgba(20,30,50,0.85)";
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(110, 5);
      ctx.lineTo(0, 0);
      ctx.lineTo(-110, 5);
      ctx.lineTo(0, 0);
      ctx.lineTo(0, -8);
      ctx.lineTo(0, 40);
      ctx.lineTo(25, 42);
      ctx.lineTo(0, 28);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const handleStart = () => {
    startFlight();
    navigate("/fly");
  };

  return (
    <div className="relative w-full h-screen overflow-hidden font-sans">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
        <h1
          className="font-serif text-7xl md:text-8xl text-white/95 tracking-wider mb-3 drop-shadow-2xl"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          云端滑翔
        </h1>
        <p className="text-white/70 text-lg tracking-widest mb-16">
          穿云海 · 越山谷 · 随风而行
        </p>

        <div className="flex gap-6 mb-12">
          {(["relax", "collect"] as GameMode[]).map((mode) => {
            const selected = gameMode === mode;
            return (
              <button
                key={mode}
                onClick={() => setMode(mode)}
                className={`group relative w-56 h-44 rounded-2xl backdrop-blur-xl transition-all duration-500 overflow-hidden ${
                  selected
                    ? "bg-white/20 border-2 border-amber-300 shadow-[0_0_40px_rgba(255,215,0,0.3)] scale-105"
                    : "bg-white/8 border-2 border-white/15 hover:bg-white/12 hover:scale-[1.02]"
                }`}
              >
                <div className="flex flex-col items-center justify-center h-full gap-4 px-6">
                  <div
                    className={`p-4 rounded-full ${selected ? "bg-amber-300/20" : "bg-white/10"}`}
                  >
                    {mode === "relax" ? (
                      <Cloud
                        className={`w-10 h-10 ${selected ? "text-amber-200" : "text-white/80"}`}
                      />
                    ) : (
                      <Star
                        className={`w-10 h-10 ${selected ? "text-amber-200 fill-amber-200" : "text-white/80"}`}
                      />
                    )}
                  </div>
                  <div className="text-center">
                    <div
                      className={`text-xl font-medium tracking-wide ${selected ? "text-amber-100" : "text-white/90"}`}
                    >
                      {mode === "relax" ? "放松模式" : "收集星星"}
                    </div>
                    <div className="text-xs text-white/50 mt-1 leading-relaxed">
                      {mode === "relax"
                        ? "纯粹欣赏风景\n无目标无压力"
                        : "飞越金色星点\n享受收集乐趣"}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleStart}
          className="group relative px-16 py-4 rounded-full bg-white/10 border-2 border-white/30 text-white text-xl tracking-[0.3em] font-light hover:bg-white/20 hover:border-white/50 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-500 hover:-translate-y-1"
        >
          <span className="relative z-10">开 始 飞 行</span>
        </button>

        <div className="absolute bottom-8 right-8 flex items-center gap-3 text-white/40 text-sm">
          <MousePointer2 className="w-5 h-5" />
          <div className="leading-relaxed">
            <div>点击画面锁定鼠标</div>
            <div>上下移动 · 俯仰</div>
            <div>左右移动 · 转向</div>
            <div className="mt-1 text-white/30">ESC · 暂停</div>
          </div>
        </div>
      </div>
    </div>
  );
}
