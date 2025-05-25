"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import GalleryFilters from "@/components/gallery/gallery-filters"
import GalleryGrid from "@/components/gallery/gallery-grid"
import RugModal from "@/components/gallery/rug-modal"
import type { Rug } from "@/types"

export default function GalleryPage() {
  const rugs = useSelector((state: RootState) => state.rugs.items)
  const [filteredRugs, setFilteredRugs] = useState<Rug[]>(rugs)
  const [selectedRug, setSelectedRug] = useState<Rug | null>(null)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-12"
    >
      <h1 className="mb-8 text-center text-4xl font-bold tracking-tight">Rug Gallery</h1>

      <GalleryFilters rugs={rugs} setFilteredRugs={setFilteredRugs} />

      <GalleryGrid rugs={filteredRugs} setSelectedRug={setSelectedRug} />

      {selectedRug && <RugModal rug={selectedRug} onClose={() => setSelectedRug(null)} />}
    </motion.div>
  )
}
