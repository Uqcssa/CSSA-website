DO $$ BEGIN
 CREATE TYPE "public"."types" AS ENUM('清真餐厅', '中餐', '西餐', '咖啡', '甜品', '烧烤', '火锅', '日料', '韩餐', '留学教育', '生活服务', '休闲娱乐', '线上商家');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "merchantTags" RENAME COLUMN "merchant_type" TO "types";--> statement-breakpoint
ALTER TABLE "tagsToMerchant" DROP CONSTRAINT "tagsToMerchant_merchant_id_merchants_id_fk";
--> statement-breakpoint
ALTER TABLE "tagsToMerchant" DROP CONSTRAINT "tagsToMerchant_merchantTags_id_merchantTags_id_fk";
--> statement-breakpoint
ALTER TABLE "merchantTags" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "merchantTags" ALTER COLUMN "types" SET DATA TYPE types;--> statement-breakpoint
ALTER TABLE "merchantTags" ALTER COLUMN "types" SET DEFAULT '中餐';--> statement-breakpoint
ALTER TABLE "merchantTags" ALTER COLUMN "types" DROP NOT NULL;--> statement-breakpoint
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
