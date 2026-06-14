import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { WORLD, COLORS } from "@/utils/constants";

interface CloudLayerData {
  sprites: THREE.InstancedMesh;
  positions: Float32Array;
  speeds: Float32Array;
  scales: Float32Array;
}

const CLOUDS_PER_LAYER = 28;

function makeCloudTexture() {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const grd = ctx.createRadialGradient(
    size / 2,
    size / 2,
    10,
    size / 2,
    size / 2,
    size / 2,
  );
  grd.addColorStop(0, "rgba(255,255,255,0.95)");
  grd.addColorStop(0.35, "rgba(255,255,255,0.7)");
  grd.addColorStop(0.7, "rgba(255,255,255,0.2)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

export function Clouds() {
  const layersRef = useRef<CloudLayerData[]>([]);
  const cloudTex = useMemo(() => makeCloudTexture(), []);
  const wind = useRef(new THREE.Vector3(2, 0, 1.2));

  const cloudLayers = useMemo(() => {
    const layers: CloudLayerData[] = [];
    for (let li = 0; li < WORLD.CLOUD_LAYER_COUNT; li++) {
      const count = CLOUDS_PER_LAYER;
      const positions = new Float32Array(count * 3);
      const speeds = new Float32Array(count);
      const scales = new Float32Array(count);

      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * WORLD.CLOUD_SPREAD * 2;
        positions[i * 3 + 1] =
          WORLD.CLOUD_BASE_HEIGHT +
          li * WORLD.CLOUD_LAYER_GAP +
          (Math.random() - 0.5) * 40;
        positions[i * 3 + 2] = (Math.random() - 0.5) * WORLD.CLOUD_SPREAD * 2;
        speeds[i] = 0.3 + Math.random() * 0.7;
        scales[i] = 60 + Math.random() * 120;
      }

      layers.push({} as CloudLayerData);
      layers[li].positions = positions;
      layers[li].speeds = speeds;
      layers[li].scales = scales;
    }
    return layers;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((_, dt) => {
    layersRef.current.forEach((layer, li) => {
      const { sprites, positions, speeds, scales } = layer;
      if (!sprites) return;
      for (let i = 0; i < CLOUDS_PER_LAYER; i++) {
        positions[i * 3] += wind.current.x * speeds[i] * dt;
        positions[i * 3 + 2] += wind.current.z * speeds[i] * dt;

        if (positions[i * 3] > WORLD.CLOUD_SPREAD)
          positions[i * 3] = -WORLD.CLOUD_SPREAD;
        if (positions[i * 3] < -WORLD.CLOUD_SPREAD)
          positions[i * 3] = WORLD.CLOUD_SPREAD;
        if (positions[i * 3 + 2] > WORLD.CLOUD_SPREAD)
          positions[i * 3 + 2] = -WORLD.CLOUD_SPREAD;
        if (positions[i * 3 + 2] < -WORLD.CLOUD_SPREAD)
          positions[i * 3 + 2] = WORLD.CLOUD_SPREAD;

        dummy.position.set(
          positions[i * 3],
          positions[i * 3 + 1],
          positions[i * 3 + 2],
        );
        dummy.scale.setScalar(scales[i]);
        dummy.updateMatrix();
        sprites.setMatrixAt(i, dummy.matrix);
      }
      sprites.instanceMatrix.needsUpdate = true;
    });
  });

  return (
    <group>
      {cloudLayers.map((_, li) => (
        <instancedMesh
          key={li}
          ref={(el) => {
            if (el && layersRef.current[li]) layersRef.current[li].sprites = el;
            if (el && !layersRef.current[li]) {
              layersRef.current[li] = {
                sprites: el,
                positions: cloudLayers[li].positions,
                speeds: cloudLayers[li].speeds,
                scales: cloudLayers[li].scales,
              };
            }
          }}
          args={[undefined, undefined, CLOUDS_PER_LAYER]}
          frustumCulled={false}
        >
          <planeGeometry />
          <meshBasicMaterial
            map={cloudTex}
            transparent
            opacity={0.32}
            depthWrite={false}
            color={COLORS.CLOUD}
          />
        </instancedMesh>
      ))}
    </group>
  );
}
