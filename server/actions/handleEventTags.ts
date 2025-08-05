'use server'
import { db } from ".."
import { eventTagsTo } from "../schema"

export const handleEventTags = async (eventId:number, eventTags:string) =>{
    
    try {
        const tagId = parseInt(eventTags,10)
        //construte the data structure 
        const taginserts = ({
            eventId,
            eventTagsId:tagId,
        })
        //insert the data into the database
        await db.insert(eventTagsTo).values(taginserts)
        return{
            success:true,
            message:"Event tags created successfully"
        }
    } catch (error) {
        return{
            error:"Error creating event tags",
            debugInfo:error,
        }
    }
}