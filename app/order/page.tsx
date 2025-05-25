"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import OrderForm from "@/components/order/order-form"
import OrderSummary from "@/components/order/order-summary"

export default function OrderPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-12"
    >
      <h1 className="mb-8 text-center text-4xl font-bold tracking-tight">Create Your Custom Rug</h1>

      <div className="mb-10 flex justify-center">
        <div className="flex w-full max-w-3xl items-center">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div key={index} className="flex flex-1 items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  index + 1 <= currentStep ? "bg-black text-white" : "border border-gray-300 bg-white text-gray-400"
                }`}
              >
                {index + 1}
              </div>
              {index < totalSteps - 1 && (
                <div className={`h-1 flex-1 ${index + 1 < currentStep ? "bg-black" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <OrderForm currentStep={currentStep} setCurrentStep={setCurrentStep} />
        </div>
        <div className="md:col-span-1">
          <OrderSummary />
        </div>
      </div>
    </motion.div>
  )
}
