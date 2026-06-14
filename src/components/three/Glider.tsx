import { useRef, useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useGameStore } from "@/stores/gameStore";
import { sampleTerrainHeight } from "./Terrain";

interface Props {
  physicsState: React.MutableRefObject<{
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    yaw: number;
    pitch: number;
    bank: number;
    speed: number;
  }>;
  paused: boolean;
}

export function Glider({ physicsState, paused }: Props) {
  const gliderRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const camOffset = useRef(new THREE.Vector3(0, 8, 22));
  const targetCamPos = useRef(new THREE.Vector3());
  const lookTarget = useRef(new THREE.Vector3());
  const updateFlight = useGameStore((s) => s.updateFlight);

  const wingShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.quadraticCurveTo(6, 0.4, 14, 0.8);
    shape.lineTo(15, 0.3);
    shape.lineTo(15, -0.3);
    shape.quadraticCurveTo(6, -0.1, 0, -0.4);
    shape.closePath();
    return shape;
  }, []);

  useFrame((_, dt) => {
    if (!gliderRef.current || paused) return;
    const s = physicsState.current;
    if (!s.position) return;

    gliderRef.current.position.copy(s.position);
    gliderRef.current.rotation.set(s.pitch, s.yaw, s.bank, "YXZ");

    const forward = new THREE.Vector3(0, 0, -1).applyEuler(
      new THREE.Euler(s.pitch, s.yaw, 0, "YXZ"),
    );
    const up = new THREE.Vector3(0, 1, 0);
    const right = new THREE.Vector3().crossVectors(forward, up).normalize();
    up.crossVectors(right, forward).normalize();

    const offset = camOffset.current.clone();
    const camRel = new THREE.Vector3()
      .addScaledVector(right, offset.x)
      .addScaledVector(up, offset.y)
      .addScaledVector(forward, -offset.z);

    targetCamPos.current.copy(s.position).add(camRel);
    camera.position.lerp(targetCamPos.current, Math.min(1, dt * 3));

    lookTarget.current
      .copy(s.position)
      .addScaledVector(forward, 30)
      .addScaledVector(up, 3);
    camera.lookAt(lookTarget.current);

    const terrainHeight = sampleTerrainHeight(s.position.x, s.position.z);
    const altitude = Math.max(0, s.position.y - terrainHeight);
    updateFlight({
      altitude,
      speed: s.speed,
    });
  });

  return (
    <group ref={gliderRef}>
      <mesh castShadow>
        <cylinderGeometry args={[0.25, 0.15, 3, 8]} />
        <meshStandardMaterial
          color={0x3a4a5c}
          metalness={0.4}
          roughness={0.4}
        />
      </mesh>
      <mesh position={[0, 0, -0.5]} castShadow>
        <extrudeGeometry
          args={[
            wingShape,
            {
              depth: 0.25,
              bevelEnabled: true,
              bevelThickness: 0.05,
              bevelSize: 0.05,
              bevelSegments: 1,
            },
          ]}
        />
        <meshStandardMaterial
          color={0x4a88c8}
          metalness={0.3}
          roughness={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh
        position={[-14, 0, -0.5]}
        scale={[1, 1, 1]}
        rotation={[0, 0, 0]}
        castShadow
      >
        <extrudeGeometry
          args={[
            wingShape,
            {
              depth: 0.25,
              bevelEnabled: true,
              bevelThickness: 0.05,
              bevelSize: 0.05,
              bevelSegments: 1,
            },
          ]}
        />
        <meshStandardMaterial
          color={0x4a88c8}
          metalness={0.3}
          roughness={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, 0.6, 1.3]} rotation={[Math.PI, 0, 0]} castShadow>
        <shapeGeometry
          args={[
            new THREE.Shape()
              .moveTo(0, 0)
              .lineTo(0, 1.8)
              .lineTo(0.3, 1.8)
              .lineTo(0.8, 0.2)
              .lineTo(0, 0),
          ]}
        />
        <meshStandardMaterial color={0x3a6ba0} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.1, 1]} castShadow>
        <boxGeometry args={[0.5, 0.1, 1.5]} />
        <meshStandardMaterial
          color={0x4a88c8}
          metalness={0.3}
          roughness={0.35}
        />
      </mesh>
      <mesh position={[0, 0.1, 0.2]}>
        <sphereGeometry args={[0.35, 16, 12]} />
        <meshStandardMaterial
          color={0x88bbff}
          transparent
          opacity={0.6}
          metalness={0.1}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
}
