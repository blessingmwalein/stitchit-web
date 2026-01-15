"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle, Package, Home } from "lucide-react"

export function OrderSuccessContent() {
    const searchParams = useSearchParams()
    const orderId = searchParams.get("orderId")

    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <Card className="p-12 text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                    <CheckCircle className="w-16 h-16 text-green-600" />
                </motion.div>

                <h1 className="text-4xl font-light text-[#2c2420] mb-4">
                    Order <span className="text-[var(--orange)] italic font-serif">Confirmed!</span>
                </h1>

                <p className="text-lg text-muted-foreground mb-2">Thank you for your order</p>

                {orderId && (
                    <p className="text-sm text-muted-foreground mb-8">
                        Order ID: <span className="font-mono font-semibold">{orderId}</span>
                    </p>
                )}

                <div className="bg-[var(--orange)]/10 border border-[var(--orange)]/20 rounded-lg p-6 mb-8">
                    <h3 className="font-semibold mb-2">What happens next?</h3>
                    <ul className="text-sm text-left space-y-2 max-w-md mx-auto">
                        <li className="flex items-start gap-2">
                            <span className="text-[var(--orange)]">•</span>
                            <span>You'll receive an order confirmation email shortly</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[var(--orange)]">•</span>
                            <span>Our team will review your order and contact you within 24 hours</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[var(--orange)]">•</span>
                            <span>Production will begin once details are confirmed</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[var(--orange)]">•</span>
                            <span>We'll keep you updated on the progress of your custom rug</span>
                        </li>
                    </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg" className="bg-[var(--orange)] hover:bg-[var(--orange-dark)]">
                        <Link href="/profile">
                            <Package className="w-4 h-4 mr-2" />
                            View Order Details
                        </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                        <Link href="/">
                            <Home className="w-4 h-4 mr-2" />
                            Back to Home
                        </Link>
                    </Button>
                </div>
            </Card>
        </motion.div>
    )
}
