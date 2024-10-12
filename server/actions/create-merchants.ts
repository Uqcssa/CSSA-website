'use server'
import { MerchantSchema } from "@/types/merchant-schema";
import { createSafeActionClient } from "next-safe-action"
import { db } from "..";
import { merchantSchema, tagsTo, users } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "../auth";
import { handleTags } from "./handleTags";

const action = createSafeActionClient();

export const createMerchant = action(
    MerchantSchema,
    async({title, description, discountInformation, address, id, merchant_type}) =>{
        //check Authentication:
        const user = await auth()
        
        if(!user){
            return {error: "User not found"}
        }
        const dbUser = await db.query.users.findFirst({
            where:eq(users.id,user.user.id)
        })
        if(!dbUser || dbUser.role === "user" ){
            return {error: "User not found or you dont have right to create or edit"}
        }

        try {
            if(id){
                const currentMerchant = await db.query.merchantSchema.findFirst({
                    where: eq(merchantSchema.id, id)
                })
                if(!currentMerchant) {
                    return{error: "Merchant not found"}
                }
                // check user authority
                if (dbUser.role !== "admin" && dbUser.id !== currentMerchant.userId) {
                    // 如果用户不是管理员，且不是商家的上传者
                    return { error: "You don't have permission to edit this merchant!" };
                }

                const editedMerchant = await db
                    .update(merchantSchema)
                    .set({title, description, discountInformation, address})
                    .where(eq(merchantSchema.id,id))
                    .returning()
                
                //update  the tags
                await db.delete(tagsTo).where(eq(tagsTo.merchantId, id))
                await handleTags(merchant_type, id);
                
                revalidatePath("/dashboard/merchants")
                return{
                    success: {
                    message1: 'Merchant Updated',
                    message2: 'Merchant information Updated successfully',
                }}
               
            }
            if(!id){
                const newMerchant = await db
                .insert(merchantSchema)
                .values({title, description, discountInformation, address,userId:dbUser.id})
                .returning()// returning() is very important 

                // insert the new tags to the table 
                const merchantId = newMerchant[0].id
                if(merchant_type && merchant_type.length > 0){
                    const tagsResult = await handleTags(merchant_type, merchantId);
                    if (tagsResult.error) {
                    return {
                        error: "Error creating merchant tags",
                        debugInfo: tagsResult,
                    };
                    }
                }

                revalidatePath("/dashboard/merchants")
                return{
                    success: {
                    message1: 'Merchant created',
                    message2: 'Merchant information registered successfully',
                    message3: 'Merchant Creating',
                    debugInfo: merchant_type,
                }}
            }
        } catch (error) {
            return{error: JSON.stringify(error)}
        }
    }
)

