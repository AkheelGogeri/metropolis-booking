-- Data already backfilled into the new `images` Json column; safe to drop.
ALTER TABLE "Venue" DROP COLUMN "image";
