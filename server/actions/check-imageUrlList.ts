'use server'
import { createSafeActionClient } from "next-safe-action"
import * as z from 'zod'
import { db } from ".."
import { merchantSchema } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { utapi } from "@/app/api/uploadthing/delete";

export async function checkImageList(id:number){
    try {
       const merchant = await db.query.merchantSchema.findFirst({
        where:eq(merchantSchema.id,id),
        with:{
            imageUrl:true
        }
       })

       if(!merchant) throw new Error("Merchant Not Found!")
       //get the image Url List from the database
       const imagesList = merchant.imageUrl.map((url) => ({
        id: url.id,
        name: url.name,
        imageUrl: url.imageUrl,
        merchantId: url.merchantId,
        key: url.key,
       }));
       return imagesList
    } catch (error) {
        console.error("Error fetching image list:", error);
        return null;
    }
}