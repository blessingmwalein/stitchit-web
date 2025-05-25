"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import AuthFooter from "@/components/auth/auth-footer"

interface ConditionalLayoutProps {
    children: React.ReactNode
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
    const pathname = usePathname()
    const isAuthPage = pathname.startsWith("/auth")

    if (isAuthPage) {
        return (
            <div className="flex min-h-screen flex-col">
                <main className="flex-1">{children}</main>
                {/* <AuthFooter /> */}
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    )
}
