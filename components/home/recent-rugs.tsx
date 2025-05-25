"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import type { Rug } from "@/types"
import Link from "next/link"

export default function RecentRugs() {
  const rugs = useSelector((state: RootState) => state.rugs.items)
  const recentRugs = [...rugs]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6)

  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const x = useTransform(scrollYProgress, [0, 1], [0, -100])

  return (
    <section ref={containerRef} className="overflow-hidden py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Recent Creations</h2>
          <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
            Our latest handcrafted tufted rugs, fresh from our workshop
          </p>
        </motion.div>
      </div>

      <motion.div style={{ x: `${x}%` }} className="flex gap-6 pb-8">
        {recentRugs.map((rug: Rug) => (
          <Link key={rug.id} href={`/rug/${rug.id}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="relative min-w-[400px] overflow-hidden rounded-2xl"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img src={rug.image || "/placeholder.svg"} alt={rug.name} className="h-full w-full object-cover" />
              </div>

              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent p-6">
                <h3 className="mb-1 text-xl font-bold text-white">{rug.name}</h3>
                <p className="text-sm text-white/80">
                  {rug.size} · {rug.useCase}
                </p>
              </div>
            </motion.div>
          </Link>
        ))}
      </motion.div>
    </section>
  )
}
