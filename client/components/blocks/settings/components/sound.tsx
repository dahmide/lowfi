import { useSettingsStore } from "@/stores/settings";
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemGroup,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { IconBadge } from "@/components/custom/icon-badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/retro/select";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
    FieldTitle,
} from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { EFFECTS, HOTKEYS, SIGNALS } from "@/utils/constants";
import {
    ChevronsRightIcon,
    CloudRainIcon as RainIcon,
    TreesIcon,
    WavesIcon,
    WindIcon as StormIcon,
    LucideProps,
    ChevronRightIcon,
    SlidersVerticalIcon,
    LucideIcon,
    ChevronLeftIcon,
} from "lucide-react";
import type { Effect, PresetId } from "@/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type View = "ambience" | "equalizer" | null;
type Item = {
    view: Exclude<View, null>;
    icon: LucideIcon;
    status: string;
    title: string;
};

type Effects = typeof EFFECTS;
type Signals = typeof SIGNALS;

const GAIN_MIN = -12;
const GAIN_MAX = +12;

const PRESETS = {
    flat: [0, 0, 0, 0, 0],
    bass: [6, 3, 0, -1, -1],
    mids: [-2, 0, 5, 3, -1],
    warm: [3, 4, 1, -1, -2],
} satisfies Record<Exclude<PresetId, "custom">, number[]>;

const ITEMS = [
    {
        view: "ambience",
        icon: RainIcon,
        title: "Ambience",
        status: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius fugit quod quos quas, ipsa sed.",
    },
    {
        view: "equalizer",
        icon: SlidersVerticalIcon,
        title: "Equalizer",
        status: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius fugit quod quos quas, ipsa sed.",
    },
] satisfies Array<Item>;

const ICONS = {
    rain: RainIcon,
    waves: WavesIcon,
    tree: TreesIcon,
    storm: StormIcon,
} as Record<Effect["id"], React.ComponentType<LucideProps>>;

function formatBiFilters(db: number) {
    const dB = db > 0 ? `+${db}` : `${db}`;
    return `${dB} dB`;
}

function formatEqPresets(eq: object) {
    return Object.keys(eq).map((key) => ({
        label: key.charAt(0).toUpperCase() + key.slice(1),
        value: key,
    }));
}

function formatFrequency(hz: number) {
    if (hz >= 1000) {
        const khz = hz / 1000;
        return `${khz % 1 === 0 ? khz : khz.toFixed(1)} kHz`;
    } else {
        return `${hz} Hz`;
    }
}

const presets = formatEqPresets(PRESETS);

function SettingsSoundHead({
    title,
    onBack,
    label = "Back to Sound",
    action,
}: {
    title: string;
    onBack: () => void;
    label?: string;
    action?: React.ReactNode;
}) {
    return (
        <div className="flex items-center gap-2">
            <Button
                variant="ghost"
                size="icon"
                aria-label={label}
                onClick={onBack}
            >
                <ChevronLeftIcon />
            </Button>
            <h2 className="flex-1 text-lg font-semibold">{title}</h2>
            {action}
        </div>
    );
}

function SettingsSoundList({
    view,
    onViewChange,
}: {
    view: View;
    onViewChange: (view: View) => void;
}) {
    return (
        <ItemGroup>
            {ITEMS.map((item) => (
                <Item
                    key={item.view}
                    variant="outline"
                    onClick={() => onViewChange(item.view)}
                >
                    <ItemMedia variant="icon">
                        <item.icon />
                    </ItemMedia>
                    <ItemContent>
                        <ItemTitle>{item.title}</ItemTitle>
                        <ItemDescription>{item.status}</ItemDescription>
                    </ItemContent>
                    <ItemActions>
                        <ChevronRightIcon />
                    </ItemActions>
                </Item>
            ))}
        </ItemGroup>
    );
}

function SettingsSoundView({
    view,
    onViewChange,
}: {
    view: View;
    onViewChange: (view: View) => void;
}) {
    const { effects, eq } = useSettingsStore((s) => s.sound);

    const setEq = useSettingsStore((s) => s.setEq);
    const setEffectActive = useSettingsStore((s) => s.setEffectActive);
    const setEffectVolume = useSettingsStore((s) => s.setEffectVolume);

    const updatePreset = ({ i, v }: { i: number; v: number }) => {
        const clamped = Math.min(GAIN_MAX, Math.max(GAIN_MIN, v));
        setEq({
            presetId: "custom",
            gains: eq.gains.map((g, j) => (j === i ? clamped : g)),
        });
    };

    const changePreset = (value: PresetId) => {
        if (!value ?? value === "custom") return;
        setEq({
            presetId: value,
            gains: PRESETS[value],
        });
    };

    const enablePreset = (value: boolean) => {
        setEq({
            enabled: value,
        });
    };

    return (
        <div className="flex flex-col gap-4">
            {view === "ambience" && (
                <div className="flex flex-col gap-4">
                    {EFFECTS.map((effect) => {
                        const Icon = ICONS[effect.id];
                        const item = (effects[effect.id] ??= {
                            volume: 0,
                            active: false,
                        });
                        return (
                            <Card key={effect.id}>
                                <CardContent className="flex flex-row gap-4">
                                    <IconBadge>
                                        <Icon />
                                    </IconBadge>
                                    <div className="flex-1 grid grid-cols-[auto_auto] gap-2 justify-between">
                                        <span>{effect.label}</span>
                                        <Switch
                                            checked={item.active}
                                            onCheckedChange={(v) =>
                                                setEffectActive(effect.id, v)
                                            }
                                        />
                                        <Slider
                                            className="col-span-2" 
                                            disabled={!item.active}
                                            value={item.volume}
                                            onValueChange={(v) =>
                                                setEffectVolume(effect.id, v)
                                            }
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
            {view === "equalizer" && (
                <div className="flex flex-col gap-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-center gap-4">
                            <h2>Equalizer</h2>
                        </div>
                        <div className="flex items-center justify-center gap-4">
                            <Select
                                items={presets}
                                value={eq.presetId}
                                onValueChange={(v) => changePreset(v!)}
                                disabled={!eq.enabled}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={eq.presetId} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {presets.map(({ label, value }) => (
                                            <SelectItem
                                                key={value}
                                                value={value}
                                            >
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <Switch
                                checked={eq.enabled}
                                onCheckedChange={(c) => enablePreset(c)}
                            />
                        </div>
                    </div>
                    <Card size="sm">
                        <CardContent className="flex flex-row gap-3">
                            {SIGNALS.map((band, i) => (
                                <Field key={band.id}>
                                    <Label className="w-fit! mx-auto" id="">
                                        {formatBiFilters(eq.gains[i])}
                                    </Label>
                                    <Slider
                                        value={eq.gains[i]}
                                        onValueChange={(v) =>
                                            updatePreset({ i, v: v as number })
                                        }
                                        min={GAIN_MIN}
                                        max={GAIN_MAX}
                                        orientation="vertical"
                                        disabled={!eq.enabled}
                                    />
                                    <Label className="w-fit! mx-auto" id="">
                                        {formatFrequency(band.frequency)}
                                    </Label>
                                </Field>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

export default function SettingsSound() {
    const [view, setView] = useState<View>(null);
    return (
        <div className="px-4 py-0">
            {view === null ? (
                <SettingsSoundList
                    view={view}
                    onViewChange={(v) => setView(v)}
                />
            ) : (
                <SettingsSoundView
                    view={view}
                    onViewChange={(v) => setView(v)}
                />
            )}
        </div>
    );
}
