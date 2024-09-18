"use client"

import { ColumnDef } from "@tanstack/react-table"

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
import { Button } from "@chakra-ui/react"
import { Ghost, MoreHorizontal } from "lucide-react"
  



type MerchantsColumn ={
    title:string,
    address:string,
    image:string,
    variants:any,
    id:number
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
        accessorKey: "variants",
        header:"Variants",
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
        cell:({row}) =>{
            const merchant = row.original
            return(
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <button className=" px-3 bg-[#fff] text-[#696969] rounded-md font-light ">
                    <MoreHorizontal className="h-5 w-5"/>
                </button>
                   
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>Edit Merchant</DropdownMenuItem>
                    <DropdownMenuItem className="bg-red-500 text-white" >Delete Merchant</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            )
        }
    },
]
