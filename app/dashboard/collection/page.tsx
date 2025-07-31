"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MapPin, Tag, Star, Calendar, Clock, Bookmark, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import placeholder from '@/public/placeholder_small.jpg'

interface CollectionItem {
  id: number
  title: string
  type: 'merchant' | 'event'
  image: string
  description: string
  tags: string[]
  address?: string
  date?: string
  time?: string
}

export default function CollectionPage() {
  const [collections, setCollections] = useState<CollectionItem[]>([])
  const [loading, setLoading] = useState(true)
  
//fix
  useEffect(() => {
    // 模拟加载收藏数据
    const mockCollections: CollectionItem[] = [
      {
        id: 1,
        title: "TiraBelle Dessert",
        type: 'merchant',
        image: placeholder.src,
        description: "Premium dessert shop offering exquisite cakes and pastries",
        tags: ["甜品", "咖啡"],
        address: "123 Queen Street, Brisbane"
      },
      {
        id: 2,
        title: "Spring Festival Gala",
        type: 'event',
        image: placeholder.src,
        description: "Celebrate Chinese New Year with traditional performances",
        tags: ["文化", "节日"],
        date: "2024-02-10",
        time: "18:00"
      },
      {
        id: 3,
        title: "Bubble Tea House",
        type: 'merchant',
        image: placeholder.src,
        description: "Authentic bubble tea and Asian beverages",
        tags: ["饮品", "奶茶"],
        address: "456 George Street, Brisbane"
      }
    ]

    setTimeout(() => {
      setCollections(mockCollections)
      setLoading(false)
    }, 1000)
  }, [])

  const removeFromCollection = (id: number) => {
    setCollections(prev => prev.filter(item => item.id !== id))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your collection...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Collection</h1>
        <p className="text-gray-600">Manage your saved merchants and events</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({collections.length})</TabsTrigger>
          <TabsTrigger value="merchants">
            Merchants ({collections.filter(item => item.type === 'merchant').length})
          </TabsTrigger>
          <TabsTrigger value="events">
            Events ({collections.filter(item => item.type === 'event').length})
          </TabsTrigger>
          <TabsTrigger value="favorites">
            Favorites ({collections.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-video relative overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="w-8 h-8"
                      onClick={() => removeFromCollection(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <Badge variant={item.type === 'merchant' ? 'default' : 'secondary'}>
                      {item.type === 'merchant' ? 'Merchant' : 'Event'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                  
                  {item.address && (
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{item.address}</span>
                    </div>
                  )}
                  
                  {item.date && item.time && (
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{item.date} at {item.time}</span>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-1 mt-3">
                    {item.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="merchants" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections
              .filter(item => item.type === 'merchant')
              .map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="aspect-video relative overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Button
                        variant="destructive"
                        size="icon"
                        className="w-8 h-8"
                        onClick={() => removeFromCollection(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <Badge variant="default">Merchant</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                    
                    {item.address && (
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{item.address}</span>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-1 mt-3">
                      {item.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections
              .filter(item => item.type === 'event')
              .map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="aspect-video relative overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Button
                        variant="destructive"
                        size="icon"
                        className="w-8 h-8"
                        onClick={() => removeFromCollection(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <Badge variant="secondary">Event</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                    
                    {item.date && item.time && (
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{item.date} at {item.time}</span>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-1 mt-3">
                      {item.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="favorites" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-video relative overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="w-8 h-8"
                      onClick={() => removeFromCollection(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <Badge variant={item.type === 'merchant' ? 'default' : 'secondary'}>
                      {item.type === 'merchant' ? 'Merchant' : 'Event'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                  
                  {item.address && (
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{item.address}</span>
                    </div>
                  )}
                  
                  {item.date && item.time && (
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{item.date} at {item.time}</span>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-1 mt-3">
                    {item.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 