import * as z from "zod"

export const SettingsSchema = z.object({
    // z.optinoal()是用来定义可选字段的,也就是说可以为undefined.
    name: z.optional(z.string()),
    image: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(8)),
    newPassword: z.optional(z.string().min(8)),
})
.refine((data) => {
    if(data.password && !data.newPassword){
        return false
    }
    return true
},{message: "New password is required", path:['newPassword']})
// 用来验证两次输入的密码是否相同