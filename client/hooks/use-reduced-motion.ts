import { useState, useEffect } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

export function useReducedMotion(): boolean {
    const [prefersReducedMotion, setPrefersReducedMotion] =
        useState<boolean>(false);

    useEffect(() => {
        const mediaQueryList = window.matchMedia(QUERY);

        // Sync initial client state safely after hydration
        setPrefersReducedMotion(mediaQueryList.matches);

        const listener = (event: MediaQueryListEvent) => {
            setPrefersReducedMotion(event.matches);
        };

        if (mediaQueryList.addEventListener) {
            mediaQueryList.addEventListener("change", listener);
        } else {
            // Legacy browser support (Safari < 14)
            mediaQueryList.addListener(listener);
        }

        return () => {
            if (mediaQueryList.removeEventListener) {
                mediaQueryList.removeEventListener("change", listener);
            } else {
                mediaQueryList.removeListener(listener);
            }
        };
    }, []);

    return prefersReducedMotion;
}
