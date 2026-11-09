import type { Hotkey as Shortcut } from "@tanstack/react-hotkeys";

export type Direction = "prev" | "next";

export type Scene = string | null;
export type Modal = {
    settings: boolean;
    selector: boolean;
    backdrop: boolean;
};

export type AccentId = "red" | "blue" | "purple" | "mint" | "orange";
export type PresetId = "flat" | "bass" | "mids" | "warm" | "custom";
export type FilterId = "none" | "vhs" | "film" | "glitch" | "color" | "pixel";
export type HotkeyId =
    | "toggle"
    | "prev"
    | "next"
    | "volumeIncrease"
    | "volumeDecrease"
    | "mute"
    | "close";

export type Signal = {
    id: string;
    frequency: number; // Hz
    type: BiquadFilterType; // "lowshelf" | "peaking" | "highshelf"
    q?: number;
};

export type Effect = {
    id: string;
    label: string;
    url: string;
};

export type Accent = {
    id: AccentId;
    label: string;
    value: string;
    cssVar: string;
};

export type Filter = {
    id: FilterId;
    label: string;
    value: string;
};

export type Hotkey = {
    id: HotkeyId;
    shortcut: Shortcut;
    label: string;
    displayKey: string;
};

export type Social = {
    name: string;
    icon: React.ReactNode;
    link: string;
};
