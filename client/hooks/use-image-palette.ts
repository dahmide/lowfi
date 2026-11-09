"use client";

import { useState, useEffect } from "react";
import { Vibrant } from "node-vibrant/browser";
import type { Palette } from "@vibrant/color";

const DEFAULT_PALETTE = {
    background: "#191414",
    foreground: "#ffffff",
    muted: "#1db954",
    mutedForeground: "#1db954",
};

const getPalette = (extractedPalette: Palette) => ({
    background: DEFAULT_PALETTE.background,
    foreground: DEFAULT_PALETTE.foreground,
    muted: DEFAULT_PALETTE.muted,
    mutedForeground: DEFAULT_PALETTE.mutedForeground,
});

export function useImagePalette(imageUrl: string) {
    const [palette, setPalette] = useState({
        ...DEFAULT_PALETTE,
        loading: Boolean(imageUrl),
    });

    useEffect(() => {
        let cancelled = false;

        if (!imageUrl) {
            setPalette({ ...DEFAULT_PALETTE, loading: false });
            return;
        }

        setPalette((prev) => ({ ...prev, loading: true }));

        async function extractPalette() {
            try {
                const extractedPalette = await Vibrant.from(
                    imageUrl
                ).getPalette();

                if (cancelled) return;

                setPalette({
                    ...getPalette(extractedPalette),
                    loading: false,
                });
            } catch (error) {
                if (cancelled) return;

                console.error("Error extracting image palette:", error);

                setPalette({
                    ...DEFAULT_PALETTE,
                    loading: false,
                });
            }
        }

        extractPalette();

        return () => {
            cancelled = true;
        };
    }, [imageUrl]);

    return palette;
}
