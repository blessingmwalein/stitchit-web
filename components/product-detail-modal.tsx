'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Package, Ruler } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FinishedProduct } from '@/lib/api/products';

interface ProductDetailModalProps {
  product: FinishedProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

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

export function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!product) return null;

  const allImages = [product.primaryImage, ...(product.images ?? [])].filter(Boolean) as string[];

  const nextImage = () => setCurrentImageIndex((i) => (i + 1) % allImages.length);
  const prevImage = () => setCurrentImageIndex((i) => (i - 1 + allImages.length) % allImages.length);

  const handleOrderThisStyle = () => {
    onClose();
    const params = new URLSearchParams({
      from: product.id,
      name: product.name,
    });
    if (product.widthCm) params.set('widthCm', String(product.widthCm));
    if (product.heightCm) params.set('heightCm', String(product.heightCm));
    router.push(`/order?${params.toString()}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-4 md:inset-10 lg:inset-16 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-gray-50 to-white">
              <div>
                <h2 className="text-2xl font-semibold text-[#2c2420]">{product.name}</h2>
                {product.publishedAt && (
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {new Date(product.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                    })}
                  </p>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
                {/* Image Gallery */}
                <div className="space-y-4">
                  <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden group">
                    {allImages.length > 0 ? (
                      <Image
                        src={allImages[currentImageIndex]}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Package className="w-16 h-16 text-gray-200" />
                      </div>
                    )}

                    {allImages.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                          {allImages.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentImageIndex(idx)}
                              className={`h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/50 w-2'}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {allImages.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {allImages.slice(0, 4).map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${idx === currentImageIndex ? 'border-[var(--orange)]' : 'border-transparent'}`}
                        >
                          <Image src={img} alt={`View ${idx + 1}`} fill className="object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-6">
                  <div>
                    <Badge className={`${getStatusColor(product.status)} border-transparent`}>
                      {formatStatus(product.status)}
                    </Badge>
                  </div>

                  {product.description && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Description</h3>
                      <p className="text-gray-700">{product.description}</p>
                    </div>
                  )}

                  <Separator />

                  {/* Dimensions */}
                  <div className="bg-gradient-to-br from-[var(--orange)]/5 to-[var(--orange)]/10 p-4 rounded-xl border border-[var(--orange)]/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Ruler className="w-5 h-5 text-[var(--orange)]" />
                      <h3 className="font-semibold text-[#2c2420]">Dimensions</h3>
                    </div>
                    {product.widthCm && product.heightCm ? (
                      <p className="text-2xl font-serif text-[var(--orange)]">
                        {product.widthCm} × {product.heightCm} cm
                      </p>
                    ) : (
                      <p className="text-lg text-muted-foreground">Custom size</p>
                    )}
                  </div>

                  {/* Notes */}
                  {product.notes && (
                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Notes</h3>
                      <p className="text-gray-700 text-sm whitespace-pre-wrap">{product.notes}</p>
                    </div>
                  )}

                  {/* CTA */}
                  <div className="pt-2 space-y-3">
                    <Button
                      onClick={handleOrderThisStyle}
                      className="w-full bg-[var(--orange)] hover:bg-[var(--orange-dark)] text-white rounded-full h-12 text-base"
                    >
                      <Package className="w-5 h-5 mr-2" />
                      Order This Style
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      We'll use this as the starting point for your custom order
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
