'use server'
 
import { SettingsSchema } from "@/types/settings-schema";
import { createSafeActionClient } from "next-safe-action"
import { auth } from "../auth";
import { eq } from "drizzle-orm";
import {users} from "../schema"
import { db } from "..";
import { undefined } from "zod";
import bcrypt from 'bcrypt'
import { newPassword } from "./new-password";
import { revalidatePath } from "next/cache";

const action = createSafeActionClient();

export const settings = action(SettingsSchema, async(values)=>{
    const user = await auth();
    if(!user){
        return {error: "User not found"}
    }
    //dbUser 用来存储和获取通过auth()登录的用户登录信息
    const dbUser = await db.query.users.findFirst({
        where:eq(users.id, user.user.id),
    });

    if(!dbUser){
        return {error: "User not found"}
    }
    //check if the user signed in through the google or github
    //we dont need define the email, name , and other informations
   // Handle OAuth users
   //set the isTwoFactorEnabled as false cuz the isTwoFactorEnabled is boolean type
   if (user.user.isOAuth) {
    values.password = undefined;
    values.newPassword = undefined;
    values.confirmYourPassword = undefined;
    values.isTwoFactorEnabled = false;
    } else {
    // Handle password change only for non-OAuth users
    if (values.password && values.newPassword && dbUser.password && values.confirmYourPassword) {
        const passwordMatch = await bcrypt.compare(values.password, dbUser.password);
        if (!passwordMatch) {
            return { error: "Password is Incorrect" };
        }

        const samePassword = await bcrypt.compare(values.newPassword, dbUser.password);
        if (samePassword) {
            return { error: "New Password is the same as the old password" };
        }
        // check if the new password match congirm new password?
        const differentPassword = await bcrypt.compare(values.newPassword, values.confirmYourPassword);
        if (differentPassword) {
            return { error: "两次输入的密码不相符" };
        }

        // Hash the user's new password
        //这里已经修改过了，将confirmYourPassword作为加密的密码
        const hashedPassword = await bcrypt.hash(values.confirmYourPassword, 10);
        values.password = undefined;
        values.newPassword = undefined;
        values.confirmYourPassword = hashedPassword;
    }
}


// Update user information in the database
//这里要去掉更新email的代码。
const updateUser = await db.update(users).set({
    twoFactorEnabled: values.isTwoFactorEnabled,
    name: values.name,
    password: values.confirmYourPassword,
    image: values.image,
}).where(eq(users.id, dbUser.id));

// Refresh the dashboard page after updating user information
revalidatePath('/dashboard/settings');
return { success: "Settings Updated", isOAuth: user.user.isOAuth };
});