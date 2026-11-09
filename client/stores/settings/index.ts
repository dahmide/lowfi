import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { initialState } from "./state";
import type { SettingsState, SettingsActions } from "./types";

type SettingsStore = SettingsState & SettingsActions;

export const useSettingsStore = create<SettingsStore>()(
    devtools(
        persist(
            (set) => ({
                ...initialState,

                // ── Sound – Effects ──────────────────────────────────
                setEffectActive: (id, active) =>
                    set(
                        (state) => ({
                            sound: {
                                ...state.sound,
                                effects: {
                                    ...state.sound.effects,
                                    [id]: {
                                        active,
                                        volume:
                                            state.sound.effects[id]?.volume ??
                                            1,
                                    },
                                },
                            },
                        }),
                        false,
                        "sound/setEffectActive"
                    ),

                setEffectVolume: (id, volume) =>
                    set(
                        (state) => ({
                            sound: {
                                ...state.sound,
                                effects: {
                                    ...state.sound.effects,
                                    [id]: {
                                        active:
                                            state.sound.effects[id]?.active ??
                                            false,
                                        volume,
                                    },
                                },
                            },
                        }),
                        false,
                        "sound/setEffectVolume"
                    ),

                // ── Sound – EQ ───────────────────────────────────────
                setEq: (eq) =>
                    set(
                        (state) => ({
                            sound: {
                                ...state.sound,
                                eq: {
                                    ...state.sound.eq,
                                    ...eq,
                                },
                            },
                        }),
                        false,
                        "sound/setEq"
                    ),

                // ── UI ───────────────────────────────────────────────
                setReduceMotion: (reduceMotion) =>
                    set(
                        (state) => ({
                            prefs: {
                                ...state.prefs,
                                reduceMotion,
                            },
                        }),
                        false,
                        "prefs/setReduceMotion"
                    ),

                setVisualEffect: (visualEffect) =>
                    set(
                        (state) => ({
                            prefs: {
                                ...state.prefs,
                                visualEffect,
                            },
                        }),
                        false,
                        "prefs/setVisualEffect"
                    ),

                setVisualFilter: (visualFilter) =>
                    set(
                        (state) => ({
                            prefs: {
                                ...state.prefs,
                                visualFilter,
                            },
                        }),
                        false,
                        "prefs/setVisualFilter"
                    ),

                setRevealClock: (revealClock) =>
                    set(
                        (state) => ({
                            prefs: {
                                ...state.prefs,
                                revealClock,
                            },
                        }),
                        false,
                        "prefs/setRevealClock"
                    ),

                setAccentColor: (accentColor) =>
                    set(
                        (state) => ({
                            prefs: {
                                ...state.prefs,
                                accentColor,
                            },
                        }),
                        false,
                        "ui/setAccentColor"
                    ),
            }),
            {
                name: "lowfi-settings",
                partialize: (state) => ({
                    sound: state.sound,
                    prefs: state.prefs,
                }),
            }
        ),
        { name: "SettingsStore" }
    )
);
