import { Effect, Hotkey, Signal } from "@/types";

export const SIGNALS = [
    { id: "bass", frequency: 60, type: "lowshelf" },
    { id: "lowMid", frequency: 230, type: "peaking", q: 1 },
    { id: "mid", frequency: 910, type: "peaking", q: 1 },
    { id: "presence", frequency: 3600, type: "peaking", q: 1 },
    { id: "treble", frequency: 14000, type: "highshelf" },
] satisfies Array<Signal>;

export const EFFECTS = [
    {
        id: "rain",
        label: "Rain",
        url: "https://pub-905052c9549b45b580eafec615ec4659.r2.dev/sounds/rain.mp3",
    },
    {
        id: "waves",
        label: "Waves",
        url: "https://pub-905052c9549b45b580eafec615ec4659.r2.dev/sounds/urban.mp3",
    },
    {
        id: "tree",
        label: "Tree",
        url: "https://pub-905052c9549b45b580eafec615ec4659.r2.dev/sounds/urban.mp3",
    },
    {
        id: "storm",
        label: "Storm",
        url: "https://pub-905052c9549b45b580eafec615ec4659.r2.dev/sounds/urban.mp3",
    },
] satisfies Array<Effect>;

export const HOTKEYS = [
    {
        id: "toggle",
        shortcut: "Space",
        label: "Play / Pause",
        displayKey: "Space",
    },
    {
        id: "prev",
        shortcut: "ArrowLeft",
        label: "Previous station",
        displayKey: "←",
    },
    {
        id: "next",
        shortcut: "ArrowRight",
        label: "Next station",
        displayKey: "→",
    },
    {
        id: "volumeIncrease",
        shortcut: "ArrowUp",
        label: "Volume up",
        displayKey: "↑",
    },
    {
        id: "volumeDecrease",
        shortcut: "ArrowDown",
        label: "Volume down",
        displayKey: "↓",
    },
    {
        id: "mute",
        shortcut: "M",
        label: "Mute",
        displayKey: "M",
    },
    {
        id: "close",
        shortcut: "Escape",
        label: "Close modal",
        displayKey: "Esc",
    },
] satisfies Array<Hotkey>;
