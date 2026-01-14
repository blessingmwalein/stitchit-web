'use client';

import Image from "next/image"
import { motion } from "framer-motion"
import { Sofa, Utensils, Bath, Bed, Car, TableProperties, Lamp, DoorOpen } from "lucide-react"

const useCases = [
  {
    icon: Sofa,
    title: "Living Rooms",
    description: "Transform your living space with statement rugs",
    image: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=600&q=80"
  },
  {
    icon: TableProperties,
    title: "Dining Areas",
    description: "Elegant rugs under dining tables for sophisticated meals",
    image: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=600&q=80"
  },
  {
    icon: Bed,
    title: "Bedrooms",
    description: "Soft, cozy rugs for ultimate bedroom comfort",
    image: "/home/bedroom.png"
  },
  {
    icon: Bath,
    title: "Bathrooms",
    description: "Plush, absorbent rugs for your bathroom",
    image: "/home/bathroom.png"
  },
  {
    icon: DoorOpen,
    title: "Entryways",
    description: "Welcome guests with stunning entrance rugs",
    image: "/home/entry.png"
  },
  {
    icon: Lamp,
    title: "Home Offices",
    description: "Professional rugs for your workspace at home",
    image: "/home/homeoff.png"
  },
  {
    icon: Car,
    title: "Car Interiors",
    description: "Custom car mats and interior rugs",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=80"
  },
  {
    icon: Utensils,
    title: "Restaurant & Cafes",
    description: "Create ambiance in dining establishments",
    image: "/home/restaurant.png"
  }
];

export function UseCasesSection() {
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
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              className="group relative overflow-hidden rounded-lg bg-white border border-border hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="relative h-50 overflow-hidden">
                <Image
                  src={useCase.image}
                  alt={useCase.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-2 text-white mb-1">
                    <useCase.icon className="w-5 h-5" />
                    <h3 className="font-semibold">{useCase.title}</h3>
                  </div>
                  <p className="text-white/80 text-xs">{useCase.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
