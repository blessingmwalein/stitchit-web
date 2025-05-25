"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default function UseCases() {
  const [activeTab, setActiveTab] = useState("bedroom")

  const useCases = [
    {
      id: "bedroom",
      title: "Bedroom",
      description: "Add warmth and comfort to your bedroom with our soft, plush rugs",
      image:
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: "livingroom",
      title: "Living Room",
      description: "Make a statement in your living space with our eye-catching designs",
      image:
        "https://images.unsplash.com/photo-1616137422495-1e9e46e2aa77?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: "bathroom",
      title: "Bathroom",
      description: "Transform your bathroom with our water-resistant, non-slip rugs",
      image:
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: "office",
      title: "Office",
      description: "Add personality to your workspace with our durable, stylish rugs",
      image:
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: "carmat",
      title: "Car Mat",
      description: "Customize your vehicle with our premium, easy-to-clean car mats",
      image:
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: "wall",
      title: "Wall Hanging",
      description: "Turn your walls into art with our decorative tufted wall hangings",
      image:
        "https://images.unsplash.com/photo-1615529328331-f8917597711f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    },
  ]

  const activeUseCase = useCases.find((useCase) => useCase.id === activeTab)

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
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Use Cases</h2>
          <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
            Discover how our rugs can transform different spaces in your home
          </p>
        </motion.div>

        <Tabs defaultValue="bedroom" value={activeTab} onValueChange={setActiveTab} className="mx-auto max-w-5xl">
          <TabsList className="mb-8 grid w-full grid-cols-3 md:grid-cols-6">
            {useCases.map((useCase) => (
              <TabsTrigger key={useCase.id} value={useCase.id}>
                {useCase.title}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="relative min-h-[400px] overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="grid md:grid-cols-2"
              >
                <div className="order-2 flex flex-col justify-center p-8 md:order-1">
                  <h3 className="mb-4 text-2xl font-bold">{activeUseCase?.title}</h3>
                  <p className="mb-6 text-gray-600 dark:text-gray-400">{activeUseCase?.description}</p>
                  <Link href={`/gallery?useCase=${activeTab}`}>
                    <Button className="w-fit">Explore {activeUseCase?.title} Rugs</Button>
                  </Link>
                </div>

                <div className="order-1 md:order-2">
                  <img
                    src={activeUseCase?.image || "/placeholder.svg"}
                    alt={activeUseCase?.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Tabs>
      </div>
    </section>
  )
}
