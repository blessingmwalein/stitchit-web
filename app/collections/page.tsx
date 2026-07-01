'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Eye, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProducts, setFilters } from '@/store/slices/productsSlice';
import { ProductDetailModal } from '@/components/product-detail-modal';
import { FinishedProduct } from '@/lib/api/products';

const STATUS_FILTERS = [
  { label: 'All', value: '' },
  { label: 'Available', value: 'AVAILABLE' },
  { label: 'Reserved', value: 'RESERVED' },
  { label: 'Sold', value: 'SOLD' },
];

function formatStatus(status: string): string {
  return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function getStatusColor(status: string): string {
  const s = status.toUpperCase();
  if (s === 'AVAILABLE' || s === 'IN_STOCK') return 'bg-green-500 text-white';
  if (s === 'SOLD' || s === 'OUT_OF_STOCK') return 'bg-red-500 text-white';
  if (s === 'RESERVED') return 'bg-yellow-500 text-white';
  return 'bg-gray-500 text-white';
}

export default function CollectionsPage() {
  const dispatch = useAppDispatch();
  const { products, loading, pagination, filters } = useAppSelector((state) => state.products);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<FinishedProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setFilters({ search: searchQuery || undefined, page: 1 }));
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

  const currentPage = pagination?.page ?? 1;
  const totalPages = pagination?.totalPages ?? 1;

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
              Our <span className="text-[var(--orange)] italic font-serif">Gallery</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Browse our handcrafted tufted rugs — order the same style or use one as your starting point
            </p>
          </motion.div>

          {/* Filters */}
          <div className="mb-8 space-y-4">
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search rugs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-full"
                />
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {STATUS_FILTERS.map((filter) => (
                <Button
                  key={filter.value}
                  onClick={() => handleStatusFilter(filter.value)}
                  variant={selectedStatus === filter.value ? 'default' : 'outline'}
                  className={`rounded-full ${selectedStatus === filter.value ? 'bg-[var(--orange)] hover:bg-[var(--orange-dark)]' : ''}`}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>

          {pagination && !loading && (
            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground">
                Showing {products.length} of {pagination.total} rugs
              </p>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 aspect-square rounded-xl mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                  <div className="h-8 bg-gray-200 rounded w-full mt-4" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Rugs Found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your filters or search</p>
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedStatus('');
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.07 }}
                    className="group bg-white rounded-xl overflow-hidden border border-border hover:shadow-xl transition-all"
                  >
                    <div
                      className="relative h-72 overflow-hidden cursor-pointer bg-gray-100"
                      onClick={() => { setSelectedProduct(product); setIsModalOpen(true); }}
                    >
                      {product.primaryImage ? (
                        <Image
                          src={product.primaryImage}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Package className="w-16 h-16 text-gray-200" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      <div className="absolute top-4 left-4">
                        <Badge className={`${getStatusColor(product.status)} border-transparent`}>
                          {formatStatus(product.status)}
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
                        onClick={() => { setSelectedProduct(product); setIsModalOpen(true); }}
                      >
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {product.description || 'Custom handcrafted tufted rug'}
                      </p>
                      <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground">
                        {product.widthCm && product.heightCm ? (
                          <span>{product.widthCm} × {product.heightCm} cm</span>
                        ) : (
                          <span>Custom size</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          onClick={() => { setSelectedProduct(product); setIsModalOpen(true); }}
                          size="sm"
                          variant="outline"
                          className="flex-1 rounded-full"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button
                          asChild
                          size="sm"
                          className="flex-1 bg-[var(--orange)] hover:bg-[var(--orange-dark)] text-white rounded-full"
                        >
                          <Link
                            href={`/order?from=${product.id}&name=${encodeURIComponent(product.name)}${product.widthCm ? `&widthCm=${product.widthCm}` : ''}${product.heightCm ? `&heightCm=${product.heightCm}` : ''}`}
                          >
                            Order This Style
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="rounded-full"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <Button
                            key={page}
                            variant={page === currentPage ? 'default' : 'outline'}
                            size="icon"
                            onClick={() => handlePageChange(page)}
                            className={`rounded-full ${page === currentPage ? 'bg-[var(--orange)] hover:bg-[var(--orange-dark)]' : ''}`}
                          >
                            {page}
                          </Button>
                        );
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return <span key={page} className="px-2 self-center text-muted-foreground">…</span>;
                      }
                      return null;
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="rounded-full"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </>
          )}

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 text-center bg-white rounded-2xl p-12 border border-border"
          >
            <h2 className="text-3xl md:text-4xl font-light text-[#2c2420] mb-4">
              Have something specific in mind?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Design your rug from scratch with our creative order builder
            </p>
            <Button asChild size="lg" className="bg-[var(--orange)] hover:bg-[var(--orange-dark)] text-white rounded-full">
              <Link href="/order">Design Your Own Rug</Link>
            </Button>
          </motion.div>
        </div>
      </main>

      <Footer />

      <ProductDetailModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
