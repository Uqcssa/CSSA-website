'use server'
// get all merchants from the database
import { db } from ".."
import { merchantSchema } from "../schema"

export async function getAllMerchants() {
  try {
    console.log('Server Action: Fetching all merchants from database...') // 调试信息
    
    const merchants = await db.query.merchantSchema.findMany({
      orderBy: (merchantSchema, { desc }) => [desc(merchantSchema.id)],
      with: {
        merchantTags: {
          with: {
            tags: true
          }
        },
        imageUrl: true
      }
    })

    console.log('Server Action: Found merchants:', merchants.length) // 调试信息
    console.log('Server Action: Merchant IDs:', merchants.map(m => m.id)) // 调试信息

    // 处理数据格式，与 dashboard 页面保持一致
    const processedMerchants = merchants.map((merchant) => {
      const tags = merchant.merchantTags.map((tagRelation) => tagRelation.tags.tags)
      return {
        id: merchant.id,
        title: merchant.title,
        address: merchant.address,
        description: merchant.description,
        discountInformation: merchant.discountInformation,
        merchant_type: tags,
        imageUrl: merchant.imageUrl,
      }
    })

    console.log('Server Action: Processed merchants:', processedMerchants.length) // 调试信息

    return { success: processedMerchants }
  } catch (error) {
    console.error('Server Action: Error fetching merchants:', error)
    return { error: 'Failed to fetch merchants' }
  }
} 