import { create } from "zustand";

export type GameMode = "relax" | "collect";
export type GameStatus = "menu" | "flying" | "paused";

export interface FlightState {
  altitude: number;
  speed: number;
  inUpdraft: boolean;
  updraftStrength: number;
}

interface GameStore {
  gameMode: GameMode;
  gameStatus: GameStatus;
  flight: FlightState;
  starsCollected: number;
  setMode: (mode: GameMode) => void;
  startFlight: () => void;
  pauseFlight: () => void;
  resumeFlight: () => void;
  endFlight: () => void;
  collectStar: () => void;
  updateFlight: (state: Partial<FlightState>) => void;
  resetStars: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  gameMode: "relax",
  gameStatus: "menu",
  flight: {
    altitude: 700,
    speed: 45,
    inUpdraft: false,
    updraftStrength: 0,
  },
  starsCollected: 0,
  setMode: (mode) => set({ gameMode: mode }),
  startFlight: () => set({ gameStatus: "flying", starsCollected: 0 }),
  pauseFlight: () =>
    set((s) => (s.gameStatus === "flying" ? { gameStatus: "paused" } : {})),
  resumeFlight: () => set({ gameStatus: "flying" }),
  endFlight: () => set({ gameStatus: "menu" }),
  collectStar: () => set((s) => ({ starsCollected: s.starsCollected + 1 })),
  updateFlight: (state) => set((s) => ({ flight: { ...s.flight, ...state } })),
  resetStars: () => set({ starsCollected: 0 }),
}));
