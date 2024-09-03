'use server'

import { eq } from "drizzle-orm";
import { db } from "..";
import { emailTokens, passwordResetTokens, users } from "../schema";
import { date } from "drizzle-orm/pg-core";

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.query.emailTokens.findFirst({
      where: eq(emailTokens.token, email),
    })
    return verificationToken
  } catch (error) {
    return null
  }
}

//一般先会运行下列代码，来产生一个新的token以及在这个function里来执行另一个函数用来查看email是否已经验证过了
export const generateEmailVerificationToken = async (email: string) => {
  const token = crypto.randomUUID()
  const expires = new Date(new Date().getTime() + 3600 * 1000)

  const existingToken = await getVerificationTokenByEmail(email)

  //如果已经存在Token则删除这个token
  if (existingToken) {
    await db.delete(emailTokens).where(eq(emailTokens.id, existingToken.id))
  }
  //这里的emailToken是在schema里的对象，这个对象包含下列三个属性值
  const verificationToken = await db
    .insert(emailTokens)
    .values({
      email,
      token,
      expires,
    })
    .returning()
  return verificationToken
}

export const newVerification = async (token: string) =>{
  const existingToken = await getVerificationTokenByEmail(token)
  if(!existingToken) return {error: "Token not Found" }
  const hasExpired = new Date(existingToken.expires) < new Date()

  if(hasExpired) return {error:"Email has already verified!"}

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, existingToken.email)
  })
  if(!existingUser) return {error:"Email does not exist"}
  await db.update(users).set({
    emailVerified: new Date(),
    email: existingToken.email,
  })
  await db.delete(emailTokens).where(eq(emailTokens.id, existingToken.id))
  return {success:"Email verified successfully!"}
}

//这个是用来验证是不是你本人发出的token,以及是否是数据库自己产生的token而不是黑客产生的token
export const getPasswordResetTokenByToken = async (token: string) =>{
  try {
    const passwordResetToken = await db.query.passwordResetTokens.findFirst({
      where: eq(passwordResetTokens.token, token)
    })
    return passwordResetToken
  } catch {
    //这里一定要返回null,避免它返回没有 expires 属性的对象。
    return null
  }
}

//这个函数用来检查在passwordRestToken数据表里是否存在对应的token根据email来查找
export const getPasswordResetTokenByEmail = async (email: string) =>{
  try {
    const resetToken = await db.query.passwordResetTokens.findFirst({
      where: eq(passwordResetTokens.email, email)
    })
    return resetToken
  } catch (error) {
    return null
  }
}

//修改密码时生成新的resettoken并发送
export const generatePasswordResetToken = async(email: string) =>{
  try {
    const token = crypto.randomUUID()
    //按小时过期
    const expires = new Date(new Date().getTime() + 3600 * 1000)

    const existingToken = await getPasswordResetTokenByEmail(email)

    //如果已经存在Token则删除这个token
    if(existingToken){
      await db.delete(passwordResetTokens).where(eq(passwordResetTokens.id, existingToken.id))
    }
    
    const passwordResetToken = await db
    .insert(passwordResetTokens)
    .values({
      email,
      token,
      expires,
    })
    .returning()//很重要
    return passwordResetToken //这里还要多返回一个tokens
  } catch (error) {
    return  null
  }
}
