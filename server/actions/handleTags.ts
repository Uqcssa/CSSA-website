'use server'

import { eq, inArray } from "drizzle-orm"
import { db } from ".."
import { merchantTags, tagsTo } from "../schema"


export async function handleTags(merchant_type: string[], merchantId: number) {
    try {
      // 将字符串形式的id转为整数
      const tagIds = merchant_type.map((typeId) => parseInt(typeId, 10));
  
      // 构建插入数据
      const tagInserts = tagIds.map((tagId) => ({
        merchantId,  // 来自商家表的id
        merchantTagsId: tagId,  // 对应的标签id
      }));
  
      // 将数据插入到tagsTo表
      await db.insert(tagsTo).values(tagInserts);
  
      return {
        success: true,
        message: "Tags inserted successfully",
        insertedTags: tagInserts,  // 调试信息，包含插入的tags数据
      };
    } catch (error) {
      return {
        error: "Failed to insert tags",
        debugInfo: error,  // 捕获并返回错误信息
      };
    }
  }
  