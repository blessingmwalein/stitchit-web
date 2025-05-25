"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ShoppingBag, User, Phone, Mail, MapPin, ChevronDown } from "lucide-react"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isLoggedIn } = useSelector((state: RootState) => state.auth)
  const { items } = useSelector((state: RootState) => state.cart)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Home", path: "/" },
    {
      name: "Gallery",
      path: "/gallery",
      dropdown: [
        { name: "All Rugs", path: "/gallery" },
        { name: "Bedroom Rugs", path: "/gallery?category=bedroom" },
        { name: "Living Room", path: "/gallery?category=livingroom" },
        { name: "Bathroom Rugs", path: "/gallery?category=bathroom" },
        { name: "Car Mats", path: "/gallery?category=carmat" },
        { name: "Wall Hangings", path: "/gallery?category=wall" },
      ],
    },
    { name: "Custom Order", path: "/order" },
    { name: "Our Process", path: "/process" },
    { name: "Pricing", path: "/pricing" },
  ]

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gray-900 text-white py-2 text-sm">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>+263 123 456 789</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>hello@stitchit.co.zw</span>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Harare, Zimbabwe</span>
            </div>
          </div>
          <div className="text-sm">Free shipping on orders over $100</div>
        </div>
      </div>

      {/* Main Navbar */}
      <header
        className={`py-4 fixed left-0 right-0 top-[40px] z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg dark:bg-gray-950/95" : "bg-white dark:bg-gray-950"
        }`}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/logo/STICHIT-01.png" width={120} height={60} alt="StitchIt Logo" className="h-12 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:block">
            <ul className="flex items-center space-x-8">
              {navLinks.map((link) => (
                <li key={link.path}>
                  {link.dropdown ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center space-x-1 text-base font-medium transition-colors hover:text-[#e98234] group">
                        <span>{link.name}</span>
                        <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-48">
                        {link.dropdown.map((item) => (
                          <DropdownMenuItem key={item.path} asChild>
                            <Link href={item.path} className="w-full">
                              {item.name}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Link
                      href={link.path}
                      className={`relative text-base font-medium transition-colors hover:text-[#e98234] ${
                        pathname === link.path ? "text-[#e98234]" : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {link.name}
                      {pathname === link.path && (
                        <motion.div
                          layoutId="navbar-indicator"
                          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#e98234]"
                          transition={{ type: "spring", duration: 0.5 }}
                        />
                      )}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center space-x-4">
            <ModeToggle />

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative hover:bg-[#e98234]/10">
                <ShoppingBag className="h-5 w-5" />
                {items.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#e98234] text-xs text-white">
                    {items.length}
                  </span>
                )}
              </Button>
            </Link>

            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="hover:bg-[#e98234]/10">
                <User className="h-5 w-5" />
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t bg-white px-4 py-4 dark:bg-gray-950 lg:hidden"
            >
              <ul className="space-y-4">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      href={link.path}
                      className={`block py-2 text-base font-medium ${
                        pathname === link.path ? "text-[#e98234]" : "text-gray-700 dark:text-gray-300"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                    {link.dropdown && (
                      <ul className="ml-4 mt-2 space-y-2">
                        {link.dropdown.map((item) => (
                          <li key={item.path}>
                            <Link
                              href={item.path}
                              className="block py-1 text-sm text-gray-600 dark:text-gray-400"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
