import { useRef, useState, useCallback, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Sky } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { Terrain } from "./Terrain";
import { Clouds } from "./Clouds";
import { Updrafts } from "./Updrafts";
import { Stars } from "./Stars";
import { Glider } from "./Glider";
import { useFlightPhysics, type UpdraftZone } from "@/hooks/useFlightPhysics";
import { useMouseControls } from "@/hooks/useMouseControls";
import { useGameStore } from "@/stores/gameStore";
import { COLORS } from "@/utils/constants";

function CameraSetup() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 760, 30);
    camera.far = 8000;
    camera.near = 0.5;
    camera.updateProjectionMatrix();
  }, [camera]);
  return null;
}

function SceneContent() {
  const paused = useGameStore((s) => s.gameStatus === "paused");
  const gameMode = useGameStore((s) => s.gameMode);
  const updateFlight = useGameStore((s) => s.updateFlight);

  const { stateRef, step, reset } = useFlightPhysics();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const updraftsRef = useRef<UpdraftZone[]>([]);
  const mousePitchRef = useRef(0);
  const mouseYawRef = useRef(0);

  const handleZonesReady = useCallback((zones: UpdraftZone[]) => {
    updraftsRef.current = zones;
  }, []);

  const handleInputChange = useCallback(
    (input: { yaw: number; pitch: number }) => {
      mousePitchRef.current = input.pitch;
      mouseYawRef.current = input.yaw;
    },
    [],
  );

  const { gl } = useThree();
  useEffect(() => {
    canvasRef.current = gl.domElement;
  }, [gl]);

  useMouseControls(!paused, canvasRef, handleInputChange);

  useEffect(() => {
    reset();
    mousePitchRef.current = 0;
    mouseYawRef.current = 0;
  }, [reset]);

  let rafLast = performance.now();

  useEffect(() => {
    let running = true;
    const loop = (now: number) => {
      if (!running) return;
      const dt = Math.min(0.05, (now - rafLast) / 1000);
      rafLast = now;
      if (!paused) {
        const result = step(
          dt,
          mousePitchRef.current,
          mouseYawRef.current,
          updraftsRef.current,
        );
        stateRef.current.position.copy(result.position);
        stateRef.current.velocity.copy(result.velocity);
        stateRef.current.yaw = result.yaw;
        stateRef.current.pitch = result.pitch;
        stateRef.current.bank = result.bank;
        stateRef.current.speed = result.speed;
        updateFlight({
          inUpdraft: result.updraftStrength > 0.05,
          updraftStrength: result.updraftStrength,
        });
      }
      requestAnimationFrame(loop);
    };
    const id = requestAnimationFrame(loop);
    return () => {
      running = false;
      cancelAnimationFrame(id);
    };
  }, [paused, step, updateFlight, stateRef]);

  return (
    <>
      <CameraSetup />
      <hemisphereLight args={[0x87ceeb, 0x2d4a3e, 0.6]} />
      <directionalLight
        position={[300, 600, -200]}
        intensity={1.3}
        color={0xffeedd}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={2000}
        shadow-camera-left={-800}
        shadow-camera-right={800}
        shadow-camera-top={800}
        shadow-camera-bottom={-800}
      />
      <Sky
        distance={450000}
        sunPosition={[300, 350, -200]}
        inclination={0.52}
        azimuth={0.25}
        turbidity={2}
        rayleigh={0.8}
        mieCoefficient={0.003}
        mieDirectionalG={0.8}
      />
      <fog attach="fog" args={[COLORS.SKY_BOTTOM, 1200, 5500]} />
      <Terrain />
      <Clouds />
      <Updrafts onZonesReady={handleZonesReady} />
      <Stars
        enabled={gameMode === "collect"}
        gliderPosition={{ current: stateRef.current.position }}
      />
      <Glider physicsState={stateRef} paused={paused} />
      <EffectComposer multisampling={0} enableNormalPass={false}>
        <Bloom
          intensity={0.25}
          luminanceThreshold={0.55}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.25} darkness={0.35} />
      </EffectComposer>
    </>
  );
}

export function Scene() {
  return (
    <Canvas
      shadows
      gl={{ antialias: true, powerPreference: "high-performance" }}
      dpr={[1, 1.5]}
      camera={{ fov: 70, near: 0.5, far: 8000, position: [0, 760, 30] }}
      style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
    >
      <SceneContent />
    </Canvas>
  );
}
