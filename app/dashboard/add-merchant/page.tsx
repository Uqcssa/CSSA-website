import { auth } from "@/server/auth"
import { redirect } from "next/navigation"
import { useForm } from "react-hook-form"
import MerchantForm from "./merchant-form"

export default async function CreateMerchant() {
    const session = await auth()
    if(session?.user.role !== "admin" && session?.user.role !== "cssaStudent") return redirect("/dashboard/settings")

    return(
        <div>
            <MerchantForm/>
        </div>
    )
}