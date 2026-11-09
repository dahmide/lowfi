import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import type { EffectName, CssLayer, ImageLayer, VideoLayer } from "./types";
import { effectPresets } from "./data";

export interface EffectOverlayProps {
    effect: EffectName;
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export function EffectOverlay({
    effect,
    children,
    className = "",
    style,
}: EffectOverlayProps) {
    const effectName = effect ?? "none";
    const definition =
        effectName === "none" ? undefined : effectPresets[effectName];

    if (!definition) {
        console.warn(`[EffectOverlay] Unknown effect: "${effect}"`);
        return <>{children}</>;
    }

    const { mediaFilter, mediaClassName, cssLayers, imageLayers, videoLayers } =
        definition ?? {};

    return (
        <div
            className={cn(
                `effect-overlay effect-${effect} h-full absolute inset-0 isolate overflow-hidden`,
                className
            )}
            data-effect={effect}
            style={style}
        >
            <MediaLayer className={mediaClassName} filter={mediaFilter}>
                {children}
            </MediaLayer>

            {/* CSS layers */}
            {cssLayers.map((layer, index) => (
                <CssLayer
                    key={`css-${index}`}
                    layer={layer}
                    zIndex={10 + index}
                />
            ))}

            {/* Image layers (empty for now, ready for future assets) */}
            {imageLayers.map((layer, index) => (
                <ImageLayer
                    key={`img-${index}`}
                    layer={layer}
                    zIndex={30 + index}
                />
            ))}

            {/* Video layers (empty for now, ready for future assets) */}
            {videoLayers.map((layer, index) => (
                <VideoLayer
                    key={`vid-${index}`}
                    layer={layer}
                    zIndex={50 + index}
                />
            ))}
        </div>
    );
}

// ── Layers ──────────────────────────────────────────

function CssLayer({ layer, zIndex }: { layer: CssLayer; zIndex: number }) {
    return (
        <div
            className={cn(
                "effect-layer effect-layer-css absolute inset-0 pointer-events-none",
                layer.className
            )}
            style={{ zIndex, ...layer.style }}
        />
    );
}

function ImageLayer({ layer, zIndex }: { layer: ImageLayer; zIndex: number }) {
    return (
        <Image
            src={layer.src}
            alt=""
            aria-hidden="true"
            draggable={false}
            className={cn(
                "effect-layer effect-layer-image absolute inset-0 h-full w-full object-cover pointer-events-none",
                layer.className
            )}
            style={{ zIndex, ...layer.style }}
        />
    );
}

function VideoLayer({ layer, zIndex }: { layer: VideoLayer; zIndex: number }) {
    const ref = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (ref.current && layer.playbackRate != null) {
            ref.current.playbackRate = layer.playbackRate;
        }
    }, [layer.playbackRate]);

    return (
        <video
            ref={ref}
            src={layer.src}
            muted
            loop
            playsInline
            autoPlay
            className={cn(
                "effect-layer effect-layer-video absolute inset-0 h-full w-full object-cover pointer-events-none",
                layer.className
            )}
            style={{ zIndex, ...layer.style }}
        />
    );
}

function MediaLayer({
    filter,
    className,
    children,
}: {
    filter?: string;
    className?: string;
    children?: React.ReactNode;
}) {
    return (
        <div
            className="effect-media relative z-0 h-full w-full"
            style={{ filter }}
        >
            <div className={cn("effect-media-anim h-full w-full", className)}>
                {children}
            </div>
        </div>
    );
}

export default EffectOverlay;
