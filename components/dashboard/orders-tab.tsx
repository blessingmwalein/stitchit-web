"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import type { Order } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function OrdersTab() {
  const orders = useSelector((state: RootState) => state.orders.items)
  const [activeTab, setActiveTab] = useState("all")

  const getFilteredOrders = () => {
    if (activeTab === "all") return orders
    return orders.filter((order) => order.status.toLowerCase() === activeTab)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "processing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500"
      case "production":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500"
      case "shipped":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-500"
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
    }
  }

  return (
    <div>
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="production">In Production</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {getFilteredOrders().length > 0 ? (
            <div className="space-y-4">
              {getFilteredOrders().map((order: Order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="rounded-lg border bg-card p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <h3 className="font-medium">Order #{order.id}</h3>
                        <Badge variant="outline" className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.date).toLocaleDateString()} • {order.items.length} item(s)
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-medium">${order.total.toFixed(2)}</p>
                      <Button variant="link" className="h-auto p-0 text-sm">
                        View Details
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    {order.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center gap-4">
                        <div className="h-12 w-12 overflow-hidden rounded-md bg-muted">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.options?.dimensions} • {item.options?.type}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border bg-card p-8 text-center shadow-sm">
              <h3 className="mb-2 text-lg font-medium">No orders found</h3>
              <p className="mb-6 text-muted-foreground">You haven't placed any orders yet.</p>
              <Button>Start Shopping</Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
