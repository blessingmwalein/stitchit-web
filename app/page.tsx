'use client';

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { RugTypesSection } from "@/components/rug-types-section"
import { UseCasesSection } from "@/components/use-cases-section"
import { BentoSection } from "@/components/bento-section"
import { StatsSection } from "@/components/stats-section"
import { FeatureSection } from "@/components/feature-section"
import { CollectionSection } from "@/components/collection-section"
import { Footer } from "@/components/footer"

export default function Home() {
  const bentoRef = useRef(null);
  const useCasesRef = useRef(null);
  const statsRef = useRef(null);
  const featureRef = useRef(null);
  const collectionRef = useRef(null);

  const { scrollYProgress: bentoProgress } = useScroll({
    target: bentoRef,
    offset: ["start end", "end start"]
  });

  const { scrollYProgress: useCasesProgress } = useScroll({
    target: useCasesRef,
    offset: ["start end", "end start"]
  });

  const { scrollYProgress: statsProgress } = useScroll({
    target: statsRef,
    offset: ["start end", "end start"]
  });

  const { scrollYProgress: featureProgress } = useScroll({
    target: featureRef,
    offset: ["start end", "end start"]
  });

  const { scrollYProgress: collectionProgress } = useScroll({
    target: collectionRef,
    offset: ["start end", "end start"]
  });

  const bentoScale = useTransform(bentoProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const bentoOpacity = useTransform(bentoProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  const useCasesScale = useTransform(useCasesProgress, [0, 0.5, 1], [0.9, 1, 0.9]);
  const useCasesOpacity = useTransform(useCasesProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  const statsScale = useTransform(statsProgress, [0, 0.5, 1], [0.85, 1, 0.85]);
  const statsOpacity = useTransform(statsProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  const featureScale = useTransform(featureProgress, [0, 0.5, 1], [0.9, 1, 0.9]);
  const featureOpacity = useTransform(featureProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const featureY = useTransform(featureProgress, [0, 0.5, 1], [100, 0, -100]);

  const collectionScale = useTransform(collectionProgress, [0, 0.5, 1], [0.9, 1, 0.9]);
  const collectionOpacity = useTransform(collectionProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <main className="min-h-screen bg-[#faf9f7]">
      <Header />
      <Hero />
      
      <motion.div 
        ref={bentoRef}
        style={{ scale: bentoScale, opacity: bentoOpacity }}
      >
        <BentoSection />
      </motion.div>

      <motion.div 
        ref={useCasesRef}
        style={{ scale: useCasesScale, opacity: useCasesOpacity }}
      >
        <UseCasesSection />
      </motion.div>

      <motion.div 
        ref={statsRef}
        style={{ scale: statsScale, opacity: statsOpacity }}
      >
        <StatsSection />
      </motion.div>

      <motion.div 
        ref={featureRef}
        style={{ scale: featureScale, opacity: featureOpacity, y: featureY }}
      >
        <FeatureSection />
      </motion.div>

      <motion.div 
        ref={collectionRef}
        style={{ scale: collectionScale, opacity: collectionOpacity }}
      >
        <CollectionSection />
      </motion.div>

      <Footer />
    </main>
  )
}
