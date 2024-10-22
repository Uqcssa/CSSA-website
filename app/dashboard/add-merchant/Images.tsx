"use client"

import { UploadDropzone } from "@/app/api/uploadthing/upload"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { MerchantSchema } from "@/types/merchant-schema"
import { error } from "console"
import { useFieldArray, useFormContext } from "react-hook-form"
import * as z from "zod"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { X } from "lucide-react"
import { Reorder } from "framer-motion"
import { useState } from "react"

export default function MerchantImages() {
    const {getValues, control, setError} = useFormContext<z.infer<typeof MerchantSchema>>()
    const{fields,remove, append, update, move} = useFieldArray({
        control,
        name:'images'
    })
    //set state for drag to change the image order
    const [active, setActive] = useState(0)
    
    return(
        <div>
            <FormField
                control={control}
                name="images"
                render={({ field }) => (
                    <FormItem className="py-2">
                        <FormLabel className="font-bold">
                            Merchant Image
                            <span className="text-gray-500 text-sm ml-3">(upload Images, at most 10)</span>
                        </FormLabel>
                        <FormControl>
                           <UploadDropzone
                                endpoint="mImage"
                                config={{mode: "auto"}}
                                disabled={fields.length == 10}
                                className={`
                                    ut-container 
                                    cursor-pointer 
                                    ut-allowed-content: text-gray-500 
                                    ut-label:text-blue-600 
                                    ut-upload-icon:text-gray-500 
                                    hover:ut-upload-icon:text-blue-500 
                                    ut-button:bg-blue-500/75 
                                    ut-button:ut-readying:bg-blue-500 
                                    hover:bg-blue-100/75 
                                    transition-all 
                                    duration-500 
                                    ease-in-out 
                                    ${fields.length == 10 ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'hover:opacity-75'}`} 
                                onUploadError={(error) =>{
                                    setError("images",{
                                        type:"validate",
                                        message: error.message,
                                    })
                                    return
                                }}
                                onBeforeUploadBegin={(files) => {
                                    if(files.length == 10){
                                        setError("images", {
                                            type: "validate",
                                            message: "You can only upload up to 10 images.",
                                        });
                                        return [];
                                    }
                                    files.map((file) => 
                                        append({
                                            name:file.name,
                                            size:file.size,
                                            url:URL.createObjectURL(file),
                                        })
                                    )
                                    return files
                                }}
                                //after image upload then
                                onClientUploadComplete={(files) =>{
                                    const mImages = getValues('images')
                                    mImages.map((field,mindex) => {
                                        if(field.url.search("blob:") === 0){
                                            const image = files.find((im) => im.name === field.name)
                                            if(image){
                                                update(mindex,{
                                                    url:image.url,
                                                    name:image.name,
                                                    size:image.size,
                                                    key:image.key,
                                                })
                                            }
                                        }
                                    })
                                }}
                           />
                        </FormControl>
                        
                        <FormMessage className="text-red-600" >
                        </FormMessage>
                    </FormItem>
                )}
            />
            <div className="container mx-auto py-10">
                <div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                >
                    {fields.map((field, index) =>{
                        return(
                            <Card 
                                className={
                                    (cn(field.url.search('blob') === 0
                                        ? "animate-pluse transition-all" 
                                        : ""
                                    ),
                                    "overflow-hidden text-sm font-bold text-gray-500 hover:text-blue-500"
                                    )
                                }
                                key={field?.id}
                            >
                                <CardContent className="p-0">
                                <div className="relative aspect-square">
                                    <Image
                                    src={field.url}
                                    alt={field.name}
                                    layout="fill"
                                    objectFit="cover"
                                    />
                                </div>
                                </CardContent>
                                <CardFooter className="flex justify-between items-center p-2">
                                    <div className="flex-col items-center gap-6">
                                        <p className="font-sm">{field.name}</p> 
                                        <p className="font-sm mt-1">{(field.size/(1024*1024)).toFixed(2)}MB</p>
                                    </div>
                                    
                                    <button
                                        className="hover:bg-destructive hover:text-destructive-foreground"
                                    >
                                        <X className="h-4 w-4" />
                                        <span className="sr-only">Remove {field.name}</span>
                                    </button>
                                </CardFooter>
                            </Card>
                        )
                    })}
                  
                </div>
            </div>
        </div>
    )
}
{/* <Card key={field?.id} 
                                                className="overflow-hidden"
                                            >       
                                                    <CardContent className="p-0">
                                                    <div className="relative aspect-square">
                                                        <Image
                                                        src={field.url}
                                                        alt={field.name}
                                                        layout="fill"
                                                        objectFit="cover"
                                                        />
                                                    </div>
                                                    </CardContent>
                                                    <CardFooter className="flex justify-between items-center p-2">
                                                    <span className="font-medium">{field.name}</span>
                                                    <button
                                                        className="hover:bg-destructive hover:text-destructive-foreground"
                                                    >
                                                        <X className="h-4 w-4" />
                                                        <span className="sr-only">Remove {field.name}</span>
                                                    </button>
                                                    </CardFooter>
                                            </Card> */}