"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import OrdersTab from "@/components/dashboard/orders-tab"
import PaymentsTab from "@/components/dashboard/payments-tab"
import ProfileTab from "@/components/dashboard/profile-tab"
import LoginForm from "@/components/auth/login-form"

export default function DashboardPage() {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth)
  const [activeTab, setActiveTab] = useState("orders")

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="mb-8 text-center text-4xl font-bold tracking-tight">Client Dashboard</h1>
        <div className="mx-auto max-w-md">
          <LoginForm />
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-12"
    >
      <h1 className="mb-8 text-center text-4xl font-bold tracking-tight">Client Dashboard</h1>

      <div className="mx-auto max-w-4xl">
        <Tabs defaultValue="orders" onValueChange={setActiveTab}>
          <TabsList className="mb-8 grid w-full grid-cols-3">
            <TabsTrigger value="orders">My Orders</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="profile">Profile Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <OrdersTab />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentsTab />
          </TabsContent>

          <TabsContent value="profile">
            <ProfileTab />
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  )
}
