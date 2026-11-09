import type { Response } from "express";

export function publicCache(res: Response, seconds = 300) {
    res.set("Cache-Control", `public, max-age=${seconds}`);
}
