'use server'

import { db } from ".."
import { eventSchema, eventTagsTo } from "../schema"
import { desc } from "drizzle-orm"

export async function getAllEvents() {
    try {
        const events = await db.query.eventSchema.findMany({
            orderBy: (eventSchema, { desc }) => [desc(eventSchema.id)],
            with: {
                eventTagsTo: { 
                    with: { 
                        eventTagsId: {
                            columns: { tags: true }
                        }
                    } 
                },
                eImages: true
            }
        })

        if (!events) {
            return { error: "No events found" }
        }

        return { success: events }
    } catch (error) {
        console.error("Error fetching events:", error)
        return { error: "Failed to fetch events" }
    }
} 