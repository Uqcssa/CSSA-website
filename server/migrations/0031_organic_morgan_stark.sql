ALTER TABLE "merchantTags" RENAME COLUMN "types" TO "tags";--> statement-breakpoint
ALTER TABLE "merchantTags" ALTER COLUMN "tags" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "merchantTags" ALTER COLUMN "tags" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "merchantTags" ALTER COLUMN "tags" SET NOT NULL;