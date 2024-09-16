'use client'

import { MerchantSchema } from "@/types/merchant-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as  z  from "zod"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
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
// import {TimeInput} from "@nextui-org/date-input";
// import {Time} from "@internationalized/date";
import {useAction} from 'next-safe-action/hooks'
import Tiptap from "./tiptap"
import { createMerchant } from "@/server/actions/create-merchants"
import { error } from "console"
import { useRouter } from "next/navigation"
import { useToast } from '@chakra-ui/react'
import { date } from "drizzle-orm/pg-core"

export default function MerchantForm(){
    const form = useForm<z.infer<typeof MerchantSchema>>({
        resolver: zodResolver(MerchantSchema),
        defaultValues:{
            title:'',
            description: '',
            // image: '',
            discountInformation:"",
            address:"",
            // durationTime:
        },
        mode: "onChange",// the actual validation errors 
    })

    const router = useRouter();// redirect user to the merchants page after create merchant
    //toast style
    const toast = useToast()
    // using useAction bound the createMerchant server action
    const{execute, status} = useAction(createMerchant,{
        onSuccess:(data) =>{
            if (data?.error) {
                toast({
                    title: `${data?.error}`,
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                })
            }
            if(data?.success){
                router.push("/dashboard/merchants")
                toast({
                    title: `${data?.success.message1}`,
                    description: `${data?.success.message2}`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
                console.log(data)
            }
            
        },
        // onExecute:(data)=>{
        //     toast({
        //         title: `${data?.success.message3}`,
        //         description: "Please wait",
        //         status: 'loading',
        //         duration: 9000,
        //         isClosable: true,
        //     })
        // },
        onError:(error) =>{
            console.log(error)
        }
    })
    // function used for sumbitting  the information input from the user 
    async function onSubmit(values: z.infer<typeof MerchantSchema>){
        execute(values);
    }
    return(
    <Card className="mx-9">
        <CardHeader>
            <CardTitle>Create Merchant</CardTitle>
            <CardDescription className="text-gray-500 py-1">Sumbit your Merchant information</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                    <FormItem className="py-2">
                        <FormLabel>Shop's Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Shop Name" {...field} />
                        </FormControl>
                        
                        <FormMessage className="text-red-600" />
                    </FormItem>
                )}
                />
                {/* shop's address */}
                <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                    <FormItem className="py-2">
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                            <Input placeholder="Address" {...field} />
                        </FormControl>
                        
                        <FormMessage className="text-red-600" />
                    </FormItem>
                )}
                />
                {/* shop's Description */}
                <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem className="py-2">
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Tiptap  val={field.value}/>
                        </FormControl>
                        
                        <FormMessage className="text-red-600"/>
                    </FormItem>
                )}
                />
                {/* shop's image
                <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                    <FormItem className="py-2">
                        <FormLabel>Image</FormLabel>
                        <FormControl>
                            <Input placeholder="Address" {...field} />
                        </FormControl>
                        
                        <FormMessage />
                    </FormItem>
                )}
                /> */}
                {/* shop's discount */}
                <FormField
                control={form.control}
                name="discountInformation"
                render={({ field }) => (
                    <FormItem className="py-2">
                        <FormLabel>Discount Information</FormLabel>
                        <FormControl>
                            <Input placeholder="Discount Information" {...field} />
                        </FormControl>
                        
                        <FormMessage className="text-red-600"/>
                    </FormItem>
                )}
                />
                
                
                <button className="shadow-[0_4px_14px_0_rgb(0,118,255,39%)] 
                        hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] 
                        px-6 py-2 bg-[#0070f3] rounded-md text-white font-bold text-sm  transition 
                        duration-200 ease-linear"
                        type="submit"
                        disabled = {status === 'executing' || !form.formState.isValid|| !form.formState.isDirty}
                        >
                           Sumbit
                </button> 
            </form>
          </Form>
        </CardContent>
        <CardFooter>
            <p>Card Footer</p>
        </CardFooter>
    </Card>

    )
}