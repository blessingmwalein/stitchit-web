"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { useGroupedRugs, useFilterOptions } from "@/hooks/use-rugs"
import { Skeleton } from "@/components/ui/skeleton"

export default function UseCases() {
  const [activeTab, setActiveTab] = useState("bedroom")
  const { groupedProducts, groupedLoading, groupedError } = useGroupedRugs()
  const { filterOptions, filtersLoading } = useFilterOptions()

  // Get use cases from API with null check
  const useCases = filterOptions?.useCases 
    ? Object.entries(filterOptions.useCases).map(([key, value]) => ({
        id: key,
        title: value,
        description: getUseCaseDescription(key),
        image: getUseCaseImage(key),
      }))
    : []

  const activeUseCase = useCases.find((useCase) => useCase.id === activeTab)
  const activeGroupedProducts = groupedProducts?.[activeTab]?.products || []

  // Helper functions for use case descriptions and images
  function getUseCaseDescription(useCase: string): string {
    const descriptions: { [key: string]: string } = {
      bedroom: "Add warmth and comfort to your bedroom with our soft, plush rugs",
      living_room: "Make a statement in your living space with our eye-catching designs",
      bathroom: "Transform your bathroom with our water-resistant, non-slip rugs",
      office: "Add personality to your workspace with our durable, stylish rugs",
      car_mat: "Customize your vehicle with our premium, easy-to-clean car mats",
      wall_hanging: "Turn your walls into art with our decorative tufted wall hangings",
    }
    return descriptions[useCase] || "Explore our beautiful rugs for this space"
  }

  function getUseCaseImage(useCase: string): string {
    const images: { [key: string]: string } = {
      bedroom: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      living_room: "https://images.unsplash.com/photo-1616137422495-1e9e46e2aa77?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      bathroom: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      office: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      car_mat: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      wall_hanging: "https://images.unsplash.com/photo-1615529328331-f8917597711f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    }
    return images[useCase] || "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  }

  // Set initial tab when use cases are loaded
  useEffect(() => {
    if (useCases.length > 0 && !activeUseCase) {
      setActiveTab(useCases[0].id)
    }
  }, [useCases, activeUseCase])

  // Show loading state if filters are still loading
  if (filtersLoading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <Skeleton className="mx-auto mb-4 h-8 w-48" />
            <Skeleton className="mx-auto h-4 w-96" />
          </div>
          <div className="mx-auto max-w-5xl">
            <Skeleton className="mb-8 h-12 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </section>
    )
  }

  // Don't render if no use cases are available
  if (useCases.length === 0) {
    return null
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
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Use Cases</h2>
          <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
            Discover how our rugs can transform different spaces in your home
          </p>
        </motion.div>

        <Tabs defaultValue={useCases[0]?.id} value={activeTab} onValueChange={setActiveTab} className="mx-auto max-w-5xl">
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
                  
                  {groupedLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ) : activeGroupedProducts.length > 0 ? (
                    <div className="mb-6">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {activeGroupedProducts.length} products available
                      </p>
                    </div>
                  ) : null}
                  
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
