'use client'

import { checkImageList } from "@/server/actions/check-imageUrlList"
import { MerchantSchema } from "@/types/merchant-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter,useSearchParams } from "next/navigation"
import { FormProvider, useForm } from "react-hook-form"
import * as  z  from "zod"
import { useEffect, useState } from "react"
import { getMerchant, getTags } from "@/server/actions/get-merchant"
import { useAction } from "next-safe-action/hooks"
import { updateMerchant } from "@/server/actions/update-merchant"
import { useToast } from '@chakra-ui/react'
import { Card,    CardFooter,CardContent,CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Select, 
    SelectContent, 
    SelectGroup, 
    SelectItem, 
    SelectLabel, 
    SelectTrigger, 
    SelectValue ,
} from "@/components/ui/select"
import { CupSoda, HandPlatter, UtensilsCrossed, X } from "lucide-react"
import MerchantImages from "../add-merchant/Images"
import Tiptap from "./tiptap"
import { MerchantTypeMap } from "../add-merchant/selectOptions"
import Image from "next/image"
import { deleteImage } from "@/server/actions/editImageMode"

//this is the edit merchant form
export default function EditMerchantForm(){
    const searchParams = useSearchParams()
    const merchantId = searchParams.get("id")
    const [existingImages, setExistingImages] = useState<any[]>([])
    const form = useForm<z.infer<typeof MerchantSchema>>({
        resolver: zodResolver(MerchantSchema),
        defaultValues: {
            title: '',
            description: '',
            discountInformation: '',
            address: '',
            merchant_type: [],
            images: [], // always start empty
        },
    })

    // request merchant information
    useEffect(() => {
        async function fetchMerchant() {
        if (merchantId) {
            const merchantRes = await getMerchant(Number(merchantId));
            if (merchantRes.success) {
            form.setValue("id", merchantRes.success.id);
            form.setValue("title", merchantRes.success.title);
            form.setValue("address", merchantRes.success.address);
            form.setValue("description", merchantRes.success.description);
            form.setValue("discountInformation", merchantRes.success.discountInformation);
            }
        }
        }
        fetchMerchant();
    }, [merchantId,form]);

    // 拉取标签
    useEffect(() => {
        async function fetchTags() {
        if (merchantId) {
            const tagsRes = await getTags(Number(merchantId));
            if (tagsRes.success) {       
            form.setValue("merchant_type", tagsRes.success as [string, ...string[]]);
            }
        }
        }
        fetchTags();
    }, [merchantId, form]);

    // 获取已存在的图片
    useEffect(() => {
        if (merchantId) {
            checkImageList(parseInt(merchantId)).then(images => {
                if (images && images.length > 0) {
                    setExistingImages(images);
                    // 同时设置到表单中
                    form.setValue("images", images.map(img => ({
                        name: img.name,
                        url: img.imageUrl,
                        size: 0,
                        key: img.key,
                    })));
                }
            });
        }
    }, [merchantId, form]);

    // 删除已存在的图片
    const handleRemoveExistingImage = async (imageKey: string, index: number) => {
        const res = await deleteImage(imageKey);
        if(res.success){
            toast({
                title: `${res?.success}`,
                status: 'success',
                duration: 3000,
                isClosable: true,
            })
            // 从状态中移除图片
            const updatedImages = existingImages.filter((_, i) => i !== index);
            setExistingImages(updatedImages);
            // 同时更新表单状态
            form.setValue("images", updatedImages.map(img => ({
                name: img.name,
                url: img.imageUrl,
                size: 0,
                key: img.key,
            })));
        }
    }

    //this is the function used to control select option or remove the option
    // const[selectedItems, setSelectedItems] = useState<string[]>([]); // 移除
    const handleSelectChange = (value: string) => {
        const current = form.getValues("merchant_type") || [];
        if (current.length >= 3) {
            // 这里可以加个提示，比如 toast 或 alert
            return;
        }
        if (!current.includes(value)) {
            const updated = [...current, value];
            form.setValue("merchant_type", updated as [string, ...string[]]);
        }
    };

    const removeItems = (value: string) => {
        const current = form.getValues("merchant_type") || [];
        const updated = current.filter((item) => item !== value);
        form.setValue("merchant_type", updated as [string, ...string[]]);
    };
    

    // 顶部定义不能在回调或普通函数里直接调用 useRouter()，应该在组件顶层调用一次，然后在回调里用。
    const toast = useToast();
    const router = useRouter();

    //update the merchant information
    const{execute, status} = useAction(updateMerchant,{
        onSuccess:(data)=>{
            console.log("onSuccess data:", data);
            if(data?.error){
                useToast({
                    title: `${data?.error}`,
                    status:'error',
                    duration: 3000,
                    isClosable: true,
                })
            }
            if(data?.success){
                router.push("/dashboard/merchants")
                toast({
                    title:`${data.success.message}`,
                    status:'success',
                    duration:6000,
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

    async function onSubmit(values: z.infer<typeof MerchantSchema>){
        console.log("Form Values before submit:", values);
        execute(values);
    }

    return(
        <Card className="mx-9">
            <CardHeader>
                <CardTitle>
                     <span>Edit Merchant</span>
                </CardTitle>
                <CardDescription className="text-gray-500 py-1">
                <span>Make changes to existing Merchant</span>
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
                            <FormLabel className="font-bold">Shop's Name</FormLabel>
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
                            <FormLabel className="font-bold">Address</FormLabel>
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
                            render={(field) => (
                            <FormItem className="py-2">
                                        <FormLabel className="font-bold">
                                            Merchant Type
                                            <span className="text-gray-500 text-sm ml-3">(multiple choices, at most 3)</span>
                                        </FormLabel>
                                        <div className="flex items-center gap-3">
                                            <Select onValueChange={handleSelectChange} >
                                                <SelectTrigger className="w-[230px]">
                                                    <SelectValue placeholder="Select a type"  />
                                                </SelectTrigger>
                                                <SelectContent  className="bg-white" >
                                                    <SelectGroup>   
                                                        <SelectLabel className="text-left text-lg font-bold flex items-center gap-1">
                                                            <UtensilsCrossed />
                                                                餐厅
                                                        </SelectLabel>
                                                        <SelectItem key="1" value='1'  className="cursor-pointer hover:bg-gray-100">清真餐厅</SelectItem>
                                                        <SelectItem key="2" value='2' className="cursor-pointer hover:bg-gray-100">中餐</SelectItem>
                                                        <SelectItem key="3" value="3" className="cursor-pointer hover:bg-gray-100">西餐</SelectItem>
                                                        <SelectItem key="8" value="4" className="cursor-pointer hover:bg-gray-100">烧烤</SelectItem>
                                                        <SelectItem key="9" value="5" className="cursor-pointer hover:bg-gray-100">火锅</SelectItem>
                                                        <SelectItem key="10" value="6" className="cursor-pointer hover:bg-gray-100">日料</SelectItem>
                                                        <SelectItem key="11" value="7" className="cursor-pointer hover:bg-gray-100">韩餐</SelectItem> 
                                                        <SelectLabel className="text-left text-lg font-bold flex items-center gap-1">
                                                            <CupSoda />
                                                                饮品
                                                        </SelectLabel>
                                                        <SelectItem key="4" value="8" className="cursor-pointer hover:bg-gray-100">甜品</SelectItem>
                                                        <SelectItem key="6" value="9" className="cursor-pointer hover:bg-gray-100">咖啡</SelectItem>
                                                        <SelectItem key="7" value="10" className="cursor-pointer hover:bg-gray-100">奶茶饮料</SelectItem>
                                                        <SelectLabel className="text-left text-lg font-bold flex items-center gap-1">
                                                            <HandPlatter/> 
                                                                其它
                                                        </SelectLabel>
                                                        <SelectItem key="12" value="11" className="cursor-pointer hover:bg-gray-100">留学教育</SelectItem>
                                                        <SelectItem key="13" value="12" className="cursor-pointer hover:bg-gray-100">生活服务</SelectItem>
                                                        <SelectItem key="14" value="13" className="cursor-pointer hover:bg-gray-100">休闲娱乐</SelectItem>
                                                        <SelectItem key="15" value="14" className="cursor-pointer hover:bg-gray-100">线上商家</SelectItem> 
                                                        
                                                    </SelectGroup>
                                                </SelectContent>
                                                <div className="flex flex-wrap gap-2 ">
                                                    {(form.watch("merchant_type") || []).map((item,index) => (
                                                        <button
                                                            key={index}
                                                            type="button"  // 关键：防止触发表单提交
                                                            className="flex items-center px-3 py-1 text-sm font-medium
                                                                    rounded-full shadow-md transition-all duration-300 ease-in-out
                                                                    bg-gradient-to-r from-blue-400 to-blue-600 text-white
                                                                    hover:from-blue-500 hover:to-blue-700
                                                                    hover:scale-110 hover:shadow-lg "
                                                            onClick={() => removeItems(item)}
                                                        >
                                                            {MerchantTypeMap[item]}
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
                                                    handleRemoveExistingImage(image.key, index);
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
                    <MerchantImages  id={merchantId ? parseInt(merchantId) : undefined} />

                    {/* shop's Description */}
                    <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem className="py-2">
                            <FormLabel className="font-bold">Description</FormLabel>
                            <FormControl>
                                <Tiptap  val={field.value}/>
                            </FormControl>
                            
                            <FormMessage className="text-red-600"/>
                        </FormItem>
                    )}
                    />
                    {/* shop's discount */}
                    <FormField
                    control={form.control}
                    name="discountInformation"
                    render={({ field }) => (
                        <FormItem className="py-2">
                            <FormLabel className="font-bold">Discount Information</FormLabel>
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
                            Update
                    </button> 
                </form>
                </FormProvider>
            </CardContent>
        </Card>
    )
}