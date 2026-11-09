"use client";

import { useEffect, useRef } from "react";

export interface BarVisualizerProps {
    analyser?: AnalyserNode | null;
    barCount?: number;
    width?: number;
    height?: number;
    barColor?: string;
    gap?: number;
    minHeightPx?: number;
    loPass?: number;
    hiPass?: number;
    smoothing?: number; // 0–1, higher = smoother/slower, lower = snappier
    className?: string;
}

export function BarVisualizer({
    analyser,
    barCount = 4,
    width = 20,
    height = 20,
    barColor = "currentColor",
    gap = 2,
    minHeightPx = 2,
    loPass = 0,
    hiPass = 300,
    smoothing = 0.25,
    className,
}: BarVisualizerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const frameId = useRef<number | undefined>(undefined);
    const currentHeights = useRef<number[]>(
        new Array(barCount).fill(minHeightPx)
    );

    useEffect(() => {
        currentHeights.current = new Array(barCount).fill(minHeightPx);
    }, [barCount, minHeightPx]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx2d = canvas.getContext("2d");
        if (!ctx2d) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx2d.scale(dpr, dpr);

        const barWidth = (width - gap * (barCount - 1)) / barCount;

        if (!analyser) {
            ctx2d.clearRect(0, 0, width, height);
            ctx2d.fillStyle = barColor;
            for (let i = 0; i < barCount; i++) {
                const x = i * (barWidth + gap);
                ctx2d.fillRect(x, height - minHeightPx, barWidth, minHeightPx);
            }
            return;
        }

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Float32Array(bufferLength);
        const sliceLength = hiPass - loPass;
        const chunkSize = Math.ceil(sliceLength / barCount);

        const normalizeDb = (value: number) => {
            if (value === -Infinity) return 0;
            const minDb = -100;
            const maxDb = -10;
            const db = 1 - (Math.max(minDb, Math.min(maxDb, value)) * -1) / 100;
            return Math.sqrt(db);
        };

        const draw = () => {
            analyser.getFloatFrequencyData(dataArray);
            ctx2d.clearRect(0, 0, width, height);
            ctx2d.fillStyle = barColor;

            for (let i = 0; i < barCount; i++) {
                let sum = 0;
                let count = 0;
                const startIdx = loPass + i * chunkSize;
                const endIdx = Math.min(loPass + (i + 1) * chunkSize, hiPass);

                for (let j = startIdx; j < endIdx; j++) {
                    sum += normalizeDb(dataArray[j]);
                    count++;
                }

                const volume = count > 0 ? sum / count : 0;
                const targetHeight = Math.max(minHeightPx, volume * height);

                // Lerp toward the target each frame instead of jumping straight to it
                const prev = currentHeights.current[i];
                const eased = prev + (targetHeight - prev) * (1 - smoothing);
                currentHeights.current[i] = eased;

                const x = i * (barWidth + gap);
                ctx2d.fillRect(x, height - eased, barWidth, eased);
            }

            frameId.current = requestAnimationFrame(draw);
        };

        frameId.current = requestAnimationFrame(draw);

        return () => {
            if (frameId.current) cancelAnimationFrame(frameId.current);
        };
    }, [
        analyser,
        barCount,
        width,
        height,
        barColor,
        gap,
        minHeightPx,
        loPass,
        hiPass,
        smoothing,
    ]);

    return (
        <canvas
            ref={canvasRef}
            style={{ width, height }}
            className={className}
        />
    );
}
