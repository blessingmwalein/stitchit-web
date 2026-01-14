'use client';

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Heart, ArrowLeft, ZoomIn } from "lucide-react"
import { useAppDispatch } from "@/store/hooks"
import { addToCart } from "@/store/slices/cartSlice"
import { useRouter } from "next/navigation"

// Collection data - in real app this would come from API/database
const collectionsData: Record<string, any> = {
  "1": {
    id: "1",
    name: "Geometric Sunset",
    category: "Modern",
    size: "6x4 ft",
    colors: ["Orange", "Beige", "Brown"],
    price: 450,
    images: [
      "https://images.unsplash.com/photo-1600166898405-da9535204843?w=1200&q=80",
      "https://images.unsplash.com/photo-1616137466211-f939a420be84?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&q=80"
    ],
    description: "Bold geometric patterns with warm sunset tones",
    fullDescription: "Our Geometric Sunset rug is a masterpiece of modern design, featuring bold geometric patterns in warm sunset tones. Each piece is hand-tufted using premium acrylic yarn and backed with durable Hessian cloth for lasting quality. The intricate pattern creates a stunning focal point for any modern space.",
    features: [
      "Premium Acrylic Yarn",
      "Quality Hessian Backing",
      "Hand-Finished Smooth Edges",
      "Colorfast Dyes",
      "Anti-Slip Backing Available",
      "Easy to Clean"
    ],
    materials: "100% Acrylic Yarn, Hessian Backing",
    care: "Vacuum regularly, spot clean with mild detergent, professional cleaning recommended",
    availability: "In Stock"
  },
  "2": {
    id: "2",
    name: "Office Elite",
    category: "Corporate",
    size: "8x5 ft",
    colors: ["Navy", "Gray", "White"],
    price: 580,
    images: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80"
    ],
    description: "Professional design perfect for corporate spaces",
    fullDescription: "Office Elite combines sophistication with durability, designed specifically for high-traffic corporate environments. The subtle navy, gray, and white palette creates a professional atmosphere while maintaining visual interest.",
    features: [
      "Commercial Grade Quality",
      "High Traffic Resistant",
      "Premium Acrylic Yarn",
      "Professional Design",
      "Quality Hessian Backing",
      "Easy Maintenance"
    ],
    materials: "100% Acrylic Yarn, Commercial Grade Hessian Backing",
    care: "Vacuum regularly, professional cleaning recommended for commercial use",
    availability: "In Stock"
  },
  "3": {
    id: "3",
    name: "Cozy Haven",
    category: "Home",
    size: "5x3 ft",
    colors: ["Cream", "Beige", "Brown"],
    price: 320,
    images: [
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&q=80",
      "https://images.unsplash.com/photo-1600166898405-da9535204843?w=1200&q=80",
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80"
    ],
    description: "Soft, warm tones for ultimate comfort",
    fullDescription: "Cozy Haven brings warmth and comfort to your home with its soft cream, beige, and brown tones. Perfect for bedrooms and living spaces, this rug creates an inviting atmosphere.",
    features: [
      "Ultra-Soft Premium Yarn",
      "Warm Neutral Tones",
      "Quality Hessian Backing",
      "Hand-Finished Edges",
      "Perfect for Bedrooms",
      "Comfortable Underfoot"
    ],
    materials: "100% Premium Acrylic Yarn, Hessian Backing",
    care: "Vacuum regularly, spot clean as needed",
    availability: "In Stock"
  },
  "4": {
    id: "4",
    name: "Luxury Suite",
    category: "Hotel",
    size: "10x6 ft",
    colors: ["Gold", "Burgundy", "Cream"],
    price: 750,
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80"
    ],
    description: "Opulent design for luxury hospitality",
    fullDescription: "Luxury Suite embodies elegance and grandeur with its rich gold, burgundy, and cream palette. Designed for high-end hospitality environments, this rug makes a lasting impression on guests while providing exceptional comfort and durability.",
    features: [
      "Luxury Grade Materials",
      "Premium Acrylic Yarn",
      "Elegant Design",
      "Quality Hessian Backing",
      "Hand-Finished Smooth Edges",
      "High-End Hospitality Quality"
    ],
    materials: "100% Luxury Acrylic Yarn, Premium Hessian Backing",
    care: "Professional cleaning recommended, vacuum regularly with care",
    availability: "In Stock"
  },
  "5": {
    id: "5",
    name: "Playful Classroom",
    category: "School",
    size: "7x5 ft",
    colors: ["Blue", "Yellow", "Red"],
    price: 420,
    images: [
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&q=80",
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80",
      "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1200&q=80",
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&q=80"
    ],
    description: "Vibrant colors to inspire young minds",
    fullDescription: "Playful Classroom brings energy and creativity to educational spaces with its vibrant blue, yellow, and red color scheme. Built to withstand the rigors of daily classroom use while maintaining its bright, inspiring appearance.",
    features: [
      "Child-Safe Materials",
      "Vibrant Colorfast Dyes",
      "Durable Construction",
      "Easy to Clean",
      "Quality Hessian Backing",
      "Educational Space Optimized"
    ],
    materials: "100% Acrylic Yarn, Reinforced Hessian Backing",
    care: "Vacuum regularly, spot clean spills immediately, professional cleaning as needed",
    availability: "In Stock"
  },
  "6": {
    id: "6",
    name: "Minimalist Chic",
    category: "Modern",
    size: "6x4 ft",
    colors: ["Black", "White", "Gray"],
    price: 480,
    images: [
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=1200&q=80",
      "https://images.unsplash.com/photo-1600166898405-da9535204843?w=1200&q=80",
      "https://images.unsplash.com/photo-1616137466211-f939a420be84?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80"
    ],
    description: "Clean lines and modern aesthetics",
    fullDescription: "Minimalist Chic showcases the beauty of simplicity with its monochromatic palette and clean geometric lines. Perfect for contemporary interiors, this rug adds sophistication without overwhelming the space.",
    features: [
      "Modern Minimalist Design",
      "Premium Acrylic Yarn",
      "Neutral Color Palette",
      "Quality Hessian Backing",
      "Hand-Finished Edges",
      "Versatile Styling"
    ],
    materials: "100% Premium Acrylic Yarn, Hessian Backing",
    care: "Vacuum regularly, professional cleaning recommended",
    availability: "In Stock"
  },
  "7": {
    id: "7",
    name: "Botanical Garden",
    category: "Home",
    size: "5x4 ft",
    colors: ["Green", "Beige", "Brown"],
    price: 380,
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&q=80",
      "https://images.unsplash.com/photo-1600166898405-da9535204843?w=1200&q=80",
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=1200&q=80"
    ],
    description: "Nature-inspired patterns and earthy tones",
    fullDescription: "Botanical Garden brings the outdoors inside with its nature-inspired design and earthy color palette. The green, beige, and brown tones create a calming, organic atmosphere perfect for any home.",
    features: [
      "Nature-Inspired Design",
      "Premium Acrylic Yarn",
      "Earthy Color Palette",
      "Quality Hessian Backing",
      "Hand-Finished Edges",
      "Eco-Conscious Aesthetic"
    ],
    materials: "100% Premium Acrylic Yarn, Hessian Backing",
    care: "Vacuum regularly, spot clean as needed",
    availability: "In Stock"
  },
  "8": {
    id: "8",
    name: "Executive Office",
    category: "Corporate",
    size: "9x6 ft",
    colors: ["Charcoal", "Tan", "Gold"],
    price: 650,
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80",
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80"
    ],
    description: "Sophisticated elegance for executive spaces",
    fullDescription: "Executive Office combines refined elegance with professional durability. The sophisticated charcoal, tan, and gold palette creates an impressive atmosphere ideal for executive offices and high-level meeting spaces.",
    features: [
      "Executive Grade Quality",
      "Premium Acrylic Yarn",
      "Sophisticated Design",
      "Commercial Grade Backing",
      "Hand-Finished Edges",
      "High-Traffic Resistant"
    ],
    materials: "100% Premium Acrylic Yarn, Commercial Grade Hessian Backing",
    care: "Vacuum regularly, professional cleaning recommended",
    availability: "In Stock"
  },
  "9": {
    id: "9",
    name: "Ocean Waves",
    category: "Modern",
    size: "6x4 ft",
    colors: ["Blue", "Turquoise", "White"],
    price: 440,
    images: [
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&q=80",
      "https://images.unsplash.com/photo-1600166898405-da9535204843?w=1200&q=80",
      "https://images.unsplash.com/photo-1616137466211-f939a420be84?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80"
    ],
    description: "Flowing patterns inspired by the sea",
    fullDescription: "Ocean Waves captures the serenity and movement of the sea with its flowing patterns in shades of blue, turquoise, and white. This rug brings a refreshing coastal aesthetic to any modern interior.",
    features: [
      "Coastal-Inspired Design",
      "Premium Acrylic Yarn",
      "Flowing Patterns",
      "Quality Hessian Backing",
      "Hand-Finished Edges",
      "Calming Color Palette"
    ],
    materials: "100% Premium Acrylic Yarn, Hessian Backing",
    care: "Vacuum regularly, spot clean as needed",
    availability: "In Stock"
  }
};

