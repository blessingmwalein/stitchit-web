'use client';

import Link from "next/link"
import Image from "next/image"
import { ShoppingBag, Menu } from "lucide-react"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { logoutClient } from "@/store/slices/authSlice"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function Header() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.cart);
  const { isAuthenticated, client } = useAppSelector((state) => state.auth);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    dispatch(logoutClient());
    router.push('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#faf9f7]/95 backdrop-blur-md border-b border-border/40">
      <div className="py-2 mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/STICHIT-01.png" alt="StichIt Logo" width={70} height={40} className="object-contain" />
        </Link>
        <nav className="hidden md:flex items-center gap-8">
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
        <div className="flex items-center gap-3">
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
          <button className="md:hidden">
            <Menu className="w-6 h-6 text-[#2c2420]" />
          </button>
        </div>
      </div>
    </header>
  )
}
