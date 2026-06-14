import { useRef } from "react";
import * as THREE from "three";
import { PHYSICS } from "@/utils/constants";

export interface UpdraftZone {
  position: THREE.Vector3;
  radius: number;
  strength: number;
}

export interface FlightPhysicsState {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  yaw: number;
  pitch: number;
  bank: number;
  speed: number;
}

export function useFlightPhysics() {
  const stateRef = useRef<FlightPhysicsState>({
    position: new THREE.Vector3(0, 700, 0),
    velocity: new THREE.Vector3(0, 0, -45),
    yaw: 0,
    pitch: 0,
    bank: 0,
    speed: PHYSICS.INITIAL_SPEED,
  });

  const forward = useRef(new THREE.Vector3());
  const right = useRef(new THREE.Vector3());
  const up = useRef(new THREE.Vector3(0, 1, 0));

  const step = (
    dt: number,
    mousePitch: number,
    mouseYaw: number,
    updrafts: UpdraftZone[],
  ) => {
    const s = stateRef.current;

    s.pitch += (mousePitch - s.pitch) * PHYSICS.PITCH_SPEED * dt;
    s.yaw += (mouseYaw - s.yaw) * PHYSICS.YAW_SPEED * dt;

    const targetBank = -(mouseYaw - s.yaw) * 2;
    s.bank += (targetBank - s.bank) * PHYSICS.BANK_SPEED * dt;
    s.bank = Math.max(-0.8, Math.min(0.8, s.bank));

    forward.current.set(0, 0, -1);
    const euler = new THREE.Euler(s.pitch, s.yaw, s.bank, "YXZ");
    forward.current.applyEuler(euler);

    right.current.set(1, 0, 0).applyEuler(new THREE.Euler(0, s.yaw, 0));

    const speedFactor = s.speed / PHYSICS.INITIAL_SPEED;
    const lift =
      PHYSICS.LIFT_COEFFICIENT *
      s.speed *
      s.speed *
      (1 + Math.sin(s.pitch) * 0.5);
    const drag = PHYSICS.DRAG_COEFFICIENT * s.speed * s.speed;

    s.velocity.copy(forward.current).multiplyScalar(s.speed);
    s.velocity.y += lift * dt;
    s.velocity.y -= PHYSICS.GRAVITY * dt;

    s.speed -= drag * dt;
    s.speed += -Math.sin(s.pitch) * PHYSICS.GRAVITY * 2 * dt;
    s.speed = Math.max(PHYSICS.MIN_SPEED, Math.min(PHYSICS.MAX_SPEED, s.speed));

    let updraftStrength = 0;
    for (const u of updrafts) {
      const dx = s.position.x - u.position.x;
      const dz = s.position.z - u.position.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < u.radius) {
        const falloff = 1 - dist / u.radius;
        updraftStrength = Math.max(updraftStrength, falloff * u.strength);
      }
    }
    if (updraftStrength > 0) {
      s.velocity.y += PHYSICS.UPDRAFT_LIFT * updraftStrength * dt;
    }

    s.position.addScaledVector(s.velocity, dt);

    if (s.position.y < 10) {
      s.position.y = 700;
      s.speed = PHYSICS.INITIAL_SPEED;
      s.velocity.set(0, 0, -PHYSICS.INITIAL_SPEED);
    }

    return { ...s, updraftStrength };
  };

  const reset = () => {
    stateRef.current = {
      position: new THREE.Vector3(0, 700, 0),
      velocity: new THREE.Vector3(0, 0, -45),
      yaw: 0,
      pitch: 0,
      bank: 0,
      speed: PHYSICS.INITIAL_SPEED,
    };
  };

  return { stateRef, step, reset };
}
