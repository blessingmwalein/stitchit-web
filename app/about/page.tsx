'use client';

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Award, Heart, Users, Zap } from "lucide-react"

const values = [
  {
    icon: Heart,
    title: "Passion for Craft",
    description: "Every rug is made with love and attention to detail by our skilled artisans"
  },
  {
    icon: Award,
    title: "Quality First",
    description: "We use only premium materials and traditional techniques for lasting beauty"
  },
  {
    icon: Users,
    title: "Customer Focused",
    description: "Your vision drives our work. We collaborate closely to bring your ideas to life"
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "Blending traditional craftsmanship with modern design and technology"
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <div className="container mx-auto px-6 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-light text-[#2c2420] mb-6">
                Crafting Dreams Into
                <br />
                <span className="text-[var(--orange)] italic font-serif">Reality</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Stitch't is Zimbabwe's premier custom tufted rug studio, where traditional craftsmanship meets contemporary design. We create unique, handcrafted rugs that tell your story.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Founded with a passion for textile artistry, we've been transforming spaces across Zimbabwe with our custom tufted rugs. Each piece is a testament to our commitment to quality, creativity, and customer satisfaction.
              </p>
              <Button asChild size="lg" className="bg-[var(--orange)] hover:bg-[var(--orange-dark)]">
                <Link href="/design">Start Your Design</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative h-[500px] rounded-2xl overflow-hidden"
            >
              <Image
                src="https://images.unsplash.com/photo-1600166898405-da9535204843?w=800&q=80"
                alt="Stitch't Workshop"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>

        {/* Our Values */}
        <div className="bg-white py-20">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-light text-[#2c2420] mb-4">
                Our <span className="text-[var(--orange)] italic font-serif">Values</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The principles that guide everything we create
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="p-6 text-center h-full hover:shadow-lg transition-shadow">
                    <div className="w-16 h-16 bg-[var(--orange)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-8 h-8 text-[var(--orange)]" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Our Process */}
        <div className="py-20">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-light text-[#2c2420] mb-4">
                How We <span className="text-[var(--orange)] italic font-serif">Work</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                From concept to creation, here's our process
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  step: "01",
                  title: "Consultation",
                  description: "We discuss your vision, space requirements, and design preferences"
                },
                {
                  step: "02",
                  title: "Design & Approval",
                  description: "Create your design using our tool or work with our team for custom concepts"
                },
                {
                  step: "03",
                  title: "Handcrafted Production",
                  description: "Our artisans bring your rug to life with expert tufting techniques"
                }
              ].map((process, index) => (
                <motion.div
                  key={process.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="text-center"
                >
                  <div className="text-6xl font-bold text-[var(--orange)]/20 mb-4">{process.step}</div>
                  <h3 className="text-xl font-semibold mb-3">{process.title}</h3>
                  <p className="text-muted-foreground">{process.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-gradient-to-br from-[var(--orange)]/10 to-[var(--orange)]/5 border-[var(--orange)]/20 p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-light text-[#2c2420] mb-4">
                Ready to Create Your Custom Rug?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Let's work together to design a unique piece that perfectly complements your space
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-[var(--orange)] hover:bg-[var(--orange-dark)]">
                  <Link href="/design">Design Your Rug</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/order">Quick Order</Link>
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
