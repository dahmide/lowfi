CREATE TABLE "overlays" (
	"id" text PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"video_asset_url" text NOT NULL
);
--> statement-breakpoint
DROP INDEX "scenes_station_idx";--> statement-breakpoint
ALTER TABLE "snippets" ADD COLUMN "overlay_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "snippets" ADD CONSTRAINT "snippets_overlay_id_overlays_id_fk" FOREIGN KEY ("overlay_id") REFERENCES "public"."overlays"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "snippets_station_idx" ON "snippets" USING btree ("station_id");--> statement-breakpoint
CREATE UNIQUE INDEX "snippets_one_default_per_station_idx" ON "snippets" USING btree ("station_id") WHERE "snippets"."is_default" = true;