import { useCallback, useEffect, useRef, useState } from "react";

interface EqNodes {
    input: AudioNode;
    output: AudioNode;
}

interface UseRadioStreamOptions {
    audioContext: AudioContext | null;
    eqNodes?: EqNodes | null;
    eqEnabled?: boolean;
    volume?: number;
    muted?: boolean;
}

const isAbortError = (err: unknown) =>
    err instanceof DOMException && err.name === "AbortError";

export function useRadioStream(
    url: string,
    {
        audioContext,
        eqNodes,
        eqEnabled = true,
        volume = 1,
        muted = false,
    }: UseRadioStreamOptions
) {
    const audioElRef = useRef<HTMLAudioElement | null>(null);
    const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const gainRef = useRef<GainNode | null>(null);
    const wasPlayingRef = useRef(false);

    const levelRef = useRef({ volume, muted });
    levelRef.current = { volume, muted };

    const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
    const [hasError, setHasError] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (!audioContext) return;

        setHasError(false);
        const shouldAutoplay = wasPlayingRef.current;

        const audioEl = new Audio();
        audioEl.crossOrigin = "anonymous";
        audioEl.loop = true;
        audioEl.src = url;

        const listeners = new AbortController();
        const { signal } = listeners;

        audioEl.addEventListener(
            "error",
            () => {
                setHasError(true);
                setIsPlaying(false);
            },
            { signal }
        );
        audioEl.addEventListener(
            "play",
            () => {
                setIsPlaying(true);
                wasPlayingRef.current = true;
            },
            { signal }
        );
        audioEl.addEventListener(
            "pause",
            () => {
                setIsPlaying(false);
                wasPlayingRef.current = false;
            },
            { signal }
        );

        const sourceNode = audioContext.createMediaElementSource(audioEl);
        const gainNode = audioContext.createGain();
        const analyserNode = audioContext.createAnalyser();
        analyserNode.smoothingTimeConstant = 0.4;

        const { volume: v, muted: m } = levelRef.current;
        gainNode.gain.value = m ? 0 : v;

        const usingEq = Boolean(eqNodes && eqEnabled);
        if (eqNodes && usingEq) {
            sourceNode.connect(eqNodes.input);
            eqNodes.output.connect(gainNode);
        } else {
            sourceNode.connect(gainNode);
        }
        gainNode.connect(analyserNode);
        analyserNode.connect(audioContext.destination);

        audioElRef.current = audioEl;
        sourceNodeRef.current = sourceNode;
        analyserRef.current = analyserNode;
        gainRef.current = gainNode;
        setAnalyser(analyserNode);

        if (shouldAutoplay) {
            audioContext.resume();
            audioEl.play().catch((err) => {
                if (isAbortError(err)) return;
                wasPlayingRef.current = false;
                setHasError(true);
                setIsPlaying(false);
            });
        }

        return () => {
            listeners.abort();
            audioEl.pause();
            audioEl.removeAttribute("src");
            audioEl.load();

            sourceNode.disconnect();
            gainNode.disconnect();
            analyserNode.disconnect();
            if (eqNodes && usingEq) {
                try {
                    eqNodes.output.disconnect(gainNode);
                } catch {}
            }
        };
    }, [url, audioContext, eqNodes, eqEnabled]);

    useEffect(() => {
        const gain = gainRef.current;
        if (!gain || !audioContext) return;
        gain.gain.setTargetAtTime(
            muted ? 0 : volume,
            audioContext.currentTime,
            0.015
        );
    }, [volume, muted, audioContext]);

    const play = useCallback(() => {
        wasPlayingRef.current = true;

        const el = audioElRef.current;
        if (!el || !audioContext) return;

        audioContext.resume();
        el.play().catch((err) => {
            if (isAbortError(err)) return;
            wasPlayingRef.current = false;
            setHasError(true);
            setIsPlaying(false);
        });
    }, [audioContext]);

    const pause = useCallback(() => {
        wasPlayingRef.current = false;
        audioElRef.current?.pause();
    }, []);

    const stop = useCallback(() => {
        wasPlayingRef.current = false;
        const el = audioElRef.current;
        if (!el) return;
        el.pause();
        el.currentTime = 0;
    }, []);

    const toggle = useCallback(() => {
        const el = audioElRef.current;
        const playing = el ? !el.paused : wasPlayingRef.current;
        if (playing) pause();
        else play();
    }, [play, pause]);

    return {
        audioRef: audioElRef,
        analyser,
        play,
        pause,
        stop,
        toggle,
        hasError,
        isPlaying,
    };
}
