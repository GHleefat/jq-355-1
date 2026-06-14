import { useEffect, useRef, useState } from "react";

export interface MouseInput {
  yaw: number;
  pitch: number;
  pointerLocked: boolean;
}

interface Props {
  enabled: boolean;
  onInputChange: (input: MouseInput) => void;
  onPointerLockChange?: (locked: boolean) => void;
}

export function useMouseControls({
  enabled,
  onInputChange,
  onPointerLockChange,
}: Props) {
  const yawRef = useRef(0);
  const pitchRef = useRef(0);
  const [pointerLocked, setPointerLocked] = useState(false);
  const pointerLockedRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const sensitivity = 0.004;

    const onMove = (e: MouseEvent) => {
      if (!pointerLockedRef.current) return;
      yawRef.current += e.movementX * sensitivity;
      pitchRef.current = Math.max(
        -0.6,
        Math.min(0.8, pitchRef.current + e.movementY * sensitivity),
      );
      onInputChange({
        yaw: yawRef.current,
        pitch: pitchRef.current,
        pointerLocked: true,
      });
    };

    const onLockChange = () => {
      const canvas = document.querySelector("canvas");
      const locked = document.pointerLockElement === canvas;
      pointerLockedRef.current = locked;
      setPointerLocked(locked);
      onPointerLockChange?.(locked);
      if (!locked) {
        onInputChange({
          yaw: yawRef.current,
          pitch: pitchRef.current,
          pointerLocked: false,
        });
      }
    };

    const onClick = () => {
      const canvas = document.querySelector("canvas");
      if (canvas && !pointerLockedRef.current && enabled) {
        canvas.requestPointerLock();
      }
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("pointerlockchange", onLockChange);
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("pointerlockchange", onLockChange);
      document.removeEventListener("click", onClick);
    };
  }, [enabled, onInputChange, onPointerLockChange]);

  return { yawRef, pitchRef, pointerLocked };
}
