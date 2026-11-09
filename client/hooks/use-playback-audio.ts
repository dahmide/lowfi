import { useEffect, useRef } from "react";

interface EqNode {
    input: AudioNode;
    output: AudioNode;
}

interface EqBand {
    id: string;
    frequency: number;
    type: BiquadFilterType;
    q?: number;
}

interface UseEqualizerOptions {
    audioContext: AudioContext | null;
    bands: EqBand[];
    gains: number[];
}

export function usePlaybackAudio({
    audioContext,
    bands,
    gains,
}: UseEqualizerOptions): EqNode | null {
    const filtersRef = useRef<BiquadFilterNode[]>([]);
    const nodesRef = useRef<EqNode | null>(null);

    useEffect(() => {
        if (!audioContext) {
            nodesRef.current = null;
            return;
        }

        const filters = bands.map((band) => {
            const filter = audioContext.createBiquadFilter();
            filter.type = band.type;
            filter.frequency.value = band.frequency;
            filter.Q.value = band.q ?? 1;
            return filter;
        });

        for (let i = 0; i < filters.length - 1; i++) {
            filters[i].connect(filters[i + 1]);
        }

        filtersRef.current = filters;
        nodesRef.current = {
            input: filters[0],
            output: filters[filters.length - 1],
        };

        return () => {
            filters.forEach((f) => f.disconnect());
            filtersRef.current = [];
            nodesRef.current = null;
        };
    }, [audioContext, bands]);

    useEffect(() => {
        filtersRef.current.forEach((filter, i) => {
            const value = gains[i] ?? 0;
            filter.gain.setTargetAtTime(
                value,
                filter.context.currentTime,
                0.01
            );
        });
    }, [gains]);

    return nodesRef.current;
}
