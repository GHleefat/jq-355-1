import { useMemo, useRef } from "react";
import * as THREE from "three";
import { WORLD, COLORS } from "@/utils/constants";
import { fbm2 } from "@/utils/noise";

export function Terrain() {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const size = WORLD.TERRAIN_SIZE;
    const seg = WORLD.TERRAIN_SEGMENTS;
    const geo = new THREE.PlaneGeometry(size, size, seg, seg);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const darkColor = new THREE.Color(COLORS.MOUNTAIN_DARK);
    const lightColor = new THREE.Color(COLORS.MOUNTAIN_LIGHT);
    const valleyColor = new THREE.Color(COLORS.VALLEY);
    const tmp = new THREE.Color();

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const nx = x / size + 0.5;
      const nz = z / size + 0.5;

      let h = 0;
      h += fbm2(nx * 1.5, nz * 1.5, 5) * 0.5;
      h += fbm2(nx * 4, nz * 4, 3) * 0.2;
      h += fbm2(nx * 10, nz * 10, 2) * 0.05;

      const height = h * WORLD.TERRAIN_HEIGHT;
      pos.setY(i, height);

      const normH = Math.max(
        0,
        Math.min(
          1,
          (height + WORLD.TERRAIN_HEIGHT * 0.3) / (WORLD.TERRAIN_HEIGHT * 1.2),
        ),
      );
      if (normH < 0.3) {
        tmp.copy(valleyColor).lerp(lightColor, normH / 0.3);
      } else {
        tmp.copy(lightColor).lerp(darkColor, (normH - 0.3) / 0.7);
      }
      colors[i * 3] = tmp.r;
      colors[i * 3 + 1] = tmp.g;
      colors[i * 3 + 2] = tmp.b;
    }

    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh ref={meshRef} geometry={geometry} receiveShadow>
      <meshStandardMaterial
        vertexColors
        flatShading
        roughness={0.95}
        metalness={0.05}
      />
    </mesh>
  );
}

export function sampleTerrainHeight(x: number, z: number): number {
  const size = WORLD.TERRAIN_SIZE;
  const nx = x / size + 0.5;
  const nz = z / size + 0.5;
  let h = 0;
  h += fbm2(nx * 1.5, nz * 1.5, 5) * 0.5;
  h += fbm2(nx * 4, nz * 4, 3) * 0.2;
  h += fbm2(nx * 10, nz * 10, 2) * 0.05;
  return h * WORLD.TERRAIN_HEIGHT;
}
