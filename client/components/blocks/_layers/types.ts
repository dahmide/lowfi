export type EffectName = "none" | "vhs" | "film" | "glitch" | "color" | "pixel";

export interface CssLayer {
    /** Tailwind classes for layout, opacity, animation, blend, etc. */
    className?: string;
    /** Complex values that are awkward as pure Tailwind (filters, gradients) */
    style?: React.CSSProperties;
}

export interface ImageLayer {
    src: string;
    className?: string;
    style?: React.CSSProperties;
}

export interface VideoLayer {
    src: string;
    className?: string;
    style?: React.CSSProperties;
    playbackRate?: number;
}

export interface EffectDefinition {
    /**
     * CSS filter applied to the media itself (colour grading).
     * A filter on an empty overlay div can't affect what's underneath,
     * so grading has to live on the media wrapper.
     */
    mediaFilter?: string;
    /** Classes for the media's inner wrapper (e.g. an animated filter). */
    mediaClassName?: string;
    /** Overlays drawn on top of the media (scanlines, vignette, flicker). */
    cssLayers: CssLayer[];
    /** File-based overlays (png, jpeg, svg). */
    imageLayers: ImageLayer[];
    /** File-based animated overlays. */
    videoLayers: VideoLayer[];
}
