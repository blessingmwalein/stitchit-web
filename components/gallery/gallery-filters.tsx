"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import type { Rug } from "@/types"

interface FilterOptions {
  useCases: { [key: string]: string }
  sizes: { [key: string]: string }
  types: { [key: string]: string }
}

interface GalleryFiltersProps {
  rugs: Rug[]
  setFilteredRugs: (rugs: Rug[]) => void
  filterOptions: FilterOptions
  filtersLoading: boolean
}

export default function GalleryFilters({ 
  rugs, 
  setFilteredRugs, 
  filterOptions, 
  filtersLoading 
}: GalleryFiltersProps) {
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

    if (currentFilters.size && currentFilters.size !== "all") {
      filtered = filtered.filter((rug) => rug.size === currentFilters.size)
    }

    if (currentFilters.type && currentFilters.type !== "all") {
      filtered = filtered.filter((rug) => rug.type === currentFilters.type)
    }

    if (currentFilters.useCase && currentFilters.useCase !== "all") {
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

  // Update filtered rugs when rugs change
  useEffect(() => {
    applyFilters()
  }, [rugs])

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
          {filtersLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select value={filters.size} onValueChange={(value) => handleFilterChange("size", value)}>
              <SelectTrigger id="size">
                <SelectValue placeholder="All sizes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sizes</SelectItem>
                {Object.entries(filterOptions.sizes).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div>
          <Label htmlFor="type">Type</Label>
          {filtersLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select value={filters.type} onValueChange={(value) => handleFilterChange("type", value)}>
              <SelectTrigger id="type">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {Object.entries(filterOptions.types).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div>
          <Label htmlFor="useCase">Use Case</Label>
          {filtersLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select value={filters.useCase} onValueChange={(value) => handleFilterChange("useCase", value)}>
              <SelectTrigger id="useCase">
                <SelectValue placeholder="All use cases" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All use cases</SelectItem>
                {Object.entries(filterOptions.useCases).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
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
