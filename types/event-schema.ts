import * as z from "zod"
import { Images } from "./images-schema"

export const EventSchema = z.object({
    id:z.number().optional(),
    title:z.string().min(3,{
        message:"Title must be at least 3 characters long"
    }),
    description:z.string().min(15,{
        message:"Description must be at least 15 characters long"
    }),
    address:z.string().min(3,{
        message:"Address must be at least 3 characters long"
    }),
    date: z.string().min(1, {
        message: "Date is required",
    }),
    time: z.string().min(1, {
        message: "Time is required",
    }),
    maxParticipants: z.number().min(1, {
        message: "Maximum participants must be at least 1",
    }).optional(),
    price: z.number().min(0, {
        message: "Price cannot be negative",
    }).default(0),
    organizer: z.string().min(2, {
        message: "Organizer name must be at least 2 characters long",
    }),
    contactInfo: z.string().optional(),
    status: z.enum(["active", "expired"]).default("active"),
    eventTags: z.array(z.string()).max(1, {
        message: "You can only select one event type"
    }),
    images: z.array(Images).max(10, {
        message: "You can only upload up to 10 images."
    }).optional(),
})