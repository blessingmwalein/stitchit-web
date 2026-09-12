'use client';

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  Sofa, Utensils, Bath, Bed, Car, TableProperties, Lamp, DoorOpen,
  Building2, Sparkles, type LucideIcon,
} from "lucide-react"
import { roomShowcaseApi, type RoomShowcaseItem } from "@/lib/api/room-showcase"

// Kept in lockstep with:
//  - stitchit-backend: src/modules/room-showcase/dto/room-showcase.dto.ts (ROOM_SHOWCASE_CATEGORIES)
//  - stitchit-admin:   lib/types/room-showcase.ts (ROOM_SHOWCASE_CATEGORIES)
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  LIVING_ROOM: Sofa,
  DINING_ROOM: TableProperties,
  BEDROOM: Bed,
  BATHROOM: Bath,
  ENTRYWAY: DoorOpen,
  HOME_OFFICE: Lamp,
  CAR_INTERIOR: Car,
  RESTAURANT_CAFE: Utensils,
  OFFICE: Lamp,
  BUSINESS: Building2,
  KIDS_ROOM: Sofa,
  CUSTOM: Sparkles,
}
const FALLBACK_ICON: LucideIcon = Sparkles

export function UseCasesSection() {
  const [items, setItems] = useState<RoomShowcaseItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    roomShowcaseApi
      .getRoomShowcases()
      .then((data) => setItems(data))
      .finally(() => setLoading(false))
  }, [])

  if (!loading && items.length === 0) return null

  return (
    <section className="py-20 bg-[#faf9f7]">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-light text-[#2c2420] mb-4">
            Perfect for <span className="text-[var(--orange)] italic font-serif">Every Room</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Discover how our custom tufted rugs can enhance any space in your home or business
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-50 rounded-lg bg-[#eae5df] animate-pulse" />
              ))
            : items.map((item, index) => {
                const Icon = (item.category && CATEGORY_ICONS[item.category]) || FALLBACK_ICON
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    className="group relative overflow-hidden rounded-lg bg-white border border-border hover:shadow-lg transition-all cursor-pointer"
                  >
                    <div className="relative h-50 overflow-hidden">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="flex items-center gap-2 text-white mb-1">
                          <Icon className="w-5 h-5" />
                          <h3 className="font-semibold">{item.title}</h3>
                        </div>
                        {item.description && <p className="text-white/80 text-xs">{item.description}</p>}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
        </div>
      </div>
    </section>
  );
}
