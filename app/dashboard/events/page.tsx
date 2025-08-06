import { db } from "@/server"
import { auth } from "@/server/auth"

import { redirect } from "next/navigation"
import placeholder from "@/public/placeholder_small.jpg"
import { DataTable } from "../merchants/data-table"
import { columns } from "./columns"
import { eventSchema } from "@/server/schema"

export default async function events() {
  //check if user has login then show the settings page
  const session = await auth()
  if(!session){
    return {error: "User not found"}
  }
  if(session.user.role !== "admin"){
    return { error: "You don't have permission to access this page!" };
  }
  
  const events = await db.query.eventSchema.findMany({
    orderBy:(eventSchema,{desc}) => [desc(eventSchema.id)],
    with:{
        eventTagsTo: {
            with: {
              eventTagsId: {
                columns: {
                  tags: true  // 获取标签名称
                }
              }
            }
        }
    }
  })
  if(!events) throw new Error("event Not Found!")
  const dataTable = events.map((event) =>{
    const tags = event.eventTagsTo.map((tagRelation) => tagRelation.eventTagsId.tags) 
              // 确保过滤掉 `null` 和非字符串的值
    return{
        id: event.id,
        title: event.title,
        address: event.address,
        date: event.date,
        time: event.time,
        description: event.description,
        status: event.status ||"active",
        eventTags: tags[0] || "",
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