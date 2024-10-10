'use server'

import { eq } from "drizzle-orm";
import { db } from "..";
import { merchantTags, } from "../schema"; 
import { error } from "console";

// 定义常量标签
const predefinedTags = ["清真餐厅", "中餐", "西餐", "甜品", "咖啡", "饮品", "烧烤", "火锅", "日料", "韩餐", "留学教育", "生活服务", "休闲娱乐", "线上商家"];

export async function handleTags(tags: string[], merchantId: number) {
  if (tags && tags.length > 0) {
    for (const tagName of tags) {
      // 检查传入的标签是否在预定义的常量标签中
      if (predefinedTags.includes(tagName)) {
        // 查找标签ID
        const tag = await db.query.merchantTags.findFirst({
          where: eq(merchantTags.tags, tagName),
        });

        if (!tag) {
          throw new Error(`标签 ${tagName} 未在数据库中找到`);
        }

        const tagId = tag.id;

        // 将标签与商家关联
        await db.insert(merchantTagsSchema).values({
          merchant_id: merchantId,
          tag_id: tagId,
        });
      } else {
        console.error(`标签 ${tagName} 不在预定义列表中`);
      }
    }
  }
}
