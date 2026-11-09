"use client";
import { Vibrant } from "node-vibrant/browser";

export type Colors = {
    background: string;
    foreground: string;
    buttonBackground: string;
    buttonForeground: string;
};

type Palette = Awaited<ReturnType<InstanceType<typeof Vibrant>["getPalette"]>>;
type Swatch = NonNullable<Palette[keyof Palette]>;

const FALLBACK: Colors = {
    background: "#2a2540",
    foreground: "#ffffff",
    buttonBackground: "#8b7cf6",
    buttonForeground: "#000000",
};
const SAMPLE_WIDTH = 64;
const TIMEOUT = 10000;
const SEEK_TIMEOUT = 2000;
const cache = new Map<string, Promise<Colors>>();

function shrink(source: HTMLImageElement | HTMLVideoElement): string {
    const isVideo = source instanceof HTMLVideoElement;
    const width = isVideo ? source.videoWidth : source.naturalWidth;
    const height = isVideo ? source.videoHeight : source.naturalHeight;

    if (!width || !height) throw new Error("source has no size");

    const scale = Math.min(1, SAMPLE_WIDTH / width);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas not supported");

    ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/png");
}

function loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const timer = setTimeout(
            () => reject(new Error("image timed out")),
            TIMEOUT
        );

        img.crossOrigin = "anonymous";
        img.onload = () => {
            clearTimeout(timer);
            resolve(img);
        };
        img.onerror = () => {
            clearTimeout(timer);
            reject(new Error("not an image"));
        };
        img.src = url;
    });
}

async function getVideoFrame(url: string): Promise<string> {
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";

    try {
        await new Promise<void>((resolve, reject) => {
            const timer = setTimeout(
                () => reject(new Error("video timed out")),
                TIMEOUT
            );

            video.onloadeddata = () => {
                clearTimeout(timer);
                resolve();
            };
            video.onerror = () => {
                clearTimeout(timer);
                reject(new Error("video failed to load"));
            };
            video.src = url;
        });

        const target = Number.isFinite(video.duration)
            ? Math.min(1, video.duration / 2)
            : 0;

        if (target > 0) {
            await new Promise<void>((resolve) => {
                video.onseeked = () => resolve();
                setTimeout(resolve, SEEK_TIMEOUT);
                video.currentTime = target;
            });
        }

        return shrink(video);
    } finally {
        video.removeAttribute("src");
        video.load();
    }
}

async function pickColors(source: string): Promise<Colors> {
    const palette = await Vibrant.from(source).quality(1).getPalette();

    const swatches = Object.values(palette)
        .filter((swatch): swatch is Swatch => swatch !== null)
        .sort((a, b) => b.population - a.population);

    const [card, ...others] = swatches;
    if (!card) return FALLBACK;

    const [, , cardLightness] = card.hsl;

    const [button] = others.sort((a, b) => {
        const score = (swatch: Swatch) =>
            Math.abs(swatch.hsl[2] - cardLightness) + swatch.hsl[1] * 0.5;
        return score(b) - score(a);
    });

    if (!button) {
        return {
            background: card.hex,
            foreground: card.bodyTextColor,
            buttonBackground: card.bodyTextColor,
            buttonForeground: card.hex,
        };
    }

    return {
        background: card.hex,
        foreground: card.bodyTextColor,
        buttonBackground: button.hex,
        buttonForeground: button.bodyTextColor,
    };
}

export function getImagePalette(url: string): Promise<Colors> {
    const existing = cache.get(url);
    if (existing) return existing;

    const promise = (async (): Promise<Colors> => {
        try {
            let source: string;

            try {
                source = shrink(await loadImage(url));
            } catch {
                source = await getVideoFrame(url);
            }

            return await pickColors(source);
        } catch (error) {
            console.warn("getColors failed, using fallback:", error);
            cache.delete(url);
            return FALLBACK;
        }
    })();

    cache.set(url, promise);
    return promise;
}
