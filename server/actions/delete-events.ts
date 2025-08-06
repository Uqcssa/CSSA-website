'use server'
import { createSafeActionClient } from "next-safe-action"
import * as z from 'zod'
import { db } from ".."
import { eventSchema } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { utapi } from "@/app/api/uploadthing/delete";

const action = createSafeActionClient();

// this is delete merchant function.

export const deleteEvent = action(
  z.object({ id: z.number() }),
  async ({ id }) => {
    try {
      const event = await db.query.eventSchema.findFirst({
        where: eq(eventSchema.id, id),
        with: {
            eImages: true  // 获取关联的图片信息，根据key来删除不是url
        }
      });
      
      if (!event) throw new Error("Merchant Not Found!");
      
      // 提取所有的 imageUrl
      const images = event.eImages.map((url) => url.key);
      
      if (images.length > 0) {
          await utapi.deleteFiles(images);
      }
      const data = await db
        .delete(eventSchema)
        .where(eq(eventSchema.id, id))
        .returning()
      
      // delete the image from the uploadthing
      revalidatePath("/dashboard/events")
      return { success: `Event ${data[0].title} has been deleted` }
    } catch (error) {
      return { error: "Failed to delete Event" }
    }
  }
)