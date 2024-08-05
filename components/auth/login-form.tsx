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

export const LoginForm = () =>{
    const form = useForm({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email:"",
            password:"",
        },
    })

    const onSubmit = (values: z.infer<typeof LoginSchema>) =>{
        console.log(values)
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
                                    <FormMessage />
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
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                            <Button className="text-purple-500" size={"sm"} variant={"link"} asChild>
                                <Link href={"/auth/reset"}>
                                    Forgot your password
                                </Link>
                            </Button>
                        </div>
                        <Button  type="submit" variant={"outline"} className="w-full my-2 text-white bg-purple-600">
                            {"Login"}
                        </Button>
                    </form>
                    
                </Form>
            </div>
        </AuthCard>
    )
} 