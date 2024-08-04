import { auth } from "@/server/auth"
import { UserButton } from "./user-button"

export default async function Nav(){
    const session = await auth()
    
    if(session)
    return(
        <header className=" bg-slate-500  py-12">
            <nav>
                <ul className="flex justify-between">
                    <li>
                        Logo
                    </li>
                    <li>
                        <UserButton  expires={session.expires} user={session.user}/>
                    </li>
                </ul>
            </nav>
        </header>
    )
}