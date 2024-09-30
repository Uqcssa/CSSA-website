'use server'

import { eq } from "drizzle-orm"
import { db } from ".."
import { merchantSchema } from "../schema"

//used for edita the merchant when user click edit 
export async function getMerchant(id:number) {
    try {
       const merchant = await db.query.merchantSchema.findFirst({
            where:eq(merchantSchema.id,id)
       }) 
       if(!merchant){
        throw new Error("Merchant Not Found")
       }
       return{success: merchant}
    } catch (error) {
        return {error: "Failed to get Merchant!"}
    }
    
}