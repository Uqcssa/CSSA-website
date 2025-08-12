'use client'

import { checkEImage, deleteEImage } from "@/server/actions/checkEImage"
import { getEvent } from "@/server/actions/get-event"
import { updateEvent } from "@/server/actions/update-event"
import { EventSchema } from "@/types/event-schema"
import { useToast } from "@chakra-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { useRouter, useSearchParams } from "next/navigation"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import * as z from "zod"

export default function EditEventForm() {
    const searchParams = useSearchParams();
    const eventId = searchParams.get("id")
    const [existingImages, setExistingImages] = useState<any[]>([])
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
                    form.setValue("title",eventRes.success.title)
                    form.setValue("description",eventRes.success.description)
                    form.setValue("address",eventRes.success.address)
                    form.setValue("date", eventRes.success.date.toISOString().split('T')[0])
                    form.setValue("time",eventRes.success.time)
                    form.setValue("maxParticipants", eventRes.success.maxParticipants || undefined)
                    form.setValue("price", eventRes.success.price || 0)
                    form.setValue("organizer",eventRes.success.organizer)
                    form.setValue("contactInfo",eventRes.success.contactInfo || undefined)
                    form.setValue("status",eventRes.success.status as "active" | "expired")
                    form.setValue("eventTags", [eventRes.success.eventTagsTo[0].eventTagsId.tags])
                }
            }
            fetchEvent()
        }
    },[eventId,form])

    //fetch existing images
    useEffect(()=>{
        
            if(eventId){
                checkEImage(parseInt(eventId)).then(images =>{
                    if(images.success && images.success.length >0){
                        setExistingImages(images.success)
                        form.setValue("existingImages",images.success.map(img => ({
                            name:img.name,
                            imageUrl:img.imageUrl,
                            key:img.key,
                        })))
                    }
                })
            }
    
    },[eventId,form])

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

    const{execute,status} = useAction(updateEvent,{
        onSuccess:(data)=>{
            console.log(data)
            if(data?.error){
                useToast({
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
        execute(values)
    }
}