import { auth } from "@/server/auth"
import { redirect } from "next/navigation"

export default async function CreateMerchant() {
    const session = await auth()
    if(session?.user.role !== "admin" && session?.user.role !== "cssaStudent") return redirect("/dashboard/settings")
    return(
        <div>
            <h1>Create a Merchant</h1>
        </div>
    )
}