
import * as z from "zod"
import { Images } from "./images-schema"

// //set the time format
// const TimeFormat = z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
//     message: "Time must be in HH:mm format",
// });

export const MerchantSchema = z.object({
    id: z.number().optional(),
    title:z.string().min(3,{
        message:"Name must be at least 3 characters long",
    }),
    // image: z.string(),
    description:z.string().min(25,{
        message:"Description must be at least 25 characters long",
    }),
    discountInformation:z.string().min(3,{
        message:"Discount information must be at least 4 characters long",
    }),
    address:z.string(),
    merchant_type: z.array(z.string()).nonempty({
        message: "At least one tag must be selected",
    }), // 允许选择多个标签
    images:z.array(Images).max(10,{
        message:"You can only upload up to 10 images."
    })
})