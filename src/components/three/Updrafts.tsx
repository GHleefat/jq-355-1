import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { WORLD, PHYSICS } from "@/utils/constants";
import type { UpdraftZone } from "@/hooks/useFlightPhysics";

interface Props {
  onZonesReady: (zones: UpdraftZone[]) => void;
}

export function Updrafts({ onZonesReady }: Props) {
  const zones = useMemo<UpdraftZone[]>(() => {
    const arr: UpdraftZone[] = [];
    for (let i = 0; i < WORLD.UPDRAFT_COUNT; i++) {
      const angle =
        (i / WORLD.UPDRAFT_COUNT) * Math.PI * 2 + Math.random() * 0.5;
      const radius = 400 + Math.random() * 1200;
      arr.push({
        position: new THREE.Vector3(
          Math.cos(angle) * radius,
          200,
          Math.sin(angle) * radius,
        ),
        radius: PHYSICS.UPDRAFT_RADIUS + Math.random() * 40,
        strength: 0.5 + Math.random() * 0.5,
      });
    }
    return arr;
  }, []);

  useMemo(() => {
    onZonesReady(zones);
  }, [zones, onZonesReady]);

  const particlesRef = useRef<THREE.Points[]>([]);
  const particleData = useMemo(() => {
    return zones.map((z) => {
      const count = 40;
      const positions = new Float32Array(count * 3);
      const offsets = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        const r = Math.random() * z.radius * 0.9;
        const a = Math.random() * Math.PI * 2;
        positions[i * 3] = Math.cos(a) * r;
        positions[i * 3 + 1] = Math.random() * 800;
        positions[i * 3 + 2] = Math.sin(a) * r;
        offsets[i] = Math.random() * 10;
      }
      return { positions, offsets };
    });
  }, [zones]);

  useFrame((_, dt) => {
    particlesRef.current.forEach((pts, idx) => {
      const pos = pts.geometry.attributes.position as THREE.BufferAttribute;
      const offs = particleData[idx].offsets;
      for (let i = 0; i < offs.length; i++) {
        offs[i] += dt * 60 * zones[idx].strength;
        let y = pos.getY(i) + dt * 80 * zones[idx].strength;
        if (y > 800) y = 0;
        pos.setY(i, y);
      }
      pos.needsUpdate = true;
    });
  });

  return (
    <group>
      {zones.map((z, i) => (
        <group key={i} position={z.position}>
          <mesh>
            <cylinderGeometry
              args={[z.radius, z.radius * 0.6, 800, 16, 1, true]}
            />
            <meshBasicMaterial
              color={0xffd700}
              transparent
              opacity={0.06}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
          <points
            ref={(el) => {
              if (el) particlesRef.current[i] = el;
            }}
          >
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={particleData[i].positions.length / 3}
                array={particleData[i].positions}
                itemSize={3}
              />
            </bufferGeometry>
            <pointsMaterial
              color={0xffe066}
              size={3}
              transparent
              opacity={0.6}
              sizeAttenuation
              depthWrite={false}
            />
          </points>
        </group>
      ))}
    </group>
  );
}
