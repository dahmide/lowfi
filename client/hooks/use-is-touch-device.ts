"use client";
import { useState, useEffect } from "react";

export function useIsTouchDevice() {
    const [isTouch, setIsTouch] = useState(false);

    useEffect(() => {
        const mql = window.matchMedia("(pointer: coarse)");
        setIsTouch(mql.matches);

        const handleChange = (e: MediaQueryListEvent) => setIsTouch(e.matches);
        mql.addEventListener("change", handleChange);
        return () => mql.removeEventListener("change", handleChange);
    }, []);

    return isTouch;
}
