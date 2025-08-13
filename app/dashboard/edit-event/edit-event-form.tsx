'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { checkEImage, deleteEImage } from "@/server/actions/checkEImage"
import { getETags, getEvent } from "@/server/actions/get-event"
import { updateEvent } from "@/server/actions/update-event"
import { EventSchema } from "@/types/event-schema"
import { FormControl, FormLabel, useToast } from "@chakra-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { useRouter, useSearchParams } from "next/navigation"

import { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"

import * as z from "zod"
import { EventTypeMap } from "../add-events/selectOptions"
import { X, ChevronDownIcon } from "lucide-react"
import Image from "next/image"
import MerchantImages from "../add-merchant/Images"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar.jsx"
import { format } from "date-fns"
import Tiptap from "../add-merchant/tiptap"

export default function EditEventForm() {
    const searchParams = useSearchParams();
    const eventId = searchParams.get("id")
    const [existingImages, setExistingImages] = useState<any[]>([])
    const [date, setDate] = useState<Date | undefined>(undefined)
    const [time, setTime] = useState<string>("")
    const [open, setOpen] = useState(false)
    const toast = useToast()
    const router = useRouter()

    const form = useForm<z.infer<typeof EventSchema>>({
        resolver:zodResolver(EventSchema),
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
        mode: "onChange",
    })

    //fetch event data
    useEffect(() =>{
        async function fetchEvent(){
            if(eventId){
                const eventRes = await getEvent(Number(eventId))
                if(eventRes.success){
                    console.log("Event response:", eventRes.success)
                    form.setValue("id", eventRes.success.id);
                    form.setValue("title",eventRes.success.title)
                    form.setValue("description",eventRes.success.description)
                    form.setValue("address",eventRes.success.address)
                    // Set the date state and form value
                    const eventDate = new Date(eventRes.success.date)
                    setDate(eventDate)
                    form.setValue("date", eventDate.toISOString().split('T')[0])
                    // Set the time state and form value
                    setTime(eventRes.success.time)
                    form.setValue("time",eventRes.success.time)
                    form.setValue("maxParticipants", eventRes.success.maxParticipants || undefined)
                    form.setValue("price", eventRes.success.price || 0)
                    form.setValue("organizer",eventRes.success.organizer)
                    form.setValue("contactInfo",eventRes.success.contactInfo || undefined)
                    form.setValue("status",eventRes.success.status as "active" | "expired")
                }
            }
        }
        fetchEvent()
    },[eventId,form])

    // Add missing handlers
    const handleDateSelect = (selectedDate: Date | undefined) => {
        setDate(selectedDate)
        setOpen(false)
        if (selectedDate) {
            form.setValue("date", format(selectedDate, "yyyy-MM-dd"))
        }
    }

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setTime(value)
        form.setValue("time", value)
    }

    //fetch existing images
    useEffect(()=>{
        
            if(eventId){
                checkEImage(parseInt(eventId)).then(images =>{
                    if(images.success && images.success.length >0){
                        setExistingImages(images.success)
                        // Remove this line since "existingImages" is not in the form schema
                        // form.setValue("existingImages",images.success.map(img => ({
                        //     name:img.name,
                        //     imageUrl:img.imageUrl,
                        //     key:img.key,
                        // })))
                    }
                })
            }
    
    },[eventId])

    //delete existing images
    const handleDeleteImage = async (imagekey:string, index:number) => {
        try {
            const res = await deleteEImage(imagekey)
            if(res.success){
                toast({
                    title:"Image deleted",
                    description:"The image has been deleted successfully",
                    status:"success",
                    duration:3000,
                    isClosable:true,
                })
            }
            const updatedImages = existingImages.filter((_,i) => i !== index)
            setExistingImages(updatedImages)
            form.setValue("images",updatedImages.map(img => ({
                url:img.imageUrl,
                size:img.size,
                key:img.key,
                name:img.name,
            })))
        } catch (error) {
            
        }
    }
    // 拉取标签
    useEffect(() => {
        async function fetchTags() {
            if (eventId) {
                const tagsRes = await getETags(Number(eventId));
                if (tagsRes.success) {       
                    console.log('Fetched tags:', tagsRes.success);
                    form.setValue("eventTags", tagsRes.success);
                } else if (tagsRes.error) {
                    console.error('Error fetching tags:', tagsRes.error);
                    form.setValue("eventTags", []); // 出错时设置为空数组
                }
            }
        }
        fetchTags();
    }, [eventId, form]);

    // 单选标签处理 - 修复为真正的单选逻辑
    const handleSelectChange = (value: string) => {
        // 单选：直接替换整个数组，而不是添加
        form.setValue("eventTags", [value]);
    }

    const removeItems = (value: string) => {
        // 单选：清空所有标签
        form.setValue("eventTags", []);
    }

    const{execute,status} = useAction(updateEvent,{
        onSuccess:(data)=>{
            console.log(data)
            if(data?.error){
                toast({
                    title: `${data?.error}`,
                    status:'error',
                    duration: 3000,
                    isClosable: true,
                })
            }
            if(data?.success){
                router.push("/dashboard/events")
                toast({
                    title:"Event updated",
                    description:"The event has been updated successfully",
                    status:"success",
                    duration:3000,
                    isClosable:true,
                })
            }
        },
        onError:(error)=>{
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
    //submit form
    async function onSubmit(values:z.infer<typeof EventSchema>){
        console.log("beforeSubmit:", values)
        execute(values)
    }

    return(
        <Card className="mx-9">
            <CardHeader>
                <CardTitle>
                     <span>Edit Event</span>
                </CardTitle>
                <CardDescription className="text-gray-500 py-1">
                <span>Make changes to existing Event</span>
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
                    control ={form.control}
                    name="address"
                    render={({field}) =>(
                        <FormItem className="py-2">
                            <FormLabel className="font-bold">Address</FormLabel>
                            <FormControl>
                                <Input placeholder="Address" {...field} />
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
                                <Select 
                                    onValueChange={handleSelectChange}
                                >
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
                                </Select>
                                <div className="flex flex-wrap gap-2 ">
                                    {(form.watch("eventTags") || []).map((item,index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            className="flex items-center px-3 py-1 text-sm font-medium
                                            rounded-full shadow-md transition-all duration-300 ease-in-out
                                            bg-gradient-to-r from-blue-400 to-blue-600 text-white
                                          hover:from-blue-500 hover:to-blue-700
                                            hover:scale-110 hover:shadow-lg "
                                            onClick={() => removeItems(item)}
                                            >
                                               {EventTypeMap[item]}{/* 直接显示标签名称，不需要 EventTypeMap */}
                                                <X className="ml-1 h-3 w-3" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </FormItem>
                    )}
                    />

                    {/* 显示已存在的图片 */}
                    {existingImages.length > 0 && (
                        <div className="py-2">
                            <FormLabel className="font-bold">Existing Images</FormLabel>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
                                {existingImages.map((image, index) => (
                                    <Card key={image.key} className="overflow-hidden">
                                        <CardContent className="p-0">
                                            <div className="relative aspect-square">
                                                <Image
                                                    src={image.imageUrl}
                                                    alt={image.name}
                                                    layout="fill"
                                                    objectFit="cover"
                                                />
                                            </div>
                                        </CardContent>
                                        <CardFooter className="flex justify-between items-center p-2">
                                            <div className="flex-col items-center gap-6 overflow-hidden">
                                                <p className="font-sm">{image.name}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleDeleteImage(image.key, index);
                                                }}
                                                className="hover:bg-destructive hover:text-destructive-foreground"
                                                title="Remove image"
                                            >
                                                <X className="h-4 w-4" />
                                                <span className="sr-only">Remove {image.name}</span>
                                            </button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                     {/* shop's Images */}
                     <MerchantImages  id={undefined} />

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
                        disabled={status === 'executing' || !form.formState.isValid }
                        >
                           Submit
                    </button>
                    </form>
                </FormProvider>
            </CardContent>
        </Card>
    )
}