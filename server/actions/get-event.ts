'use server'

import { eq } from "drizzle-orm"
import { db } from ".."
import { eventSchema } from "../schema"

export async function getEvent(id:number) {
    try {
        const event = await db.query.eventSchema.findFirst({
            where:eq(eventSchema.id,id),
            with:{
                eventTagsTo:{
                    with:{
                        eventTagsId:{
                            columns:{
                                tags:true,
                            }
                        }
                    }
                },
            }
        })
        if(!event){
            throw new Error("Event not found")
        }
        return{success:event}
    } catch (error) {
        return{error:"Failed to get event"}
    }
}