"use client"
import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistance } from "date-fns"
import type { Order } from "@/lib/types"

export default function OrderGrid() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")
        const response = await axios.get("http://localhost:5000/orders/user/", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        setOrders(response.data.order || [])
      } catch (err: (any)) {
        console.log("getOrders error", err.response?.data || err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'completed': return "bg-green-100 text-green-800 border-green-200"
      case 'pending': return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case 'cancelled': return "bg-red-100 text-red-800 border-red-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return formatDistance(date, new Date(), { addSuffix: true })
    } catch (e) {
      return dateString
    }
  }

  return (
    <div className="w-full">      
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <p className="text-gray-500">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium">Order #{order.productId}</h3>
                    <p className="text-sm text-gray-500">{formatDate(order.timestamp)}</p>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>
                <div className="bg-gray-50 p-3 rounded-md mb-3">
                  <p className="text-sm">
                    <span className="font-medium">Product ID:</span> {order.productId}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 px-4 py-3 flex justify-end">
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  View details
                </button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}