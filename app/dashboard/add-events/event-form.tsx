'use client'

import { EventSchema } from "@/types/event-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSearchParams ,useRouter} from "next/navigation"
import { FormProvider, useForm } from "react-hook-form"
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
import * as  z  from "zod"
import {useAction} from 'next-safe-action/hooks'
import { Select, 
    SelectContent, 
    SelectGroup, 
    SelectItem, 
    SelectLabel, 
    SelectTrigger, 
    SelectValue ,
} from "@/components/ui/select"
import { EventTypeMap } from "./selectOptions"
import { ChevronDownIcon, X } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { format } from "date-fns"
import Tiptap from "../add-merchant/tiptap"

import { useToast } from '@chakra-ui/react'
import { createEvent } from "@/server/actions/create-events"
import MerchantImages from "../add-merchant/Images"

export default function EventForm() {
    const searchParams = useSearchParams()
    const [date, setDate] = useState<Date | undefined>(undefined)
    const [time, setTime] = useState<string>("")
    const [open, setOpen] = useState(false)

    const router = useRouter();// redirect user to the merchants page after create merchant
    const toast = useToast() //toast style
    

    const form = useForm<z.infer<typeof EventSchema>>({
        resolver: zodResolver(EventSchema),
        defaultValues:{
            title:"",
            description:"",
            address:"",
            date:"",
            time:"",
            maxParticipants:1,
            price:0,
            organizer:"",
            contactInfo:"",
            status:"active",
            eventTags:[],
            images:[],
        },
        mode: "onChange",// the actual validation errors 
    })

    // handle select change
    const handleSelectChange = (value:string) =>{
        const  currentTags = form.getValues("eventTags") || []

        if(currentTags.includes(value)){
            return
        }
        form.setValue("eventTags",[value])
    }

    // handle remove tag
    const handleRemove = (value:string) =>{
        const currentTags = form.getValues("eventTags") || []
        const updateTags = currentTags.filter((tag: string) => tag !== value)
        form.setValue("eventTags", updateTags) // the tag is only one so is not a string array 
    }

   

    // handle time change
    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        const value = e.target.value
        setTime(value)
        form.setValue("time", value)
    }

    // handle date selection
    const handleDateSelect = (selectedDate: Date | undefined) => {
        setDate(selectedDate)
        setOpen(false)
        if (selectedDate) {
            form.setValue("date", format(selectedDate, "yyyy-MM-dd"))
        }
    }

    // handle event status
    const handleStatus = (value:string) =>{
        form.setValue("status", value as "active" | "expired")
    }

    const{execute, status} = useAction(createEvent,{
        onSuccess:(data) =>{
            if(data?.error){
                toast({
                    title:`${data.error}`,
                    status:"error",
                    duration:3000,
                    isClosable:true,
                })
            }
            if(data?.success){
                router.push("/dashboard/events")
                toast({
                    title:`${data.success.message1}`,
                    description:`${data.success.message2}`,
                    status:"success",
                    duration:9000,
                    isClosable:true,
                })
            }
        },
        onError:(error) =>{
            console.log("onError:", error);
            toast({
                title: 'Unexpected error',
                description: JSON.stringify(error),
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    })

    async function onSubmit(values: z.infer<typeof EventSchema>) {
        console.log("Form values:", values);
        
        // 确保日期和时间都有值
        if (!values.date || !values.time) {
            console.error("Date and time are required");
            return;
        }
        
        // 调用 createEvent action
        execute(values);
    }

    return(
        <Card className="mx-9">
            <CardHeader>
                <CardTitle>
                    <span>Create Event</span>
                </CardTitle>
                <CardDescription className="text-gray-500 py-1">
                    <span>Add a new event</span>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                    <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem className="py-2">
                            <FormLabel className="font-bold">Event's Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Event Name" {...field} />
                            </FormControl>
                            
                            <FormMessage className="text-red-600" />
                        </FormItem>
                    )}
                    />

                    {/* Event's address */}
                    <FormField
                    control={form.control}
                    name="address"
                    render={({field}) => (
                        <FormItem className="py-2">
                            <FormLabel className="font-bold">Location</FormLabel>
                            <FormControl>
                                <Input placeholder="Event Location" {...field} />
                            </FormControl>
                            <FormMessage className="text-red-600" />
                        </FormItem>
                            
                    )}
                    />

                    {/* Event's type */}
                    <FormField
                    control={form.control}
                    name="eventTags"
                    render={({field}) =>(
                        <FormItem className="py-2">
                            <FormLabel className="font-bold">
                                Event Type
                                <span className="text-gray-500 text-sm ml-3">(at most 1)</span>
                            </FormLabel>
                            <div className="flex items-center gap-3">
                                <Select onValueChange={handleSelectChange}>
                                    <SelectTrigger className="w-[230px]">
                                        <SelectValue placeholder="Select Event Type" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                        <SelectGroup>
                                            <SelectItem key="1" value='1'  className="cursor-pointer hover:bg-gray-100">文化</SelectItem>
                                            <SelectItem key="2" value='2'  className="cursor-pointer hover:bg-gray-100">节日</SelectItem>
                                            <SelectItem key="3" value='3'  className="cursor-pointer hover:bg-gray-100">学术</SelectItem>
                                            <SelectItem key="4" value='4'  className="cursor-pointer hover:bg-gray-100">娱乐</SelectItem>
                                            <SelectItem key="5" value='5'  className="cursor-pointer hover:bg-gray-100">体育</SelectItem>
                                            <SelectItem key="6" value='6'  className="cursor-pointer hover:bg-gray-100">社交</SelectItem>
                                            <SelectItem key="7" value='7'  className="cursor-pointer hover:bg-gray-100">商业</SelectItem>
                                            <SelectItem key="8" value='8'  className="cursor-pointer hover:bg-gray-100">技术</SelectItem>
                                            <SelectItem key="9" value='9'  className="cursor-pointer hover:bg-gray-100">艺术</SelectItem>
                                            <SelectItem key="10" value='10'  className="cursor-pointer hover:bg-gray-100">教育</SelectItem>       
                                        </SelectGroup>
                                    </SelectContent>
                                    <div className="flex flex-wrap gap-2 ">
                                        {(form.watch("eventTags") || []).map((item,index) => (
                                            <button
                                                key={index}
                                                type="button"  // 关键：防止触发表单提交
                                                className="flex items-center px-3 py-1 text-sm font-medium
                                                rounded-full shadow-md transition-all duration-300 ease-in-out
                                                bg-gradient-to-r from-blue-400 to-blue-600 text-white
                                              hover:from-blue-500 hover:to-blue-700
                                                hover:scale-110 hover:shadow-lg "
                                                onClick={() => handleRemove(item)}
                                                >
                                                    {EventTypeMap[item]}
                                                    <X className="ml-1 h-3 w-3" />
                                            </button>
                                        ))}
                                    </div>
                                </Select>
                            </div>
                        </FormItem>
                    )}
                    />
                    {/* shop's Images */}
                    <MerchantImages  id={undefined} />

                    {/* Event's organizer */}
                    <FormField
                    control={form.control}
                    name="organizer"
                    render={({ field }) => (
                        <FormItem className="py-2">
                            <FormLabel className="font-bold">Organizer</FormLabel>
                            <FormControl>
                                <Input placeholder="Organizer" {...field} />
                            </FormControl>
                            
                            <FormMessage className="text-red-600"/>
                        </FormItem>
                    )}
                    />
                  
                    {/* ticket price */}
                    <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem className="py-2">
                            <FormLabel className="font-bold">Ticket Price</FormLabel>
                            <FormControl>
                                <Input 
                                    type="number" 
                                    min="" 
                                    step="0.01" 
                                     
                                    {...field}
                                    onChange={(e) => {
                                        const value = parseFloat(e.target.value) || 0;
                                        field.onChange(value);
                                    }}
                                />
                            </FormControl>
                            
                            <FormMessage className="text-red-600"/>
                        </FormItem>
                    )}
                    />

                    {/* Event's max participants */}
                    <FormField
                    control={form.control}
                    name="maxParticipants"
                    render={({ field }) => (
                        <FormItem className="py-2">
                            <FormLabel className="font-bold">Max Participants</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    min="1"
                                    placeholder="1"
                                    {...field}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value) || 1;
                                        field.onChange(value);
                                    }}
                                />
                            </FormControl>
                            <FormMessage className="text-red-600"/>
                        </FormItem>
                    )}
                    />

                    {/* Event's date */}
                    <FormField
                    control ={form.control}
                    name="date"
                    render={({field}) =>(
                        <FormItem>
                            <FormLabel className="font-bold">
                                Date & Time
                            </FormLabel>
                            <FormControl>
                                <div className="flex gap-4">
                                    <div className="flex flex-col gap-3">
                                        <Label htmlFor="date-picker" className="px-1">
                                        Date
                                        </Label>
                                        <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                            variant="outline"
                                            id="date-picker"
                                            className="w-32 justify-between font-normal"
                                            >
                                            {date ? format(date, "dd/MM/yyyy") : "Select date"}
                                            <ChevronDownIcon />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                onSelect={handleDateSelect}
                                                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                                className="rounded-md border"
                                                captionLayout="dropdown"
                                                initialFocus
                                            />
                                        </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <Label htmlFor="time-picker" className="px-1">
                                            Time
                                        </Label>
                                        <Input
                                            id="time-picker"
                                            type="time"
                                            value={time}
                                            onChange={handleTimeChange}
                                            className="w-32"
                                        />
                                    </div>
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                    />

                    {/* Event's time */}
                    <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                        <FormItem className="py-2">
                            <FormLabel className="font-bold">Time</FormLabel>
                            <FormControl>
                                <Input
                                    type="time"
                                    {...field}
                                    value={time}
                                    onChange={handleTimeChange}
                                />
                            </FormControl>
                            <FormMessage className="text-red-600"/>
                        </FormItem>
                    )}
                    />



                    {/* Event's Description */}
                    <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem className="py-2">
                            <FormLabel className="font-bold">Description</FormLabel>
                            <FormControl>
                                <Tiptap val={field.value} />
                            </FormControl>
                            
                            <FormMessage className="text-red-600"/>
                        </FormItem>
                    )}
                    />
                    {/* Event contact information */}
                    <FormField
                    control={form.control}
                    name="contactInfo"
                    render={({ field }) => (
                        <FormItem className="py-2">
                            <FormLabel className="font-bold">Contact Information</FormLabel>
                            <FormControl>
                                <Input placeholder="weChat Group number" {...field} />
                            </FormControl>
                            
                            <FormMessage className="text-red-600"/>
                        </FormItem>
                    )}
                    />

                    {/* Event's Status */}
                    <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem className="py-2">
                            <FormLabel className="font-bold">Event Status</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger className="w-[200px]">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                        <SelectGroup>
                                            <SelectItem value="active" className="cursor-pointer hover:bg-gray-100">
                                                Active
                                            </SelectItem>
                                            <SelectItem value="expired" className="cursor-pointer hover:bg-gray-100">
                                                Expired
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
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
                        disabled={status === 'executing' || !form.formState.isValid || !form.formState.isDirty}
                        >
                           Submit
                    </button>
                    </form>
                </FormProvider>
            </CardContent>
        </Card>
    )
}
