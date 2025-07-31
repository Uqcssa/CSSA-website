'use client'
//merchants page
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoadingSpinner } from "@/components/loading"
import Image from "next/image"
import placeholder from "@/public/placeholder_small.jpg"
import { useState, useEffect } from "react"
import { UtensilsCrossed, CupSoda, HandPlatter, MapPin, Tag } from "lucide-react"
import { getAllMerchants } from "@/server/actions/get-all-merchants"
import Link from "next/link"
import { FaMapMarkerAlt } from "react-icons/fa";

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

// 定义标签分类
const tagCategories = {
  restaurant: {
    name: "餐厅",
    icon: UtensilsCrossed,
    tags: ["清真餐厅", "中餐", "西餐", "烧烤", "火锅", "日料", "韩餐"]
  },
  beverage: {
    name: "饮品", 
    icon: CupSoda,
    tags: ["甜品", "咖啡", "奶茶饮料"]
  },
  other: {
    name: "其他",
    icon: HandPlatter,
    tags: ["留学教育", "生活服务", "休闲娱乐", "线上商家"]
  }
}

export default function MerchantsPage() {
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [filteredMerchants, setFilteredMerchants] = useState<Merchant[]>([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedTag, setSelectedTag] = useState("")
  const [loading, setLoading] = useState(true)
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1)
  const merchantsPerPage = 9

  useEffect(() => {
    async function fetchMerchants() {
      try {
        setLoading(true)
        console.log('Page: Fetching merchants using server action...') // 调试信息
        
        const result = await getAllMerchants()
        
        if (result.error) {
          console.error('Page: Error from server action:', result.error)
          setLoading(false)
          return
        }
        
        if (!result.success) {
          console.error('Page: No data returned from server action')
          setLoading(false)
          return
        }
        
        const data: MerchantData[] = result.success
        
        console.log('Page: Fetched merchants data:', data) // 调试信息
        console.log('Page: Number of merchants fetched:', data.length) // 调试信息
        
        // 处理商家数据
        const processedMerchants: Merchant[] = data.map((merchant: MerchantData) => {
          return {
            id: merchant.id,
            title: merchant.title,
            address: merchant.address,
            description: merchant.description,
            discountInformation: merchant.discountInformation,
            merchant_type: merchant.merchant_type,
            image: merchant.imageUrl.length > 0 ? merchant.imageUrl[0].imageUrl : placeholder.src,
          }
        })

        console.log('Page: Processed merchants:', processedMerchants) // 调试信息
        console.log('Page: Number of processed merchants:', processedMerchants.length) // 调试信息

        setMerchants(processedMerchants)
        setFilteredMerchants(processedMerchants)
        setLoading(false)
      } catch (error) {
        console.error('Page: Error fetching merchants:', error)
        setLoading(false)
      }
    }

    fetchMerchants()
    
    // // // 添加定时刷新，每30秒刷新一次
    // // const interval = setInterval(fetchMerchants, 30000)
    // // 添加定时刷新，每30天刷新一次
    // const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000 // 30天 = 一个月
    // const interval = setInterval(fetchMerchants, ONE_MONTH_MS)

    // return () => clearInterval(interval)
  }, [])

  // 处理类别筛选
  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category)
    setSelectedTag("")
    setCurrentPage(1) // 重置到第一页
    
    if (category === "all") {
      setFilteredMerchants(merchants)
    } else {
      const categoryTags = tagCategories[category as keyof typeof tagCategories]?.tags || []
      const filtered = merchants.filter(merchant => 
        merchant.merchant_type.some(tag => categoryTags.includes(tag))
      )
      setFilteredMerchants(filtered)
    }
  }

  // 处理标签筛选
  const handleTagFilter = (tag: string) => {
    setSelectedTag(tag)
    setCurrentPage(1) // 重置到第一页
    if (tag === "all") {
      // 如果选择了 "all"，显示当前类别的所有商家
      const categoryTags = tagCategories[selectedCategory as keyof typeof tagCategories]?.tags || []
      const filtered = merchants.filter(merchant => 
        merchant.merchant_type.some(tag => categoryTags.includes(tag))
      )
      setFilteredMerchants(filtered)
    } else {
      const filtered = merchants.filter(merchant => 
        merchant.merchant_type.includes(tag)
      )
      setFilteredMerchants(filtered)
    }
  }

  // 分页计算
  const totalPages = Math.ceil(filteredMerchants.length / merchantsPerPage)
  const startIndex = (currentPage - 1) * merchantsPerPage
  const endIndex = startIndex + merchantsPerPage
  const currentMerchants = filteredMerchants.slice(startIndex, endIndex)

  // 分页处理函数
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 处理轮播图数据 - 取前5个商家作为轮播图
  const heroMerchants = merchants.slice(0, 5)

  if (loading) {
    return <LoadingSpinner text="Loading merchants..." />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Carousel */}
      <section className="relative h-[500px] bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        <div className="relative z-20 h-full flex items-center justify-center">
          <div className="text-center text-white mb-8">
            <h1 className="text-5xl font-bold mb-4">Discover Amazing Merchants</h1>
            <p className="text-xl opacity-90">Find the best local businesses and services</p>
          </div>
        </div>
        
        {/* Carousel */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 w-full max-w-4xl px-4">
          <Carousel className="w-full">
            <CarouselContent>
              {heroMerchants.map((merchant) => (
                <CarouselItem key={merchant.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
                      <CardContent className="p-4">
                        <div className="aspect-square mb-4 relative overflow-hidden rounded-lg">
                          <Image
                            src={merchant.image}
                            alt={merchant.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">{merchant.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{merchant.address}</p>
                        <div className="flex flex-wrap gap-1">
                          {merchant.merchant_type.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="bg-white/80 hover:bg-white" />
            <CarouselNext className="bg-white/80 hover:bg-white" />
          </Carousel>
        </div>
      </section>

      {/* Merchants Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">All Merchants</h2>
            <p className="text-gray-600 mb-6">Browse through our complete collection of merchants</p>
            
            {/* Filter Section */}
            <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
              {/* Category Filter */}
              <div className="w-full max-w-xs">
                <Select onValueChange={handleCategoryFilter} value={selectedCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                    <SelectItem value="all">All Merchants</SelectItem>
                    {Object.entries(tagCategories).map(([key, category]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <category.icon className="w-4 h-4" />
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tag Filter - 只在选择了类别后显示 */}
              {selectedCategory && selectedCategory !== "all" && (
                <div className="w-full max-w-xs">
                  <Select onValueChange={handleTagFilter} value={selectedTag}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select specific type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                      <SelectItem value="all">
                        All {tagCategories[selectedCategory as keyof typeof tagCategories]?.name}
                      </SelectItem>
                      {tagCategories[selectedCategory as keyof typeof tagCategories]?.tags.map((tag) => (
                        <SelectItem key={tag} value={tag}>
                          {tag}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            {/* Results count */}
            <p className="text-sm text-gray-500 mb-6">
              Showing {currentMerchants.length} of {filteredMerchants.length} merchants 
              {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentMerchants.map((merchant) => (
              <Link key={merchant.id} href={`/merchants/${merchant.id}`} className="block">
                <div className="w-full max-w-sm mx-auto">
                  <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white via-gray-50 to-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Floating Elements */}
                    <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
                    <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-lg group-hover:scale-125 transition-transform duration-500 delay-100" />

                    <CardHeader className="p-0 relative">
                      <div className="aspect-square relative overflow-hidden rounded-t-lg">
                        <Image
                          src={merchant.image}
                          alt={merchant.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {/* Image Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />
                      </div>
                    </CardHeader>

                    <CardContent className="relative p-6">
                      <CardTitle className="text-lg mb-2 text-gray-800 group-hover:text-gray-900 transition-colors duration-300 text-center">
                        {merchant.title}
                      </CardTitle>
                      
                      {/* Address and Discount Information in same row */}
                      <div className="flex flex-col gap-2 mb-3">
                        {/* Address */}
                        <div className="flex items-center gap-2 text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                          <MapPin className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium">Address:</span>
                          <span className="text-sm">{merchant.address}</span>
                        </div>
                        
                        {/* Discount Information */}
                        {merchant.discountInformation && (
                          <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4 text-red-500" />
                            <span className="text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors duration-300">Discount:</span>
                            <Badge variant="destructive" className="text-xs bg-gradient-to-r from-red-500 to-pink-500 border-0 text-white shadow-md">
                              {merchant.discountInformation}
                            </Badge>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {merchant.merchant_type.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-white/80 backdrop-blur-sm border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors duration-300">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Progress Bar */}
                      <div className="absolute bottom-6 left-6 right-6 bg-gray-200 rounded-full h-1 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-out" />
                      </div>
                    </CardContent>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </Card>
                </div>
              </Link>
            ))}
          </div>
          
          {filteredMerchants.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {selectedCategory === "all" 
                  ? "No merchants found." 
                  : `No merchants found for ${tagCategories[selectedCategory as keyof typeof tagCategories]?.name || "this category"}.`
                }
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center space-x-2">
                {/* Previous button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-md text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                
                {/* Page numbers */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // 显示当前页附近的页码和首尾页
                    const shouldShow = 
                      page === 1 || 
                      page === totalPages || 
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    
                    if (shouldShow) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 rounded-md transition-colors ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    } else if (
                      (page === currentPage - 2 && currentPage > 3) ||
                      (page === currentPage + 2 && currentPage < totalPages - 2)
                    ) {
                      return <span key={page} className="px-2 text-gray-400">...</span>
                    }
                    return null
                  })}
                </div>
                
                {/* Next button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-md text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
      </section>
    </div>
  )
} 