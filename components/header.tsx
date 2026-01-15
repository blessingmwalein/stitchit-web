'use client';

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingBag, Menu, X, User, LogOut, Package } from "lucide-react"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { logoutClient } from "@/store/slices/authSlice"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export function Header() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.cart);
  const { isAuthenticated, client } = useAppSelector((state) => state.auth);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutClient());
    setIsMobileMenuOpen(false);
    router.push('/');
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#faf9f7]/95 backdrop-blur-md border-b border-border/40">
      <div className="py-2 mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
          <Image src="/STICHIT-01.png" alt="StichIt Logo" width={70} height={40} className="object-contain" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          <Link href="/collections" className="text-sm text-[#5a4a42] hover:text-[var(--orange)] transition-colors">
            Collections
          </Link>
          <Link href="/use-cases" className="text-sm text-[#5a4a42] hover:text-[var(--orange)] transition-colors">
            Use Cases
          </Link>
          <Link href="/design" className="text-sm text-[#5a4a42] hover:text-[var(--orange)] transition-colors">
            Design Your Rug
          </Link>
          <Link href="/about" className="text-sm text-[#5a4a42] hover:text-[var(--orange)] transition-colors">
            About Us
          </Link>
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <Button asChild className="bg-[var(--orange)] hover:bg-[var(--orange-dark)] text-white rounded-full">
            <Link href="/order">Quick Order</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/cart" className="relative">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Cart
              {cartCount > 0 && (
                <span className="ml-1 bg-[var(--orange)] text-white text-xs px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </Button>
          {isAuthenticated ? (
            <>
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/profile">{client?.full_name || 'Profile'}</Link>
              </Button>
              <Button onClick={handleLogout} variant="outline" className="rounded-full">
                Logout
              </Button>
            </>
          ) : (
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/auth/login">Login</Link>
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-[#2c2420]" />
          ) : (
            <Menu className="w-6 h-6 text-[#2c2420]" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-white border-t border-border overflow-hidden"
          >
            <nav className="px-4 py-4 space-y-2">
              {/* Navigation Links */}
              <Link
                href="/collections"
                className="block py-3 px-4 text-[#5a4a42] hover:bg-[var(--orange)]/10 hover:text-[var(--orange)] rounded-lg transition-colors"
                onClick={closeMobileMenu}
              >
                Collections
              </Link>
              <Link
                href="/use-cases"
                className="block py-3 px-4 text-[#5a4a42] hover:bg-[var(--orange)]/10 hover:text-[var(--orange)] rounded-lg transition-colors"
                onClick={closeMobileMenu}
              >
                Use Cases
              </Link>
              <Link
                href="/design"
                className="block py-3 px-4 text-[#5a4a42] hover:bg-[var(--orange)]/10 hover:text-[var(--orange)] rounded-lg transition-colors"
                onClick={closeMobileMenu}
              >
                Design Your Rug
              </Link>
              <Link
                href="/about"
                className="block py-3 px-4 text-[#5a4a42] hover:bg-[var(--orange)]/10 hover:text-[var(--orange)] rounded-lg transition-colors"
                onClick={closeMobileMenu}
              >
                About Us
              </Link>

              <div className="border-t border-border my-2"></div>

              {/* Action Buttons */}
              <Link
                href="/order"
                className="flex items-center gap-2 py-3 px-4 bg-[var(--orange)] text-white hover:bg-[var(--orange-dark)] rounded-lg transition-colors"
                onClick={closeMobileMenu}
              >
                <Package className="w-4 h-4" />
                Quick Order
              </Link>

              <Link
                href="/cart"
                className="flex items-center justify-between py-3 px-4 border border-border hover:bg-gray-50 rounded-lg transition-colors"
                onClick={closeMobileMenu}
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  Cart
                </div>
                {cartCount > 0 && (
                  <span className="bg-[var(--orange)] text-white text-xs px-2 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 py-3 px-4 border border-border hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={closeMobileMenu}
                  >
                    <User className="w-4 h-4" />
                    {client?.full_name || 'Profile'}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 py-3 px-4 text-red-600 border border-red-200 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 py-3 px-4 border border-border hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={closeMobileMenu}
                >
                  <User className="w-4 h-4" />
                  Login
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
