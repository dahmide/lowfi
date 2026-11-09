/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export const AMBIENCE_LAYER_TYPES = ["rain", "snow", "lightning"] as const;

export type AmbienceLayerType = (typeof AMBIENCE_LAYER_TYPES)[number];

/** Intensity per layer, 0-1. Missing or 0 = layer off. */
export type AmbienceLayers = Partial<Record<AmbienceLayerType, number>>;

export interface AmbienceLayerOptions {
    /** Hex color, e.g. "#a9c8ff". Lightning requires hex. */
    color?: string;
    /** Speed multiplier. Default 1. */
    speed?: number;
}

export type AmbienceOptions = Partial<
    Record<AmbienceLayerType, AmbienceLayerOptions>
>;

/** Internal contract every layer implements. */
interface Layer {
    /** Full replacement: omitted fields fall back to the layer's defaults. */
    setOptions(options: AmbienceLayerOptions): void;
    /** Called with CSS pixel dimensions. */
    resize(width: number, height: number): void;
    /** dt in seconds, intensity is the smoothed 0-1 level. */
    update(dt: number, intensity: number): void;
    draw(ctx: CanvasRenderingContext2D): void;
    /** True when nothing is alive/visible, so the engine can drop the layer. */
    isIdle(): boolean;
}

type LayerFactory = () => Layer;

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

const TAU = Math.PI * 2;

const clamp = (v: number, min: number, max: number) =>
    Math.min(max, Math.max(min, v));

const rand = (min: number, max: number) => min + Math.random() * (max - min);

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type RGB = [number, number, number];

