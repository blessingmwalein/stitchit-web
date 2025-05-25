import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"

export default function AuthFooter() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Image src="/logo/STICHIT-01.png" width={120} height={60} alt="StitchIt Logo" className="h-12 w-auto" />
            <p className="text-gray-400 text-sm">
              Handcrafted tufted rugs from Zimbabwe. Transform your space with our custom designs and expert
              craftsmanship.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-[#e98234] cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-[#e98234] cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-[#e98234] cursor-pointer transition-colors" />
            </div>
          </div>

          {/* About Us */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">About Us</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/about" className="hover:text-[#e98234] transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/process" className="hover:text-[#e98234] transition-colors">
                  Our Process
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-[#e98234] transition-colors">
                  Meet the Team
                </Link>
              </li>
              <li>
                <Link href="/sustainability" className="hover:text-[#e98234] transition-colors">
                  Sustainability
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Services</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/order" className="hover:text-[#e98234] transition-colors">
                  Custom Design
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-[#e98234] transition-colors">
                  Ready-Made Rugs
                </Link>
              </li>
              <li>
                <Link href="/consultation" className="hover:text-[#e98234] transition-colors">
                  Design Consultation
                </Link>
              </li>
              <li>
                <Link href="/maintenance" className="hover:text-[#e98234] transition-colors">
                  Rug Maintenance
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact</h3>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+263 788 959 677 / +263 772 440 0088</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>hello@stitchit.co.zw</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Harare, Zimbabwe</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 StitchIt. All rights reserved. Made with ❤️ in Zimbabwe.</p>
        </div>
      </div>
    </footer>
  )
}
