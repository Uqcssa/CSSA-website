ALTER TABLE "tagsToMerchant" DROP CONSTRAINT "tagsToMerchant_merchant_id_merchants_id_fk";
--> statement-breakpoint
ALTER TABLE "tagsToMerchant" DROP CONSTRAINT "tagsToMerchant_merchantTags_id_merchantTags_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tagsToMerchant" ADD CONSTRAINT "tagsToMerchant_merchant_id_merchants_id_fk" FOREIGN KEY ("merchant_id") REFERENCES "public"."merchants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tagsToMerchant" ADD CONSTRAINT "tagsToMerchant_merchantTags_id_merchantTags_id_fk" FOREIGN KEY ("merchantTags_id") REFERENCES "public"."merchantTags"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
