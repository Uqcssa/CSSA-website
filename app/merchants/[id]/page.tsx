'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/loading"
import Image from "next/image"
import placeholder from "@/public/placeholder_small.jpg"
import { useState, useEffect } from "react"
import { MapPin, Tag, ArrowLeft, Star, Clock, Phone, ChevronLeft, ChevronRight } from "lucide-react"
import { getAllMerchants } from "@/server/actions/get-all-merchants"
import Link from "next/link"
import { useParams } from "next/navigation"

interface Merchant {
  id: number
  title: string
  address: string
  description: string
  discountInformation: string
  merchant_type: string[]
  image: string
}

interface MerchantData {
  id: number
  title: string
  address: string
  description: string
  discountInformation: string
  merchant_type: string[]
  imageUrl: Array<{
    id: number
    name: string
    key: string
    imageUrl: string
    merchantId: number
  }>
}

export default function MerchantDetailPage() {
  const params = useParams()
  const merchantId = parseInt(params.id as string)
  const [merchant, setMerchant] = useState<Merchant | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // 图片 slider 状态
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [merchantImages, setMerchantImages] = useState<string[]>([])
  const [relatedMerchants, setRelatedMerchants] = useState<Merchant[]>([])

  // 图片导航函数
  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === merchantImages.length - 1 ? 0 : prev + 1
    )
  }

  const previousImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? merchantImages.length - 1 : prev - 1
    )
  }

  useEffect(() => {
    async function fetchMerchant() {
      try {
        setLoading(true)
        console.log('Detail Page: Fetching merchant with ID:', merchantId)
        
        const result = await getAllMerchants()
        
        if (result.error) {
          console.error('Detail Page: Error from server action:', result.error)
          setError('Failed to fetch merchant data')
          setLoading(false)
          return
        }
        
        if (!result.success) {
          console.error('Detail Page: No data returned from server action')
          setError('No merchant data available')
          setLoading(false)
          return
        }
        
        const data: MerchantData[] = result.success
        const foundMerchant = data.find(m => m.id === merchantId)
        
        if (!foundMerchant) {
          setError('Merchant not found')
          setLoading(false)
          return
        }
        
        // 处理商家数据
        const processedMerchant: Merchant = {
          id: foundMerchant.id,
          title: foundMerchant.title,
          address: foundMerchant.address,
          description: foundMerchant.description,
          discountInformation: foundMerchant.discountInformation,
          merchant_type: foundMerchant.merchant_type,
          image: foundMerchant.imageUrl.length > 0 ? foundMerchant.imageUrl[0].imageUrl : placeholder.src,
        }

        // 设置图片数组
        const images = foundMerchant.imageUrl.length > 0 
          ? foundMerchant.imageUrl.map(img => img.imageUrl)
          : [placeholder.src]
        setMerchantImages(images)

        // 查找相关商家（具有相同tag的其他商家）
        const relatedMerchantsData = data
          .filter(m => m.id !== merchantId && m.merchant_type.some(tag => foundMerchant.merchant_type.includes(tag)))
          .slice(0, 4) // 只取前4个
          .map(m => ({
            id: m.id,
            title: m.title,
            address: m.address,
            description: m.description,
            discountInformation: m.discountInformation,
            merchant_type: m.merchant_type,
            image: m.imageUrl.length > 0 ? m.imageUrl[0].imageUrl : placeholder.src,
          }))

        setRelatedMerchants(relatedMerchantsData)

        console.log('Detail Page: Processed merchant:', processedMerchant)
        setMerchant(processedMerchant)
        setLoading(false)
      } catch (error) {
        console.error('Detail Page: Error fetching merchant:', error)
        setError('Failed to load merchant details')
        setLoading(false)
      }
    }

    if (merchantId) {
      fetchMerchant()
    }
  }, [merchantId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner text="Loading merchant details..." />
      </div>
    )
  }

  if (error || !merchant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Merchant Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The merchant you are looking for does not exist.'}</p>
          <Link 
            href="/merchants"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Merchants
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link 
            href="/merchants"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Merchants
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-8">
          {/* Product Image */}
          <div className="lg:w-1/2 order-1 lg:order-1 lg:sticky lg:top-24 lg:ml-24">
            <div className="relative aspect-square max-w-lg mx-auto">
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white/80 hover:bg-white"
                onClick={previousImage}
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </Button>

              <div className="relative w-full h-full overflow-hidden rounded-2xl group">
                <Image
                  src={merchantImages[currentImageIndex] || placeholder.src}
                  alt={merchant.title}
                  fill
                  className="object-cover transition-all duration-300 group-hover:scale-110"
                />
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white/80 hover:bg-white"
                onClick={nextImage}
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </Button>
            </div>

            <div className="flex justify-center gap-3 sm:gap-4 mt-6">
              {merchantImages.slice(0, 5).map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative w-14 h-14 rounded-lg overflow-hidden transition-all
                    ${currentImageIndex === index ? "ring-2 ring-black" : "hover:ring-1 hover:ring-gray-200"}
                  `}
                >
                  <Image
                    src={image}
                    alt={`${merchant.title} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:w-1/2 order-2 lg:order-2 space-y-6 lg:ml-4">
            {/* Title and Rating */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-gray-900">{merchant.title}</h1>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(4.5 / 120 reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-gray-900">$ 49.99</h2>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed text-lg">
                {merchant.description || `Elevate your dining experience with ${merchant.title}. Crafted for the discerning individual who demands both quality and authenticity. Our establishment offers the perfect blend of traditional flavors and modern convenience, whether you're looking for a quick meal or a leisurely dining experience. A must-visit destination for food enthusiasts and those who appreciate exceptional service.`}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {merchant.merchant_type.map((tag, index) => (
                <Badge key={index} variant="outline" className="bg-white/80 backdrop-blur-sm border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors duration-300">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Address */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <MapPin className="w-5 h-5 text-blue-500" />
              <div>
                <h3 className="font-medium text-gray-900">Address</h3>
                <p className="text-gray-600">{merchant.address}</p>
              </div>
            </div>

            {/* Discount Information */}
            {merchant.discountInformation && (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Tag className="w-5 h-5 text-red-500" />
                <div>
                  <h3 className="font-medium text-gray-900">Special Offer</h3>
                  <Badge variant="destructive" className="text-sm bg-gradient-to-r from-red-500 to-pink-500 border-0 text-white shadow-md">
                    {merchant.discountInformation}
                  </Badge>
                </div>
              </div>
            )}

            {/* Business Hours */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Clock className="w-5 h-5 text-green-500" />
              <div>
                <h3 className="font-medium text-gray-900">Business Hours</h3>
                <p className="text-gray-600">Monday - Sunday: 10:00 AM - 10:00 PM</p>
              </div>
            </div>

            {/* Contact */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Phone className="w-5 h-5 text-purple-500" />
              <div>
                <h3 className="font-medium text-gray-900">Contact</h3>
                <p className="text-gray-600">+1 (555) 123-4567</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Make Reservation
              </button>
              <button className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* You May Also Like Section */}
      {relatedMerchants.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-12 lg:ml-24 mt-9">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedMerchants.map((relatedMerchant) => (
              <Link 
                key={relatedMerchant.id} 
                href={`/merchants/${relatedMerchant.id}`}
                className="group"
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src={relatedMerchant.image}
                      alt={relatedMerchant.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {relatedMerchant.title}
                    </h3>
                    <p className="text-sm text-gray-600">$49.99</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 