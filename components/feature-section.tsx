import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FeatureSection() {
  return (
    <section className="container mx-auto px-6 py-12">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="relative h-[500px] md:h-[600px] rounded-2xl overflow-hidden">
          <Image
            src="/ours/work2.png"
            alt="Elegant tufted rug in modern interior"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center px-4 md:px-8">
          <div className="flex items-center gap-4 text-sm text-[#8a7a72] mb-4">
            <span>Elegance</span>
            <span className="w-8 h-px bg-[#8a7a72]" />
            <span>Timeless</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-[#2c2420] leading-tight">
            Artisan Style
            <br />
            <span className="italic font-serif">Timeless Charm</span>
          </h2>
          <p className="mt-6 text-[#5a4a42] text-sm leading-relaxed max-w-md">
            We craft our rugs elegantly using premium <strong>Acrylic yarn</strong> from quality brands. Each piece is backed with durable <strong>Hessian rough cloth</strong> for lasting stability. Our artisans add meticulous <strong>final curving for smooth edges and lines</strong>, ensuring every rug is a masterpiece of comfort and style.
          </p>
          <div className="mt-6 space-y-2 text-sm text-[#5a4a42]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[var(--orange)] rounded-full"></span>
              <span>Premium Acrylic Yarn</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[var(--orange)] rounded-full"></span>
              <span>Quality Hessian Backing</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[var(--orange)] rounded-full"></span>
              <span>Hand-Finished Smooth Edges</span>
            </div>
          </div>
          <Button asChild className="mt-8 rounded-full bg-[var(--orange)] hover:bg-[var(--orange-dark)] w-fit">
            <Link href="/collections" className="inline-flex items-center gap-2">
              View Collection
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
