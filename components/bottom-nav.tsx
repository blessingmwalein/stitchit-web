"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Palette, ShoppingBag, User } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/", label: "Home", icon: Home, match: (p: string) => p === "/" },
  { href: "/collections", label: "Gallery", icon: LayoutGrid, match: (p: string) => p.startsWith("/collections") },
  { href: "/design", label: "Design", icon: Palette, match: (p: string) => p.startsWith("/design") },
];

export function BottomNav() {
  const pathname = usePathname();
  const { items } = useAppSelector((state) => state.cart);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Hide on auth flows and the checkout/order-success flow — these are
  // focused, full-bleed steps where a persistent tab bar would distract.
  if (pathname.startsWith("/auth") || pathname.startsWith("/checkout") || pathname.startsWith("/order-success")) {
    return null;
  }

  const accountHref = isAuthenticated ? "/profile" : "/auth/login";
  const accountActive = pathname.startsWith("/profile") || pathname.startsWith("/auth");

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-[#faf9f7]/95 backdrop-blur-md border-t border-border/40 flex items-stretch"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {ITEMS.map(({ href, label, icon: Icon, match }) => {
        const active = match(pathname);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium transition-colors",
              active ? "text-[var(--orange)]" : "text-[#8a7a72]"
            )}
          >
            <Icon className="w-5 h-5" />
            {label}
          </Link>
        );
      })}

      <Link
        href="/cart"
        className={cn(
          "relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium transition-colors",
          pathname.startsWith("/cart") ? "text-[var(--orange)]" : "text-[#8a7a72]"
        )}
      >
        <span className="relative">
          <ShoppingBag className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-[var(--orange)] text-white text-[9px] leading-none min-w-[15px] h-[15px] rounded-full flex items-center justify-center px-0.5">
              {cartCount}
            </span>
          )}
        </span>
        Cart
      </Link>

      <Link
        href={accountHref}
        className={cn(
          "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium transition-colors",
          accountActive ? "text-[var(--orange)]" : "text-[#8a7a72]"
        )}
      >
        <User className="w-5 h-5" />
        {isAuthenticated ? "Account" : "Login"}
      </Link>
    </nav>
  );
}
