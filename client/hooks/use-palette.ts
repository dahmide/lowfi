"use client";

import { useEffect, useState } from "react";
import { getImagePalette } from "@/lib/palette";

type Palette = Awaited<ReturnType<typeof getImagePalette>> | null;

export function usePalette(imgUrl: string) {
    const [palette, setPalette] = useState<Palette>(null);

    useEffect(() => {
        let cancelled = false;
        getImagePalette(imgUrl)
        .then((p) => {
            if (!cancelled) {
                setPalette(p);
            }
        });
        return () => {
            cancelled = true;
        };
    }, [imgUrl]);

    return palette;
}
