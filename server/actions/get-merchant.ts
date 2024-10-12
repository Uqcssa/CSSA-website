'use server'

import { eq } from "drizzle-orm"
import { db } from ".."
import { merchantSchema } from "../schema"

//used for edita the merchant when user click edit 
export async function getMerchant(id:number) {
    try {
       const merchant = await db.query.merchantSchema.findFirst({
            where:eq(merchantSchema.id,id)
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

export async function getTags(id: number) {
  try {
    // 通过 merchantId 查询相关的 merchantTags 及其 tags 信息
    const merchantWithTags = await db.query.merchantSchema.findFirst({
      where: eq(merchantSchema.id, id),
      with: {
        merchantTags: {
          with: {
            tags: true, // 通过 tagsTo 表关联到 merchantTags 表中的 tags 字段
          },
        },
      },
    });

    // 检查查询结果是否为空
    if(!merchantWithTags) throw new Error("Merchant Not Found!")
    

    // 返回成功结果，包含 tags 信息
    const tags = merchantWithTags.merchantTags.flatMap((tagsList) => 
        tagsList.tags.tags
      );
    return {
      success: tags // 提取 tags
    };

  } catch (error) {
    console.error("Error fetching tags:", error);
    return { error: "Failed to get tags!" };
  }
}

