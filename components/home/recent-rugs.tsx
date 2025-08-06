"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Heart, ShoppingBag } from "lucide-react"
import { useRecentRugs } from "@/hooks/use-rugs"
import { ProductCarouselSkeleton } from "@/components/ui/product-skeleton"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { Rug } from "@/types"

export default function RecentRugs() {
  const { items, loading, error } = useRecentRugs()
  const sliderRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current
      const scrollTo = direction === "left" ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2

      sliderRef.current.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      })
    }
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Recent Creations</h2>
          <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
            Our latest handcrafted tufted rugs, fresh from our workshop
          </p>
        </motion.div>

        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 backdrop-blur-sm dark:bg-gray-950/80"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div
            ref={sliderRef}
            className="flex overflow-x-auto pb-8 pt-4 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {loading ? (
              <ProductCarouselSkeleton count={6} />
            ) : error ? (
              <div className="flex w-full items-center justify-center py-8">
                <p className="text-gray-500 dark:text-gray-400">Failed to load recent rugs</p>
              </div>
            ) : (
              <div className="flex gap-6">
                {items.map((rug: Rug) => (
                  <motion.div
                    key={rug.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="relative min-w-[320px] overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800"
                    style={{ height: "450px" }}
                  >
                    {/* Image Section - Full Height */}
                    <div className="relative h-full overflow-hidden">
                      <img 
                        src={rug.image || "/placeholder.svg"} 
                        alt={rug.name} 
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" 
                      />
                      
                      {/* Dimensions Badge - Top Left */}
                      <div className="absolute left-3 top-3 bg-gray-600/60 px-3 py-1 rounded-full backdrop-blur-sm">
                        <span className="text-xs font-bold text-white">
                          {rug.dimensions}
                        </span>
                      </div>
                      
                      {/* Favorite Button */}
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-3 top-3 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>

                      {/* Floating Details Section */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                        <div className="space-y-3">
                          {/* Name and Size in Row */}
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-white drop-shadow-lg">
                              {rug.name}
                            </h3>
                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                            <span className="text-sm font-medium text-white/90">
                              {rug.size.charAt(0).toUpperCase() + rug.size.slice(1)}
                            </span>
                          </div>

                          {/* Price and Action */}
                          <div className="flex items-center justify-between">
                            <div className="text-white drop-shadow-lg">
                              <span className="text-xl font-bold">
                                ${rug.price}
                              </span>
                              <span className="ml-1 text-xs opacity-90">USD</span>
                            </div>
                            
                            <Link href={`/order?rug=${rug.id}`}>
                              <Button className="rounded-full bg-orange-500 px-4 py-2 text-sm text-white hover:bg-orange-600 drop-shadow-lg">
                                <ShoppingBag className="h-4 w-4 mr-2" />
                                Place Order
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 backdrop-blur-sm dark:bg-gray-950/80"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
