'use server'
import { LoginSchema } from '@/types/login-schema';
import {createSafeActionClient} from 'next-safe-action'
import {actionClient} from "@/lib/safe-action";
import { eq } from 'drizzle-orm';
import { db } from '..';
import {twoFactorTokens, users} from "../schema"
import { generateEmailVerificationToken, generateTwoFactorToken, getTwoFactorTokenByEmail } from './tokens';
import { sendTwoFactorTokenByEmail, sendVerificationEmail } from './email';
import { signIn } from '../auth';
import { AuthError } from 'next-auth';
import { error } from 'console';
import bcrypt from "bcrypt"


export const emailSignIn = actionClient(LoginSchema, async ({email, password, Code}) => {
    try {
        //检查用户是否在数据库里
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email)
        })
        // 如果不在或者用户email为null则报错
        if(existingUser?.email !== email){
            return {error:"Email not Found!"}
        }
        //如果用户没有被验证，我们需要在这重新发送一次验证码用来验证用户
        //在这里我使用了类型断言来使typescript检查通过后面的existingUser!.email参数。因为不加类型断言一直会报错，我在前面已经验证了existingUser不会为null
        if(!existingUser?.emailVerified){
            const verificationToken = await generateEmailVerificationToken(existingUser!.email);
            await sendVerificationEmail(verificationToken[0].email, verificationToken[0].token);
            return { success: 'Confirmation Email Sent!' };
        }  
        
        // Check if password exists and is valid
        if (!existingUser.password) {
            return { error: "Password not set for this user" };
        }
        //在检测是否开启双因素验证前提前验证密码是否正确，若正确则检测双因素
        const passwordValid = await bcrypt.compare(password, existingUser.password);
        if (!passwordValid) {
            return {error: "Email or Password Incorrect"};
        }

        //Two factor to do(双因素验证)
        if(existingUser.twoFactorEnabled && existingUser.email && passwordValid){
            if(Code){
                const twoFactorToken = await getTwoFactorTokenByEmail(
                    existingUser.email
                  )
                  if (!twoFactorToken) {
                    return { error: "Invalid Token" }
                  }
                  if (twoFactorToken.token !== Code) {
                    return { error: "Confirmation number is Incorrect" }
                  }
                  const hasExpired = new Date(twoFactorToken.expires) < new Date()
                  if (hasExpired) {
                    return { error: "Confirmation number has expired" }
                  }
                  await db
                    .delete(twoFactorTokens)
                    .where(eq(twoFactorTokens.id, twoFactorToken.id))
            }else{
                const token = await generateTwoFactorToken(existingUser.email)

                if (!token) {
                    return { error: "Token not generated!" }
                }

                await sendTwoFactorTokenByEmail(token[0].email, token[0].token)
                return { twoFactor: "Confirmation Number Sent!" }
            }

        }

        await signIn("credentials",{
            email,
            password,
            redirectTo:"/",
        })
    } catch (error) {
        console.log(error)
        if(error instanceof AuthError ){
            switch(error.type){
                case "CredentialsSignin":
                    return{error:"Email or Password Incorrect"}
                case "AccessDenied":
                    return{error: error.message}
                case "OAuthSignInError":
                    return{error: error.message}
                default:
                    return{error:"Something Went Wrong"}
            }
        }
        throw error
    }
     
})
// export const action = createSafeActionClient();

// export const emailSignIn = action (LoginSchema, async ({email,password,code}) => {
//     //check if the user is in the database
// })