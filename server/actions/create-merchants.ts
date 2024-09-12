'use server'
import { MerchantSchema } from "@/types/merchant-schema";
import { createSafeActionClient } from "next-safe-action"
import { db } from "..";
import { merchantSchema } from "../schema";
import { eq } from "drizzle-orm";

const action = createSafeActionClient();

export const createMerchant = action(
    MerchantSchema,
    async({title, description, discountInformation, address, id}) =>{
        try {
            if(id){
                const currentMerchant = await db.query.merchantSchema.findFirst({
                    where: eq(merchantSchema.id, id)
                })
                if(!currentMerchant) return{error: "Merchant not found"}
                const editedMerchant = await db
                    .update(merchantSchema)
                    .set({title, description, discountInformation, address})
                    .where(eq(merchantSchema.id,id)).returning();
                return{success: `Merchant ${editedMerchant[0].title} has been Updated`}
            }
            if(!id){
                const newMerchant = await db
                .insert(merchantSchema)
                .values({title, description, discountInformation, address})
                .returning()// returning() is very important 
                return{success:`Product ${newMerchant[0].title} has been created`}
            }
        } catch (error) {
            return{error: JSON.stringify(error)}
        }
    }
)