'use server'
import { EventSchema } from "@/types/event-schema";
import { createSafeActionClient } from "next-safe-action"
import { auth } from "../auth";
import { db } from "..";
import { eq } from "drizzle-orm";
import { eventSchema, users } from "../schema";
import { handleEventTags } from "./handleEventTags";
import { revalidatePath } from "next/cache";
import { uploadEImages } from "./uploadEImages";

const action = createSafeActionClient();

export const createEvent = action(
    EventSchema,
    async({title,id, description, address, date, time, maxParticipants, price, organizer, contactInfo, status, eventTags, images}) =>{
        const user = await auth();
        if(!user){
            return {error: "User not found"}
        }
        const dbUser = await db.query.users.findFirst({
            where:eq(users.id, user.user.id)
        })
        if(!dbUser || dbUser.role !== "admin"){
            return {error: "User not found or you dont have right to create or edit"}
        }
 
        try {
            if(id){
                const currentEvent = await db.query.eventSchema.findFirst({
                    where:eq(eventSchema.id, id)
                })
                if(!currentEvent){
                    return {error: "Event not found"}
                }
                if(dbUser.role !== "admin" && currentEvent.userId !== user.user.id){
                    return {error: "You dont have right to edit this event"}
                }
            }
            //create new event
            if(!id){
                const newEvent = await db
                .insert(eventSchema)
                .values({
                    title,
                    description, 
                    address, 
                    date: new Date(date), //the date is timestamp type but here is string so we need to transfer it to timestamp type for storing in database for storing in database properly
                    time, 
                    maxParticipants, 
                    price, 
                    organizer, 
                    contactInfo, 
                    status, 
                    userId: dbUser.id
                })
                .returning()// return the id of the event

                //event tags part
                const eventId = newEvent[0].id
                if(eventTags && eventTags.length > 0){
                    const eventTagsresult = await handleEventTags(eventId, eventTags[0])
                    if (eventTagsresult.error) {
                        return {
                            error: "Error creating event tags",
                            debugInfo: eventTagsresult,
                        };
                    }
                }

                //images part
                if(images && images.length > 0){
                    const imageResult = await uploadEImages(images, eventId)
                    if(imageResult.error){
                        return {
                            error: imageResult.debugInfo,
                            debugInfo: imageResult.debugInfo,
                        };
                    }
                }

                revalidatePath("/dashboard/add-events")
                return{
                    success: {
                    message1: 'Event created',
                    message2: 'Event information registered successfully',
                    message3: 'Event Creating',
                    debugInfo: images,
                }}
            }


          

        } catch (error) {
            return{error: JSON.stringify(error)}
        }
    }
)