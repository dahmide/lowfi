"use client";

import { useEffect, useRef, useState } from "react";
import { Howl } from "howler";
import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PauseIcon, PlayIcon, RotateCcwIcon, TimerIcon } from "lucide-react";

type Phase = "focus" | "short" | "long";
type Cycle = number;
type Timer = {
    long: number;
    short: number;
    focus: number;
};

const chime = new Howl({
    src: ["/audio/chime.ogg"],
    volume: 1,
});
const LABELS = {
    focus: "Focus",
    short: "Short break",
    long: "Long break",
} satisfies Record<Phase, string>;

const getSecs = (phase: Phase, timer: Timer) => {
    let mins;
    if (phase === "focus") {
        mins = timer.focus;
    } else if (phase === "short") {
        mins = timer.short;
    } else {
        mins = timer.long;
    }
    return mins * 60;
};

const getNext = (phase: Phase, cycle: Cycle) => {
    let next;
    if (phase === "focus") {
        next = { phase: cycle === 4 ? "long" : "short", cycle };
    } else {
        next = { phase: "focus", cycle: phase === "long" ? 1 : cycle + 1 };
    }
    return next as { phase: Phase; cycle: Cycle };
};

const fmtTime = (secs: number) => {
    const mm = String(Math.floor(secs / 60)).padStart(2, "0");
    const ss = String(Math.floor(secs % 60)).padStart(2, "0");
    return `${mm}:${ss}`;
};

export default function Pomodoro({
    durations,
    autoStart = true,
}: {
    durations: Timer;
    autoStart?: boolean;
}) {
    const endTime = useRef<number | null>(null);

    const [phase, setPhase] = useState<Phase>("focus");
    const [cycle, setCycle] = useState<Cycle>(1);
    const [alive, setAlive] = useState(false);
    const [count, setCount] = useState(getSecs("focus", durations));

    const goNext = () => {
        const next = getNext(phase, cycle);
        const secs = getSecs(next.phase, durations);

        setPhase(next.phase);
        setCycle(next.cycle);
        setCount(secs);

        if (autoStart) {
            endTime.current = Date.now() + secs * 1000;
            setAlive(true);
        } else {
            setAlive(false);
        }
    };

    const handleStart = () => {
        endTime.current = Date.now() + count * 1000;
        setAlive(true);
    };

    const handlePause = () => {
        setAlive(false);
    };

    const handleReset = () => {
        setAlive(false);
        setPhase("focus");
        setCycle(1);
        setCount(getSecs("focus", durations));
    };

    const switchPhase = (value: Phase) => {
        setAlive(false);
        setPhase(value);
        setCount(getSecs(value, durations));

        if (value === "long") setCycle(4);
        if (value === "short") setCycle(Math.min(cycle, 3));
    };

    useEffect(() => {
        if (!alive) return;
        const id = setInterval(() => {
            const remaining = Math.ceil(
                ((endTime.current ?? 0) - Date.now()) / 1000
            );
            const left = Math.max(0, remaining);
            setCount(left);
            if (left === 0) {
                chime?.play();
                goNext();
            }
        }, 250);
        return () => clearInterval(id);
    }, [
        durations.focus,
        durations.short,
        durations.long,
        alive,
        phase,
        cycle,
        autoStart,
    ]);

    useEffect(() => {
        handleReset();
    }, [durations.focus, durations.short, durations.long]);

    return (
        <Popover modal="trap-focus">
            <PopoverTrigger
                className="bg-muted text-foreground hover:bg-muted/80"
                render={
                    <Button variant="outline" size="icon-lg">
                        <TimerIcon />
                    </Button>
                }
            />
            <PopoverContent>
                <PopoverHeader>
                    <PopoverTitle>Pomodoro</PopoverTitle>
                    <PopoverDescription>Stay in the moment.</PopoverDescription>
                </PopoverHeader>
                <Tabs
                    value={phase}
                    onValueChange={(v) => switchPhase(v as Phase)}
                >
                    <TabsList className="w-full">
                        <TabsTrigger value="focus">Focus</TabsTrigger>
                        <TabsTrigger value="short">Short break</TabsTrigger>
                        <TabsTrigger value="long">Long break</TabsTrigger>
                    </TabsList>
                </Tabs>
                <div className="w-full flex flex-col items-center gap-2">
                    <span>{LABELS[phase]}</span>
                    <time>{fmtTime(count)}</time>
                    <span>Cycle {cycle} of 4</span>
                </div>
                <div className="w-full flex flex-row items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon-lg"
                        onClick={handleReset}
                    >
                        <RotateCcwIcon />
                    </Button>
                    {alive ? (
                        <Button
                            variant="default"
                            className="flex-1"
                            size="lg"
                            onClick={handlePause}
                        >
                            <PauseIcon />
                            Pause
                        </Button>
                    ) : (
                        <Button
                            variant="default"
                            className="flex-1"
                            size="lg"
                            onClick={handleStart}
                        >
                            <PlayIcon />
                            Start
                        </Button>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
