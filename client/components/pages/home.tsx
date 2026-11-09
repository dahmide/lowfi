"use client";

import { useMemo, useState } from "react";
import {
    Player,
    Prompt,
    Scene,
    Backdrop,
    Selector,
    Settings,
    Pomodoro,
} from "@/components/blocks";
import { StationDTO } from "@/lib/dto/stations.dto";
import { AmbienceEffectDTO } from "@/lib/dto/ambience-effect.dto";
import { AmbienceVisualDTO } from "@/lib/dto/ambience-visual.dto";
import { useStation } from "@/hooks/use-station";
import { AmbienceCanvas } from "@/components/blocks/_canvas/ambience";
import { useSettingsStore } from "@/stores/settings";
import { EFFECTS } from "@/utils/constants";
import { useAmbienceAudio } from "@/hooks/use-ambience-audio";
import { usePalette } from "@/hooks/use-palette";
// import type { Scene } from "@/types";

export default function Home({
    initialStation,
    initialAmbienceEffects,
    initialAmbienceVisuals,
}: {
    initialStation: StationDTO;
    initialAmbienceEffects: AmbienceEffectDTO[];
    initialAmbienceVisuals: AmbienceVisualDTO[];
}) {
    const { station, changeStation, isTuning } = useStation(initialStation);

    const [tuned, setTuned] = useState(false);
    const [scene, setScene] = useState<string | null>(null);
    const [modal, setModal] = useState({
        settings: false,
        selector: false,
        backdrop: false,
    });

    console.log(station);
    const palette = usePalette(scene ?? station.defaultUrl);
    const effects = useSettingsStore((s) => s.sound.effects);
    const sources = useMemo(
        () =>
            EFFECTS.map((e) => ({
                ...e,
                ...(effects[e.id] ??= { active: false, volume: 50 }),
            })),
        [EFFECTS, effects]
    );
    useAmbienceAudio(sources, { canPlay: tuned });
    return (
        <Scene url={scene ?? station.defaultUrl}>
            <AmbienceCanvas
                layers={{
                    rain: effects.rain.volume,
                    lightning: 0,
                    snow: 0,
                }}
                respectReducedMotion={false}
            />
            {tuned && (
                <Backdrop
                    open={modal.backdrop}
                    onFileChange={setScene}
                    onOpenChange={(v) =>
                        setModal((p) => ({ ...p, backdrop: v }))
                    }
                />
            )}
            {tuned && (
                <Selector
                    station={station}
                    changeStation={changeStation}
                    open={modal.selector}
                    onOpenChange={(v) =>
                        setModal((p) => ({ ...p, selector: v }))
                    }
                />
            )}
            {tuned && (
                <Settings
                    open={modal.settings}
                    onOpenChange={(v) =>
                        setModal((p) => ({ ...p, settings: v }))
                    }
                />
            )}
            <div className="container max-w-6xl mx-auto px-4 flex-1 flex flex-col relative z-10">
                {tuned ? (
                    <Player
                        palette={palette}
                        station={station}
                        onOpenChange={setModal}
                        isTuning={isTuning}
                        changeStation={changeStation}
                    />
                ) : (
                    <Prompt
                        onTuneChange={setTuned}
                        listenerCount={station.listeners}
                    />
                )}
            </div>
        </Scene>
    );
}
