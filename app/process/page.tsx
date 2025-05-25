"use client"

import { motion } from "framer-motion"
import { CheckCircle, Package, Truck, Palette, CreditCard } from "lucide-react"

export default function ProcessPage() {
  const steps = [
    {
      title: "Submit Order",
      description: "Choose your design, size, and preferences",
      icon: <CreditCard className="h-12 w-12" />,
    },
    {
      title: "Confirm Design & Payment",
      description: "Review your order and complete payment",
      icon: <CheckCircle className="h-12 w-12" />,
    },
    {
      title: "Rug Production",
      description: "2–5 days depending on size and complexity",
      icon: <Palette className="h-12 w-12" />,
    },
    {
      title: "Quality Check & Packaging",
      description: "Thorough inspection and secure packaging",
      icon: <Package className="h-12 w-12" />,
    },
    {
      title: "Delivery",
      description: "Safe delivery to your doorstep",
      icon: <Truck className="h-12 w-12" />,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-12"
    >
      <h1 className="mb-12 text-center text-4xl font-bold tracking-tight">Our Process</h1>

      <div className="mx-auto max-w-4xl">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
            className="relative mb-16 flex items-start gap-8 last:mb-0"
          >
            {index < steps.length - 1 && (
              <div className="absolute left-6 top-16 h-[calc(100%-2rem)] w-0.5 bg-gray-200" />
            )}

            <div className="relative z-10 rounded-full bg-white p-2">{step.icon}</div>

            <div className="flex-1">
              <h3 className="mb-2 text-2xl font-semibold">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">
              {index + 1}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
