'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Eye, ChevronLeft, ChevronRight, Package } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProducts, setFilters } from "@/store/slices/productsSlice";
import { ProductDetailModal } from "@/components/product-detail-modal";
import { FinishedProduct } from "@/lib/api/products";

const statusFilters = [
  { label: "All", value: "" },
  { label: "In Stock", value: "IN_STOCK" },
  { label: "Reserved", value: "RESERVED" },
  { label: "Out of Stock", value: "OUT_OF_STOCK" },
];

export default function CollectionsPage() {
  const dispatch = useAppDispatch();
  const { products, loading, pagination, filters } = useAppSelector((state) => state.products);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<FinishedProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch products on mount and when filters change
  useEffect(() => {
    dispatch(fetchProducts(filters));
  }, [dispatch, filters]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setFilters({ search: searchQuery, page: 1 }));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, dispatch]);

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    dispatch(setFilters({ status: status || undefined, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    dispatch(setFilters({ page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openProductModal = (product: FinishedProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'IN_STOCK': return 'bg-green-500 text-white';
      case 'OUT_OF_STOCK': return 'bg-red-500 text-white';
      case 'RESERVED': return 'bg-yellow-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  // Fix image URLs
  const fixImageUrl = (url: string) => {
    if (!url) return '/placeholder.png';

    // Handle malformed URLs like "/storage/https://admin.stitchit.co.zw/storage/..."
    // Extract the full URL if it's embedded
    const httpsMatch = url.match(/https:\/\/[^\s]+/);
    if (httpsMatch) {
      return httpsMatch[0];
    }

    // Handle relative paths that might have duplicate /storage/
    const cleanUrl = url.replace(/^\/storage\//, '');

    // If it's already a full URL, return it
    if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
      return cleanUrl;
    }

    // Otherwise, assume it's a relative path and prepend the storage URL
    return `http://127.0.0.1/storage/${cleanUrl}`;
  };

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-light text-[#2c2420] mb-4">
              Our <span className="text-[var(--orange)] italic font-serif">Collections</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Browse our curated collection of handcrafted tufted rugs
            </p>
          </motion.div>

          {/* Filters */}
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-full"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex flex-wrap justify-center gap-3">
              {statusFilters.map((filter) => (
                <Button
                  key={filter.value}
                  onClick={() => handleStatusFilter(filter.value)}
                  variant={selectedStatus === filter.value ? "default" : "outline"}
                  className={`rounded-full ${selectedStatus === filter.value ? "bg-[var(--orange)] hover:bg-[var(--orange-dark)]" : ""}`}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          {pagination && !loading && (
            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground">
                Showing {products.length} of {pagination.total} products
              </p>
            </div>
          )}

          {/* Loading Skeleton */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 aspect-square rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters or search query
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedStatus("");
                  dispatch(setFilters({ search: undefined, status: undefined, page: 1 }));
                }}
                variant="outline"
                className="rounded-full"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group bg-white rounded-xl overflow-hidden border border-border hover:shadow-xl transition-all"
                  >
                    <div
                      className="relative h-80 overflow-hidden cursor-pointer"
                      onClick={() => openProductModal(product)}
                    >
                      <Image
                        src={fixImageUrl(product.primary_image)}
                        alt={product.product_name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      <div className="absolute top-4 left-4">
                        <Badge className={`${getStatusColor(product.status)} border-transparent`}>
                          {product.status_label}
                        </Badge>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-semibold text-[#2c2420] flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          View Details
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3
                        className="text-xl font-semibold text-foreground mb-2 group-hover:text-[var(--orange)] transition-colors cursor-pointer"
                        onClick={() => openProductModal(product)}
                      >
                        {product.product_name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {product.description || 'Custom handcrafted rug'}
                      </p>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs text-muted-foreground">
                          {product.dimensions !== 'N/A' ? product.dimensions : 'Custom Size'}
                        </span>
                        {product.order_reference && (
                          <>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-blue-600 font-medium">
                              {product.order_reference}
                            </span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {product.reference}
                        </span>
                        <Button
                          onClick={() => openProductModal(product)}
                          size="sm"
                          className="bg-[var(--orange)] hover:bg-[var(--orange-dark)] text-white rounded-full"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.last_page > 1 && (
                <div className="mt-12 flex justify-center items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(pagination.current_page - 1)}
                    disabled={pagination.current_page === 1}
                    className="rounded-full"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  <div className="flex gap-2">
                    {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => {
                      // Show first, last, current, and adjacent pages
                      if (
                        page === 1 ||
                        page === pagination.last_page ||
                        (page >= pagination.current_page - 1 && page <= pagination.current_page + 1)
                      ) {
                        return (
                          <Button
                            key={page}
                            variant={page === pagination.current_page ? "default" : "outline"}
                            size="icon"
                            onClick={() => handlePageChange(page)}
                            className={`rounded-full ${page === pagination.current_page ? "bg-[var(--orange)] hover:bg-[var(--orange-dark)]" : ""}`}
                          >
                            {page}
                          </Button>
                        );
                      } else if (
                        page === pagination.current_page - 2 ||
                        page === pagination.current_page + 2
                      ) {
                        return <span key={page} className="px-2">...</span>;
                      }
                      return null;
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(pagination.current_page + 1)}
                    disabled={pagination.current_page === pagination.last_page}
                    className="rounded-full"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </>
          )}

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 text-center bg-white rounded-2xl p-12 border border-border"
          >
            <h2 className="text-3xl md:text-4xl font-light text-[#2c2420] mb-4">
              Don't see what you're looking for?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Create your own custom rug with our quick order form
            </p>
            <Button asChild size="lg" className="bg-[var(--orange)] hover:bg-[var(--orange-dark)] text-white rounded-full">
              <Link href="/order">Quick Order Request</Link>
            </Button>
          </motion.div>
        </div>
      </main>

      <Footer />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
