"use client"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { object, z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Session } from "next-auth"
import { SettingsSchema } from "@/types/settings-schema"
import Image from "next/image"
import { FormError } from "@/components/auth/form-error"
import { FormSuccess } from "@/components/auth/form-success"
import { useState } from "react"
import { Switch } from "@chakra-ui/react"
import { settings } from "@/server/actions/settings"
import { useAction } from "next-safe-action/hooks"

type SettingsForm = {
    session: Session
}

export default function SettingsCard(session: SettingsForm){
    //设置error和success的状态
    const [error, setError] = useState<string | undefined>()
    const [success, setSuccess] = useState<string | undefined>()
    const [isOAuth, setIsOAuth] = useState<boolean>(false); // 存储 OAuth 状态
    //设置判断avatar是否完成上传
    const [avatarUploading, setAvatarUploading] = useState(false)
    console.log(session.session.user)
    //创建useForm for controlling the form sumbit and update and delete
    const form = useForm<z.infer<typeof SettingsSchema>>({
        resolver: zodResolver(SettingsSchema),
        defaultValues:{
            password: isOAuth ? undefined : "",
            newPassword: isOAuth ? undefined : "",
            confirmYourPassword: isOAuth ? undefined : "",
            name: session.session.user?.name || undefined,
            email: session.session.user?.email || undefined,
            image: session.session.user?.image || undefined,
            // isTwoFactorEnabled: session.session.user?.isTwoFactorEnabled || undefined,
        },
    })

    const { execute, status } = useAction(settings, {
        onSuccess: (data) => {
          if (data?.success) setSuccess(data.success)
          if (data?.error) setError(data.error)
          setIsOAuth(data.isOAuth!); // 设置 OAuth 状态
        },
        onError: (error) => {
          console.log(error)
          setError("Something went wrong")
        },
    })

    //提交表单的攻能
    const onSubmit = (values: z.infer<typeof SettingsSchema>) =>{
        execute(values);
    }

    return(
        <Card className="mx-9 my-4">
            <CardHeader>
                <CardTitle>Your Settings</CardTitle>
                <CardDescription className="text-gray-500 py-1">Update your account settings</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input 
                                    placeholder="User Name" {...field} 
                                    disabled = {status === "executing"}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        {/* 设置image的提交form */}
                    
                        <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Avatar</FormLabel>
                            {/* check if user has sumbitted their own avatar  */}
                            <div className="flex items-center ">
                                {!form.getValues("image") &&(
                                    <div className="font-bold">
                                        {session.session.user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                {form.getValues("image") &&(
                                    <Image
                                        src = {form.getValues("image")!}
                                        width={42}
                                        height={42}
                                        className="rounded-full"
                                        alt="User Image"
                                    />
                                )}
                            </div>
                            <FormControl>
                                <Input 
                                    placeholder="User Image" {...field} 
                                    type="hidden"
                                    disabled = {status === "executing"}
                                    {...field}
                                />
                            </FormControl>
                            
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        {/* 设置password的form */}
                   
                        <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                                <Input 
                                    placeholder="******" {...field} 
                                    disabled = {status === "executing" || session?.session.user.isOAuth}
                                    {...field}
                                />
                            </FormControl>
                            
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        
                    {/* 设置newPassword的form */}
                        <FormField
                        control={form.control}
                        name ="newPassword"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                                <Input 
                                    placeholder="******" {...field} 
                                    disabled = {status === "executing" || session?.session.user.isOAuth}
                                    {...field}
                                />
                            </FormControl>
                            
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    {/* 设置confirmYourNewPassword的form */}
                        <FormField
                        control={form.control}
                        name ="confirmYourPassword"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Confirm Your New Password</FormLabel>
                            <FormControl>
                                <Input 
                                    placeholder="******" {...field} 
                                    disabled = {status === "executing" || session?.session.user.isOAuth}
                                    {...field}
                                />
                            </FormControl>
                            
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        {/* check if twoFactory enabled? */}
                        <FormField
                        control={form.control}
                        name ="isTwoFactorEnabled"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Two Factor Authentication</FormLabel>
                            <FormDescription className="text-gray-500">
                                Enable two factor authentication for your account
                            </FormDescription>
                            <FormControl>
                                <Switch
                                    size='lg'
                                    disabled={
                                        status === "executing" ||
                                        session.session.user.isOAuth === true
                                      }
                                      checked={field.value}
                                />
                            </FormControl>
                            
                            <FormMessage />
                            </FormItem>
                        )}
                        />

                        <FormError message={error} />
                        <FormSuccess message={success} /> 
                        <button className="shadow-[0_4px_14px_0_rgb(0,118,255,39%)] 
                        hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] 
                        px-6 py-2 bg-[#0070f3] rounded-md text-white text-sm font-light transition 
                        duration-200 ease-linear"
                        type="submit"
                        disabled = {status === 'executing' || avatarUploading}
                        >
                            Update your settings
                        </button> 
                        
                    </form>

                </Form>
            </CardContent>
            
        </Card>
             
    )
}
