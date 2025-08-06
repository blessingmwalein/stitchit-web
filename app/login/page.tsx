"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import { useRouter } from "next/navigation"
import LoginForm from "@/components/auth/login-form"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function LoginPage() {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth)
  const router = useRouter()

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/dashboard")
    }
  }, [isLoggedIn, router])

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-[104px]">
      <div className="flex min-h-screen">
        {/* Left Panel - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 flex flex-col justify-between h-full p-12 text-white">
            {/* Header */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">9</span>
              </div>
              <span className="text-xl font-bold">ninth</span>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="mb-8">
                <button className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium mb-6">
                  Join Us to Build 😊
                </button>
                <h1 className="text-4xl font-bold mb-4">Start your Journey</h1>
                <p className="text-blue-100 text-lg">
                  Follow these simple steps to set up your account.
                </p>
              </div>

              {/* Steps */}
              <div className="flex space-x-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex-1">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mb-2">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <p className="text-sm text-blue-100">Register your account</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 flex-1">
                  <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center mb-2">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <p className="text-sm text-blue-100">Set up your profile information</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 flex-1">
                  <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center mb-2">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <p className="text-sm text-blue-100">Verify your identity through passport/ID</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Back Button */}
            <Link 
              href="/" 
              className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-8"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>

            {/* Login Form */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Join Us</h1>
                <p className="text-gray-600 dark:text-gray-400">Sign in to your account</p>
              </div>

              <LoginForm />

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or</span>
                </div>
              </div>

              {/* Google Sign In */}
              <button className="w-full flex items-center justify-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Sign in with Google</span>
              </button>

              {/* Terms */}
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-6">
                By signing in I confirm that I carefully have read and agree to the{" "}
                <Link href="/privacy" className="text-blue-600 hover:text-blue-500">Privacy Policy</Link>
                {" "}and{" "}
                <Link href="/terms" className="text-blue-600 hover:text-blue-500">Terms of Service</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 