import { useEffect, useRef } from "react";

export interface MouseInput {
  yaw: number;
  pitch: number;
  pointerLocked: boolean;
}

export function useMouseControls(
  enabled: boolean,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  onInputChange: (input: MouseInput) => void,
) {
  const yawRef = useRef(0);
  const pitchRef = useRef(0);
  const lockedRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onMove = (e: MouseEvent) => {
      if (!lockedRef.current) return;
      yawRef.current += e.movementX * 0.002;
      pitchRef.current = Math.max(
        -0.6,
        Math.min(0.8, pitchRef.current + e.movementY * 0.002),
      );
      onInputChange({
        yaw: yawRef.current,
        pitch: pitchRef.current,
        pointerLocked: true,
      });
    };

    const onLockChange = () => {
      lockedRef.current = document.pointerLockElement === canvas;
      if (!lockedRef.current) {
        onInputChange({
          yaw: yawRef.current,
          pitch: pitchRef.current,
          pointerLocked: false,
        });
      }
    };

    const onClick = () => {
      if (!lockedRef.current) {
        canvas.requestPointerLock();
      }
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("pointerlockchange", onLockChange);
    canvas.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("pointerlockchange", onLockChange);
      canvas.removeEventListener("click", onClick);
    };
  }, [enabled, canvasRef, onInputChange]);

  return { yawRef, pitchRef };
}
