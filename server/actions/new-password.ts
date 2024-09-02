'use server'
import { NewPasswordSchema } from "@/types/new-password-schema"
import { createSafeActionClient } from "next-safe-action"
import { getPasswordResetTokenByToken } from "./tokens"
import { eq } from "drizzle-orm"
import { users, passwordResetTokens } from "../schema"
import { db } from ".."
import bcrypt from "bcrypt"
import { Pool } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-serverless"

const action = createSafeActionClient()

export const newPassword = action(
    NewPasswordSchema,
    async ({password,confirmPassword, token}) =>{
        
        const pool = new Pool({ connectionString: process.env.POSTGRES_URL })
        const dbPool = drizzle(pool)
        //To check the Token 
        if(!token){
            return{error:"Missing Token"}
        }
        //检查token是否是valid
        //如果token是vaild的我们则更新密码

        const existingToken = await getPasswordResetTokenByToken(token)

        //一定要写这个if检查不然如果existingToken为null就没有办法通过typescript的检查

        if (!existingToken) {
        return { error: "Token not found" }
        }
        //这里的expires也一样，TypeScript 检测到 existingToken 的类型不明确，
        //导致无法确定 expires 属性是否存在。所以要修改getPasswordResetTokenByToken方法

        const hasExpired = new Date(existingToken.expires) < new Date()
        if (hasExpired) {
            return { error: "Token has expired" }
        }

        const existingUser = await db.query.users.findFirst({
            where:eq(users.email, existingToken.email)
        })

        if(!existingUser){
            return{error:"User not found"}
        }

        if(!password === confirmPassword){
            return{error:"Password doesn't match"}
        }
        //很关键这里传入的是confirmPassword, 使用bcrypt来加密confirmPassword而不是password
        const hashedPassword = await bcrypt.hash(confirmPassword, 10);
        //这里使用数据库事务，tx为事务对象，通过它可以执行各种数据库操作（例如更新、删除）
        //而不用担心这些操作会立即生效，因为事务还没有提交。
        //用于防止密码更新后，删除旧的密码后重置Token失败
        //使用事务后，如果任何一步操作失败，整个操作都会被回滚，保持数据的一致性。
        await dbPool.transaction(async (tx) => {
            await tx
              .update(users)
              .set({
                password: hashedPassword,
              })
              .where(eq(users.id, existingUser.id))
            await tx
              .delete(passwordResetTokens)
              .where(eq(passwordResetTokens.id, existingToken.id))
        })
        return { success: "Password updated" }
    }
)