'use client';

import Image from "next/image"
import { motion } from "framer-motion"
import { Building2, Home, School, Hotel, ShoppingBag, Plus, ArrowUpRight } from "lucide-react"

export function RugTypesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-light text-[#2c2420] mb-4">
            Rugs for <span className="text-[var(--orange)] italic font-serif">Every Space</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            From corporate offices to cozy homes, we create custom tufted rugs for any environment
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-auto lg:h-[500px]">
          {/* Large left card - Corporate Offices */}
          <div className="relative rounded-2xl overflow-hidden h-[300px] lg:h-full lg:row-span-2">
            <Image
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
              alt="Corporate Offices"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm p-3 rounded-lg">
              <Building2 className="w-6 h-6 text-[var(--orange)]" />
            </div>
            <div className="absolute bottom-6 left-6">
              <span className="text-xs text-white/70 tracking-widest uppercase">Professional</span>
              <h3 className="text-2xl md:text-3xl font-light text-white mt-2">
                Corporate
                <br />
                Offices
              </h3>
              <p className="text-white/80 text-sm mt-2 max-w-xs">
                Professional rugs that elevate your workspace with style and comfort
              </p>
            </div>
          </div>

          {/* Top right card - Homes */}
          <div className="relative rounded-2xl overflow-hidden h-[200px] lg:h-auto bg-[#e8e4df] lg:col-span-2">
            <Image
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80"
              alt="Homes"
              fill
              className="object-cover opacity-30"
            />
            <div className="absolute inset-0 flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg">
                  <Home className="w-6 h-6 text-[var(--orange)]" />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-light text-[#2c2420]">Homes</h3>
                  <p className="text-[#5a4a42] text-sm max-w-[300px]">
                    Cozy, personalized rugs that make your house feel like home
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom left middle card - Schools */}
          <div className="relative rounded-2xl overflow-hidden h-[250px] lg:h-auto">
            <Image
              src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80"
              alt="Schools"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg">
              <School className="w-5 h-5 text-[var(--orange)]" />
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <h4 className="text-white font-semibold mb-1">Schools</h4>
              <p className="text-white/90 text-xs">Durable and vibrant rugs perfect for educational spaces</p>
            </div>
          </div>

          {/* Bottom middle card - Hotels & Hospitality */}
          <div className="relative rounded-2xl overflow-hidden h-[250px] lg:h-auto">
            <Image
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80"
              alt="Hotels & Hospitality"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg">
              <Hotel className="w-5 h-5 text-[var(--orange)]" />
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <h4 className="text-white font-semibold mb-1">Hotels & Hospitality</h4>
              <p className="text-white/90 text-xs">Luxury rugs that create memorable guest experiences</p>
            </div>
          </div>

          {/* Bottom right small cards container */}
          <div className="grid grid-rows-2 gap-4 h-[250px] lg:h-auto">
            {/* Retail Spaces */}
            <div className="relative rounded-2xl overflow-hidden bg-[#d4c4b5]">
              <Image
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80"
                alt="Retail Spaces"
                fill
                className="object-cover opacity-40"
              />
              <div className="absolute inset-0 p-4 flex flex-col justify-between">
                <div className="bg-white/90 backdrop-blur-sm p-2 rounded-lg w-fit">
                  <ShoppingBag className="w-4 h-4 text-[var(--orange)]" />
                </div>
                <div>
                  <h4 className="text-[#2c2420] font-semibold text-sm mb-0.5">Retail Spaces</h4>
                  <p className="text-[#5a4a42] text-xs">Eye-catching rugs that enhance your store's ambiance</p>
                </div>
              </div>
            </div>

            {/* And More */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[var(--orange)]/20 to-[var(--orange)]/10">
              <div className="absolute inset-0 p-4 flex flex-col justify-between">
                <div className="bg-white/90 backdrop-blur-sm p-2 rounded-lg w-fit">
                  <Plus className="w-4 h-4 text-[var(--orange)]" />
                </div>
                <div>
                  <h4 className="text-[#2c2420] font-semibold text-sm mb-0.5">And More</h4>
                  <p className="text-[#5a4a42] text-xs">Custom solutions for any space you can imagine</p>
                </div>
                <button className="absolute bottom-3 right-3 bg-white rounded-full p-2 hover:bg-white/90 transition-colors">
                  <ArrowUpRight className="w-4 h-4 text-[#2c2420]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
