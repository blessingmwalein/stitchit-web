'use client';

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative pt-20">
      <div className="container mx-auto px-6 py-8">
        <div className="relative h-[75vh] min-h-[600px] rounded-2xl overflow-hidden">
          <Image
            src="/ours/backdrop.jpg"
            alt="Custom tufted rugs handcrafted in Zimbabwe"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 text-[var(--orange)] text-sm mb-4 tracking-widest uppercase font-semibold">
                <Sparkles className="w-4 h-4" />
                Proudly Made in Zimbabwe
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-white italic font-serif tracking-wide">
                Custom Tufted Rugs
              </h1>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-white mt-2">
                With Our Own Style
              </h2>
              <p className="mt-6 max-w-2xl text-white/90 text-base md:text-lg leading-relaxed">
                We create premium custom tufted rugs right here in Zimbabwe. Perfect for homes, corporate offices, hotels, schools, and more. 
                Each rug is handcrafted with precision and passion.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <Button asChild size="lg" className="bg-[var(--orange)] hover:bg-[var(--orange-dark)] text-white">
                  <Link href="/order" className="inline-flex items-center gap-2">
                    Order Your Rug
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20">
                  <Link href="/design">
                    Design Your Own
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
