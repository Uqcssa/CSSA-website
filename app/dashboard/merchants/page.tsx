import { auth } from "@/server/auth"
import { redirect } from "next/navigation"


export default async function merchants() {
  //check if user login then show the settings page
  const session = await auth()
  if (!session) redirect("/")
  if (session) return <div>Merchant</div>
  

}