export default function CollectionDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const collection = collectionsData[params.id];

  if (!collection) {
    return (
      <div className="min-h-screen bg-[#faf9f7]">
        <Header />
        <div className="min-h-[80vh] flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <h1 className="text-3xl font-light text-[#2c2420] mb-4">Collection Not Found</h1>
            <p className="text-[#5a4a42] mb-8">
              Sorry, we couldn't find the collection you're looking for. It may have been removed or the link might be incorrect.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="rounded-full bg-[var(--orange)] hover:bg-[var(--orange-dark)]">
                <Link href="/collections">Browse All Collections</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/design">Design Your Own</Link>
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: collection.id,
      name: collection.name,
      size: collection.size,
      color: collection.colors,
      design: collection.category,
      price: collection.price,
      image: collection.images[0],
      quantity: quantity
    }));
  };

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Button 
              onClick={() => router.back()} 
              variant="outline" 
              className="rounded-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Collections
            </Button>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <div className="relative h-[500px] md:h-[600px] rounded-2xl overflow-hidden bg-white">
                <Image
                  src={collection.images[selectedImage]}
                  alt={collection.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-[var(--orange)] text-white">{collection.category}</Badge>
                </div>
              </div>
              
              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-3">
                {collection.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-24 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index 
                        ? 'border-[var(--orange)] scale-105' 
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${collection.name} view ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Product Details */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div>
                <div className="flex items-center gap-4 text-sm text-[#8a7a72] mb-4">
                  <span>Premium</span>
                  <span className="w-8 h-px bg-[#8a7a72]" />
                  <span>Handcrafted</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-light text-[#2c2420] mb-4 leading-tight">
                  {collection.name.split(' ')[0]}
                  <br />
                  <span className="italic font-serif">{collection.name.split(' ').slice(1).join(' ')}</span>
                </h1>
                <p className="text-lg text-[#5a4a42] mb-6">{collection.fullDescription}</p>
              </div>

              {/* Price */}
              <div className="border-t border-b border-border py-6">
                <span className="text-4xl font-bold text-[var(--orange)]">${collection.price}</span>
                <p className="text-sm text-muted-foreground mt-1">{collection.availability}</p>
              </div>

              {/* Size and Colors */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-[#2c2420] mb-2">Size</p>
                  <p className="text-[#5a4a42]">{collection.size}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#2c2420] mb-2">Colors</p>
                  <div className="flex gap-2 flex-wrap">
                    {collection.colors.map((color: string) => (
                      <span key={color} className="px-3 py-1 bg-[#e8e4df] text-[#5a4a42] rounded-full text-sm">
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#2c2420] mb-2">Materials</p>
                  <p className="text-sm text-[#5a4a42]">{collection.materials}</p>
                </div>
              </div>

              {/* Quantity */}
              <div>
                <p className="text-sm font-semibold text-[#2c2420] mb-2">Quantity</p>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    className="rounded-full w-10 h-10 p-0"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    className="rounded-full w-10 h-10 p-0"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-[var(--orange)] hover:bg-[var(--orange-dark)] text-white rounded-full h-12 text-base"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart - ${collection.price * quantity}
                </Button>
                <Button 
                  variant="outline" 
                  className="rounded-full h-12 w-12 p-0"
                >
                  <Heart className="w-5 h-5 text-[var(--orange)]" />
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-12 mb-16"
          >
            <div>
              <h2 className="text-2xl font-light text-[#2c2420] mb-6">
                Product <span className="italic font-serif text-[var(--orange)]">Features</span>
              </h2>
              <div className="space-y-3">
                {collection.features.map((feature: string, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-[var(--orange)] rounded-full" />
                    <span className="text-[#5a4a42]">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-light text-[#2c2420] mb-6">
                Care <span className="italic font-serif text-[var(--orange)]">Instructions</span>
              </h2>
              <p className="text-[#5a4a42] leading-relaxed">{collection.care}</p>
              <div className="mt-6 p-4 bg-[#e8e4df] rounded-xl">
                <p className="text-sm text-[#5a4a42]">
                  <strong>Note:</strong> All our rugs are crafted with premium acrylic yarn and quality Hessian backing, 
                  featuring hand-finished smooth edges for durability and elegance.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Related Products */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-light text-[#2c2420] mb-8 text-center">
              You May Also <span className="italic font-serif text-[var(--orange)]">Like</span>
            </h2>
            <div className="text-center">
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/collections">View All Collections</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
