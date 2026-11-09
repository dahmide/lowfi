import { Router, type Request, type Response } from "express";
import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { publicCache } from "@/lib/cache";
import { sounds } from "@/db";
import type { AmbienceResponse } from "@shared/api";

export const router = Router();

router.get("/", async (_req: Request, res: Response<AmbienceResponse>) => {
    const rows = await db
        .select()
        .from(sounds)
        .orderBy(asc(sounds.category), asc(sounds.label));

    const grouped: AmbienceResponse = { atmos: [], noise: [] };
    for (const row of rows) grouped[row.category].push(row);

    publicCache(res);
    res.json(grouped);
});

export default router;
