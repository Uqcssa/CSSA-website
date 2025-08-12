'use server'

import { eq } from "drizzle-orm"
import { db } from ".."
import { eImage, eventSchema } from "../schema"
import { utapi } from "@/app/api/uploadthing/delete"

export async function checkEImage(id:number){
    try {
        const event = await db.query.eventSchema.findFirst({
            where:eq(eventSchema.id,id),
            with:{
                eImages:true
            }
        })
        if(!event) throw new Error("Event not found")
        const imageList = event.eImages
        return{success:imageList}
    } catch (error) {
        return{error:"Failed to check event image"}
    }
}

export async function deleteEImage(imageKey:string){
    try {
        await utapi.deleteFiles(imageKey)
        await db.delete(eImage).where(eq(eImage.key,imageKey))
        return{success:"Image deleted successfully"}
    } catch (error) {
        return{error:"Failed to delete Image"}
    }
}