function parseHex(color: string, fallback: RGB): RGB {
    const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(color.trim());
    if (!m) return fallback;
    let hex = m[1];
    if (hex.length === 3) {
        hex = hex
            .split("")
            .map((c) => c + c)
            .join("");
    }
    const n = parseInt(hex, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const rgba = (c: RGB, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

/* -------------------------------------------------------------------------- */
/*  Rain layer                                                                */
/* -------------------------------------------------------------------------- */

interface Drop {
    x: number;
    y: number;
    len: number;
    vy: number;
    near: boolean;
    alive: boolean;
}

const RAIN_DEFAULT_COLOR = "#a9c8ff";
/** Horizontal px travelled per vertical px (slant of the rain). */
const RAIN_WIND = 0;

function createRainLayer(): Layer {
    let width = 0;
    let height = 0;
    let max = 0;
    let color = RAIN_DEFAULT_COLOR;
    let speed = 1;
    const drops: Drop[] = [];

    function spawn(d: Drop) {
        d.near = Math.random() < 0.35;
        d.len = d.near ? rand(18, 32) : rand(8, 16);
        d.vy = d.near ? rand(900, 1300) : rand(550, 800);
        d.x = rand(-height * RAIN_WIND, width);
        d.y = -d.len - rand(0, height * 0.5);
    }

    return {
        setOptions(o) {
            color = o.color ?? RAIN_DEFAULT_COLOR;
            speed = o.speed ?? 1;
        },

        resize(w, h) {
            width = w;
            height = h;
            max = clamp(Math.round((w * h) / 3000), 80, 600);
            while (drops.length < max) {
                drops.push({
                    x: 0,
                    y: 0,
                    len: 0,
                    vy: 0,
                    near: false,
                    alive: false,
                });
            }
        },

        update(dt, intensity) {
            const target = Math.round(max * clamp(intensity, 0, 1));
            const step = dt * speed;

            for (let i = 0; i < drops.length; i++) {
                const d = drops[i];
                if (!d.alive) {
                    if (i < target) {
                        spawn(d);
                        d.alive = true;
                    }
                    continue;
                }
                d.y += d.vy * step;
                d.x += d.vy * RAIN_WIND * step;
                if (d.y - d.len > height) {
                    if (i < target) spawn(d);
                    else d.alive = false;
                }
            }
        },

        draw(ctx) {
            ctx.strokeStyle = color;
            ctx.lineCap = "round";
            // Two passes (far = faint/thin, near = brighter/thicker), one stroke each.
            for (const near of [false, true]) {
                ctx.globalAlpha = near ? 0.5 : 0.22;
                ctx.lineWidth = near ? 1.4 : 1;
                ctx.beginPath();
                for (const d of drops) {
                    if (!d.alive || d.near !== near) continue;
                    ctx.moveTo(d.x, d.y);
                    ctx.lineTo(d.x - RAIN_WIND * d.len, d.y - d.len);
                }
                ctx.stroke();
            }
            ctx.globalAlpha = 1;
        },

        isIdle() {
            return !drops.some((d) => d.alive);
        },
    };
}

/* -------------------------------------------------------------------------- */
/*  Snow layer                                                                */
/* -------------------------------------------------------------------------- */

interface Flake {
    x: number;
    y: number;
    r: number;
    vy: number;
    phase: number;
    sway: number;
    swaySpeed: number;
    near: boolean;
    alive: boolean;
    /** 0-1, eased in on spawn and out when the layer is turned down. */
    fade: number;
}

const SNOW_DEFAULT_COLOR = "#ffffff";
const SNOW_FADE_RATE = 0.8; // per second

function createSnowLayer(): Layer {
    let width = 0;
    let height = 0;
    let max = 0;
    let color = SNOW_DEFAULT_COLOR;
    let speed = 1;
    const flakes: Flake[] = [];

    function spawn(f: Flake, anywhere: boolean) {
        f.near = Math.random() < 0.3;
        f.r = f.near ? rand(2, 3.4) : rand(0.9, 1.8);
        f.vy = f.near ? rand(45, 75) : rand(20, 40);
        f.sway = rand(10, 30) * (f.near ? 1.2 : 0.8);
        f.swaySpeed = rand(0.4, 1.1);
        f.phase = rand(0, TAU);
        f.x = rand(0, width);
        f.y = anywhere ? rand(-f.r, height) : -f.r;
    }

    return {
        setOptions(o) {
            color = o.color ?? SNOW_DEFAULT_COLOR;
            speed = o.speed ?? 1;
        },

        resize(w, h) {
            width = w;
            height = h;
            max = clamp(Math.round((w * h) / 5000), 50, 280);
            while (flakes.length < max) {
                flakes.push({
                    x: 0,
                    y: 0,
                    r: 1,
                    vy: 30,
                    phase: 0,
                    sway: 10,
                    swaySpeed: 1,
                    near: false,
                    alive: false,
                    fade: 0,
                });
            }
        },

        update(dt, intensity) {
            const target = Math.round(max * clamp(intensity, 0, 1));

            for (let i = 0; i < flakes.length; i++) {
                const f = flakes[i];
                const wanted = i < target;

                if (!f.alive) {
                    if (wanted) {
                        spawn(f, true);
                        f.fade = 0;
                        f.alive = true;
                    }
                    continue;
                }

                f.fade = wanted
                    ? Math.min(1, f.fade + dt * SNOW_FADE_RATE)
                    : Math.max(0, f.fade - dt * SNOW_FADE_RATE);
                if (!wanted && f.fade === 0) {
                    f.alive = false;
                    continue;
                }

                f.phase += f.swaySpeed * dt * speed;
                f.y += f.vy * dt * speed;
                if (f.y - f.r > height) {
                    if (wanted) spawn(f, false);
                    else f.alive = false;
                }
            }
        },

        draw(ctx) {
            ctx.fillStyle = color;
            for (const f of flakes) {
                if (!f.alive) continue;
                ctx.globalAlpha = (f.near ? 0.85 : 0.5) * f.fade;
                ctx.beginPath();
                ctx.arc(f.x + Math.sin(f.phase) * f.sway, f.y, f.r, 0, TAU);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
        },

        isIdle() {
            return !flakes.some((f) => f.alive);
        },
    };
}

/* -------------------------------------------------------------------------- */
/*  Lightning layer                                                           */
/* -------------------------------------------------------------------------- */

interface Bolt {
    /** Flat [x0, y0, x1, y1, ...] polyline. */
    points: number[];
    width: number;
}

const LIGHTNING_DEFAULT_COLOR = "#cfdcff";
const LIGHTNING_FALLBACK_RGB: RGB = [207, 220, 255];
const FLASH_DURATION = 1.1; // seconds
const BOLT_DURATION = 0.45;

/**
 * Flash brightness over time: quick pulse, dip, bright main flash, decay.
 * Strikes are always >= FLASH_DURATION apart and the wash is low-alpha,
 * which keeps this well under the 3-flashes-per-second guideline.
 */
function flashEnvelope(t: number) {
    if (t < 0.05) return (t / 0.05) * 0.7;
    if (t < 0.11) return 0.7 - ((t - 0.05) / 0.06) * 0.5;
    if (t < 0.17) return 0.2 + ((t - 0.11) / 0.06) * 0.8;
    return Math.exp(-(t - 0.17) * 4.5);
}

/** Midpoint-displacement polyline between two points. */
function jag(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    offset: number,
    iterations: number
): number[] {
    let pts = [x1, y1, x2, y2];
    for (let it = 0; it < iterations; it++) {
        const next = [pts[0], pts[1]];
        for (let i = 0; i < pts.length - 2; i += 2) {
            const ax = pts[i];
            const ay = pts[i + 1];
            const bx = pts[i + 2];
            const by = pts[i + 3];
            const dx = bx - ax;
            const dy = by - ay;
            const len = Math.hypot(dx, dy) || 1;
            const o = rand(-offset, offset);
            next.push(
                (ax + bx) / 2 + (-dy / len) * o,
                (ay + by) / 2 + (dx / len) * o,
                bx,
                by
            );
        }
        pts = next;
        offset /= 2;
    }
    return pts;
}

function createLightningLayer(): Layer {
    let width = 0;
    let height = 0;
    let color = LIGHTNING_DEFAULT_COLOR;
    let rgb = LIGHTNING_FALLBACK_RGB;
    let speed = 1;

    let armed = false;
    let nextIn = 0;
    let t = Infinity; // seconds since the current strike began
    let strength = 1;
    let originX = 0;
    let bolts: Bolt[] = [];

    function strike(intensity: number) {
        t = 0;
        strength = clamp(0.5 + intensity * 0.5, 0, 1) * rand(0.75, 1);
        originX = rand(width * 0.15, width * 0.85);

        const endX = originX + rand(-width * 0.12, width * 0.12);
        const endY = height * rand(0.5, 0.85);
        const main = jag(originX, -10, endX, endY, endY * 0.16, 6);
        bolts = [{ points: main, width: 2.2 }];

        const pointCount = main.length / 2;
        const branches = Math.floor(rand(1, 4));
        for (let k = 0; k < branches; k++) {
            const idx = Math.floor(rand(0.25, 0.8) * (pointCount - 1)) * 2;
            const bx = main[idx];
            const by = main[idx + 1];
            const dir = Math.random() < 0.5 ? -1 : 1;
            const ex = bx + dir * rand(width * 0.04, width * 0.14);
            const ey = by + rand(height * 0.08, height * 0.22);
            bolts.push({
                points: jag(
                    bx,
                    by,
                    ex,
                    ey,
                    Math.hypot(ex - bx, ey - by) * 0.2,
                    4
                ),
                width: 1.1,
            });
        }
    }

    return {
        setOptions(o) {
            color = o.color ?? LIGHTNING_DEFAULT_COLOR;
            rgb = parseHex(color, LIGHTNING_FALLBACK_RGB);
            speed = o.speed ?? 1;
        },

        resize(w, h) {
            width = w;
            height = h;
        },

        update(dt, intensity) {
            if (t < FLASH_DURATION) t += dt;

            if (intensity < 0.02) {
                armed = false;
                return;
            }
            if (!armed) {
                armed = true;
                nextIn = rand(1, 3);
            }

            nextIn -= dt * speed;
            if (nextIn <= 0 && t >= FLASH_DURATION) {
                strike(intensity);
                nextIn = Math.max(
                    2.2,
                    lerp(16, 3.5, intensity) * rand(0.6, 1.4)
                );
            }
        },

        draw(ctx) {
            if (t >= FLASH_DURATION) return;
            const e = flashEnvelope(t) * strength;

            // Ambient wash + glow around the strike point.
            ctx.globalAlpha = 1;
            ctx.fillStyle = rgba(rgb, 0.16 * e);
            ctx.fillRect(0, 0, width, height);
            const g = ctx.createRadialGradient(
                originX,
                0,
                0,
                originX,
                0,
                height
            );
            g.addColorStop(0, rgba(rgb, 0.4 * e));
            g.addColorStop(1, rgba(rgb, 0));
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, width, height);

            if (t >= BOLT_DURATION) return;

            const a = clamp(e * 1.6, 0, 1);
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            for (const b of bolts) {
                ctx.beginPath();
                ctx.moveTo(b.points[0], b.points[1]);
                for (let i = 2; i < b.points.length; i += 2) {
                    ctx.lineTo(b.points[i], b.points[i + 1]);
                }
                // Soft outer glow, then a white-hot core.
                ctx.globalAlpha = a * 0.25;
                ctx.strokeStyle = color;
                ctx.lineWidth = b.width * 5;
                ctx.stroke();

                ctx.globalAlpha = a;
                ctx.strokeStyle = "#ffffff";
                ctx.lineWidth = b.width;
                ctx.shadowColor = color;
                ctx.shadowBlur = 14;
                ctx.stroke();
                ctx.shadowBlur = 0;
            }
            ctx.globalAlpha = 1;
        },

        isIdle() {
            return t >= FLASH_DURATION;
        },
    };
}

/* -------------------------------------------------------------------------- */
/*  Engine                                                                    */
/* -------------------------------------------------------------------------- */

const LAYER_FACTORIES: Record<AmbienceLayerType, LayerFactory> = {
    rain: createRainLayer,
    snow: createSnowLayer,
    lightning: createLightningLayer,
};

interface Entry {
    layer: Layer;
    /** Smoothed level currently applied. */
    level: number;
    /** Level the caller asked for. */
    target: number;
}

const MAX_DPR = 2;
/** Higher = snappier fades when levels change. */
const SMOOTHING = 3;

export class AmbienceEngine {
    private readonly canvas: HTMLCanvasElement;
    private readonly ctx: CanvasRenderingContext2D;
    private readonly entries = new Map<AmbienceLayerType, Entry>();
    private options: AmbienceOptions = {};
    private observer: ResizeObserver | null = null;
    private width = 1;
    private height = 1;
    private raf = 0;
    private last = 0;
    private paused = false;
    private destroyed = false;

    constructor(canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("AmbienceEngine: 2D context unavailable");
        this.canvas = canvas;
        this.ctx = ctx;
        this.resize();
        if (typeof ResizeObserver !== "undefined") {
            this.observer = new ResizeObserver(() => this.resize());
            this.observer.observe(canvas);
        }
    }

    /** Set the target intensity (0-1) per layer. Omitted layers fade out. */
    setLayers(levels: AmbienceLayers) {
        if (this.destroyed) return;
        for (const type of AMBIENCE_LAYER_TYPES) {
            const target = clamp(levels[type] ?? 0, 0, 1);
            let entry = this.entries.get(type);
            if (!entry) {
                if (target <= 0) continue;
                const layer = LAYER_FACTORIES[type]();
                layer.setOptions(this.options[type] ?? {});
                layer.resize(this.width, this.height);
                entry = { layer, level: 0, target };
                this.entries.set(type, entry);
            }
            entry.target = target;
        }
        this.ensureRunning();
    }

    setOptions(options: AmbienceOptions) {
        this.options = options;
        for (const [type, entry] of this.entries) {
            entry.layer.setOptions(options[type] ?? {});
        }
    }

    setPaused(paused: boolean) {
        this.paused = paused;
        if (paused) {
            cancelAnimationFrame(this.raf);
            this.raf = 0;
        } else {
            this.ensureRunning();
        }
    }

    destroy() {
        this.destroyed = true;
        cancelAnimationFrame(this.raf);
        this.raf = 0;
        this.observer?.disconnect();
        this.entries.clear();
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    private resize() {
        const rect = this.canvas.getBoundingClientRect();
        const w = Math.max(1, Math.round(rect.width));
        const h = Math.max(1, Math.round(rect.height));
        const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

        this.canvas.width = Math.round(w * dpr);
        this.canvas.height = Math.round(h * dpr);
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        this.width = w;
        this.height = h;

        for (const entry of this.entries.values()) entry.layer.resize(w, h);
    }

    private ensureRunning() {
        if (this.raf || this.paused || this.destroyed) return;
        if (this.entries.size === 0) return;
        this.last = performance.now();
        this.raf = requestAnimationFrame(this.tick);
    }

    private tick = (now: number) => {
        this.raf = 0;
        const dt = Math.min((now - this.last) / 1000, 0.05);
        this.last = now;
        const k = 1 - Math.exp(-SMOOTHING * dt);

        this.ctx.clearRect(0, 0, this.width, this.height);

        for (const [type, entry] of this.entries) {
            entry.level += (entry.target - entry.level) * k;
            if (Math.abs(entry.target - entry.level) < 0.003) {
                entry.level = entry.target;
            }
            entry.layer.update(dt, entry.level);
            entry.layer.draw(this.ctx);

            if (
                entry.target === 0 &&
                entry.level === 0 &&
                entry.layer.isIdle()
            ) {
                this.entries.delete(type);
            }
        }

        // No layers left = no loop, so zero CPU while idle.
        if (this.entries.size > 0) this.raf = requestAnimationFrame(this.tick);
    };
}
