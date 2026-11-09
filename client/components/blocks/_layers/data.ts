import { EffectDefinition, EffectName } from "./types";

/**
 * Curated CSS-only definitions using Tailwind classes where possible.
 * Building blocks that require Image/Video assets are left empty for now.
 */
export const effectPresets: Record<EffectName, EffectDefinition> = {
    none: {
        cssLayers: [],
        imageLayers: [],
        videoLayers: [],
    },
    // ──────────────────────────────────────────────
    // VHS — Scanlines + Flicker + Color Bleed
    // ──────────────────────────────────────────────
    vhs: {
        cssLayers: [
            // Base color bleed + slight contrast
            {
                className: "opacity-100",
                style: {
                    filter: "contrast(1.08) saturate(1.25) hue-rotate(4deg)",
                },
            },
            // Scanlines
            {
                className: "opacity-55 animate-vhs-scanlines",
                style: {
                    background: `repeating-linear-gradient(
            0deg,
            transparent 0px,
            transparent 2px,
            rgba(0, 0, 0, 0.18) 2px,
            rgba(0, 0, 0, 0.18) 4px
          )`,
                },
            },
            // Flicker
            {
                className: "opacity-35 animate-vhs-flicker bg-black/10",
            },
        ],
        imageLayers: [],
        videoLayers: [],
    },

    // ──────────────────────────────────────────────
    // Film — Vignette + Vintage grade + light Flicker
    // ──────────────────────────────────────────────
    film: {
        cssLayers: [
            // Vintage color grade
            {
                className: "opacity-100",
                style: {
                    filter: "contrast(0.92) brightness(1.03) sepia(0.22) saturate(0.85)",
                },
            },
            // Vignette
            {
                className: "opacity-75",
                style: {
                    background: `radial-gradient(
            ellipse at center,
            transparent 45%,
            rgba(0, 0, 0, 0.35) 100%
          )`,
                },
            },
            // Very light flicker
            {
                className: "opacity-40 animate-film-flicker bg-black/5",
            },
        ],
        imageLayers: [],
        videoLayers: [],
    },

    // ──────────────────────────────────────────────
    // Glitch — RGB Split + mild Tear + Chromatic Aberration
    // ──────────────────────────────────────────────
    glitch: {
        cssLayers: [
            // Base contrast
            {
                className: "opacity-100",
                style: {
                    filter: "contrast(1.12) brightness(1.05)",
                },
            },
            // RGB Split + chromatic aberration
            {
                className: "opacity-70 animate-glitch-rgb",
            },
            // Screen tear
            {
                className: "opacity-85 animate-glitch-tear",
            },
        ],
        imageLayers: [],
        videoLayers: [],
    },

    // ──────────────────────────────────────────────
    // Color — Refined Sepia + warmth
    // ──────────────────────────────────────────────
    color: {
        cssLayers: [
            {
                className: "opacity-100",
                style: {
                    filter: "sepia(0.75) contrast(1.08) brightness(1.02) saturate(0.9) hue-rotate(-8deg)",
                },
            },
        ],
        imageLayers: [],
        videoLayers: [],
    },

    // ──────────────────────────────────────────────
    // Pixel — empty for now (needs real texture asset)
    // ──────────────────────────────────────────────
    pixel: {
        cssLayers: [],
        imageLayers: [],
        videoLayers: [],
    },
};
