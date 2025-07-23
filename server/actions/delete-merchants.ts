'use server'
import { createSafeActionClient } from "next-safe-action"
import * as z from 'zod'
import { db } from ".."
import { merchantSchema } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { utapi } from "@/app/api/uploadthing/delete";

const action = createSafeActionClient();

// this is delete merchant function.

export const deleteMerchant = action(
  z.object({ id: z.number() }),
  async ({ id }) => {
    try {
      const merchant = await db.query.merchantSchema.findFirst({
        where: eq(merchantSchema.id, id),
        with: {
            imageUrl: true  // 获取关联的图片信息，根据key来删除不是url
        }
      });
      
      if (!merchant) throw new Error("Merchant Not Found!");
      
      // 提取所有的 imageUrl
      const images = merchant.imageUrl.map((url) => url.key);
      
      if (images.length > 0) {
          await utapi.deleteFiles(images);
      }
      const data = await db
        .delete(merchantSchema)
        .where(eq(merchantSchema.id, id))
        .returning()
      
      // delete the image from the uploadthing
      revalidatePath("/dashboard/merchants")
      return { success: `Merchant ${data[0].title} has been deleted` }
    } catch (error) {
      return { error: "Failed to delete Merchant" }
    }
  }
)