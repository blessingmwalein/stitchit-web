"use client"

import { motion } from "framer-motion"

export default function PricingPage() {
  const pricingTiers = [
    {
      size: "Small",
      dimensions: "50x50cm",
      price: "$20",
      description: "Perfect for small spaces or accent pieces",
    },
    {
      size: "Medium",
      dimensions: "80x80cm or 60x100cm",
      price: "$35–$45",
      description: "Ideal for bedrooms and small living areas",
      featured: true,
    },
    {
      size: "Large",
      dimensions: "100x100cm+",
      price: "$50+",
      description: "Statement pieces for living rooms and open spaces",
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-12"
    >
      <h1 className="mb-8 text-center text-4xl font-bold tracking-tight">Pricing</h1>

      <div className="mx-auto max-w-4xl">
        <div className="mb-12 grid gap-8 md:grid-cols-3">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`rounded-2xl border p-8 shadow-sm transition-all duration-300 hover:shadow-md ${
                tier.featured ? "border-black bg-black text-white" : "border-gray-200 bg-white"
              }`}
            >
              <h3 className="mb-2 text-2xl font-bold">{tier.size}</h3>
              <p className="mb-4 text-sm opacity-80">{tier.dimensions}</p>
              <p className="mb-6 text-3xl font-bold">{tier.price}</p>
              <p className="text-sm opacity-80">{tier.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="rounded-xl bg-gray-50 p-6">
          <h3 className="mb-4 text-xl font-semibold">Additional Information</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="mt-1 block h-2 w-2 rounded-full bg-black"></span>
              <span>Prices may vary depending on design complexity</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 block h-2 w-2 rounded-full bg-black"></span>
              <span>Custom shapes and sizes are priced individually</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 block h-2 w-2 rounded-full bg-black"></span>
              <span>Delivery fees are calculated based on location</span>
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  )
}
