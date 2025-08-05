import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import EventForm from "./event-form";

export default async function CreateEvent(){
    const session = await auth()
    if(session?.user.role !== "admin" ) return redirect("/dashboard/settings")

    return(
        <div>
           <EventForm/> 
        </div>
        
    )
}