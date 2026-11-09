export type SceneCategory = "motion" | "static";
export type SoundCategory = "atmos" | "noise";

export interface StationResponse {
    id: string;
    title: string;
    label: string;
    genre: string;
    streamUrl: string;
    sceneUrl: string | null;
    frequency: number;
    sortOrder: number;
}

export interface SceneResponse {
    id: string;
    category: SceneCategory;
    url: string;
    label: string;
    description: string | null;
    isDefault: boolean;
}

export type ScenesResponse = Record<SceneCategory, SceneResponse[]>;

export interface SoundResponse {
    id: string;
    category: SoundCategory;
    label: string;
    url: string;
}

export type AmbienceResponse = Record<SoundCategory, SoundResponse[]>;

export interface ApiError {
    error: string;
}
