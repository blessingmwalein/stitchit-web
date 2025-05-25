"use client"

import { motion } from "framer-motion"
import HeroSection from "@/components/home/hero-section"
import FeaturedRugs from "@/components/home/featured-rugs"
import RecentRugs from "@/components/home/recent-rugs"
import UseCases from "@/components/home/use-cases"
import QuickOrderButton from "@/components/home/quick-order-button"

export default function Home() {
  return (
    <div className="relative">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <HeroSection />
        <FeaturedRugs />
        <RecentRugs />
        <UseCases />
        <QuickOrderButton />
      </motion.div>
    </div>
  )
}
