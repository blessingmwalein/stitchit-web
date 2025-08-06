"use client"

import { motion } from "framer-motion"
import type { Rug } from "@/types"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingBag } from "lucide-react"

interface GalleryGridProps {
  rugs: Rug[]
  setSelectedRug: (rug: Rug) => void
}

export default function GalleryGrid({ rugs, setSelectedRug }: GalleryGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {rugs.length > 0 ? (
        rugs.map((rug, index) => (
          <motion.div
            key={rug.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800"
            style={{ height: "450px" }}
          >
            {/* Image Section - Full Height */}
            <div className="relative h-full overflow-hidden">
              <img
                src={rug.image || "/placeholder.svg"}
                alt={rug.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
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
        ))
      ) : (
        <div className="col-span-full py-12 text-center">
          <p className="text-lg font-medium">No rugs found</p>
          <p className="text-muted-foreground">Try adjusting your filters</p>
        </div>
      )}
    </div>
  )
}
