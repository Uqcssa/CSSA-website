import { auth } from "@/server/auth"
import { UserButton } from "./user-button"

import Link from "next/link"
import {LogIn} from "lucide-react"
import Image from "next/image"





export default async function Nav(){
    //来自sever auth ,通过session 来访问auth以及user的头像和信息
    const session = await auth()
    
    
    return(
        <header className=" bg-gradient-to-t  py-9">
            <nav>
                <ul className="flex justify-between items-center mx-3 px-2">
                    <li className="text-white text-3xl">
                        <Link href={"/"} aria-label="Uqcssa Logo">
                            <Image
                                src= "/assets/uqcssa_logo/cssaLogo.jpg"
                                width={420}
                                height={766}
                                alt=''
                                className=''
                            />
                        </Link>
                    </li>
                    {!session ? (
                        <li>
                            
                            <button className="p-[3px] relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                                <div className="px-3 py-2  bg-slate-300 rounded-[6px]  relative group transition duration-200 text-black hover:bg-transparent">
                                    <Link className="flex gap-2" href={"/auth/login"}>
                                        <LogIn className="my-1" size={16} />
                                        <span>Login</span>
                                    </Link>
                                </div>
                            </button>
                            

                        </li>
                    ) : (<li>
                            <UserButton  expires ={session?.expires} user={session?.user}/>
                        </li>
                    )}
                    
                </ul>
            </nav>
        </header>
    )
}