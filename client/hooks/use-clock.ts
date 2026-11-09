"use client";

import { useState, useEffect, useCallback } from "react";

export type ClockGranularity = "second" | "minute" | "hour";

export interface ClockTime {
    hours: number;
    minutes: number;
    seconds: number;
    hours12: number;
    ampm: "AM" | "PM";
    date: Date;
    formatted: (pattern: string) => string;
}

function pad(n: number, length = 2): string {
    return n.toString().padStart(length, "0");
}

function formatTime(date: Date, pattern: string): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const hours12 = hours % 12 || 12;
    const ampm = hours >= 12 ? "PM" : "AM";

    return pattern
        .replace(/HH/g, pad(hours))
        .replace(/H/g, hours.toString())
        .replace(/hh/g, pad(hours12))
        .replace(/h/g, hours12.toString())
        .replace(/mm/g, pad(minutes))
        .replace(/m/g, minutes.toString())
        .replace(/ss/g, pad(seconds))
        .replace(/s/g, seconds.toString())
        .replace(/A/g, ampm)
        .replace(/a/g, ampm.toLowerCase());
}

export function useClock(options?: {
    granularity?: ClockGranularity;
    interval?: number;
}) {
    const { granularity = "second", interval } = options ?? {};

    const getTime = useCallback((): ClockTime => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const hours12 = hours % 12 || 12;
        const ampm = hours >= 12 ? "PM" : "AM";

        return {
            hours,
            minutes,
            seconds,
            hours12,
            ampm,
            date: now,
            formatted: (pattern: string) => formatTime(now, pattern),
        };
    }, []);

    const [time, setTime] = useState<ClockTime>(getTime);

    useEffect(() => {
        const tick = () => setTime(getTime());

        // Determine update interval based on granularity
        let ms = 1000;
        if (interval) {
            ms = interval;
        } else if (granularity === "minute") {
            ms = 60_000;
        } else if (granularity === "hour") {
            ms = 3_600_000;
        }

        // Align to next second/minute for smoother updates
        const now = new Date();
        let delay = ms - (now.getMilliseconds() % ms);
        if (granularity === "minute") {
            delay = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
        } else if (granularity === "hour") {
            delay =
                (60 - now.getMinutes()) * 60_000 +
                (60 - now.getSeconds()) * 1000 -
                now.getMilliseconds();
        }

        let intervalId: ReturnType<typeof setInterval> | null = null;

        const timeout = setTimeout(() => {
            tick();
            intervalId = setInterval(tick, ms);
        }, delay);

        return () => {
            clearTimeout(timeout);
            if (intervalId) clearInterval(intervalId);
        };
    }, [granularity, interval, getTime]);

    return time;
}
