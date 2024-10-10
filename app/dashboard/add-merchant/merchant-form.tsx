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
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from '@chakra-ui/react'
import { date } from "drizzle-orm/pg-core"
import { getMerchant } from "@/server/actions/get-merchant"
import React, { useEffect, useState } from "react"
import { Select, 
         SelectContent, 
         SelectGroup, 
         SelectItem, 
         SelectLabel, 
         SelectTrigger, 
         SelectValue ,
    } from "@/components/ui/select"
import { CupSoda, HandPlatter, UtensilsCrossed, X } from "lucide-react"

import { IoRestaurantSharp } from "react-icons/io5";


export default function MerchantForm(){
    //this is the function used to control the select function
    const [selectedItems, setSelectedItems] = React.useState<string[]>([]);

    const handleSelect = (value: string) => {
        if (!selectedItems.includes(value)) {
            setSelectedItems([...selectedItems, value])
        }
    }

    const handleRemove = (value: string) => {
        setSelectedItems(selectedItems.filter(item => item !== value))
    }
    //check the input is valid?
    const form = useForm<z.infer<typeof MerchantSchema>>({
        resolver: zodResolver(MerchantSchema),
        defaultValues:{
            title:'',
            description: '',
            // image: '',
            discountInformation:"",
            address:"",
            // durationTime:
            merchant_type:[],
        },
        mode: "onChange",// the actual validation errors 
    })


    const router = useRouter();// redirect user to the merchants page after create merchant
    const toast = useToast() //toast style
    //create the unique function to check the product exist or not
    const searchParams = useSearchParams()
    const editMode = searchParams.get("id")
    const checkMerchant = async (id: number) => {
        if(editMode){
            const data = await getMerchant(id)
            if(data.error){
                toast({
                    title: `${data?.error}`,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
                router.push('/dashboard/merchants')
                return
            }
            if(data.success){
                const id = parseInt(editMode);
                form.setValue("title",data.success.title)
                form.setValue("address",data.success.address)
                form.setValue("description",data.success.description)
                form.setValue("discountInformation",data.success.discountInformation)
                form.setValue("id",data.success.id)
            }
        }
    }

    //useEffect
    useEffect(() =>{
        if(editMode){
            checkMerchant(parseInt(editMode))
        }
    },[])
    // using useAction bound the createMerchant server action
    const{execute, status} = useAction(createMerchant,{
        onSuccess:(data) =>{
            if (data?.error) {
                toast({
                    title: `${data?.error}`,
                    status: 'error',
                    duration: 3000,
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
            <CardTitle>
                {editMode ? <span>Edit Merchant</span>: <span>Create Merchant</span>}
            </CardTitle>
            <CardDescription className="text-gray-500 py-1">
                {editMode ? <span>Make changes to existing Merchant</span>
                : 
                <span>Sumbit your Merchant information</span>}
            </CardDescription>
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

                {/* shop's type*/}
                <FormField
                        control={form.control}
                        name="merchant_type"
                        render={() => (
                        <FormItem className="py-2">
                                    <FormLabel>
                                        Merchant Type
                                        <span className="text-gray-500 text-sm ml-3">(multiple choices, at most 3)</span>
                                    </FormLabel>
                                    <div className="flex items-center gap-3">
                                        <Select onValueChange={handleSelect} >
                                            <SelectTrigger className="w-[230px]">
                                                <SelectValue placeholder="Select a type" />
                                            </SelectTrigger>
                                            <SelectContent position="popper" side="bottom" align="start" className="bg-white" >
                                                <SelectGroup>   
                                                    <SelectLabel className="text-left text-lg font-bold flex items-center gap-1">
                                                        <UtensilsCrossed />
                                                            餐厅
                                                    </SelectLabel>
                                                    <SelectItem key="1" value="清真餐厅 " className="cursor-pointer hover:bg-gray-100">清真餐厅</SelectItem>
                                                    <SelectItem key="2" value="中餐 " className="cursor-pointer hover:bg-gray-100">中餐</SelectItem>
                                                    <SelectItem key="3" value="西餐 " className="cursor-pointer hover:bg-gray-100">西餐</SelectItem>
                                                    <SelectItem key="8" value="烧烤 " className="cursor-pointer hover:bg-gray-100">烧烤</SelectItem>
                                                    <SelectItem key="9" value="火锅 " className="cursor-pointer hover:bg-gray-100">火锅</SelectItem>
                                                    <SelectItem key="10" value="日料 " className="cursor-pointer hover:bg-gray-100">日料</SelectItem>
                                                    <SelectItem key="11" value="韩餐 " className="cursor-pointer hover:bg-gray-100">韩餐</SelectItem> 
                                                    <SelectLabel className="text-left text-lg font-bold flex items-center gap-1">
                                                        <CupSoda />
                                                            饮品
                                                    </SelectLabel>
                                                    <SelectItem key="4" value="甜品 " className="cursor-pointer hover:bg-gray-100">甜品</SelectItem>
                                                    <SelectItem key="6" value="咖啡 " className="cursor-pointer hover:bg-gray-100">咖啡</SelectItem>
                                                    <SelectItem key="7" value="饮品" className="cursor-pointer hover:bg-gray-100">饮品</SelectItem>
                                                    <SelectLabel className="text-left text-lg font-bold flex items-center gap-1">
                                                        <HandPlatter/> 
                                                            其它
                                                    </SelectLabel>
                                                    <SelectItem key="12" value="留学教育 " className="cursor-pointer hover:bg-gray-100">留学教育</SelectItem>
                                                    <SelectItem key="13" value="生活服务 " className="cursor-pointer hover:bg-gray-100">生活服务</SelectItem>
                                                    <SelectItem key="14" value="休闲娱乐 " className="cursor-pointer hover:bg-gray-100">休闲娱乐</SelectItem>
                                                    <SelectItem key="15" value="线上商家 " className="cursor-pointer hover:bg-gray-100">线上商家</SelectItem> 
                                                    
                                                </SelectGroup>
                                            </SelectContent>
                                            <div className="flex flex-wrap gap-2 ">
                                                {selectedItems.map((item,index) => (
                                                    <button
                                                        key={index}
                                                        className="rounded-full text-ml px-2 py-1 font-bold
                                                                    flex items-center bg-[#0070f3] text-white"
                                                        onClick={() => handleRemove(item)}
                                                    >
                                                        {item}
                                                        <X className="ml-1 h-3 w-3" />
                                                    </button>
                                                ))}
                                            </div>
                                        </Select>
                                    </div>
                                        
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
            
        </CardFooter>
    </Card>

    )
}