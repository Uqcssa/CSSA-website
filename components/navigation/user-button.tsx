'use client'

import { Session } from "next-auth"
import {signOut} from "next-auth/react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import { Suspense } from "react"
import { LogOut, Moon, Settings, Sun, Truck } from "lucide-react"


export const UserButton =({user}: Session) => {
    return(
    <DropdownMenu modal={false}>
    <DropdownMenuTrigger>
        <Avatar>
                {user?.image &&(   
                        <Image
                            src= {user.image}
                            alt={user.name!}
                            // width={32}
                            // height={32}
                            // className='rounded-full'
                            fill = {true}
                        />       
                )}
                {!user?.image && (
                    <AvatarFallback className="bg-primary/25">
                        <div className="font-bold">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                    </AvatarFallback>
                )}
        </Avatar>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-64 p-6 rounded-lg bg-white " align="end">
        {/* 调整用户下拉菜单的排版,and rounded-full to shape the user avatar as circle */}
        <div className="mb-4 p-4 flex flex-col items-center gap-1 ">
            {user?.image &&(
                <Image src={user.image} alt={user.name!} width={36} height={36} className="rounded-full" />
            )}
            <p className="font-bold ">{user?.name}</p>
            <span className="text-xs font-medium text-secondary-foreground">
                {user?.email}
            </span>
        </div>
        {/* <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem> */}
        <DropdownMenuItem className="group focus:bg-slate-50 py-2 font-medium cursor-pointer transition-all duration-500">
            <Truck size={15} className=" mr-3 group-hover:translate-x-1 transition-all duration-300 ease-in-out"/>
            My Orders
        </DropdownMenuItem>
        <DropdownMenuItem className="group focus:bg-slate-50 py-2 font-medium cursor-pointer transition-all duration-500">
            <Settings size={15} className="mr-3 group-hover:rotate-180 transition-all duration-300 ease-in-out" />
            Settings
        </DropdownMenuItem>
        <DropdownMenuItem className="py-2 font-medium cursor-pointer transition-all duration-500">
            <div className="flex items-center">
                <Sun size={15}/>
                <Moon size={15}/>
                Theme
            </div> 
        </DropdownMenuItem>
        <DropdownMenuItem 
            onClick={() => signOut()}
            className="group focus:bg-red-100 py-2 font-medium cursor-pointer transition-all duration-500 group-hover:rounded-lg "
        >
            <LogOut size={15} className="mr-3 group-hover:scale-75  transition-all duration-300 ease-in-out" />Sign out

        </DropdownMenuItem>
    </DropdownMenuContent>
    </DropdownMenu>

    )
}