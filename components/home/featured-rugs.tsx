"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import type { Rug } from "@/types"

export default function FeaturedRugs() {
  const rugs = useSelector((state: RootState) => state.rugs.items)
  const [activeCategory, setActiveCategory] = useState("small")
  const sliderRef = useRef<HTMLDivElement>(null)

  const categories = [
    { id: "small", label: "Small" },
    { id: "medium", label: "Medium" },
    { id: "large", label: "Large" },
  ]

  const filteredRugs = rugs.filter((rug) => rug.size === activeCategory)

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
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Featured Rugs</h2>
          <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
            Explore our collection of handcrafted tufted rugs, designed to elevate any space
          </p>
        </motion.div>

        <div className="mb-8 flex justify-center">
          <div className="inline-flex rounded-lg border p-1">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "ghost"}
                className={`rounded-md px-4 py-2 ${
                  activeCategory === category.id ? "" : "text-gray-600 dark:text-gray-400"
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

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
            <div className="flex gap-6">
              {filteredRugs.map((rug: Rug) => (
                <motion.div
                  key={rug.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="relative min-w-[300px] overflow-hidden rounded-2xl bg-gray-100 shadow-sm transition-all duration-300 hover:shadow-md dark:bg-gray-800"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={rug.image || "/placeholder.svg"}
                      alt={rug.name}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>

                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent p-6 opacity-0 transition-opacity duration-300 hover:opacity-100">
                    <h3 className="mb-2 text-xl font-bold text-white">{rug.name}</h3>
                    <p className="mb-4 text-sm text-white/80">{rug.description}</p>
                    <div className="flex gap-2">
                      <Link href={`/rug/${rug.id}`} className="flex-1">
                        <Button variant="outline" className="w-full border-white text-white hover:bg-white/10">
                          View Details
                        </Button>
                      </Link>
                      <Link href={`/order?rug=${rug.id}`} className="flex-1">
                        <Button className="w-full bg-white text-black hover:bg-white/90">Order Now</Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
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
