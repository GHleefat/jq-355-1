import { useEffect, useRef, useState, useCallback } from "react";

export interface MouseInput {
  offsetX: number;
  offsetY: number;
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
  const offsetXRef = useRef(0);
  const offsetYRef = useRef(0);
  const [pointerLocked, setPointerLocked] = useState(false);
  const pointerLockedRef = useRef(false);
  const lastMoveTime = useRef(0);

  const emit = useCallback(() => {
    onInputChange({
      offsetX: offsetXRef.current,
      offsetY: offsetYRef.current,
      pointerLocked: pointerLockedRef.current,
    });
  }, [onInputChange]);

  useEffect(() => {
    if (!enabled) return;

    const sensitivity = 0.0028;
    const maxOffset = 1.0;
    const springBack = 2.2;

    const onMove = (e: MouseEvent) => {
      if (!pointerLockedRef.current) return;
      lastMoveTime.current = performance.now();
      offsetXRef.current = Math.max(
        -maxOffset,
        Math.min(maxOffset, offsetXRef.current + e.movementX * sensitivity),
      );
      offsetYRef.current = Math.max(
        -maxOffset,
        Math.min(maxOffset, offsetYRef.current + e.movementY * sensitivity),
      );
      emit();
    };

    const onLockChange = () => {
      const canvas = document.querySelector("canvas");
      const locked = document.pointerLockElement === canvas;
      pointerLockedRef.current = locked;
      setPointerLocked(locked);
      onPointerLockChange?.(locked);
      if (!locked) {
        offsetXRef.current = 0;
        offsetYRef.current = 0;
        emit();
      }
    };

    let raf = 0;
    const loop = () => {
      const now = performance.now();
      const idle = now - lastMoveTime.current > 50;
      if (pointerLockedRef.current && idle) {
        let changed = false;
        if (Math.abs(offsetXRef.current) > 0.001) {
          const step =
            Math.sign(offsetXRef.current) *
            Math.min(Math.abs(offsetXRef.current), springBack * 0.016);
          offsetXRef.current -= step;
          changed = true;
        }
        if (Math.abs(offsetYRef.current) > 0.001) {
          const step =
            Math.sign(offsetYRef.current) *
            Math.min(Math.abs(offsetYRef.current), springBack * 0.016);
          offsetYRef.current -= step;
          changed = true;
        }
        if (changed) emit();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    document.addEventListener("mousemove", onMove);
    document.addEventListener("pointerlockchange", onLockChange);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("pointerlockchange", onLockChange);
    };
  }, [enabled, onInputChange, onPointerLockChange, emit]);

  const requestLock = useCallback(() => {
    const canvas = document.querySelector("canvas");
    if (canvas && !pointerLockedRef.current && enabled) {
      canvas.requestPointerLock();
    }
  }, [enabled]);

  return { offsetXRef, offsetYRef, pointerLocked, requestLock };
}
