import { db } from "@/server"
import { auth } from "@/server/auth"
import { merchantSchema } from "@/server/schema"
import { redirect } from "next/navigation"
import placeholder from "@/public/placeholder_small.jpg"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { eq } from "drizzle-orm"

export default async function merchants() {
  //check if user has login then show the settings page
  const session = await auth()
  if(!session){
    return {error: "User not found"}
  }
  
  if(session?.user.role === "user"){
    return { error: "You don't have permission to access this page!" };
  }

    // Admin 可以看到所有 merchants
   const  merchants = session?.user.role === "admin"
    ? await db.query.merchantSchema.findMany({
      orderBy: (merchantSchema, { desc }) => [desc(merchantSchema.id)],
      with: {
        merchantTags: {
          with: {
            tags: true
          }
        }
      }
    })

    : await db.query.merchantSchema.findMany({
    where: eq(merchantSchema.userId, session?.user.id),
    orderBy:(merchantSchema,{desc}) => [desc(merchantSchema.id)],
    with:{
      merchantTags:{
        with:{
          tags:true
        }
      }
    }
  })

  if(!merchants) throw new Error("Merchant Not Found!")
  const dataTable = merchants.map((merchant) =>{
    const tags = merchant.merchantTags.map((tagRelation) => tagRelation.tags.tags) 
              // 确保过滤掉 `null` 和非字符串的值
    return{
        id: merchant.id,
        title: merchant.title,
        address: merchant.address,
        description: merchant.description,
        discountInformation: merchant.discountInformation,
        merchant_type:tags,//tags is an array so dont use [] to include it
        image: placeholder.src,
    }

  })
  //check if the dataCrad pass down from the client side
  if (!dataTable) throw new Error("No data found")
  return(
    <div>
        <DataTable columns={columns} data={dataTable}/>
    </div>
  )
  if (!session) redirect("/")
  if (session) return <div>Merchant</div>
  

}