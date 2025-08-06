"use client"

import { useEffect } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, User, Mail, Phone, MapPin, Calendar } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const { user, isLoggedIn } = useSelector((state: RootState) => state.auth)
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [isLoggedIn, router])

  if (!isLoggedIn || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-[104px]">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Welcome Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome to StitchIt, {user.name}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Your account has been created successfully. Let's get you started.
            </p>
          </div>

          {/* Profile Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Your account details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-gray-500">Full Name</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.email}</p>
                    <p className="text-xs text-gray-500">Email Address</p>
                  </div>
                </div>
                {user.phone_number && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user.phone_number}</p>
                      <p className="text-xs text-gray-500">Phone Number</p>
                    </div>
                  </div>
                )}
                {user.address && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user.address}</p>
                      <p className="text-xs text-gray-500">Address</p>
                    </div>
                  </div>
                )}
                {user.city && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user.city}</p>
                      <p className="text-xs text-gray-500">City</p>
                    </div>
                  </div>
                )}
                {user.gender && (
                  <div className="flex items-center space-x-3">
                    <User className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user.gender}</p>
                      <p className="text-xs text-gray-500">Gender</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(user.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">Member Since</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-blue-600 font-bold text-lg">🎨</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Browse Gallery</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Explore our collection of custom tufted rugs
                  </p>
                  <Link href="/gallery">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      View Gallery
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-600 font-bold text-lg">📝</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Place Order</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Start your custom rug order
                  </p>
                  <Link href="/order">
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Order Now
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-purple-600 font-bold text-lg">⚙️</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Account Settings</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Manage your profile and preferences
                  </p>
                  <Link href="/dashboard">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      Go to Dashboard
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
              <CardDescription>
                Complete your profile setup and start exploring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Browse our gallery</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Explore our collection of custom rugs</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Place your first order</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Start creating your custom rug</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Track your orders</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Monitor the progress of your custom rugs</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
} 