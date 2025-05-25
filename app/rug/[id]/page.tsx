"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, useScroll, useTransform } from "framer-motion"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ShoppingBag, Heart, Share2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useDispatch } from "react-redux"
import { addToCart } from "@/redux/slices/cartSlice"
import { useToast } from "@/hooks/use-toast"

export default function RugDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const dispatch = useDispatch()
  const { toast } = useToast()
  const rugs = useSelector((state: RootState) => state.rugs.items)
  const rug = rugs.find((r) => r.id === id)
  const [activeSection, setActiveSection] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "design", label: "Design" },
    { id: "materials", label: "Materials" },
    { id: "dimensions", label: "Dimensions" },
    { id: "care", label: "Care" },
  ]

  const handleAddToCart = () => {
    if (!rug) return

    dispatch(
      addToCart({
        id: rug.id,
        name: rug.name,
        price: rug.price,
        image: rug.image,
        quantity: quantity,
        options: {
          type: rug.type,
          dimensions: rug.dimensions,
          useLocation: rug.useCase,
        },
      }),
    )

    toast({
      title: "Added to cart",
      description: `${rug.name} has been added to your cart.`,
    })
  }

  const scrollToSection = (index: number) => {
    setActiveSection(index)
    const section = document.getElementById(sections[index].id)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
  }

  const nextSection = () => {
    if (activeSection < sections.length - 1) {
      scrollToSection(activeSection + 1)
    }
  }

  const prevSection = () => {
    if (activeSection > 0) {
      scrollToSection(activeSection - 1)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map((section) => document.getElementById(section.id))
      const viewportHeight = window.innerHeight
      const viewportMiddle = window.scrollY + viewportHeight / 2

      sectionElements.forEach((element, index) => {
        if (element) {
          const { top, bottom } = element.getBoundingClientRect()
          const elementMiddle = window.scrollY + top + (bottom - top) / 2

          if (Math.abs(viewportMiddle - elementMiddle) < viewportHeight / 3) {
            setActiveSection(index)
          }
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [sections])

  if (!rug) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-20">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold">Rug not found</h2>
          <p className="mb-6">The rug you're looking for doesn't exist or has been removed.</p>
          <Link href="/gallery">
            <Button>Back to Gallery</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen pt-16">
      {/* Back button */}
      <div className="fixed left-4 top-20 z-40">
        <Button variant="outline" size="icon" className="rounded-full" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Navigation dots */}
      <div className="fixed right-8 top-1/2 z-40 -translate-y-1/2">
        <div className="flex flex-col items-center gap-4">
          {sections.map((section, index) => (
            <button key={section.id} onClick={() => scrollToSection(index)} className="group flex items-center gap-2">
              <span
                className={`block h-3 w-3 rounded-full transition-all duration-300 ${
                  activeSection === index
                    ? "h-4 w-4 bg-black dark:bg-white"
                    : "bg-gray-300 group-hover:bg-gray-400 dark:bg-gray-700 dark:group-hover:bg-gray-500"
                }`}
              />
              <span
                className={`text-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                  activeSection === index ? "font-medium" : ""
                }`}
              >
                {section.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <div ref={containerRef} className="relative h-screen">
        <motion.div
          style={{ opacity, scale }}
          className="absolute inset-0 flex items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
          <img src={rug.image || "/placeholder.svg"} alt={rug.name} className="h-full w-full object-cover" />
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="mb-2 text-4xl font-bold md:text-5xl lg:text-6xl">{rug.name}</h1>
              <p className="mb-6 text-xl text-muted-foreground">{rug.description}</p>
              <div className="flex items-baseline gap-4">
                <span className="text-3xl font-bold">${rug.price}</span>
                <span className="text-muted-foreground line-through">${(rug.price * 1.2).toFixed(2)}</span>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
            className="flex flex-col items-center"
          >
            <span className="mb-2 text-sm text-muted-foreground">Scroll to explore</span>
            <ChevronDown className="h-6 w-6 animate-bounce" />
          </motion.div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="container mx-auto px-4">
        {/* Overview Section */}
        <section id="overview" className="min-h-screen py-20">
          <div className="grid gap-12 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-col justify-center"
            >
              <h2 className="mb-6 text-3xl font-bold">Handcrafted Excellence</h2>
              <p className="mb-6 text-lg text-muted-foreground">
                Each {rug.name} is meticulously handcrafted in Zimbabwe by our skilled artisans, ensuring exceptional
                quality and attention to detail in every piece.
              </p>
              <div className="mb-8 grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-muted p-4">
                  <h3 className="mb-2 font-medium">Size</h3>
                  <p className="text-muted-foreground">{rug.dimensions}</p>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <h3 className="mb-2 font-medium">Type</h3>
                  <p className="capitalize text-muted-foreground">{rug.type}</p>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <h3 className="mb-2 font-medium">Materials</h3>
                  <p className="text-muted-foreground">{rug.materials}</p>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <h3 className="mb-2 font-medium">Production Time</h3>
                  <p className="text-muted-foreground">{rug.productionTime}</p>
                </div>
              </div>

              <div className="mt-auto space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center rounded-md border">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center">{quantity}</span>
                    <Button variant="ghost" size="icon" onClick={() => setQuantity(quantity + 1)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button className="flex-1" onClick={handleAddToCart}>
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Add to Cart
                  </Button>

                  <Button variant="outline" size="icon">
                    <Heart className="h-5 w-5" />
                  </Button>

                  <Button variant="outline" size="icon">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>

                <Link href={`/order?rug=${rug.id}`}>
                  <Button variant="outline" className="w-full">
                    Customize This Design
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex items-center justify-center"
            >
              <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-2xl">
                <img src={rug.image || "/placeholder.svg"} alt={rug.name} className="h-full w-full object-cover" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Design Section */}
        <section id="design" className="min-h-screen py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold">Thoughtful Design</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Our design process combines traditional craftsmanship with modern aesthetics to create rugs that are both
              beautiful and functional.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="overflow-hidden rounded-2xl"
            >
              <img
                src="/placeholder.svg?height=600&width=400"
                alt="Design process"
                className="h-full w-full object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="overflow-hidden rounded-2xl md:col-span-2"
            >
              <img
                src="/placeholder.svg?height=600&width=800"
                alt="Design showcase"
                className="h-full w-full object-cover"
              />
            </motion.div>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-col justify-center"
            >
              <h3 className="mb-4 text-2xl font-bold">Unique Patterns</h3>
              <p className="text-muted-foreground">
                Each rug features unique patterns inspired by both traditional Zimbabwean art and contemporary design
                trends. Our designers work closely with artisans to create pieces that tell a story while complementing
                modern interiors.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col justify-center"
            >
              <h3 className="mb-4 text-2xl font-bold">Color Selection</h3>
              <p className="text-muted-foreground">
                We carefully select color palettes that are both vibrant and timeless. Our dyes are eco-friendly and
                colorfast, ensuring your rug maintains its beautiful appearance for years to come.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Materials Section */}
        <section id="materials" className="min-h-screen py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold">Premium Materials</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              We source only the highest quality materials to ensure durability, comfort, and beauty in every rug we
              create.
            </p>
          </motion.div>

          <div className="grid gap-12 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h3 className="mb-2 text-xl font-bold">Wool</h3>
                <p className="text-muted-foreground">
                  Our premium wool is soft, durable, and naturally stain-resistant. It provides excellent insulation and
                  maintains its appearance even in high-traffic areas.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-xl font-bold">Cotton</h3>
                <p className="text-muted-foreground">
                  We use high-quality cotton for its softness and versatility. Cotton rugs are lightweight, easy to
                  clean, and perfect for any room in your home.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-xl font-bold">Synthetic Blends</h3>
                <p className="text-muted-foreground">
                  For certain applications, we incorporate premium synthetic fibers to enhance durability, stain
                  resistance, and longevity, particularly in high-moisture areas or outdoor rugs.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="sticky top-24 overflow-hidden rounded-2xl">
                <img
                  src="/placeholder.svg?height=800&width=600"
                  alt="Materials showcase"
                  className="h-full w-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Dimensions Section */}
        <section id="dimensions" className="min-h-screen py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold">Perfect Dimensions</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Each rug is carefully sized to fit perfectly in your space, whether it's a small accent piece or a
              statement centerpiece.
            </p>
          </motion.div>

          <div className="relative mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-12 overflow-hidden rounded-2xl bg-muted"
            >
              <img
                src="/placeholder.svg?height=600&width=1000"
                alt="Rug dimensions"
                className="h-full w-full object-cover"
              />
            </motion.div>

            <div className="grid gap-8 md:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="rounded-xl bg-card p-6 shadow-sm"
              >
                <h3 className="mb-4 text-xl font-bold">Small</h3>
                <p className="mb-2 text-muted-foreground">50cm x 50cm</p>
                <p className="text-sm text-muted-foreground">
                  Perfect for small spaces, bathrooms, or as accent pieces under coffee tables.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="rounded-xl bg-card p-6 shadow-sm"
              >
                <h3 className="mb-4 text-xl font-bold">Medium</h3>
                <p className="mb-2 text-muted-foreground">80cm x 120cm</p>
                <p className="text-sm text-muted-foreground">
                  Ideal for bedrooms, office spaces, or as area rugs in smaller living rooms.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="rounded-xl bg-card p-6 shadow-sm"
              >
                <h3 className="mb-4 text-xl font-bold">Large</h3>
                <p className="mb-2 text-muted-foreground">150cm x 200cm+</p>
                <p className="text-sm text-muted-foreground">
                  Statement pieces for living rooms, dining areas, or open concept spaces.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Care Section */}
        <section id="care" className="min-h-screen py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold">Care Instructions</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Proper care will ensure your tufted rug remains beautiful for years to come.
            </p>
          </motion.div>

          <div className="grid gap-12 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="sticky top-24 overflow-hidden rounded-2xl">
                <img
                  src="/placeholder.svg?height=800&width=600"
                  alt="Rug care"
                  className="h-full w-full object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h3 className="mb-2 text-xl font-bold">Regular Cleaning</h3>
                <p className="text-muted-foreground">
                  Vacuum your rug regularly using a low-power setting without a beater bar to remove dust and debris.
                  Rotate your rug occasionally to ensure even wear.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-xl font-bold">Spot Cleaning</h3>
                <p className="text-muted-foreground">
                  For spills, blot immediately with a clean, dry cloth. For stains, use a mild detergent mixed with
                  water and gently dab the affected area. Avoid rubbing, which can damage the fibers.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-xl font-bold">Professional Cleaning</h3>
                <p className="text-muted-foreground">
                  We recommend professional cleaning every 12-18 months to maintain your rug's appearance and extend its
                  lifespan.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-xl font-bold">Storage</h3>
                <p className="text-muted-foreground">
                  If you need to store your rug, clean it thoroughly first, then roll it (don't fold) with the pile
                  facing inward. Store in a cool, dry place and avoid placing heavy items on top.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Similar Rugs Section */}
        <section className="py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold">You May Also Like</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">Explore other rugs that complement your selection</p>
          </motion.div>

          <div className="relative">
            <Button
              variant="outline"
              size="icon"
              className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 rounded-full"
              onClick={prevSection}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="flex gap-6 overflow-x-auto pb-8 pt-4 scrollbar-hide">
              {rugs
                .filter((r) => r.id !== rug.id && (r.size === rug.size || r.type === rug.type))
                .slice(0, 4)
                .map((similarRug) => (
                  <Link
                    key={similarRug.id}
                    href={`/rug/${similarRug.id}`}
                    className="min-w-[300px] overflow-hidden rounded-2xl bg-card shadow-sm transition-all duration-300 hover:shadow-md"
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={similarRug.image || "/placeholder.svg"}
                        alt={similarRug.name}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>

                    <div className="p-4">
                      <h3 className="font-medium">{similarRug.name}</h3>
                      <div className="mt-1 flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          <span className="capitalize">{similarRug.size}</span> •{" "}
                          <span className="capitalize">{similarRug.type}</span>
                        </div>
                        <span className="font-medium">${similarRug.price}</span>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 rounded-full"
              onClick={nextSection}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </section>
      </div>

      {/* Section Navigation */}
      <div className="fixed bottom-8 left-1/2 z-40 -translate-x-1/2 transform">
        <div className="flex items-center gap-4 rounded-full bg-background/80 px-6 py-3 shadow-lg backdrop-blur-sm">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={prevSection}
            disabled={activeSection === 0}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="flex gap-2">
            {sections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(index)}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  activeSection === index ? "bg-primary" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={section.label}
              />
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={nextSection}
            disabled={activeSection === sections.length - 1}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function ChevronDown(props: React.ComponentProps<typeof ChevronLeft>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function Minus(props: React.ComponentProps<typeof ChevronLeft>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5 12h14" />
    </svg>
  )
}

function Plus(props: React.ComponentProps<typeof ChevronLeft>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}
