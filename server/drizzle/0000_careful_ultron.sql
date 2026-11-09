CREATE TABLE "effects" (
	"id" text PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"sound_url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "visuals" (
	"id" text PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"ambience_id" text NOT NULL,
	CONSTRAINT "visuals_ambience_id_unique" UNIQUE("ambience_id")
);
--> statement-breakpoint
CREATE TABLE "snippets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"station_id" text NOT NULL,
	"label" text NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"bg_asset_url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stations" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"genre" text NOT NULL,
	"sort_order" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "visuals" ADD CONSTRAINT "visuals_ambience_id_effects_id_fk" FOREIGN KEY ("ambience_id") REFERENCES "public"."effects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "snippets" ADD CONSTRAINT "snippets_station_id_stations_id_fk" FOREIGN KEY ("station_id") REFERENCES "public"."stations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "scenes_station_idx" ON "snippets" USING btree ("station_id");--> statement-breakpoint
CREATE INDEX "stations_sort_order_idx" ON "stations" USING btree ("sort_order");