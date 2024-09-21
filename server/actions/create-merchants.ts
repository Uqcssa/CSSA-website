'use server'
import { MerchantSchema } from "@/types/merchant-schema";
import { createSafeActionClient } from "next-safe-action"
import { db } from "..";
import { merchantSchema } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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
                return{
                    success: {
                    message1: 'Merchant Updeatd',
                    message2: 'Merchant information Updated successfully',
                }}
            }
            if(!id){
                const newMerchant = await db
                .insert(merchantSchema)
                .values({title, description, discountInformation, address})
                .returning()// returning() is very important 
                revalidatePath("/dashboard/merchants")
                return{
                    success: {
                    message1: 'Product created',
                    message2: 'Merchant information registered successfully',
                    message3: 'Product Creating',
                }}
            }
        } catch (error) {
            return{error: JSON.stringify(error)}
        }
    }
)