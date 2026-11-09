export type ControlsState = {
    muted: boolean;
    volume: number;
};

export type ControlsActions = {
    setVolume: (v: number) => void;
    increaseVolume: () => void;
    decreaseVolume: () => void;
    toggleMute: () => void;
};
