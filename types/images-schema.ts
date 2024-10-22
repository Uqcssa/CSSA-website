import * as z from "zod"

export const Images = z.object({
    url:z.string().refine((url) => url.search("blob:") !== 0,{
        message:"Please wait for the image to upload",
    }),
    size:z.number().max(16*1024*1024),
    key:z.string().optional(),
    name:z.string(),
})