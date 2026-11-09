import { useEffect, useRef } from "react";
import { Howl } from "howler";

interface AmbienceEffect {
    id: string;
    url: string;
    active: boolean;
    volume: number; // 0–100
}

interface UseAmbienceAudioOptions {
    canPlay: boolean;
}

const toGain = (volume: number) => volume / 100;

function createHowl(effect: AmbienceEffect) {
    return new Howl({
        src: [effect.url],
        loop: true,
        volume: toGain(effect.volume),
    });
}

function handleSync(howl: Howl, shouldPlay: boolean) {
    if (shouldPlay && !howl.playing()) {
        howl.play();
        return;
    }

    if (!shouldPlay && howl.playing()) {
        howl.pause();
    }
}

export function useAmbienceAudio(
    effects: AmbienceEffect[],
    { canPlay }: UseAmbienceAudioOptions
) {
    const howlsRef = useRef<Map<string, Howl>>(new Map());

    useEffect(() => {
        const howls = howlsRef.current;
        const activeIds = new Set(effects.map(({ id }) => id));

        for (const effect of effects) {
            const shouldPlay = effect.active && canPlay;
            let howl = howls.get(effect.id);

            if (!howl) {
                if (!shouldPlay) continue;
                howl = createHowl(effect);
                howls.set(effect.id, howl);
            }

            howl.volume(toGain(effect.volume));
            handleSync(howl, shouldPlay);
        }

        for (const [id, howl] of howls) {
            if (activeIds.has(id)) continue;
            howl.unload();
            howls.delete(id);
        }
    }, [effects, canPlay]);

    useEffect(() => {
        const howls = howlsRef.current;
        return () => {
            for (const howl of howls.values()) {
                howl.unload();
            }
            howls.clear();
        };
    }, []);
}
