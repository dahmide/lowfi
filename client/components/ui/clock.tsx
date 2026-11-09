"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { useClock, type ClockGranularity } from "@/hooks/use-clock";
import { useLocation } from "@/hooks/use-location";
import { Separator } from "./separator";

interface ClockContextValue {
    time: ReturnType<typeof useClock>;
    pattern: string;
    location: ReturnType<typeof useLocation>;
}

interface ClockProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Time format pattern. Supports: HH, H, hh, h, mm, m, ss, s, A, a. Default: "HH:mm" */
    pattern?: string;
    /** Update granularity for performance. Default: "second" if pattern has ss/s, else "minute" */
    granularity?: ClockGranularity;
    children?: React.ReactNode;
}

const ClockContext = React.createContext<ClockContextValue | null>(null);

function useClockContext() {
    const ctx = React.useContext(ClockContext);
    if (!ctx) {
        throw new Error("Clock components must be used within <Clock>");
    }
    return ctx;
}

function Clock({
    pattern = "HH:mm",
    granularity,
    className,
    children,
    ...props
}: React.ComponentProps<"div"> & {
    pattern?: string;
    granularity?: ClockGranularity;
}) {
    const hasSeconds = /ss?/.test(pattern);
    const resolvedGranularity =
        granularity ?? (hasSeconds ? "second" : "minute");

    const time = useClock({ granularity: resolvedGranularity });
    const location = useLocation();

    const value = React.useMemo(
        () => ({ time, pattern, location }),
        [time, pattern, location]
    );

    return (
        <ClockContext.Provider value={value}>
            <div
                className={cn(
                    "inline-flex flex-row items-center gap-2 tabular-nums",
                    className
                )}
                data-slot="clock"
                {...props}
            >
                {children ?? (
                    <>
                        <ClockTime />
                        <Separator className="bg-white" orientation="vertical" />
                        <ClockZone />
                    </>
                )}
            </div>
        </ClockContext.Provider>
    );
}

Clock.displayName = "Clock";

function ClockTime({
    className,
    children,
    ...props
}: React.ComponentProps<"time">) {
    const { time, pattern } = useClockContext();
    const formatted = time.formatted(pattern);

    return (
        <time
            dateTime={time.date.toISOString()}
            className={cn("", className)}
            data-slot="clock-time"
            {...props}
        >
            {children ?? formatted}
        </time>
    );
}
// ClockTime.displayName = "ClockTime";

function ClockZone({
    className,
    children,
    ...props
}: React.ComponentProps<"div">) {
    const { location } = useClockContext();

    return (
        <div
            className={cn("", className)}
            data-slot="clock-zone"
            title={location.timezone}
            {...props}
        >
            {children ?? <span>{location.formatted}</span>}
        </div>
    );
}
// ClockZone.displayName = "ClockZone";

export { Clock, ClockTime, ClockZone };
export type { ClockProps };
