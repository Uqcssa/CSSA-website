'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/loading"
import Image from "next/image"
import placeholder from "@/public/placeholder_small.jpg"
import { useState, useEffect } from "react"
import { MapPin, Tag, ArrowLeft, Calendar, Clock, Users, ChevronLeft, ChevronRight, Star, Heart, Share2 } from "lucide-react"
import { getAllEvents } from "@/server/actions/get-all-events"
import Link from "next/link"
import { useParams } from "next/navigation"
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
  contactInfo?: string | null
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
  contactInfo?: string | null
}

export default function EventDetailPage() {
  const params = useParams()
  const eventId = parseInt(params.id as string)
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // 图片 slider 状态
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [eventImages, setEventImages] = useState<string[]>([])
  const [relatedEvents, setRelatedEvents] = useState<Event[]>([])

  // 图片导航函数
  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === eventImages.length - 1 ? 0 : prev + 1
    )
  }

  const previousImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? eventImages.length - 1 : prev - 1
    )
  }

  useEffect(() => {
    async function fetchEvent() {
      try {
        setLoading(true)
        console.log('Detail Page: Fetching event with ID:', eventId)
        
        const result = await getAllEvents()
        
        if (result.error) {
          console.error('Detail Page: Error from server action:', result.error)
          setError('Failed to fetch event data')
          setLoading(false)
          return
        }
        
        if (!result.success) {
          console.error('Detail Page: No data returned from server action')
          setError('No event data available')
          setLoading(false)
          return
        }
        
        const data: EventData[] = result.success
        const foundEvent = data.find(e => e.id === eventId)
        
        if (!foundEvent) {
          setError('Event not found')
          setLoading(false)
          return
        }
        
        // 处理事件数据
        const processedEvent: Event = {
          id: foundEvent.id,
          title: foundEvent.title,
          address: foundEvent.address,
          description: foundEvent.description,
          date: foundEvent.date,
          time: foundEvent.time,
          maxParticipants: foundEvent.maxParticipants,
          price: foundEvent.price,
          organizer: foundEvent.organizer,
          status: foundEvent.status,
          eventTags: foundEvent.eventTagsTo.map(tag => tag.eventTagsId.tags),
          image: foundEvent.eImages.length > 0 ? foundEvent.eImages[0].imageUrl : placeholder.src,
          contactInfo: foundEvent.contactInfo || null,
        }
        
        // 设置图片数组
        const images = foundEvent.eImages.length > 0 
          ? foundEvent.eImages.map(img => img.imageUrl)
          : [placeholder.src]
        setEventImages(images)

        // 查找相关事件（具有相同tag的其他事件）
        const relatedEventsData = data
          .filter(e => e.id !== eventId && e.eventTagsTo.some(tag => 
            foundEvent.eventTagsTo.some(foundTag => foundTag.eventTagsId.tags === tag.eventTagsId.tags)
          ))
          .slice(0, 4) // 只取前4个
          .map(e => ({
            id: e.id,
            title: e.title,
            address: e.address,
            description: e.description,
            date: e.date,
            time: e.time,
            maxParticipants: e.maxParticipants,
            price: e.price,
            organizer: e.organizer,
            status: e.status,
            eventTags: e.eventTagsTo.map(tag => tag.eventTagsId.tags),
            image: e.eImages.length > 0 ? e.eImages[0].imageUrl : placeholder.src,
          }))

        setRelatedEvents(relatedEventsData)
        
        console.log('Detail Page: Processed event:', processedEvent)
        setEvent(processedEvent)
        setLoading(false)
        
      } catch (error) {
        console.error('Detail Page: Error fetching event:', error)
        setError('Failed to load event details')
        setLoading(false)
      }
    }

    if (eventId) {
      fetchEvent()
    }
  }, [eventId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner text="Loading event details..." />
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The event you are looking for does not exist.'}</p>
          <Link 
            href="/events"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link 
            href="/events"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </Link>
        </div>
      </div>

      {/* Top Large Image Carousel - 占据整个顶部区域 */}
      <div className="w-full max-w-5xl   mx-auto ">
        <div className="w-full rounded-full  mt-10 max-w-7xl mx-auto relative">
            <div className="relative w-full h-96 md:h-[500px] lg:h-[600px]">
            {/* Navigation Buttons */}
            <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 hover:bg-white shadow-lg"
                onClick={previousImage}
            >
                <ChevronLeft className="w-6 h-6 text-blue-600" />
            </Button>

            <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 hover:bg-white shadow-lg"
                onClick={nextImage}
            >
                <ChevronRight className="w-6 h-6 text-blue-600" />
            </Button>

            {/* Main Image */}
            <div className="relative w-full h-full overflow-hidden">
                <Image
                src={eventImages[currentImageIndex] || placeholder.src}
                alt={event.title}
                fill
                className="object-cover"
                />
            </div>

            {/* Progress Indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {eventImages.map((_, index) => (
                <div
                    key={index}
                    className={`h-1 transition-all duration-300 ${
                    index === currentImageIndex 
                        ? 'w-8 bg-white' 
                        : 'w-4 bg-white/50'
                    }`}
                />
                ))}
            </div>
            </div>
        </div>
      </div>

      {/* Main Content - 事件信息和操作区域 */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Left Column - 事件信息垂直布局 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Date */}
            <div className="text-gray-600 text-lg">
              {format(new Date(event.date), 'EEEE, dd MMMM')}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              {event.title}
            </h1>

            {/* Entry Fee */}
            {event.price === null || event.price === 0 ? (
              <div className="text-2xl md:text-3xl font-bold text-gray-900">
                (FREE ENTRY)
              </div>
            ) : (
              <div className="text-2xl md:text-3xl font-bold text-gray-900">
                ${event.price}
              </div>
            )}

            {/* Organizer */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">A</span>
              </div>
              <span className="text-gray-700 text-lg">
                By {event.organizer}
              </span>
            </div>

            {/* Description */}
            <div className="pt-4 space-y-4 text-gray-700 text-lg leading-relaxed">
              <div dangerouslySetInnerHTML={{ __html: event.description }} />
            </div>

            {/* Address */}
            <div className="flex items-center gap-3 pt-4">
              <MapPin className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">{event.address}</span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-4">
              {event.eventTags.map((tag, index) => (
                <Badge key={index} variant="outline" className="bg-gray-100 border-gray-300 text-gray-700">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Right Column - 操作区域 */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm sticky top-24">
              {/* Action Icons */}
              {/* <div className="flex justify-end gap-3 mb-6">
                <Button variant="ghost" size="icon" className="w-10 h-10 text-gray-500 hover:text-gray-700">
                  <Heart className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="w-10 h-10 text-gray-500 hover:text-gray-700">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div> */}

              {/* Price */}
              <div className="mb-4">
                <div className="text-2xl font-semibold text-gray-900">
                  {event.price === null || event.price === 0 ? 'Free' : `$${event.price}`}
                </div>
              </div>

              {/* Date & Time */}
              <div className="mb-6">
                <div className="text-gray-700">
                  {format(new Date(event.date), 'MMM dd')} · {event.time} AEST
                </div>
              </div>

              {/* Call to Action Button */}
              {event.contactInfo && /^https?:\/\//.test(event.contactInfo) ? (
                <a
                  href={event.contactInfo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg font-medium rounded-lg">
                    Reserve a spot
                  </Button>
                </a>
              ) : (
                <Button 
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg font-medium rounded-lg"
                >
                  Reserve a spot
                </Button>
              )}

              {/* Additional Info */}
              {/* {event.maxParticipants && (
                <div className="mt-4 text-center text-sm text-gray-500">
                  Max {event.maxParticipants} participants
                </div>
              )} */}
            </div>
          </div>
        </div>
      </div>

      {/* You May Also Like Section */}
      {relatedEvents.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedEvents.map((relatedEvent) => (
              <Link 
                key={relatedEvent.id} 
                href={`/events/${relatedEvent.id}`}
                className="group"
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src={relatedEvent.image}
                      alt={relatedEvent.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {relatedEvent.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {relatedEvent.price !== null && relatedEvent.price > 0 
                        ? `$${relatedEvent.price}` 
                        : 'Free'
                      }
                    </p>
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