'use server'
import getBaseURL from "@/lib/base-url"
import {Resend} from 'resend'

const resend  = new Resend(process.env.RESEND_API_KEY);
const domain = getBaseURL();

export const sendVerificationEmail = async(email:string, token: string) =>{
    const confirmLink = `${domain}/auth/new-verification?token=${token}`
    const { data, error } = await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: ['uqcssakundaxuelian@gmail.com'],
        subject: "UQCSSA - Confirmation Email Test",
        html: `<p>Click to <a href='${confirmLink}'>confirm your email</a></p>`,
      })
    if (error) return console.log(error)
    if (data) return data
}

//create function to send  confirmation link to email for reseting password
export const sendPasswordResetEmail = async(email:string, token: string) =>{
  const confirmLink = `${domain}/auth/new-password?token=${token}`
  const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: ['uqcssakundaxuelian@gmail.com'],
      subject: "UQCSSA - Confirmation Reset password",
      html: `<p>Click here <a href='${confirmLink}'>reset your password</a></p>`,
    })
  if (error) return console.log(error)
  if (data) return data
}