"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

export default function HeroSection() {
  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[80vh]">
          {/* Main Large Card - Left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-100 to-orange-200"
          >
            <div className="absolute inset-0">
              <img src="/logo/banner.jpg" alt="Custom tufted rug showcase" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
            </div>

            <div className="relative z-10 p-8 lg:p-12 h-full flex flex-col justify-between">
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
                  Custom
                  <br />
                  Tufted
                  <br />
                  Rugs
                </h1>

                <p className="text-lg text-white/90 max-w-md">
                  100+ Design possibilities for your space
                  <br />
                  Handcrafted in Zimbabwe
                </p>
              </div>

              <Link href="/order">
                <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-8 py-3 text-lg font-medium w-fit">
                  START YOUR DESIGN
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right Column - Two Stacked Cards */}
          <div className="space-y-6">
            {/* Top Right Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-100 to-blue-200 h-[48%]"
            >
              <div className="absolute inset-0">
                <img
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Bedroom rugs"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
              </div>

              <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                <h2 className="text-2xl lg:text-3xl font-bold text-white">
                  Bedroom
                  <br />
                  Comfort
                </h2>

                <Link href="/gallery?category=bedroom" className="self-end">
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full">
                    <ArrowUpRight className="h-6 w-6" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Bottom Right Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-100 to-red-200 h-[48%]"
            >
              <div className="absolute inset-0">
                <img
                  src="https://images.unsplash.com/photo-1616137422495-1e9e46e2aa77?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Living room rugs"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
              </div>

              <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                <h2 className="text-2xl lg:text-3xl font-bold text-white">
                  Living
                  <br />
                  Statement
                </h2>

                <Link href="/gallery?category=livingroom" className="self-end">
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full">
                    <ArrowUpRight className="h-6 w-6" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Row - Three Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Bottom Left Card - Quick Order Form */}
    

          {/* Bottom Middle Card - Custom Inspirations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 h-80"
          >
            <div className="relative z-10 p-8 h-full flex flex-col justify-center text-center">
              <div className="space-y-6">
                <h2 className="text-3xl lg:text-4xl font-bold text-black">
                  Custom
                  <br />
                  Inspirations
                </h2>

                <p className="text-gray-600 text-lg leading-relaxed mb-2">
                  Our favorite combinations for custom
                  <br />
                  rugs that can inspire you to apply on
                  <br />
                  your daily spaces.
                </p>

                <Link href="/gallery" className="mt-3">
                  <Button
                    variant="outline"
                    className="border-black text-black hover:bg-black hover:text-white rounded-full px-8 py-4 text-lg font-medium"
                  >
                    BROWSE INSPIRATIONS
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        

          {/* Bottom Right Card - Wall Art */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-100 to-purple-200 h-80"
          >
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1615529328331-f8917597711f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Wall hangings"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30" />
            </div>

            <div className="relative z-10 p-8 h-full flex flex-col justify-between">
              <h2 className="text-3xl lg:text-4xl font-bold text-white">
                Artistry never
                <br />
                gets old
              </h2>

              <Link href="/gallery?category=wall" className="self-end">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full">
                  <ArrowUpRight className="h-6 w-6" />
                </Button>
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-100 to-purple-200 h-80"
          >
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1615529328331-f8917597711f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Wall hangings"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30" />
            </div>

            <div className="relative z-10 p-8 h-full flex flex-col justify-between">
              <h2 className="text-3xl lg:text-4xl font-bold text-white">
                Artistry never
                <br />
                gets old
              </h2>

              <Link href="/gallery?category=wall" className="self-end">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full">
                  <ArrowUpRight className="h-6 w-6" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
