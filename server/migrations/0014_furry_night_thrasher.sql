DROP TABLE "mImages";--> statement-breakpoint
DROP TABLE "tagsToMerchant";--> statement-breakpoint
ALTER TABLE "merchants" DROP CONSTRAINT "merchants_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "merchants" DROP COLUMN IF EXISTS "user_id";