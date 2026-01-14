'use client';

import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { useRef } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Sofa, Utensils, Bath, Bed, Car, Building2, Hotel, School, ArrowRight } from "lucide-react"
import Link from "next/link"

const useCases = [
  {
    icon: Sofa,
    title: "Living Rooms",
    subtitle: "Where comfort meets style",
    description: "Transform your living space with statement rugs that anchor your furniture and add warmth. Our tufted rugs create the perfect foundation for your home's heart.",
    image: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=1200&q=80",
    examples: ["Under coffee tables", "Layered with larger rugs", "Statement pieces"],
    color: "#f97316"
  },
  {
    icon: Utensils,
    title: "Dining Areas",
    subtitle: "Elegance for every meal",
    description: "Protect your floors while adding sophistication to dining experiences. Our durable rugs withstand high-traffic while maintaining their beauty.",
    image: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=1200&q=80",
    examples: ["Under dining tables", "Kitchen runners", "Breakfast nook accents"],
    color: "#ea580c"
  },
  {
    icon: Bed,
    title: "Bedrooms",
    subtitle: "Your personal sanctuary",
    description: "Create a cozy retreat with soft rugs that feel luxurious under your feet. Wake up to comfort every morning.",
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&q=80",
    examples: ["Bedside placement", "Full room coverage", "Accent rugs"],
    color: "#fb923c"
  },
  {
    icon: Bath,
    title: "Bathrooms",
    subtitle: "Comfort and safety",
    description: "Add luxury and functionality with absorbent, anti-slip bathroom rugs crafted for moisture-rich environments.",
    image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&q=80",
    examples: ["Bath mats", "Vanity rugs", "Shower mats"],
    color: "#fdba74"
  },
  {
    icon: Building2,
    title: "Corporate Offices",
    subtitle: "Professional excellence",
    description: "Enhance productivity and define workspace zones with sophisticated corporate rugs. Make a lasting impression on clients and employees.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
    examples: ["Under desks", "Meeting areas", "Reception lobbies"],
    color: "#f97316"
  },
  {
    icon: Hotel,
    title: "Hotels & Hospitality",
    subtitle: "Unforgettable experiences",
    description: "Create memorable guest experiences with luxury custom rugs that elevate every space in your establishment.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80",
    examples: ["Hotel rooms", "Lobbies", "Conference halls"],
    color: "#ea580c"
  },
  {
    icon: School,
    title: "Educational Spaces",
    subtitle: "Inspiring learning",
    description: "Durable, vibrant rugs perfect for schools and learning environments. Built to withstand active use while maintaining their appeal.",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&q=80",
    examples: ["Classrooms", "Libraries", "Play areas"],
    color: "#fb923c"
  },
  {
    icon: Car,
    title: "Vehicle Interiors",
    subtitle: "Automotive luxury",
    description: "Custom car mats and interior rugs designed specifically for your vehicle. Perfect fit, premium quality.",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200&q=80",
    examples: ["Floor mats", "Trunk liners", "Custom fit designs"],
    color: "#fdba74"
  }
];

function ScrollSection({ useCase, index }: { useCase: typeof useCases[0], index: number }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, -100]);

  return (
    <motion.section
      ref={ref}
      style={{ opacity }}
      className="min-h-screen flex items-center justify-center py-24 px-6 md:px-12"
    >
      <div className="container mx-auto max-w-7xl">
        <div className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${index % 2 === 0 ? '' : 'lg:grid-flow-dense'}`}>
          <motion.div 
            style={{ y }}
            className={`space-y-6 ${index % 2 === 0 ? '' : 'lg:col-start-2'}`}
          >
            <motion.div
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: false }}
              className="flex items-center gap-4 text-sm text-[#8a7a72]"
            >
              <useCase.icon className="w-5 h-5" style={{ color: useCase.color }} />
              <span className="w-8 h-px bg-[#8a7a72]" />
              <span>{useCase.subtitle}</span>
            </motion.div>
            
            <motion.h2 
              className="text-3xl md:text-4xl lg:text-5xl font-light text-[#2c2420] leading-tight"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: false }}
            >
              {useCase.title.split(' ')[0]}
              <br />
              <span className="italic font-serif">{useCase.title.split(' ').slice(1).join(' ') || useCase.title}</span>
            </motion.h2>
            
            <motion.p 
              className="mt-6 text-[#5a4a42] text-sm leading-relaxed max-w-md"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: false }}
            >
              {useCase.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: false }}
              className="mt-6 space-y-2 text-sm text-[#5a4a42]"
            >
              {useCase.examples.map((example, i) => (
                <motion.div
                  key={example}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + (i * 0.1) }}
                  viewport={{ once: false }}
                  className="flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: useCase.color }} />
                  <span>{example}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              viewport={{ once: false }}
            >
              <Button 
                asChild 
                className="mt-8 rounded-full w-fit"
                style={{ backgroundColor: useCase.color }}
              >
                <Link href="/design" className="inline-flex items-center gap-2">
                  Design Your Rug
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            style={{ scale }}
            className={`relative ${index % 2 === 0 ? '' : 'lg:col-start-1 lg:row-start-1'}`}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: false }}
              className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-lg"
            >
              <Image
                src={useCase.image}
                alt={useCase.title}
                fill
                className="object-cover"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

export default function UseCasesPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0]);

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <Header />
      
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1600166898405-da9535204843?w=1600&q=80"
            alt="Custom tufted rugs showcase"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        </div>

        <motion.div 
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="relative text-center z-10 px-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="space-y-6"
          >
            <motion.div
              className="flex items-center gap-4 text-sm text-white/70 mb-6 justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <span>Elegance</span>
              <span className="w-8 h-px bg-white/50" />
              <span>Timeless</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-white leading-tight">
              Discover Our Rugs
              <br />
              <span className="text-[var(--orange)] italic font-serif">Use Cases</span>
            </h1>
            
            <motion.p 
              className="text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              Discover how our custom tufted rugs transform spaces from ordinary to extraordinary. Each piece crafted with premium materials and timeless artisan style.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="pt-8"
            >
              <p className="text-sm text-white/60 animate-bounce">Scroll to explore ↓</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Use Cases Sections */}
      <main>
        {useCases.map((useCase, index) => (
          <ScrollSection key={useCase.title} useCase={useCase} index={index} />
        ))}
      </main>

      {/* CTA Section */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-gradient-to-b from-[#faf9f7] to-[#e8e4df]">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="container mx-auto text-center space-y-8 max-w-4xl"
        >
          <div className="flex items-center gap-4 text-sm text-[#8a7a72] mb-6 justify-center">
            <span>Ready</span>
            <span className="w-8 h-px bg-[#8a7a72]" />
            <span>Transform</span>
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-light text-[#2c2420] leading-tight">
            Ready to Transform
            <br />
            <span className="text-[var(--orange)] italic font-serif">Your Space?</span>
          </h2>
          <p className="text-sm md:text-base text-[#5a4a42] max-w-2xl mx-auto leading-relaxed">
            Start designing your perfect custom rug today. Our artisans are ready to bring your vision to life with premium materials and timeless craftsmanship.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button asChild size="lg" className="bg-[var(--orange)] hover:bg-[var(--orange-dark)] rounded-full text-base px-8">
              <Link href="/design" className="inline-flex items-center gap-2">
                Start Designing
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full text-base px-8">
              <Link href="/collections">View Collections</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
