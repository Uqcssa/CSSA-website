
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import EditMerchantForm from "./edit-merchant-form";

export default async function EditMerchantPage() {
  const session = await auth()
  if(session?.user.role !=="admin" && session?.user.role !=="cssaStudent") return redirect("/dashboard/settings")
 
  return (
    <div>
      <EditMerchantForm />
    </div>
  );
} 