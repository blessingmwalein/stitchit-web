"use client"

import { motion } from "framer-motion"
import type { Rug } from "@/types"
import Link from "next/link"

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
            className="group cursor-pointer overflow-hidden rounded-xl bg-card shadow-sm transition-all duration-300 hover:shadow-md"
          >
            <Link href={`/rug/${rug.id}`} className="block">
              <div className="aspect-square overflow-hidden">
                <img
                  src={rug.image || "/placeholder.svg"}
                  alt={rug.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </Link>

            <div className="p-4">
              <Link href={`/rug/${rug.id}`}>
                <h3 className="font-medium">{rug.name}</h3>
              </Link>
              <div className="mt-1 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  <span className="capitalize">{rug.size}</span> • <span className="capitalize">{rug.type}</span>
                </div>
                <span className="font-medium">${rug.price}</span>
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
