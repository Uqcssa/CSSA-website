'use server'

import { MerchantSchema } from "@/types/merchant-schema";
import { createSafeActionClient } from "next-safe-action"
import { auth } from "../auth";
import { db } from "..";
import { eq } from "drizzle-orm";
import { merchantSchema, tagsTo, users, mImages } from "../schema";
import { handleTags } from "./handleTags";
import { handleImages } from "./handleImages";
import { revalidatePath } from "next/cache";

const action = createSafeActionClient();
export const updateMerchant = action(
    MerchantSchema,
    async({title, description, discountInformation, address, id, merchant_type, images})=>{
        const user = await auth()

        if(!user){
            return{error:"User Not Found!"}
        }
        const dbUser = await db.query.users.findFirst({
            where:eq(users.id,user.user.id)
        })
        if(!dbUser || dbUser.role == "user"){
            return {error: "User not found or you dont have right to create or edit"}
        }
        try {
            if(id){
                const currentMerchant = await db.query.merchantSchema.findFirst({
                    where:eq(merchantSchema.id,id)
                })
                if(!currentMerchant){
                    return {error:"Merchant not found"}
                }
                //check the user have permission to edit the merchant
                if(dbUser.role !== "admin" && currentMerchant.userId !== dbUser.id){
                    return{error:"You dont have permission to edit this merchant!"}
                }

                //update the merchant information
                await db
                .update(merchantSchema)
                .set({title, description, discountInformation, address})
                .where(eq(merchantSchema.id,id)).returning()

                //update the tags
                await db.delete(tagsTo).where(eq(tagsTo.merchantId, id));
                if (merchant_type && merchant_type.length > 0) {
                await handleTags(merchant_type, id);
                }

                //update the images
                if (images && images.length > 0) {
                    // 先删除现有的图片记录
                    await db.delete(mImages).where(eq(mImages.merchantId, id));
                    // 插入新的图片
                    const imageResult = await handleImages(images, id);
                    if (imageResult.error) {
                        return {
                            error: imageResult.debugInfo,
                            debugInfo: imageResult.debugInfo,
                        };
                    }
                }

                //revalidate the path
                revalidatePath("/dashboard/merchants");
                return {
                success: {
                    message: 'Merchant information Updated successfully!',
                }};
            }
        } catch (error) {
            return{error: JSON.stringify(error)}
        }
    }
)