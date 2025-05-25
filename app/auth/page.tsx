"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import { useRouter } from "next/navigation"
import LoginForm from "@/components/auth/login-form"
import RegisterForm from "@/components/auth/register-form"
import Image from "next/image"

export default function AuthPage() {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth)
  const [activeTab, setActiveTab] = useState("login")
  const router = useRouter()

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/dashboard")
    }
  }, [isLoggedIn, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 ">
        <div className="flex items-center justify-center min-h-screen">
          {/* Centered Auth Forms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-lg mx-auto"
          >
            {/* Logo and Branding */}
            <div className="text-center mb-8">
              <Image
                src="/logo/STICHIT-01.png"
                width={200}
                height={90}
                alt="StitchIt Logo"
                className="h-[100px] w-auto mx-auto mb-4"
              />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome to <span className="text-[#e98234]">StitchIt</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-300">Custom tufted rugs made in Zimbabwe</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8">
              <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-8 grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-700">
                  <TabsTrigger value="login" className="rounded-lg">
                    Login
                  </TabsTrigger>
                  <TabsTrigger value="register" className="rounded-lg">
                    Register
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <LoginForm />
                </TabsContent>

                <TabsContent value="register">
                  <RegisterForm />
                </TabsContent>
              </Tabs>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 mt-8 text-center">
              <div>
                <div className="text-2xl font-bold text-[#e98234]">500+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Happy Customers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#e98234]">1000+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Custom Rugs Made</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
