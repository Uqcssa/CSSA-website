
import * as z from "zod"

// //set the time format
// const TimeFormat = z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
//     message: "Time must be in HH:mm format",
// });

export const MerchantSchema = z.object({
    id: z.number().optional(),
    title:z.string().min(4,{
        message:"Name must be at least 4 characters long",
    }),
    // image: z.string(),
    description:z.string().min(30,{
        message:"Description must be at least 30 characters long",
    }),
    discountInformation:z.string().min(3,{
        message:"Discount information must be at least 4 characters long",
    }),
    address:z.string(),
    
})