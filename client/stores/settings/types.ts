import type { AccentId, FilterId, PresetId } from "@/types";

type Effect = {
    active: boolean;
    volume: number;
};

type EqState = {
    presetId: PresetId;
    gains: number[];
    linked: boolean;
    enabled: boolean;
};

export type SettingsState = {
    sound: {
        effects: Record<string, Effect>;
        eq: EqState;
    };
    prefs: {
        accentColor: AccentId;
        visualFilter: FilterId;
        revealClock: boolean;
        reduceMotion: boolean;
        visualEffect: boolean;
    };
};

export type SettingsActions = {
    // Sound
    setEq: (eq: Partial<EqState>) => void;
    setEffectActive: (id: string, active: boolean) => void;
    setEffectVolume: (id: string, volume: number) => void;

    // Prefs
    setAccentColor: (accentColor: AccentId) => void;
    setRevealClock: (revealClock: boolean) => void;

    setReduceMotion: (reduceMotion: boolean) => void;
    setVisualEffect: (visualEffect: boolean) => void;
    setVisualFilter: (visualFilter: FilterId) => void;
};
