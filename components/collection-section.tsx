"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { productsApi, type FeaturedProduct } from "@/lib/api/products"
import { ProductDetailModal } from "@/components/product-detail-modal"

function formatShape(shape?: string | null) {
  if (!shape) return null
  return shape.charAt(0) + shape.slice(1).toLowerCase()
}

export function CollectionSection() {
  const [products, setProducts] = useState<FeaturedProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<FeaturedProduct | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    productsApi
      .getFeaturedProducts(6)
      .then((data) => setProducts(data))
      .finally(() => setLoading(false))
  }, [])

  if (!loading && products.length === 0) return null

  return (
    <section className="container mx-auto px-6 py-16">
      <ProductDetailModal
        product={selected}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
        <div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-[#2c2420]">
            Explore Our Proudly
            <br />
            <span className="italic font-serif">Collection</span>
          </h2>
        </div>
        <div className="mt-6 md:mt-0 flex items-center gap-4">
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 bg-[#2c2420] text-white px-5 py-2.5 rounded-full text-sm hover:bg-[#3d332d] transition-colors"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-[#8a7a72] text-xs max-w-[200px] hidden lg:block">
            Explore the rugs Stitch&apos;t has already completed for our clients — real work, real craftsmanship.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[280px] rounded-2xl bg-[#eae5df] animate-pulse" />
            ))
          : products.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  setSelected(product)
                  setModalOpen(true)
                }}
                className="group relative h-[280px] rounded-2xl overflow-hidden cursor-pointer"
              >
                {product.primaryImage ? (
                  <Image
                    src={product.primaryImage}
                    alt={`${product.name} tufted rug`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[#eae5df]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-white text-lg font-light block truncate">{product.name}</span>
                    <span className="text-white/80 text-xs">
                      {[
                        product.widthCm && product.heightCm ? `${product.widthCm}×${product.heightCm} cm` : null,
                        formatShape(product.shape),
                        product.price ? `$${product.price}` : null,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  </div>
                  <button className="bg-white/20 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            ))}
      </div>
    </section>
  )
}
