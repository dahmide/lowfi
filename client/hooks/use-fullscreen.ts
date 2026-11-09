import { useCallback, useEffect, useState } from "react";

export function useFullscreen() {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        setIsSupported(document.fullscreenEnabled);

        const onChange = () =>
            setIsFullscreen(Boolean(document.fullscreenElement));

        onChange();
        document.addEventListener("fullscreenchange", onChange);
        return () => document.removeEventListener("fullscreenchange", onChange);
    }, []);

    const toggle = useCallback(async () => {
        try {
            if (document.fullscreenElement) {
                await document.exitFullscreen();
            } else {
                await document.documentElement.requestFullscreen();
            }
        } catch {
            // Request can be rejected (no user gesture, or blocked by the browser).
        }
    }, []);

    return { isFullscreen, isSupported, toggle };
}
