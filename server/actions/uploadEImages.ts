'use server'

import { eq, inArray } from "drizzle-orm"
import { db } from ".."
import {  eImage } from "../schema"


export async function uploadEImages(images: {url:string, name: string,key: string} [], eventId: number) {
    try {
      // 遍历images数组，构建插入数据，包含图片和name以及url
      const imageInserts = images.map((image) => ({
        
        eventId,
        imageUrl: image.url,
        name: image.name,
        key: image.key,
      }));
      // console.log(imageInserts)
      // 将数据插入到mImages表
      await db.insert(eImage).values(imageInserts).returning();
  
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
    