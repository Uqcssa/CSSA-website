import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import EditEventForm from "./edit-event-form";

export default async function EditEvent() {
    const session = await auth()
    if(!session){
        return {error: "User not found"}
    }
    if(session.user.role !== "admin"){
        return redirect("/dashboard/events")
    }
    return(
        <div>
            <EditEventForm />
        </div>
    )

}