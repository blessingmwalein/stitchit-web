"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Rug } from "@/types"

interface GalleryFiltersProps {
  rugs: Rug[]
  setFilteredRugs: (rugs: Rug[]) => void
}

export default function GalleryFilters({ rugs, setFilteredRugs }: GalleryFiltersProps) {
  const [filters, setFilters] = useState({
    size: "",
    type: "",
    useCase: "",
    search: "",
  })

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    applyFilters(newFilters)
  }

  const applyFilters = (currentFilters = filters) => {
    let filtered = [...rugs]

    if (currentFilters.size) {
      filtered = filtered.filter((rug) => rug.size === currentFilters.size)
    }

    if (currentFilters.type) {
      filtered = filtered.filter((rug) => rug.type === currentFilters.type)
    }

    if (currentFilters.useCase) {
      filtered = filtered.filter((rug) => rug.useCase === currentFilters.useCase)
    }

    if (currentFilters.search) {
      const searchTerm = currentFilters.search.toLowerCase()
      filtered = filtered.filter(
        (rug) => rug.name.toLowerCase().includes(searchTerm) || rug.description.toLowerCase().includes(searchTerm),
      )
    }

    setFilteredRugs(filtered)
  }

  const resetFilters = () => {
    setFilters({
      size: "",
      type: "",
      useCase: "",
      search: "",
    })
    setFilteredRugs(rugs)
  }

  return (
    <div className="mb-8 rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <div>
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search rugs..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="size">Size</Label>
          <Select value={filters.size} onValueChange={(value) => handleFilterChange("size", value)}>
            <SelectTrigger id="size">
              <SelectValue placeholder="All sizes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sizes</SelectItem>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="type">Type</Label>
          <Select value={filters.type} onValueChange={(value) => handleFilterChange("type", value)}>
            <SelectTrigger id="type">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="circle">Circle</SelectItem>
              <SelectItem value="rectangle">Rectangle</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="useCase">Use Case</Label>
          <Select value={filters.useCase} onValueChange={(value) => handleFilterChange("useCase", value)}>
            <SelectTrigger id="useCase">
              <SelectValue placeholder="All use cases" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All use cases</SelectItem>
              <SelectItem value="bedroom">Bedroom</SelectItem>
              <SelectItem value="livingroom">Living Room</SelectItem>
              <SelectItem value="bathroom">Bathroom</SelectItem>
              <SelectItem value="office">Office</SelectItem>
              <SelectItem value="carmat">Car Mat</SelectItem>
              <SelectItem value="wall">Wall Hanging</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" onClick={resetFilters}>
          Reset Filters
        </Button>
      </div>
    </div>
  )
}
