import * as z from "zod"

export const SettingsSchema = z.object({
    // z.optinoal()是用来定义可选字段的,也就是说可以为undefined.
    name: z.optional(z.string()),
    image: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(8)),
    newPassword: z.optional(z.string().min(8)),
    confirmYourPassword: z.optional(z.string().min(8)),
})
.refine((data) => {
    // Ensure that if the user is changing their password, both newPassword and confirmYourPassword are provided
    if (data.password && !data.newPassword) {
        return false;
    }

    // Ensure newPassword and confirmYourPassword match
    if (data.newPassword && data.confirmYourPassword) {
        return data.newPassword === data.confirmYourPassword;
    }

    return true; // If there's no new password or confirm password, or if there's no attempt to change password, validation passes.
}, {
    message: "Passwords do not match or new password is required",
    path: ['confirmYourPassword']
});
// 用来验证两次输入的密码是否相同