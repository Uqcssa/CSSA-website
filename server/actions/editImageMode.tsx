'use server'
import { createSafeActionClient } from "next-safe-action"
import * as z from 'zod'
import { db } from ".."
import { merchantSchema, mImages } from "../schema";
import { eq } from "drizzle-orm";
import { utapi } from "@/app/api/uploadthing/delete";




const action = createSafeActionClient();


// // Define the server-side code
// export const deleteImage = async  ({ id, imageKey }: { id?: number, imageKey: string }) => {
//     try {
//       // Find the current image in the database
//       const currentImages = await db.query.mImages.findFirst({
//         where: eq(mImages.id, id!),
//       });
  
//       if (currentImages) {
//         // If the image exists, delete it
//         const data = await db
//           .delete(mImages)
//           .where(eq(mImages.merchantId, id!))
//           .returning();
  
//         // Delete the image from the external storage service (e.g., Uploadthing)
//         await utapi.deleteFiles(imageKey);
  
//         return { success: "Image has been deleted" };
//       } else {
//         throw new Error("Image not found");
//       }
//     } catch (error) {
//       return { error: "Failed to delete image" };
//     }
//   };
  
 
// remove images from the database 
export const deleteImage = async (imageKey: string) =>{
    try {
        // 1. 删除 UploadThing 存储中的文件
        await utapi.deleteFiles(imageKey)
        // 2. 删除数据库中的图片记录
        await db.delete(mImages).where(eq(mImages.key, imageKey))
        return { success: `Image has been deleted` }
    } catch (error) {
        return { error: "Failed to delete Image" }
    }
}