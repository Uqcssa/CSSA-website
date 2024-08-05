'use server'


import { createSafeActionClient } from "next-safe-action";
import {actionClient} from "@/lib/safe-action";
import { eq } from 'drizzle-orm';
import { db } from '..';
import {users} from "../schema"
import { RegisterSchema } from '@/types/register-schema';
import bcrpyt from "bcrypt";

const action = createSafeActionClient()
export const emailRegister = action(RegisterSchema, async ({email, password, name}) => {
    const hashPassword = await bcrpyt.hash(password,10) 
    console.log(hashPassword)
    const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email)
    })
    if(existingUser){
        // if(!existingUser.emailVerified){
        //     const vertificationToken =
        // }
        return {error:"Email already in use"}
    }
    console.log(email, password, name)
    return {success:"yayyy"}
})