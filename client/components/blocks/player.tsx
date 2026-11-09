import { useCallback, useEffect, useRef, useState } from "react";
import { Howl } from "howler";
import { Logo } from "@/components/custom/logo";
import { Button } from "@/components/ui/button";
import {
    ButtonGroup,
    ButtonGroupSeparator,
    ButtonGroupText,
} from "@/components/ui/button-group";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ArrowUpRightIcon,
    ImagesIcon,
    MaximizeIcon,
    MinimizeIcon,
    PlayIcon,
    PauseIcon,
    RadioIcon,
    SatelliteIcon,
    SettingsIcon,
    SkipForwardIcon as SkipNextIcon,
    SkipBackIcon,
    ShuffleIcon,
    TimerIcon,
} from "lucide-react";
import type { Direction, Modal } from "@/types";
import { ShineBorder } from "@/components/ui/magic/shine-border";
import { BarVisualizer } from "@/components/custom/bar-visualizer";
import { useListenerCount } from "@/hooks/use-listener-count";
import { useRadioStream } from "@/hooks/use-playback-stream";
import { StationDTO } from "@/lib/dto/stations.dto";
import { getAudioContext } from "@/lib/audio";
import { useSettingsStore } from "@/stores/settings";
import { usePlaybackAudio } from "@/hooks/use-playback-audio";
import { SIGNALS } from "@/utils/constants";
import { Clock, ClockTime, ClockZone } from "../ui/clock";
import { useMediaShortcuts } from "@/hooks/use-media-shortcuts";
import { useFullscreen } from "@/hooks/use-fullscreen";
import { useControlsStore } from "@/stores/controls";
import { Badge } from "../ui/badge";
import { IconBadge } from "../custom/icon-badge";
import Pomodoro from "./pomodoro";

const STATIC_NOISE_URL = "/audio/static.wav";

export default function Player({
    station,
    palette,
    isTuning,
    changeStation,
    onOpenChange,
}: {
    palette: any;
    station: StationDTO;
    onOpenChange: React.Dispatch<React.SetStateAction<Modal>>;
    isTuning: boolean;
    changeStation: (id: string, direction: Direction) => void;
}) {
    console.log("Palette: ", palette);

    const audioCtx = getAudioContext();
    const noiseRef = useRef<Howl>(null);

    const count = useListenerCount(station.id);
    const gains = useSettingsStore((s) => s.sound.eq.gains);
    const nodes = usePlaybackAudio({
        bands: SIGNALS,
        gains: gains,
        audioContext: audioCtx,
    });

    const { isFullscreen, toggle: toggleFullscreen } = useFullscreen();
    const { volume, increaseVolume, decreaseVolume } = useControlsStore();

    const { analyser, toggle, play, isPlaying } = useRadioStream(
        station.listen,
        { audioContext: audioCtx, eqNodes: nodes, volume }
    );

    // ── Signals ──────────────────────────────────────────
    const randomStation = useCallback(
        async (id: string, direction: Direction) => {
            toggle();
        },
        []
    );

    const switchStation = useCallback(
        async (id: string, direction: Direction) => {
            toggle();
            noiseRef.current?.play();
            await changeStation(id, direction);
            noiseRef.current?.stop();
            toggle();
        },
        [toggle, changeStation, noiseRef]
    );

    // ── Signals ──────────────────────────────────────────
    useMediaShortcuts({
        prev: () => changeStation(station.id, "prev"),
        next: () => changeStation(station.id, "next"),
        volumeIncrease: () => increaseVolume(),
        volumeDecrease: () => decreaseVolume(),
    });

    // ── Signals ──────────────────────────────────────────
    useEffect(() => {
        noiseRef.current = new Howl({
            src: [STATIC_NOISE_URL],
            loop: true,
        });
        play();

        return () => {
            noiseRef.current?.unload();
            noiseRef.current = null;
        };
    }, []);
    return (
        <div className="py-4 flex-1 flex flex-col justify-between">
            <div className="flex flex-col justify-between">
                <div className="w-full flex flex-row items-center justify-between">
                    <Logo />
                    {/* <ButtonGroup> */}
                    <div className="flex items-center gap-3">
                        <Button
                            variant="default"
                            className="bg-muted text-foreground hover:bg-muted/80"
                            size="icon-lg"
                            onClick={() =>
                                onOpenChange((p) => ({ ...p, backdrop: true }))
                            }
                        >
                            <ImagesIcon />
                        </Button>
                        <Pomodoro
                            durations={{ long: 0.5, short: 0.5, focus: 1 }}
                        />
                        <Button
                            variant="default"
                            className="bg-muted text-foreground hover:bg-muted/80"
                            size="icon-lg"
                            onClick={() =>
                                onOpenChange((p) => ({ ...p, settings: true }))
                            }
                        >
                            <SettingsIcon />
                        </Button>
                    </div>
                    {/* </ButtonGroup> */}
                </div>
                <div className="w-full">
                    <Clock>
                        <ClockTime />
                        <span>/</span>
                        <ClockZone />
                    </Clock>
                </div>
            </div>
            <div className="flex flex-col items-center justify-center">
                <div></div>
            </div>
            {/* <div className="w-1/2 h-12 bg-red-300" /> */}
            <Card style={{ padding: 0 }}>
                <CardContent className="p-4 grid grid-cols-[1fr_auto] gap-2 md:grid-cols-[1fr_1fr_auto] md:gap-0">
                    <div className="flex items-center gap-4 col-span-2 md:col-auto">
                        <IconBadge>
                            <SatelliteIcon />
                        </IconBadge>
                        <div className="flex flex-col">
                            <div className="-my-0.5 flex flex-row items-baseline gap-0">
                                <h2>{station.title}</h2>
                            </div>
                            <div className="-my-0.5 flex flex-row items-baseline gap-1">
                                <BarVisualizer
                                    className="w-3.5! h-lh"
                                    analyser={analyser}
                                    barCount={3}
                                    barColor="#a1a1aa"
                                />
                                <p>{count ?? 1} Listening</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 col-span-1 md:col-auto">
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => switchStation(station.id, "prev")}
                        >
                            <SkipBackIcon />
                        </Button>
                        <Button
                            variant="default"
                            size="icon-lg"
                            onClick={() => toggle()}
                            disabled={isTuning}
                        >
                            {isPlaying ? <PauseIcon /> : <PlayIcon />}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => switchStation(station.id, "next")}
                        >
                            <SkipNextIcon />
                        </Button>
                    </div>
                    <div className="flex items-center gap-1 col-span-1 md:col-auto">
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => null}
                        >
                            {/* <VolumeIcon /> */}
                            <ShuffleIcon />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => null}
                        >
                            <ShuffleIcon />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => toggleFullscreen()}
                        >
                            {isFullscreen ? <MinimizeIcon /> : <MaximizeIcon />}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
