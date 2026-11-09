export function stringToColor(
    str: string,
    options: { s?: number; l?: number } = {}
): string {
    const { s = 65, l = 45 } = options;

    const normalized = String(str).trim().toLowerCase();

    let hash = 0;
    for (let i = 0; i < normalized.length; i++) {
        hash = normalized.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;

    const sNorm = s / 100;
    const lNorm = l / 100;
    const k = (n: number) => (n + hue / 30) % 12;
    const a = sNorm * Math.min(lNorm, 1 - lNorm);
    const f = (n: number) =>
        lNorm - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    const toHex = (x: number) =>
        Math.round(255 * x)
            .toString(16)
            .padStart(2, "0");

    return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}
