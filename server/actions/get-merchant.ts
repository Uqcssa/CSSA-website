'use server'

import { eq } from "drizzle-orm"
import { db } from ".."
import { tagsTo,merchantSchema } from "../schema"


//used for edita the merchant when user click edit 
export async function getMerchant(id:number) {
    try {
       const merchant = await db.query.merchantSchema.findFirst({
            where:eq(merchantSchema.id,id),
            with:{
              merchantTags:{
                with:{
                  tags:true,
                }
              },
              imageUrl: true,
            }
       }) 
       if(!merchant){
        throw new Error("Merchant Not Found")
       }
       return{success: merchant}
    } catch (error) {
        return {error: "Failed to get Merchant!"}
    }
    
}
//used for edita the merchant when user click edit 
// export async function getTags(id:number) {
//     try {
//        const tags = await db.query.tagsTo.findMany({
//             where:eq(merchantSchema.id,id)
//        }) 
//        if(!tags){
//         throw new Error("Tags Not Found")
//        }
//        return{success: tags}
//     } catch (error) {
//         return {error: "Failed to get tags!"}
//     }
    
// }

// server/actions/get-merchant.ts




// 获取某个商家的所有标签ID（字符串数组）
export async function getTags(merchantId: number) {
  try {
    // 查询 tagsTo 表，获取所有 merchantTagsId
    const tagLinks = await db.query.tagsTo.findMany({
      where: eq(tagsTo.merchantId, merchantId),
    });

    if (!tagLinks) throw new Error("Tags Not Found!");

    // 保证返回字符串数组
    const tagStrings = tagLinks.map((tag: any) => String(tag.merchantTagsId));
    return { success: tagStrings };
  } catch (error) {
    console.error("Error fetching tags:", error);
    return { error: "Failed to get tags!" };
  }
}

