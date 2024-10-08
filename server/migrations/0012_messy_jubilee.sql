CREATE TABLE IF NOT EXISTS "mImages" (
	"id" serial PRIMARY KEY NOT NULL,
	"merchant_id" integer NOT NULL,
	"size" real NOT NULL,
	"merchant_type" varchar(50) NOT NULL,
	"order" real NOT NULL,
	"created" timestamp DEFAULT now(),
	"image_url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "merchantTags" (
	"id" serial PRIMARY KEY NOT NULL,
	"merchant_type" varchar(20) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tagsToMerchant" (
	"merchant_id" integer NOT NULL,
	"merchantTags_id" integer NOT NULL,
	CONSTRAINT "tagsToMerchant_merchant_id_merchantTags_id_pk" PRIMARY KEY("merchant_id","merchantTags_id")
);
--> statement-breakpoint
ALTER TABLE "merchants" ADD COLUMN "user_id" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mImages" ADD CONSTRAINT "mImages_merchant_id_merchants_id_fk" FOREIGN KEY ("merchant_id") REFERENCES "public"."merchants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tagsToMerchant" ADD CONSTRAINT "tagsToMerchant_merchant_id_merchants_id_fk" FOREIGN KEY ("merchant_id") REFERENCES "public"."merchants"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tagsToMerchant" ADD CONSTRAINT "tagsToMerchant_merchantTags_id_merchantTags_id_fk" FOREIGN KEY ("merchantTags_id") REFERENCES "public"."merchantTags"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "merchants" ADD CONSTRAINT "merchants_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
