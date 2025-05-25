import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Providers } from "@/redux/provider"
import GlobalSnackbar from "@/components/global-snackbar"
import ConditionalLayout from "@/components/conditional-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Tufted Rugs Zimbabwe",
  description: "Custom Tufted Rugs Made in Zimbabwe — Tailored to Your Style",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Providers>
            <ConditionalLayout>{children}</ConditionalLayout>
            <GlobalSnackbar />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
