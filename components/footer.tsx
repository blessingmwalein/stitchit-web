import Link from "next/link"
import { Instagram, Facebook, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t bg-white py-12 dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-bold">Tufted Rugs</h3>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Custom Tufted Rugs Made in Zimbabwe — Tailored to Your Style
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-gray-600 transition-colors hover:text-black dark:text-gray-400 dark:hover:text-white"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-600 transition-colors hover:text-black dark:text-gray-400 dark:hover:text-white"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-600 transition-colors hover:text-black dark:text-gray-400 dark:hover:text-white"
              >
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/gallery"
                  className="text-gray-600 transition-colors hover:text-black dark:text-gray-400 dark:hover:text-white"
                >
                  Rug Gallery
                </Link>
              </li>
              <li>
                <Link
                  href="/order"
                  className="text-gray-600 transition-colors hover:text-black dark:text-gray-400 dark:hover:text-white"
                >
                  Custom Order
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-gray-600 transition-colors hover:text-black dark:text-gray-400 dark:hover:text-white"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 transition-colors hover:text-black dark:text-gray-400 dark:hover:text-white"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/process"
                  className="text-gray-600 transition-colors hover:text-black dark:text-gray-400 dark:hover:text-white"
                >
                  Our Process
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 transition-colors hover:text-black dark:text-gray-400 dark:hover:text-white"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/faq"
                  className="text-gray-600 transition-colors hover:text-black dark:text-gray-400 dark:hover:text-white"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-gray-600 transition-colors hover:text-black dark:text-gray-400 dark:hover:text-white"
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/care"
                  className="text-gray-600 transition-colors hover:text-black dark:text-gray-400 dark:hover:text-white"
                >
                  Rug Care
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} Tufted Rugs Zimbabwe. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
