import { Code } from "lucide-react"
import * as z from "zod"

export const LoginSchema = z.object({
    email: z.string().email({
        
        message: "Invalid Email Address",
    }),

    password: z.string().min(5,{
        message: "Password is required/and do not less than 5 characters",
    }),
    Code : z.optional(z.string()),
})