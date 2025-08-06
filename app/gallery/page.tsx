"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useSearchParams } from "next/navigation"
import { useRugs, useFilterOptions } from "@/hooks/use-rugs"
import GalleryFilters from "@/components/gallery/gallery-filters"
import GalleryGrid from "@/components/gallery/gallery-grid"
import RugModal from "@/components/gallery/rug-modal"
import { ProductGridSkeleton } from "@/components/ui/product-skeleton"
import type { Rug } from "@/types"

export default function GalleryPage() {
  const searchParams = useSearchParams()
  const { items, loading, error, fetchProducts } = useRugs()
  const { filterOptions, filtersLoading } = useFilterOptions()
  const [filteredRugs, setFilteredRugs] = useState<Rug[]>([])
  const [selectedRug, setSelectedRug] = useState<Rug | null>(null)

  // Get initial filter from URL params
  const initialUseCase = searchParams.get('useCase')

  useEffect(() => {
    // Fetch products with initial filter
    const params: any = { page: 1 }
    if (initialUseCase && initialUseCase !== 'all') {
      params.use_case = initialUseCase
    }
    fetchProducts(params)
  }, [initialUseCase])

  useEffect(() => {
    // Update filtered rugs when items change
    setFilteredRugs(items)
  }, [items])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-12"
    >
      <h1 className="mb-8 text-center text-4xl font-bold tracking-tight">Rug Gallery</h1>

      {!loading && !error && (
        <GalleryFilters 
          rugs={items} 
          setFilteredRugs={setFilteredRugs}
          filterOptions={filterOptions}
          filtersLoading={filtersLoading}
        />
      )}

      {loading ? (
        <ProductGridSkeleton count={12} />
      ) : error ? (
        <div className="flex w-full items-center justify-center py-12">
          <div className="text-center">
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">Failed to load gallery</p>
            <p className="text-gray-500 dark:text-gray-400">{error}</p>
          </div>
        </div>
      ) : (
        <GalleryGrid rugs={filteredRugs} setSelectedRug={setSelectedRug} />
      )}

      {selectedRug && <RugModal rug={selectedRug} onClose={() => setSelectedRug(null)} />}
    </motion.div>
  )
}
