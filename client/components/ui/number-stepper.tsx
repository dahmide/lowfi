"use client";

import * as React from "react";
import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/cn";

type NumberStepperContextValue = {
    value: number;
    min: number;
    max: number;
    step: number;
    disabled: boolean;
    setValue: (value: number) => void;
};

const NumberStepperContext =
    React.createContext<NumberStepperContextValue | null>(null);

function useNumberStepper() {
    const context = React.useContext(NumberStepperContext);

    if (!context) {
        throw new Error(
            "NumberStepper components must be used within NumberStepper"
        );
    }

    return context;
}

type NumberStepperProps = {
    value?: number;
    defaultValue?: number;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    onValueChange?: (value: number) => void;
    className?: string;
    children: React.ReactNode;
};

export function NumberStepper({
    value: controlledValue,
    defaultValue = 1,
    min = 0,
    max = Infinity,
    step = 1,
    disabled = false,
    onValueChange,
    className,
    children,
}: NumberStepperProps) {
    const [internalValue, setInternalValue] = React.useState(defaultValue);

    const value = controlledValue ?? internalValue;

    const setValue = React.useCallback(
        (nextValue: number) => {
            const clampedValue = Math.min(max, Math.max(min, nextValue));

            if (controlledValue === undefined) {
                setInternalValue(clampedValue);
            }

            onValueChange?.(clampedValue);
        },
        [controlledValue, min, max, onValueChange]
    );

    return (
        <NumberStepperContext.Provider
            value={{
                value,
                min,
                max,
                step,
                disabled,
                setValue,
            }}
        >
            <div
                className={cn(
                    "inline-flex h-10 items-center gap-1 rounded-md border border-input bg-background p-1",
                    disabled && "cursor-not-allowed opacity-50",
                    className
                )}
            >
                {children}
            </div>
        </NumberStepperContext.Provider>
    );
}

type NumberStepperValueProps = React.ComponentProps<"span">;

export function NumberStepperValue({
    className,
    ...props
}: NumberStepperValueProps) {
    const { value } = useNumberStepper();

    return (
        <span
            aria-live="polite"
            className={cn(
                "min-w-8 select-none text-center text-sm font-medium tabular-nums",
                className
            )}
            {...props}
        >
            {value}
        </span>
    );
}

type NumberStepperIncrementProps = React.ComponentProps<"button">;

export function NumberStepperIncrement({
    className,
    children,
    disabled: buttonDisabled,
    ...props
}: NumberStepperIncrementProps) {
    const { value, max, step, disabled, setValue } = useNumberStepper();

    return (
        <button
            type="button"
            aria-label="Increase value"
            disabled={disabled || buttonDisabled || value >= max}
            onClick={() => setValue(value + step)}
            className={cn(
                "inline-flex size-8 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                className
            )}
            {...props}
        >
            {children ?? <Plus className="size-4" />}
        </button>
    );
}

type NumberStepperDecrementProps = React.ComponentProps<"button">;

export function NumberStepperDecrement({
    className,
    children,
    disabled: buttonDisabled,
    ...props
}: NumberStepperDecrementProps) {
    const { value, min, step, disabled, setValue } = useNumberStepper();

    return (
        <button
            type="button"
            aria-label="Decrease value"
            disabled={disabled || buttonDisabled || value <= min}
            onClick={() => setValue(value - step)}
            className={cn(
                "inline-flex size-8 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                className
            )}
            {...props}
        >
            {children ?? <Minus className="size-4" />}
        </button>
    );
}
