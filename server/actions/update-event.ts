'use server'

import { EventSchema } from "@/types/event-schema"
import { createSafeActionClient } from "next-safe-action"
import { auth } from "../auth"
import { eq } from "drizzle-orm"
import { db } from ".."
import { eImage, eventSchema, eventTagsTo, users } from "../schema"
import { handleEventTags } from "./handleEventTags"
import { handleEImage } from "./handleImages"
import { revalidatePath } from "next/cache"

const action = createSafeActionClient()
export const updateEvent = action(
    EventSchema,
    async({title, description, address, date, time, maxParticipants, price, organizer, contactInfo, status, eventTags, images,id})=>{
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
                const currentEvent = await db.query.eventSchema.findFirst({
                    where:eq(eventSchema.id,id)
                })
                if(!currentEvent){
                    return{error:"Event not found"}
                }
                if(dbUser.role !== "admin" && currentEvent.userId !== dbUser.id){
                    return{error:"You are not authorized to update this event"}
                }

                //update event

                await db.update(eventSchema).set({
                    title,
                    description,
                    address,
                    date,
                    time,
                    maxParticipants,
                    price,
                    organizer,
                    contactInfo,
                    status,
                }).where(eq(eventSchema.id,id)).returning()

                //update tags
                await db.delete(eventTagsTo).where(eq(eventTagsTo.eventId,id))
                if(eventTags && eventTags.length > 0){
                    await handleEventTags(eventTags,id)
                }


                //update images
                if(images && images.length > 0){
                    await db.delete(eImage).where(eq(eImage.eventId,id))
                    const imageResult = await handleEImage(eventTags,id)
                    if(imageResult.error){
                        return{
                            error:imageResult.debugInfo,
                            debugInfo:imageResult.debugInfo,
                        }
                    }

                }
                //revalidate the path
                revalidatePath("/dashboard/events");
                return {
                success: {
                    message: 'Merchant information Updated successfully!',
                }};
            }
        } catch (error) {
            return{error:JSON.stringify(error)}
        }
    }

)