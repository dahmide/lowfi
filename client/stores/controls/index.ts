import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { initialState } from "./state";
import type { ControlsState, ControlsActions } from "./types";

type ControlsStore = ControlsState & ControlsActions;

const STEP = 0.05;
const clamp = (v: number) =>
    Math.round(Math.min(1, Math.max(0, v)) * 100) / 100;

export const useControlsStore = create<ControlsStore>()(
    devtools(
        persist(
            (set) => ({
                ...initialState,

                setVolume: (v) =>
                    set((state) => ({
                        ...state,
                        volume: clamp(v),
                    })),
                increaseVolume: () =>
                    set((state) => ({
                        ...state,
                        volume: clamp(state.volume + STEP),
                    })),
                decreaseVolume: () =>
                    set((state) => ({
                        ...state,
                        volume: clamp(state.volume - STEP),
                    })),
                toggleMute: () =>
                    set((state) => ({
                        ...state,
                        muted: !state.muted,
                    })),
            }),
            {
                name: "lowfi-controls",
                partialize: (state) => ({ volume: state.volume }),
            }
        ),
        { name: "ControlsStore" }
    )
);
