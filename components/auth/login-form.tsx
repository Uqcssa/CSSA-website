"use client"

import { AuthCard } from "./auth-card"
import {useForm} from "react-hook-form"
import { Form,FormControl,
        FormDescription,
        FormField,
        FormItem,
        FormLabel,
        FormMessage,} from "../ui/form"
import {zodResolver} from "@hookform/resolvers/zod"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
  } from "@/components/ui/input-otp"  
import { LoginSchema } from "@/types/login-schema"
import { Input } from "../ui/input"
import * as  z  from "zod"
import { Button } from "../ui/button"
import Link from "next/link"
import {useAction} from 'next-safe-action/hooks'
import { emailSignIn } from "@/server/actions/email-signin"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { FormError } from "./form-error"
import { FormSuccess } from "./form-success"

export const LoginForm = () =>{
    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
          email: "",
          password: "",
        },
      })

    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [showTwoFactor, setShowTwoFactor] = useState(false)
    // the email function for showing success message if user register successfully!
    // useAction hooks 会返回一个对象，这个对象里会包含 excute方法，status状态以及RESULT结果。
    const {execute, status} = useAction(emailSignIn,{
        onSuccess(data){
            if(data?.error) {
                setError(data.error)
            }
            if(data?.success) {
                setSuccess(data.success)
            }
            if(data?.twoFactor){
                setShowTwoFactor(true)
            }    
            console.log(data)
        }
    })

    // 使用onSumbit处理由用户输入的values，excute这些values,它将用户输入的表单值传递给 emailSignIn 方法，完成登录操作。
    const onSubmit = (values: z.infer<typeof LoginSchema>) =>{
        execute(values);
    }
    return(
        <AuthCard 
            cardTitle="Welcome Back!" 
            backButtonLabel= "Create a new account" 
            backButtonHref="/auth/register" 
            
            showSocials
        >
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div>
                            {/* 判断是否有twoFactor如果有则显示下列component */}
                            {showTwoFactor &&(
                               <FormField
                               control={form.control}
                               name="Code"
                               render={({field}) => (
                                   <FormItem>
                                       <FormLabel className="text-2xl">
                                            {" "}
                                            We've sent you a two factor code to your email.
                                        </FormLabel>
                                        {/* this is InputOTP form */}
                                       <FormControl>
                                        <InputOTP
                                                disabled={status === "executing"}
                                                {...field}
                                                maxLength={6}
                                            >
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                    <InputOTPSlot index={3} />
                                                    <InputOTPSlot index={4} />
                                                    <InputOTPSlot index={5} />
                                                </InputOTPGroup>
                                        </InputOTP>
                                       </FormControl>
                                       <FormDescription />
                                       <FormMessage className="text-red-600" />
                                   </FormItem>
                               )}
                               /> 
                            )}
                                {/* this will show the component withou twoFactorToken Enabled */}
                            {!showTwoFactor &&(
                                <>
                                    <FormField
                                    control={form.control}
                                    name="email"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="text-2xl">Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Email Address"
                                                    type="email"
                                                    autoComplete="email"
                                                />
                                            </FormControl>
                                            <FormDescription />
                                            <FormMessage className="text-red-600" />
                                        </FormItem>
                                    )}
                                    />
                                    <FormField
                                    control={form.control}
                                    name="password"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="text-2xl">Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Your Password"
                                                    type="password"
                                                    autoComplete="current-password"
                                                />
                                            </FormControl>
                                            <FormDescription />
                                            <FormMessage  className="text-red-600"/>
                                        </FormItem>
                                    )}
                                    />
                                </>
                            )}
                            <FormSuccess message={success}/>
                            <FormError message={error}/>
                            <Button className="text-purple-500 px-0" size={"sm"} variant={"link"} asChild>
                                <Link href={"/auth/resets"}>
                                    Forgot your password
                                </Link>
                            </Button>
                        </div>
                        <Button  
                            type="submit" 
                            variant={"outline"} 
                            className={cn('w-full my-2 text-white bg-purple-600', 
                            status === "executing" ? "animate-pulse" : "")}>
                            {showTwoFactor ? "Verify" : "Sign In"}
                        </Button>
                    </form>
                    
                </Form>
            </div>
        </AuthCard>
    )
} 