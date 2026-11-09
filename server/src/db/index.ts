import {
    boolean,
    index,
    integer,
    pgEnum,
    pgTable,
    real,
    text,
    uniqueIndex,
    uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const sceneCategory = pgEnum("scene_category", ["motion", "static"]);
export const soundCategory = pgEnum("sound_category", ["atmos", "noise"]);

export const stations = pgTable(
    "stations",
    {
        id: text("id").primaryKey(),
        title: text("title").notNull(),
        label: text("label").notNull(),
        genre: text("genre").notNull(),
        streamUrl: text("stream_url").notNull(),
        frequency: real("frequency").notNull(),
        sortOrder: integer("sort_order").notNull(),
    },
    (t) => [index("stations_sort_order_idx").on(t.sortOrder)]
);

export const scenes = pgTable(
    "scenes",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        stationId: text("station_id")
            .notNull()
            .references(() => stations.id, { onDelete: "cascade" }),
        category: sceneCategory("category").notNull(),
        url: text("url").notNull(),
        label: text("label").notNull(),
        description: text("description"),
        isDefault: boolean("is_default").notNull().default(false),
    },
    (t) => [
        index("scenes_station_idx").on(t.stationId),
        uniqueIndex("scenes_station_url_unique").on(t.stationId, t.url),
        uniqueIndex("scenes_one_default_per_station")
            .on(t.stationId)
            .where(sql`"is_default" = true`),
    ]
);

export const sounds = pgTable("sounds", {
    id: text("id").primaryKey(),
    category: soundCategory("category").notNull(),
    label: text("label").notNull(),
    url: text("url").notNull(),
});

export type Station = typeof stations.$inferSelect;
export type Scene = typeof scenes.$inferSelect;
export type Sound = typeof sounds.$inferSelect;
