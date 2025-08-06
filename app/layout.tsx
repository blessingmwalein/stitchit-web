import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Providers } from "@/redux/provider"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "StitchIt - Custom Tufted Rugs",
  description: "Handcrafted custom tufted rugs made in Zimbabwe",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Providers>
            <Toaster />
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
