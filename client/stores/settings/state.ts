import type { SettingsState } from "./types";

export const initialState: SettingsState = {
    sound: {
        effects: {},
        eq: {
            presetId: "flat",
            gains: [0, 0, 0, 0, 0],
            linked: false,
            enabled: false,
        },
    },
    prefs: {
        accentColor: "red",
        revealClock: true,
        reduceMotion: false,
        visualEffect: true,
        visualFilter: "none",
    },
};
