import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { WORLD } from "@/utils/constants";
import { useGameStore } from "@/stores/gameStore";

interface Props {
  enabled: boolean;
  gliderPosition: React.MutableRefObject<THREE.Vector3>;
}

export function Stars({ enabled, gliderPosition }: Props) {
  const { starsCollected, collectStar } = useGameStore();
  const starsCount = WORLD.STAR_COUNT;
  const meshesRef = useRef<THREE.Mesh[]>([]);

  const starPositions = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    for (let i = 0; i < starsCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 300 + Math.random() * 1500;
      positions.push(
        new THREE.Vector3(
          Math.cos(angle) * r,
          300 + Math.random() * 700,
          Math.sin(angle) * r,
        ),
      );
    }
    return positions;
  }, []);

  const collectedRef = useRef(new Set<number>());
  const collectDistSq =
    WORLD.STAR_COLLECT_DISTANCE * WORLD.STAR_COLLECT_DISTANCE;

  useFrame((state, dt) => {
    if (!enabled) return;
    const gpos = gliderPosition.current;
    if (!gpos) return;

    for (let i = 0; i < starsCount; i++) {
      if (collectedRef.current.has(i)) continue;
      const mesh = meshesRef.current[i];
      if (!mesh) continue;

      mesh.rotation.y += dt * 1.5;
      mesh.rotation.x += dt * 0.8;
      mesh.position.y =
        starPositions[i].y + Math.sin(state.clock.elapsedTime * 2 + i) * 3;

      const distSq = gpos.distanceToSquared(starPositions[i]);
      if (distSq < collectDistSq) {
        collectedRef.current.add(i);
        mesh.visible = false;
        collectStar();
      }
    }
  });

  useMemo(() => {
    collectedRef.current.clear();
    if (starsCollected === 0) {
      setTimeout(() => {
        meshesRef.current.forEach((m) => {
          if (m) m.visible = true;
        });
      }, 100);
    }
  }, [starsCollected === 0]);

  if (!enabled) return null;

  return (
    <group>
      {starPositions.map((pos, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) meshesRef.current[i] = el;
          }}
          position={pos}
        >
          <octahedronGeometry args={[5, 0]} />
          <meshStandardMaterial
            color={0xffd700}
            emissive={0xffaa00}
            emissiveIntensity={1.2}
            metalness={0.3}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}
