'use server'
import { EventSchema } from "@/types/event-schema";
import { createSafeActionClient } from "next-safe-action"
import { auth } from "../auth";
import { db } from "..";
import { eq } from "drizzle-orm";
import { eventSchema, users } from "../schema";
import { handleEventTags } from "./handleEventTags";
import { revalidatePath } from "next/cache";

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
                .values({title,description, address, date, time, maxParticipants, price, organizer, contactInfo, status, userId:dbUser.id})
                .returning()

                const eventId = newEvent[0].id // 你使用了 .returning()，它会返回一个 数组，即使你只插入了一条数据。所以 newMerchant 的类型是string[], 所以需要取第一个元素
                if(eventTags && eventTags.length > 0){
                    const eventTagsresult = await handleEventTags(eventId, eventTags)
                    if (eventTagsresult.error) {
                        return {
                            error: "Error creating merchant tags",
                            debugInfo: eventTagsresult,
                        };
                    }
                }

                //images part

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