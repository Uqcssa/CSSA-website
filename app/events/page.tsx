'use client'
//events page
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoadingSpinner } from "@/components/loading"
import Image from "next/image"
import placeholder from "@/public/placeholder_small.jpg"
import { useState, useEffect } from "react"
import { MapPin, Tag, Users, Clock } from "lucide-react"
import { getAllEvents } from "@/server/actions/get-all-events"
import Link from "next/link"
import { format } from "date-fns"

interface Event {
  id: number
  title: string
  address: string
  description: string
  date: Date
  time: string
  maxParticipants: number | null
  price: number | null
  organizer: string
  status: string | null
  eventTags: string[]
  image: string
}

interface EventData {
  id: number
  title: string
  address: string
  description: string
  date: Date
  time: string
  maxParticipants: number | null
  price: number | null
  organizer: string
  status: string | null
  eventTagsTo: Array<{
    eventTagsId: {
      tags: string
    }
  }>
  eImages: Array<{
    id: number
    name: string
    key: string
    imageUrl: string
    eventId: number
  }>
}



export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [selectedTag, setSelectedTag] = useState("")
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("all") // 时间筛选状态
  const [loading, setLoading] = useState(true)
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1)
  const eventsPerPage = 9

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true)
        console.log('Page: Fetching events using server action...') // 调试信息
        
        const result = await getAllEvents()
        
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
        
        const data: EventData[] = result.success
        
        console.log('Page: Fetched events data:', data) // 调试信息
        console.log('Page: Number of events fetched:', data.length) // 调试信息
        
        // 处理事件数据
        const processedEvents: Event[] = data.map((event: EventData) => {
          // 提取标签
          const eventTags = event.eventTagsTo.map(tag => tag.eventTagsId.tags)
          
          return {
            id: event.id,
            title: event.title,
            address: event.address,
            description: event.description,
            date: event.date,
            time: event.time,
            maxParticipants: event.maxParticipants,
            price: event.price,
            organizer: event.organizer,
            status: event.status,
            eventTags: eventTags,
            image: event.eImages.length > 0 ? event.eImages[0].imageUrl : placeholder.src,
          }
        })

        console.log('Page: Processed events:', processedEvents) // 调试信息
        console.log('Page: Number of processed events:', processedEvents.length) // 调试信息

        setEvents(processedEvents)
        setFilteredEvents(processedEvents)
        setLoading(false)
      } catch (error) {
        console.error('Page: Error fetching events:', error)
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])



  // 处理标签筛选
  const handleTagFilter = (tag: string) => {
    setSelectedTag(tag)
    setCurrentPage(1) // 重置到第一页
    
    let filtered = events
    
    // 应用标签筛选
    if (tag !== "all") {
      filtered = filtered.filter(event => 
        event.eventTags.includes(tag)
      )
    }
    
    // 应用时间筛选
    if (selectedTimeFilter === "latest") {
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
      
      filtered = filtered
        .filter(event => new Date(event.date) >= sixMonthsAgo)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    } else if (selectedTimeFilter === "past") {
      const now = new Date()
      filtered = filtered
        .filter(event => new Date(event.date) < now)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }
    
    console.log(`Tag filter: ${tag}, showing ${filtered.length} events`)
    setFilteredEvents(filtered)
  }

  // 处理时间筛选
  const handleTimeFilter = (timeFilter: string) => {
    setSelectedTimeFilter(timeFilter)
    setCurrentPage(1) // 重置到第一页
    
    let filtered = events
    
    // 应用标签筛选
    if (selectedTag && selectedTag !== "all") {
      filtered = filtered.filter(event => 
        event.eventTags.includes(selectedTag)
      )
    }
    
    // 应用时间筛选
    if (timeFilter === "latest") {
      // Latest: 半年之内的所有event，按创建时间排序（最新创建的排在前面）
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
      
      filtered = filtered
        .filter(event => new Date(event.date) >= sixMonthsAgo)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      
      console.log(`Latest filter: Showing ${filtered.length} events from last 6 months`)
    } else if (timeFilter === "past") {
      // Past: 根据现在的时间和event上的date来判断，如果event date上的时间已经过去了则筛选出来
      const now = new Date()
      filtered = filtered
        .filter(event => new Date(event.date) < now)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // 最近过去的排在前面
      
      console.log(`Past filter: Showing ${filtered.length} past events`)
    } else {
      console.log(`All time filter: Showing all ${filtered.length} events`)
    }
    
    setFilteredEvents(filtered)
  }

  // 分页计算
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage)
  const startIndex = (currentPage - 1) * eventsPerPage
  const endIndex = startIndex + eventsPerPage
  const currentEvents = filteredEvents.slice(startIndex, endIndex)

  // 分页处理函数
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 处理轮播图数据 - 取前5个事件作为轮播图
  const heroEvents = events.slice(0, 5)

  if (loading) {
    return <LoadingSpinner text="Loading events..." />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Carousel */}
      <section className="relative h-[500px] bg-gradient-to-r from-green-600 to-blue-600">
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        <div className="relative z-20 h-full flex items-center justify-center">
          <div className="text-center text-white mb-8">
            <h1 className="text-5xl font-bold mb-4">Discover Amazing Events</h1>
            <p className="text-xl opacity-90">Find the best local events and activities</p>
          </div>
        </div>
        
        {/* Carousel */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 w-full max-w-4xl px-4">
          <Carousel className="w-full">
            <CarouselContent>
              {heroEvents.map((event) => (
                <CarouselItem key={event.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
                      <CardContent className="p-4">
                        <div className="aspect-square mb-4 relative overflow-hidden rounded-lg">
                          <Image
                            src={event.image}
                            alt={event.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{event.address}</p>
                        <div className="flex flex-wrap gap-1">
                          {event.eventTags.slice(0, 2).map((tag, index) => (
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

      {/* Events Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">All Events</h2>
            <p className="text-gray-600 mb-6">Browse through our complete collection of events</p>
            
            {/* Filter Section */}
            <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
              {/* Tag Filter - Event Types */}
              <div className="w-full max-w-xs">
                <Select onValueChange={handleTagFilter} value={selectedTag}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                    <SelectItem value="all">All Event Types</SelectItem>
                    {/* 显示所有可用的标签 */}
                    {["文化", "节日", "学术", "娱乐", "体育", "社交", "商业", "技术", "艺术", "教育"].map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Time Filter */}
              <div className="w-full max-w-xs">
                <Select onValueChange={handleTimeFilter} value={selectedTimeFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select time filter" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="latest">Latest (6 months)</SelectItem>
                    <SelectItem value="past">Past Events</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Results count */}
            <p className="text-sm text-gray-500 mb-6">
              Showing {currentEvents.length} of {filteredEvents.length} events 
              {selectedTag !== "all" && (
                <span className="ml-2">
                  (Type: {selectedTag})
                </span>
              )}
              {selectedTimeFilter !== "all" && (
                <span className="ml-2">
                  {selectedTimeFilter === "latest" ? "(Last 6 months)" : "(Past events)"}
                </span>
              )}
              {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentEvents.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`} className="block">
                <div className="w-full max-w-sm mx-auto">
                  <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white via-gray-50 to-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-blue-50/30 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Floating Elements */}
                    <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
                    <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-lg group-hover:scale-125 transition-transform duration-500 delay-100" />

                    <CardHeader className="p-0 relative">
                      <div className="aspect-square relative overflow-hidden rounded-t-lg">
                        <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {/* Image Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />
                      </div>
                    </CardHeader>

                    <CardContent className="relative p-6">
                      <CardTitle className="text-lg mb-2 text-gray-800 group-hover:text-gray-900 transition-colors duration-300 text-center">
                        {event.title}
                      </CardTitle>
                      
                      {/* Event Details */}
                      <div className="flex flex-col gap-2 mb-3">
                        {/* Date and Time */}
                        <div className="flex items-center gap-2 text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                          <Clock className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-medium">Date:</span>
                          <span className="text-sm">{format(new Date(event.date), 'MMM dd, yyyy')}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                          <Clock className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium">Time:</span>
                          <span className="text-sm">{event.time}</span>
                        </div>

                        {/* Address */}
                        <div className="flex items-center gap-2 text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                          <MapPin className="w-4 h-4 text-red-500" />
                          <span className="text-sm font-medium">Address:</span>
                          <span className="text-sm">{event.address}</span>
                        </div>
                        
                        {/* Organizer */}
                        <div className="flex items-center gap-2 text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                          <Users className="w-4 h-4 text-purple-500" />
                          <span className="text-sm font-medium">Organizer:</span>
                          <span className="text-sm">{event.organizer}</span>
                        </div>

                        
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {event.eventTags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-white/80 backdrop-blur-sm border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors duration-300">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Progress Bar */}
                      <div className="absolute bottom-6 left-6 right-6 bg-gray-200 rounded-full h-1 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-500 to-blue-600 rounded-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-out" />
                      </div>
                    </CardContent>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </Card>
                </div>
              </Link>
            ))}
          </div>
          
          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No events found.
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
                              ? 'bg-green-600 text-white'
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