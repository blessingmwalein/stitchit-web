import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Providers } from "@/lib/providers"
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register"
import { BottomNav } from "@/components/bottom-nav"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Stitch't | Premium Custom Tufted Rugs in Zimbabwe",
  description: "Create custom tufted rugs with our unique style. Perfect for homes, offices, hotels, schools and more. Handcrafted in Zimbabwe.",
  keywords: "tufted rugs, custom rugs, Zimbabwe, handcrafted, office rugs, home decor, hotel rugs",
  generator: "v0.app",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Stitch't",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#f97316",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased pb-16 lg:pb-0`}>
        <Providers>
          {children}
          <BottomNav />
        </Providers>
        <Analytics />
        <ServiceWorkerRegister />
      </body>
    </html>
  )
}
