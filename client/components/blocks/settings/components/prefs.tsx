import { useSettingsStore } from "@/stores/settings";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { Accent, Filter } from "@/types";
import {
    NumberStepper,
    NumberStepperValue,
    NumberStepperIncrement,
    NumberStepperDecrement,
} from "@/components/ui/number-stepper";

const ACCENTS = [
    { id: "red", label: "Red", value: "red", cssVar: "--red" },
    { id: "blue", label: "Blue", value: "blue", cssVar: "--blue" },
    { id: "purple", label: "Purple", value: "purple", cssVar: "--purple" },
    { id: "mint", label: "Mint", value: "mint", cssVar: "--mint" },
    { id: "orange", label: "Orange", value: "orange", cssVar: "--orange" },
] satisfies Array<Accent>;

const FILTERS = [
    { id: "none", label: "None", value: "none" },
    { id: "vhs", label: "VHS", value: "vhs" },
    { id: "film", label: "Old Film", value: "film" },
    { id: "glitch", label: "Glitch", value: "glitch" },
    { id: "pixel", label: "Pixel", value: "pixel" },
] satisfies Array<Filter>;

const PERIODS = [
    { id: "focus", title: "Focus Session", description: "minutes", max: 25 },
    { id: "short", title: "Short break", description: "minutes", max: 5 },
    { id: "long", title: "Long break", description: "minutes", max: 15 },
];

export default function SettingsPrefs() {
    const {
        accentColor,
        revealClock,
        reduceMotion,
        visualEffect,
        visualFilter,
    } = useSettingsStore((s) => s.prefs);

    const setAccentColor = useSettingsStore((s) => s.setAccentColor);
    const setRevealClock = useSettingsStore((s) => s.setRevealClock);

    const setReduceMotion = useSettingsStore((s) => s.setReduceMotion);
    const setVisualEffect = useSettingsStore((s) => s.setVisualEffect);
    const setVisualFilter = useSettingsStore((s) => s.setVisualFilter);
    return (
        <div className="flex flex-col gap-4">
            {/*  */}
            <Card size="sm">
                <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>Card Description</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <div className="flex flex-row items-center justify-between">
                        <div className="flex flex-col gap-px">
                            <h3>Accent Color</h3>
                            <p>Lorem ipsum dolor sit amet.</p>
                        </div>
                        <RadioGroup
                            className="w-fit flex flex-row items-center gap-2"
                            value={accentColor}
                            onValueChange={setAccentColor}
                        >
                            {ACCENTS.map((accent) => (
                                <Label
                                    className="*:sr-only size-[24px] p-0 border border-transparent rounded-full bg-(--swatch) cursor-pointer"
                                    key={accent.id}
                                    style={{
                                        "--swatch": `var(${accent.cssVar})`,
                                    }}
                                >
                                    <RadioGroupItem value={accent.value} />
                                </Label>
                            ))}
                        </RadioGroup>
                    </div>
                    <div className="flex flex-row items-center justify-between">
                        <div className="flex flex-col gap-px">
                            <h3>Reveal Clock</h3>
                            <p>Lorem ipsum dolor sit amet.</p>
                        </div>
                        <Switch
                            checked={revealClock}
                            onCheckedChange={setRevealClock}
                        />
                    </div>
                </CardContent>
            </Card>
            {/*  */}
            <Card size="sm">
                <CardHeader>
                    <CardTitle>Motion</CardTitle>
                    <CardDescription>Card Description</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <div className="flex flex-row items-center justify-between">
                        <div className="flex flex-col gap-px">
                            <h3>Reduce Motion</h3>
                        </div>
                        <Switch
                            checked={reduceMotion}
                            onCheckedChange={setReduceMotion}
                        />
                    </div>
                    <div className="flex flex-row items-center justify-between">
                        <div className="flex flex-col gap-px">
                            <h3>Visual Effects</h3>
                            <p>Lorem ipsum dolor sit amet.</p>
                        </div>
                        <Switch
                            checked={visualEffect}
                            onCheckedChange={setVisualEffect}
                        />
                    </div>
                    <div className="flex flex-row items-center justify-between">
                        <div className="flex flex-col gap-px">
                            <h3>Visual Filters</h3>
                            <p>Lorem ipsum dolor sit amet.</p>
                        </div>
                        <RadioGroup
                            className="w-fit flex flex-row items-center gap-1"
                            value={visualFilter}
                            onValueChange={setVisualFilter}
                        >
                            {FILTERS.map((filter) => (
                                <Label
                                    className="*:sr-only size-[auto] p-2 border border-transparent rounded-full bg-(--acccent) cursor-pointer"
                                    key={filter.id}
                                >
                                    {filter.label}
                                    <RadioGroupItem value={filter.value} />
                                </Label>
                            ))}
                        </RadioGroup>
                    </div>
                </CardContent>
            </Card>
            {/*  */}
            <Card size="sm">
                <CardHeader>
                    <CardTitle>Timers</CardTitle>
                    <CardDescription>Card Description</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    {PERIODS.map((period) => (
                        <div className="flex flex-row items-center justify-between">
                            <div className="flex flex-col gap-px">
                                <h2>{period.title}</h2>
                                <p>{period.description}</p>
                            </div>
                            <NumberStepper
                                defaultValue={1}
                                min={1}
                                max={period.max}
                                step={1}
                            >
                                <NumberStepperDecrement />
                                <NumberStepperValue />
                                <NumberStepperIncrement />
                            </NumberStepper>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
