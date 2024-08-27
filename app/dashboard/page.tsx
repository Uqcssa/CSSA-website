import { redirect } from "next/navigation"

export default function DashBoard(){
    return(
        redirect("/dashboard/settings")
    )
}