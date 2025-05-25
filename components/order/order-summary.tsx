"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ShoppingBag, Clock, Truck } from "lucide-react"

export default function OrderSummary() {
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 200)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`rounded-xl border bg-card p-6 shadow-sm transition-all duration-300 ${
        isSticky ? "lg:sticky lg:top-24" : ""
      }`}
    >
      <h3 className="mb-6 text-lg font-semibold">Order Summary</h3>

      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-primary/10 p-2 text-primary">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-medium">Custom Rug</h4>
            <p className="text-sm text-muted-foreground">Handcrafted to your specifications</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="rounded-full bg-primary/10 p-2 text-primary">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-medium">Production Time</h4>
            <p className="text-sm text-muted-foreground">2-5 days depending on size and complexity</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="rounded-full bg-primary/10 p-2 text-primary">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-medium">Delivery</h4>
            <p className="text-sm text-muted-foreground">Safe delivery to your doorstep</p>
          </div>
        </div>

        <div className="rounded-md bg-muted p-4 text-sm">
          <p className="mb-2 font-medium">Why choose our rugs?</p>
          <ul className="space-y-1 text-muted-foreground">
            <li>• Handcrafted with premium materials</li>
            <li>• Customized to your exact specifications</li>
            <li>• Durable and long-lasting</li>
            <li>• Made with care in Zimbabwe</li>
          </ul>
        </div>
      </div>
    </motion.div>
  )
}
