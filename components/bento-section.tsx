import Image from "next/image"
import { ArrowUpRight, Building2, Home, Car } from "lucide-react"

export function BentoSection() {
  return (
    <section className="container mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-auto lg:h-[600px]">
        {/* Large left card - Corporate Offices */}
        <div className="relative rounded-2xl overflow-hidden h-[300px] lg:h-full lg:row-span-2">
          <Image
            src="/home/office.png"
            alt="Corporate Offices"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
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
          </div>
        </div>

        {/* Top right card - Houses for Personal Home Decor */}
        <div className="relative rounded-2xl overflow-hidden h-[200px] lg:h-auto bg-[#e8e4df] lg:col-span-2">
          <div className="absolute inset-0 flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg">
                <Home className="w-6 h-6 text-[var(--orange)]" />
              </div>
              <p className="text-[#5a4a42] text-sm max-w-[200px] hidden sm:block">
                Cozy, personalized rugs that make your house feel like home
              </p>
            </div>
            <div className="text-right">
              <p className="text-[#5a4a42] text-sm italic">Personal home decor</p>
              <h3 className="text-2xl md:text-3xl font-light text-[#2c2420]">Houses</h3>
            </div>
          </div>
        </div>

        {/* Bottom middle card - Car Interior */}
        <div className="relative rounded-2xl overflow-hidden h-[300px] lg:h-auto bg-[#d4c4b5]">
          <Image
            src="/home/wall.png"
            alt="Wall Rugs"
            fill
            className="object-cover"
          />
          <div className="absolute top-4 left-4">
            <div className="bg-white/90 backdrop-blur-sm p-2 rounded-lg inline-block">
              <Car className="w-5 h-5 text-[var(--orange)]" />
            </div>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <h4 className="text-white font-semibold mb-1">Wall Rugs</h4>
            <p className="text-white text-xs">Customised tufted rugs hang on walls</p>
          </div>
        </div>

        {/* Bottom right card - Explore More */}
        <div className="relative rounded-2xl overflow-hidden h-[300px] lg:h-auto">
          <Image
            src="/home/home.png"
            alt="Explore our collection"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-white/90 text-xs mb-2">Personal home decor</p>
            <h4 className="text-white font-semibold">Houses</h4>
          </div>
          <button className="absolute bottom-4 right-4 bg-white rounded-full p-3 hover:bg-white/90 transition-colors">
            <ArrowUpRight className="w-5 h-5 text-[#2c2420]" />
          </button>
        </div>
      </div>
    </section>
  )
}
