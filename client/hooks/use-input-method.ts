"use client";
import { useEffect, useState } from "react";

export type InputMethod =
    | {
          type: "keyboard";
          key?: string;
      }
    | {
          type: "touch";
      };

function isTapLike(pointerType: string): boolean {
    return pointerType === "touch" || pointerType === "pen";
}

function guessInp(): InputMethod {
    if (typeof window === "undefined") {
        return { type: "keyboard" };
    }

    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    return isTouchDevice ? { type: "touch" } : { type: "keyboard" };
}

export function useInputMethod(onInput: (input: InputMethod) => void) {
    const [inputMethod, setInputMethod] = useState<InputMethod>(guessInp);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            setInputMethod({
                type: "keyboard",
                key: event.key,
            });
            if (onInput) onInput({ type: "keyboard", key: event.key });
        };

        const handlePointerDown = (event: PointerEvent) => {
            const type = isTapLike(event.pointerType) ? "touch" : "keyboard";
            setInputMethod({
                type: type,
            });
            if (onInput) onInput({ type });
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("pointerdown", handlePointerDown, {
            passive: true,
        });

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("pointerdown", handlePointerDown);
        };
    }, []);

    return inputMethod;
}
