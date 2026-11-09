import express, { Router, type Request, type Response } from "express";
import { asc, desc, eq, gt, lt, ne, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { publicCache } from "@/lib/cache";
import { scenes, stations } from "@/db";
import type { ApiError, ScenesResponse, StationResponse } from "@shared/api";

export const router = Router();
router.use(express.json());

const defaultScene = db
    .select({ stationId: scenes.stationId, url: scenes.url })
    .from(scenes)
    .where(eq(scenes.isDefault, true))
    .as("default_scene");

function selectStations() {
    return db
        .select({
            id: stations.id,
            title: stations.title,
            label: stations.label,
            genre: stations.genre,
            streamUrl: stations.streamUrl,
            sceneUrl: defaultScene.url,
            frequency: stations.frequency,
            sortOrder: stations.sortOrder,
        })
        .from(stations)
        .leftJoin(defaultScene, eq(defaultScene.stationId, stations.id));
}

async function findStation(id: string): Promise<StationResponse | null> {
    const [station] = await selectStations()
        .where(eq(stations.id, id))
        .limit(1);
    return station ?? null;
}

async function findNeighbourId(stationId: string, direction: "next" | "prev") {
    const [current] = await db
        .select({ sortOrder: stations.sortOrder })
        .from(stations)
        .where(eq(stations.id, stationId))
        .limit(1);
    if (!current) return null;

    const forward = direction === "next";
    const order = forward ? asc(stations.sortOrder) : desc(stations.sortOrder);

    const [target] = await db
        .select({ id: stations.id })
        .from(stations)
        .where(
            forward
                ? gt(stations.sortOrder, current.sortOrder)
                : lt(stations.sortOrder, current.sortOrder)
        )
        .orderBy(order)
        .limit(1);
    if (target) return target.id;

    const [wrapped] = await db
        .select({ id: stations.id })
        .from(stations)
        .orderBy(order)
        .limit(1);
    return wrapped?.id ?? null;
}

async function findRandomId(stationId: string) {
    const [current] = await db
        .select({ id: stations.id })
        .from(stations)
        .where(eq(stations.id, stationId))
        .limit(1);
    if (!current) return null;

    const [target] = await db
        .select({ id: stations.id })
        .from(stations)
        .where(ne(stations.id, stationId))
        .orderBy(sql`random()`)
        .limit(1);

    return target?.id ?? current.id;
}

function stationSwitchHandler(
    findId: (stationId: string) => Promise<string | null>
) {
    return async (req: Request, res: Response<StationResponse | ApiError>) => {
        const id = await findId(req.params.stationId as string);
        if (!id) return res.status(404).json({ error: "Station not found" });

        const station = await findStation(id);
        if (!station)
            return res.status(404).json({ error: "Station not found" });

        res.json(station);
    };
}

router.get("/", async (_req: Request, res: Response<StationResponse[]>) => {
    const rows: StationResponse[] = await selectStations().orderBy(
        asc(stations.sortOrder)
    );
    res.json(rows);
});

router.get(
    "/:stationId",
    async (req: Request, res: Response<StationResponse | ApiError>) => {
        const station = await findStation(req.params.stationId as string);
        if (!station)
            return res.status(404).json({ error: "Station not found" });

        res.json(station);
    }
);

router.get(
    "/:stationId/next",
    stationSwitchHandler((id) => findNeighbourId(id, "next"))
);
router.get(
    "/:stationId/prev",
    stationSwitchHandler((id) => findNeighbourId(id, "prev"))
);
router.get("/:stationId/random", stationSwitchHandler(findRandomId));

router.get(
    "/:stationId/scenes",
    async (req: Request, res: Response<ScenesResponse | ApiError>) => {
        const stationId = req.params.stationId as string;

        const [station] = await db
            .select({ id: stations.id })
            .from(stations)
            .where(eq(stations.id, stationId))
            .limit(1);
        if (!station)
            return res.status(404).json({ error: "Station not found" });

        const rows = await db
            .select({
                id: scenes.id,
                category: scenes.category,
                url: scenes.url,
                label: scenes.label,
                description: scenes.description,
                isDefault: scenes.isDefault,
            })
            .from(scenes)
            .where(eq(scenes.stationId, stationId))
            .orderBy(desc(scenes.isDefault), asc(scenes.label));

        const grouped: ScenesResponse = { motion: [], static: [] };
        for (const row of rows) grouped[row.category].push(row);

        publicCache(res);
        res.json(grouped);
    }
);

export default router;
