'use server'


import { createSafeActionClient } from "next-safe-action";
import {actionClient} from "@/lib/safe-action";
import { eq } from 'drizzle-orm';
import { db } from '..';
import {users} from "../schema"
import { RegisterSchema } from '@/types/register-schema';
import bcrpyt from "bcrypt";
import { generateEmailVerificationToken } from "./tokens";
import { sendVerificationEmail } from "./email";

const action = createSafeActionClient()
export const emailRegister = action(RegisterSchema, async ({email, password, name}) => {
    //hash the password
    const hashPassword = await bcrpyt.hash(password,10) 
    //check if the user exist in the database
    const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email)
    })
    //这个用来测试：如果这个用户存在但是email没有验证则重新发送verification code验证。
    if (existingUser) {
        if (!existingUser.emailVerified) {
          const verificationToken = await generateEmailVerificationToken(email)
          await sendVerificationEmail(
            verificationToken[0].email,
            verificationToken[0].token
          )
  
          return { success: "Email Confirmation resent" }
        }
        return { error: "Email already in use" }
    }
    //如果没有user在数据库里则插入数据库,重新制造token并且发送和验证：
    await db.insert(users).values({
        email,
        name,
        password:hashPassword,
    })
    const verificationToken = await generateEmailVerificationToken(email)
    await sendVerificationEmail(
        verificationToken[0].email,
        verificationToken[0].token)
    return {success:"Confirmation Email Sent"}
})