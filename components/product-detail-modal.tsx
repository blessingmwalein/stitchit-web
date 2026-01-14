'use client';

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Package, Ruler, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FinishedProduct } from "@/lib/api/products";

interface ProductDetailModalProps {
    product: FinishedProduct | null;
    isOpen: boolean;
    onClose: () => void;
}

export function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    if (!product) return null;

    // Fix image URLs (remove duplicate /storage/ prefix)
    const fixImageUrl = (url: string) => {
        if (!url) return '';
        // Remove duplicate /storage/ prefixes and http://127.0.0.1 duplicates
        return url.replace(/\/storage\/(http:\/\/127\.0\.0\.1)?\/storage\//g, '/storage/')
            .replace(/http:\/\/127\.0\.0\.1\/storage\//g, 'http://127.0.0.1/storage/');
    };

    const allImages = [product.primary_image, ...product.images].filter(Boolean).map(fixImageUrl);

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    };

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case 'IN_STOCK': return 'bg-green-500 text-white';
            case 'OUT_OF_STOCK': return 'bg-red-500 text-white';
            case 'RESERVED': return 'bg-yellow-500 text-white';
            default: return 'bg-gray-500 text-white';
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-4 md:inset-10 lg:inset-20 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-gray-50 to-white">
                            <div>
                                <h2 className="text-2xl font-semibold text-[#2c2420]">{product.product_name}</h2>
                                <p className="text-sm text-muted-foreground mt-1">{product.reference}</p>
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
                                    {/* Main Image */}
                                    <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden group">
                                        <Image
                                            src={allImages[currentImageIndex] || '/placeholder.png'}
                                            alt={product.product_name}
                                            fill
                                            className="object-cover"
                                        />
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
                                            </>
                                        )}
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                            {allImages.map((_, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setCurrentImageIndex(idx)}
                                                    className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Thumbnail Grid */}
                                    {allImages.length > 1 && (
                                        <div className="grid grid-cols-4 gap-2">
                                            {allImages.slice(0, 4).map((img, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setCurrentImageIndex(idx)}
                                                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${idx === currentImageIndex ? 'border-[var(--orange)]' : 'border-transparent'
                                                        }`}
                                                >
                                                    <Image
                                                        src={img || '/placeholder.png'}
                                                        alt={`View ${idx + 1}`}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Product Details */}
                                <div className="space-y-6">
                                    {/* Status & Quality */}
                                    <div className="flex gap-3">
                                        <Badge className={`${getStatusColor(product.status)} border-transparent`}>
                                            {product.status_label}
                                        </Badge>
                                        {product.quality_status === 'PASSED' && (
                                            <Badge className="bg-blue-500 text-white border-transparent flex items-center gap-1">
                                                <CheckCircle className="w-3 h-3" />
                                                Quality Passed
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">Description</h3>
                                        <p className="text-gray-700">{product.description || 'No description available'}</p>
                                    </div>

                                    <Separator />

                                    {/* Dimensions */}
                                    <div className="bg-gradient-to-br from-[var(--orange)]/5 to-[var(--orange)]/10 p-4 rounded-lg border border-[var(--orange)]/20">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Ruler className="w-5 h-5 text-[var(--orange)]" />
                                            <h3 className="font-semibold">Dimensions</h3>
                                        </div>
                                        <p className="text-2xl font-serif text-[var(--orange)]">
                                            {product.dimensions !== 'N/A' ? product.dimensions : 'Custom Size'}
                                        </p>
                                        {product.length && product.width && (
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {Number(product.length).toFixed(0)} × {Number(product.width).toFixed(0)} {product.unit}
                                            </p>
                                        )}
                                    </div>

                                    {/* Order Reference */}
                                    {product.order_reference && (
                                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                            <h3 className="text-sm font-semibold text-gray-600 uppercase mb-1">Original Order</h3>
                                            <p className="text-blue-700 font-medium">{product.order_reference}</p>
                                        </div>
                                    )}

                                    {/* Published Date */}
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-600 uppercase mb-1">Published</h3>
                                        <p className="text-gray-700">{new Date(product.published_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}</p>
                                    </div>

                                    {/* Notes */}
                                    {product.notes && (
                                        <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                                            <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">Notes</h3>
                                            <p className="text-gray-700 text-sm whitespace-pre-wrap">{product.notes}</p>
                                        </div>
                                    )}

                                    {/* CTA */}
                                    <div className="pt-4">
                                        <Button className="w-full bg-[var(--orange)] hover:bg-[var(--orange-dark)] text-white rounded-full h-12 text-lg">
                                            <Package className="w-5 h-5 mr-2" />
                                            Request This Design
                                        </Button>
                                        <p className="text-xs text-center text-muted-foreground mt-2">
                                            Contact us to order this exact design or customize it
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
