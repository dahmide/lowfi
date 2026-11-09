"use client";

import { useEffect, useRef, useState } from "react";
import type { ComponentPropsWithoutRef } from "react";
import {
    AmbienceEngine,
    type AmbienceLayers,
    type AmbienceOptions,
} from "@/lib/ambience";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export interface AmbienceCanvasProps
    extends Omit<ComponentPropsWithoutRef<"canvas">, "children"> {
    /** Intensity (0-1) per layer, e.g. { rain: 0.6, lightning: 0.3 }. */
    layers: AmbienceLayers;
    /** Optional per-layer color/speed overrides. */
    options?: AmbienceOptions;
    /** Freeze the animation without clearing it. */
    paused?: boolean;
    /** Turn visuals off under prefers-reduced-motion. Default true. */
    respectReducedMotion?: boolean;
}

export function AmbienceCanvas({
    layers,
    options,
    paused = false,
    respectReducedMotion = true,
    className,
    ...props
}: AmbienceCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const engineRef = useRef<AmbienceEngine | null>(null);

    const isReduced = useReducedMotion();
    const isAllowed = respectReducedMotion && isReduced;

    // Serialized so inline object props don't retrigger effects every render.
    const layersKey = JSON.stringify(layers);
    const optionsKey = JSON.stringify(options ?? {});

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const engine = new AmbienceEngine(canvas);
        engineRef.current = engine;
        return () => {
            engine.destroy();
            engineRef.current = null;
        };
    }, []);

    useEffect(() => {
        const option = JSON.parse(optionsKey);
        engineRef.current?.setOptions(option);
    }, [optionsKey]);

    useEffect(() => {
        const layers = isAllowed ? {} : JSON.parse(layersKey);
        engineRef.current?.setLayers(layers);
    }, [layersKey, isAllowed]);

    useEffect(() => {
        engineRef.current?.setPaused(paused);
    }, [paused]);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className={cn(
                "pointer-events-none absolute inset-0 h-full w-full",
                className
            )}
            {...props}
        />
    );
}
