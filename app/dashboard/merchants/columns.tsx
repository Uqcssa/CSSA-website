"use client"

import { ColumnDef, Row } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Ghost, MoreHorizontal } from "lucide-react"
import { deleteMerchant } from "@/server/actions/delete-merchants"
import { useToast } from '@chakra-ui/react'
import { useAction } from "next-safe-action/hooks"
import { date } from "drizzle-orm/pg-core"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { useState } from "react"
import Link from "next/link"



type MerchantsColumn ={
    title:string,
    address:string,
    image:string,
    merchant_type:string[],
    id:number
}

async function deleteMerchantWrapper(id:number) {
    const toast = useToast()
    const res = await deleteMerchant({id})
    
    if(res.data?.error){
        toast({
            title: `${res.data?.error}`,
            status: 'error',
            duration: 3000,
            isClosable: true,
        })
    }
    
}

// this is the delete function used for receiving the  merchant id 
const ActionCell = ({row}: {row:Row<MerchantsColumn>}) =>{
    const toast = useToast()
    const {status,execute} =  useAction(deleteMerchant,{
        onExecute:() =>{
            
            toast({
                title: "Deleting",
                status: 'loading',
                duration: 1000,
                isClosable: true,
            })
        },
        onSuccess:(data) => {
           
            if(data.success){
                toast({
                    title: `${data?.success}`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
            }
            if(data?.error){
                toast({
                    title: `${data?.error}`,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
            }
        },
        
    })
    const merchant = row.original
    return(
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <button className=" px-3 bg-[#fff] text-[#696969] rounded-md font-light ">
                    <MoreHorizontal className="h-5 w-5"/>
                </button>
                   
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white h-full">
                    <DropdownMenuItem className="text-sm p-1">
                        {/* this is how to pass id to the server, backend*/}
                        <Link className="w-full cursor-pointer hover:bg-gray-100" href={`/dashboard/edit-merchant?id=${merchant.id}`}>
                            Edit Merchant
                        </Link>
                    </DropdownMenuItem>
                    {/* this is the delete confirmation */}
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <button className="text-sm  p-1 cursor-pointer hover:bg-gray-100">Delete Merchant</button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white">
                            <AlertDialogHeader>
                            <AlertDialogTitle>Do you want delete Merchant?</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-500">
                                This action cannot be undone. This will permanently delete your
                                Merchant and remove your data from our servers.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel
                                className="hover:bg-gray-400"
                            >
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction 
                            onClick={()=>{
                                execute({id: merchant.id})
                            }}
                            className="bg-red-500 text-white hover:bg-red-400 transition-all ease-linear"
                            >
                                Delete Merchant
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </DropdownMenuContent>
            </DropdownMenu>

    ) 
}
   
    


export const columns: ColumnDef<MerchantsColumn>[] = [
    {
        accessorKey: "id",
        header:"ID",
    },
    //shop's name
    {
        accessorKey: "title",
        header:"Shop Name",
    },
    {
        accessorKey: "address",
        header:"Address",
    },
    {
        accessorKey: "merchant_type",
        header:"Merchant Type",
         //change tags style
        cell:({row}) =>{
            const cellTags = row.getValue("merchant_type") as string[] || []
            return(
                <div className="flex flex-wrap gap-2 ">
                    {cellTags.map((item,index) => (
                    <button
                    key={index}
                    className="inline-block px-3 py-1 text-sm font-medium
                    rounded-full shadow-md transition-all duration-300 ease-in-out
                    bg-gradient-to-r from-blue-400 to-blue-600 text-white
                    hover:from-blue-500 hover:to-blue-700
                    hover:scale-110 hover:shadow-lg"
                     >
                            {item}
                         
                    </button>
                    ))}
                </div> 
            )
        }
        
    },
    {
        accessorKey: "image",
        header:"Image",
        cell:({row}) =>{
            const cellImage = row.getValue("image") as string
            const cellTitle = row.getValue("title") as string
            return(
                <div>
                    <Image 
                        src={cellImage}
                        alt={cellTitle}
                        width={50}
                        height={50}
                        className="rounded-md"
                    />
                </div>
            )
        }
    },
    // this is the edit menu
    {
        id: "actions",
        header:"Actions",
        cell:ActionCell,
    },
]
