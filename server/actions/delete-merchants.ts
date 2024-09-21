'use server'
import { createSafeActionClient } from "next-safe-action"
import * as z from 'zod'
import { db } from ".."
import { merchantSchema } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const action = createSafeActionClient();



export const deleteMerchant = action(
  z.object({ id: z.number() }),
  async ({ id }) => {
    try {
      const data = await db
        .delete(merchantSchema)
        .where(eq(merchantSchema.id, id))
        .returning()
      revalidatePath("/dashboard/merchants")
      return { success: `Merchant ${data[0].title} has been deleted` }
    } catch (error) {
      return { error: "Failed to delete Merchant" }
    }
  }
)