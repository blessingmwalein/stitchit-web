import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#2c2420] text-white">
      <div className="container mx-auto px-6 py-16">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light leading-tight">
            Let's Create Your
            <br />
            <span className="italic font-serif text-[var(--orange)]">Perfect Rug</span>
          </h2>
          <p className="mt-4 text-white/60 text-sm max-w-md">
            Handcrafted with passion in Zimbabwe. Get in touch to discuss your custom tufted rug project.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-8 border-t border-white/10">
          <div>
            <h4 className="text-sm font-medium mb-4 text-[var(--orange)]">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/collections" className="text-white/60 text-sm hover:text-[var(--orange)] transition-colors">
                  Our Collections
                </Link>
              </li>
              <li>
                <Link href="/design" className="text-white/60 text-sm hover:text-[var(--orange)] transition-colors">
                  Design Your Rug
                </Link>
              </li>
              <li>
                <Link href="/use-cases" className="text-white/60 text-sm hover:text-[var(--orange)] transition-colors">
                  Use Cases
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white/60 text-sm hover:text-[var(--orange)] transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-4 text-[var(--orange)]">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/order" className="text-white/60 text-sm hover:text-[var(--orange)] transition-colors">
                  Place an Order
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-white/60 text-sm hover:text-[var(--orange)] transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/60 text-sm hover:text-[var(--orange)] transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/60 text-sm hover:text-[var(--orange)] transition-colors">
                  Care Guide
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-4 text-[var(--orange)]">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-white/60 text-sm">
                <Phone className="w-4 h-4" />
                <span>+263 788 959 677 / +263 772 440 088</span>
              </li>
              <li className="flex items-center gap-2 text-white/60 text-sm">
                <Mail className="w-4 h-4" />
                <span>stichiitt@gmail.com</span>
              </li>
              <li className="flex items-start gap-2 text-white/60 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Harare, Zimbabwe</span>
              </li>
            </ul>
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--orange)] transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--orange)] transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--orange)] transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div className="flex items-end justify-end">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Image src="/STICHIT-01.png" alt="StichIt Logo" width={150} height={50} className="object-contain" />
            </Link>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40">
            <p>© {new Date().getFullYear()} Stitch't. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-[var(--orange)] transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-[var(--orange)] transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
