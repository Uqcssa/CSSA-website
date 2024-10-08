DO $$ BEGIN
 CREATE TYPE "public"."types" AS ENUM('清真餐厅', '中餐', '西餐', '甜品', '饮料', '咖啡', '饮品', '烧烤', '火锅', '日料', '韩餐', '留学教育', '生活服务', '休闲娱乐', '线上商家');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "merchantTags" ADD COLUMN "types" "types" DEFAULT '中餐';--> statement-breakpoint
ALTER TABLE "merchantTags" DROP COLUMN IF EXISTS "merchant_type";