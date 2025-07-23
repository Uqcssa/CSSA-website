'use server'

import { eq, inArray } from "drizzle-orm"
import { db } from ".."
import { merchantTags, mImages } from "../schema"


export async function handleImages(images: {url:string, name: string,key: string} [], merchantId: number) {
    try {
      // 遍历images数组，构建插入数据，包含图片和name以及url
      const imageInserts = images.map((image) => ({
        merchantId,
        imageUrl: image.url,
        name: image.name,
        key: image.key,
      }));
      console.log(imageInserts)
      // 将数据插入到mImages表
      await db.insert(mImages).values(imageInserts);
  
      return {
        success: true,
        message: "Images inserted successfully",
        insertedTags: imageInserts,  // 调试信息，包含插入的tags数据
      };
    } catch (error) {
        console.error("Error in handleImages:", error); // 打印完整的错误信息
        return {
            error: "Error creating images",
            debugInfo: error instanceof Error ? error.message : String(error),  // 捕获并返回简化的错误信息
        };
    }
  }