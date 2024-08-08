import { auth } from "@/server/auth"
import { UserButton } from "./user-button"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {LogIn} from "lucide-react"





export default async function Nav(){
    const session = await auth()
    
    
    return(
        <header className=" bg-gradient-to-t  py-8">
            <nav>
                <ul className="flex justify-between items-center mx-3 px-2">
                    <li className="text-white text-3xl">
                        <Link href={"/"}>
                            UQCSSA
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