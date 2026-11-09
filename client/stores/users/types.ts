type Background = {
    id: string;
    label: string;
    mime: string;
    sizeBytes: number;
};

export type UserState = {
    backgrounds: Background[];
};

export type UserActions = {
    addBackground: (bg: Background) => void;
    popBackground: (id: Background["id"]) => void;
};
