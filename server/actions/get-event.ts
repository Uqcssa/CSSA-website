'use server'

import { eq } from "drizzle-orm"
import { db } from ".."
import { eventSchema, eventTagsTo } from "../schema"

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

// 获取某个事件的标签（单选，最多一个）
export async function getETags(eventId: number) {
    try {
        // 通过 eventId 查询 eventTagsTo 表，获取对应的 eventTagsId
        const tagLink = await db.query.eventTagsTo.findFirst({
            where: eq(eventTagsTo.eventId, eventId),
            with: {
                eventTagsId: {
                    columns: {
                        id: true,  // 获取标签的ID
                        tags: true  // 获取标签的名称
                    }
                }
            }
        });

        if (!tagLink) {
            return { success: [] }; // 没有标签时返回空数组
        }

        // 关键修复：获取 eventTagsId.id 而不是整个 eventTagsId 对象
        const tagId = String(tagLink.eventTagsId.id);
       
        return { success: [tagId] }; // 返回数组格式，如 ["2"]

    } catch (error) {
        console.error("Error fetching event tags:", error);
        return { error: "Failed to get event tags!" };
    }
}