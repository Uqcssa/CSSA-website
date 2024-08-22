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
import { NewPasswordSchema } from "@/types/new-password-schema"
import { newPassword } from "@/server/actions/new-password"
import { ResetSchema } from "@/types/reset-schema"
import { reset } from "@/server/actions/password-reset"

export const ResetPasswordForm = () =>{
    const form = useForm<z.infer<typeof ResetSchema>>({
        resolver: zodResolver(ResetSchema),
        defaultValues: {
            email:"",
        },
    })

    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    // 这里的useAction hooks 绑定了reset 功能来自 server actions里的
    // useAction hooks 会返回一个对象，这个对象里会包含 excute方法，status状态以及RESULT结果。
    const {execute, status} = useAction(reset,{
        onSuccess(data){
            if(data?.error) setError(data.error)
            if (data?.success) {
                setSuccess(data.success)
            }
        },
    })

    // 使用onSumbit处理由用户输入的values，excute这些values,它将用户输入的表单值传递给 newpassword-form 方法，完成重设密码操作。
    const onSubmit = (values: z.infer<typeof ResetSchema>) =>{
        execute(values);
    }
    return(
        <AuthCard 
            cardTitle="Forgot your Password?" 
            backButtonLabel= "Back to Login" 
            backButtonHref="/auth/login" 
            
            showSocials
        >
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div>
                            <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className="text-xl">Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder=""
                                            type="email"
                                            disabled={status === "executing"}
                                            autoComplete="your email"
                                        />
                                    </FormControl>
                                    <FormDescription />
                                    <FormMessage  className="text-red-600"/>
                                </FormItem>
                            )}
                            />
                            <FormSuccess message={success}/>
                            <FormError message={error}/>
                            <Button className="text-purple-500" size={"sm"} variant={"link"} asChild>
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
                            {"Reset Password"}
                        </Button>
                    </form>
                    
                </Form>
            </div>
        </AuthCard>
    )
}