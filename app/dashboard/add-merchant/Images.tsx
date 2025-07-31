"use client"

import { UploadDropzone } from "@/app/api/uploadthing/upload"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { MerchantSchema } from "@/types/merchant-schema"
import { useFieldArray, useFormContext } from "react-hook-form"
import * as z from "zod"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { X } from "lucide-react"
import { deleteImage } from "@/server/actions/editImageMode"
import { useToast } from "@chakra-ui/react"

interface MerchantImagesProps {
    id?: number;
}
export default function MerchantImages({id} : MerchantImagesProps) {
    const {getValues, control, setError} = useFormContext<z.infer<typeof MerchantSchema>>()
    const{fields, remove, append, update} = useFieldArray({
        control,
        name:'images'
    })

    const toast = useToast()
    const [initialized, setInitialized] = useState(false)
    
    //this is remove image from the server function
    const handleRemove = async (index: number,imageKey: string) =>{
        const res = await deleteImage(imageKey);
        if(res.success){
            toast({
                title: `${res?.success}`,
                status: 'success',
                duration: 3000,
                isClosable: true,
            })
            remove(index);  // 删除图片成功后，再从 fields 中移除
            console.log('After remove:', fields);     
        }
        console.log(fields)
    }
    
    // Fetch existing images if id is provided - 只在初始化时执行一次
    useEffect(() => {
        if (id && !initialized) {
            // 在编辑模式下，只设置初始化状态，不加载已存在的图片
            setInitialized(true)
        } else if (!id) {
            // 如果没有 id（新建模式），直接标记为已初始化
            setInitialized(true)
        }
    }, [id, append, initialized])
    
    return(
        <div>
            <FormField
                control={control}
                name="images"
                //this part used to display the image that uploaded before
                render={({ field }) => (
                    <FormItem className="py-2">
                        <FormLabel className="font-bold">
                            Merchant Image
                            <span className="text-gray-500 text-sm ml-3 font-bold">
                                (Upload Images, <span className="text-red-600 font-bold">At most 10</span>)
                            </span>
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
                                            message: "You can only upload up to 9 images.",
                                        });
                                        return [];
                                    }
                                    files.forEach((file) => 
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
                                    mImages.forEach((field, mindex) => {
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
                                    return
                                }}
                           />
                        </FormControl>
                        
                        <FormMessage className="text-red-600" >
                        </FormMessage>
                    </FormItem>
                )}
            />
            
            {/* 只在创建新 merchant 时显示当前上传的图片 */}
            {!id && fields.length > 0 && (
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
                                    key={field.url}
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
                                        <div className="flex-col items-center gap-6 overflow-hidden">
                                            <p className="font-sm">{field.name}</p> 
                                         
                                            <p className="font-sm mt-1">{(field.size/(1024*1024)).toFixed(2)}MB</p>
                                        </div>
                                        
                                        <button
                                            className="hover:bg-destructive hover:text-destructive-foreground"
                                            onClick={(e) => {
                                                e.preventDefault()
                                            
                                                if (field?.key){
                                                    handleRemove(index, field.key);  // Only call if key is not undefined
                                                }
                                                
                                            }}
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
            )}
        </div>
    )
}