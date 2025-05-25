"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ZoomIn, ZoomOut, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Rug } from "@/types"
import Link from "next/link"

interface RugModalProps {
  rug: Rug
  onClose: () => void
}

export default function RugModal({ rug, onClose }: RugModalProps) {
  const [scale, setScale] = useState(1)

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 2.5))
  }

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 1))
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", damping: 20 }}
          className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-xl bg-card shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b p-4">
            <h3 className="text-xl font-semibold">{rug.name}</h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid md:grid-cols-2">
            <div className="relative flex h-[50vh] items-center justify-center overflow-hidden bg-muted p-4">
              <div className="h-full w-full transition-all duration-300" style={{ transform: `scale(${scale})` }}>
                <img src={rug.image || "/placeholder.svg"} alt={rug.name} className="h-full w-full object-contain" />
              </div>

              <div className="absolute bottom-4 right-4 flex gap-2">
                <Button variant="outline" size="icon" onClick={zoomOut} disabled={scale <= 1}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={zoomIn} disabled={scale >= 2.5}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col p-6">
              <div className="mb-4 flex items-center gap-2 text-sm">
                <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium capitalize text-primary">
                  {rug.size}
                </span>
                <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium capitalize text-primary">
                  {rug.type}
                </span>
                {rug.useCase && (
                  <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium capitalize text-primary">
                    {rug.useCase}
                  </span>
                )}
              </div>

              <p className="mb-6 text-muted-foreground">{rug.description}</p>

              <div className="mb-6 space-y-4 rounded-lg bg-muted p-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="font-medium">Dimensions:</span>
                  <span>{rug.dimensions}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="font-medium">Materials:</span>
                  <span>{rug.materials}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="font-medium">Production Time:</span>
                  <span>{rug.productionTime}</span>
                </div>
              </div>

              <div className="mt-auto space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-medium">Price</span>
                  <span className="text-2xl font-bold">${rug.price}</span>
                </div>

                <div className="flex gap-4">
                  <Link href={`/order?rug=${rug.id}`} className="flex-1">
                    <Button className="w-full">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Order Similar
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
