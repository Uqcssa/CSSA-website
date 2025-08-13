'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/loading"
import Image from "next/image"
import placeholder from "@/public/placeholder_small.jpg"
import { useState, useEffect } from "react"
import { MapPin, Tag, ArrowLeft, Calendar, Clock, Users, ChevronLeft, ChevronRight, Star } from "lucide-react"
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
    <div className="min-h-screen bg-gray-50">
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
                  src={eventImages[currentImageIndex] || placeholder.src}
                  alt={event.title}
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
              {eventImages.slice(0, 5).map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative w-14 h-14 rounded-lg overflow-hidden transition-all
                    ${currentImageIndex === index ? "ring-2 ring-black" : "hover:ring-1 hover:ring-gray-200"}
                  `}
                >
                  <Image
                    src={image}
                    alt={`${event.title} ${index + 1}`}
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
              <h1 className="text-4xl font-bold text-gray-900">{event.title}</h1>
              
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
              <h2 className="text-3xl font-bold text-gray-900">
                {event.price !== null && event.price > 0 ? `$ ${event.price}` : 'Free'}
              </h2>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed text-lg">
                {event.description || `Join us for an amazing event: ${event.title}. This is a must-attend event for anyone interested in this field. Don't miss out on this incredible opportunity to learn, network, and have fun!`}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {event.eventTags.map((tag, index) => (
                <Badge key={index} variant="outline" className="bg-white/80 backdrop-blur-sm border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors duration-300">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Date and Time */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-500" />
              <div>
                <h3 className="font-medium text-gray-900">Date & Time</h3>
                <p className="text-gray-600">
                  {format(new Date(event.date), 'EEEE, MMMM dd, yyyy')} at {event.time}
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <MapPin className="w-5 h-5 text-blue-500" />
              <div>
                <h3 className="font-medium text-gray-900">Address</h3>
                <p className="text-gray-600">{event.address}</p>
              </div>
            </div>

            {/* Organizer */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Users className="w-5 h-5 text-green-500" />
              <div>
                <h3 className="font-medium text-gray-900">Organizer</h3>
                <p className="text-gray-600">{event.organizer}</p>
              </div>
            </div>

            {/* Max Participants */}
            {event.maxParticipants && (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Users className="w-5 h-5 text-purple-500" />
                <div>
                  <h3 className="font-medium text-gray-900">Max Participants</h3>
                  <p className="text-gray-600">{event.maxParticipants}</p>
                </div>
              </div>
            )}

            {/* Status */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Tag className="w-5 h-5 text-orange-500" />
              <div>
                <h3 className="font-medium text-gray-900">Status</h3>
                <Badge 
                  variant={event.status === 'active' ? 'default' : 'secondary'}
                  className="text-sm"
                >
                  {event.status === 'active' ? 'Active' : 'Expired'}
                </Badge>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Register Now
              </button>
              <button className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                Contact Organizer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* You May Also Like Section */}
      {relatedEvents.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-12 lg:ml-24 mt-9">
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