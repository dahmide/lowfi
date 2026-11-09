import { useEffect } from "react";

export function useFirstGesture(onUnlock: () => void, enabled = true) {
    useEffect(() => {
        if (!enabled) return;

        const handleGesture = () => {
            onUnlock();
        };

        window.addEventListener("pointerdown", handleGesture, { once: true });
        window.addEventListener("keydown", handleGesture, { once: true });

        return () => {
            window.removeEventListener("pointerdown", handleGesture);
            window.removeEventListener("keydown", handleGesture);
        };
    }, [onUnlock, enabled]);
}
