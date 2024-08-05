'use server'
import { LoginSchema } from '@/types/login-schema';
import {createSafeActionClient} from 'next-safe-action'
import {actionClient} from "@/lib/safe-action";
import { eq } from 'drizzle-orm';
import { db } from '..';
import {users} from "../schema"


export const emailSignIn = actionClient(LoginSchema, async ({email, password, code}) => {
    const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email)
    })
    console.log(email, password, code)
    return {email}
})
// export const action = createSafeActionClient();

// export const emailSignIn = action (LoginSchema, async ({email,password,code}) => {
//     //check if the user is in the database
// })