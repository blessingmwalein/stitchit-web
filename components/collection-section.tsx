import Image from "next/image"
import { ArrowRight } from "lucide-react"

const collections = [
  {
    name: "Persian",
    image: "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=600&q=80",
  },
  {
    name: "Nordic",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
  },
  {
    name: "Bohemian",
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&q=80",
  },
  {
    name: "Moroccan",
    image: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=600&q=80",
  },
  {
    name: "Abstract",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80",
  },
  {
    name: "Vintage",
    image: "https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?w=600&q=80",
  },
]

export function CollectionSection() {
  return (
    <section className="container mx-auto px-6 py-16">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
        <div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-[#2c2420]">
            Explore Our Proudly
            <br />
            <span className="italic font-serif">Collection</span>
          </h2>
        </div>
        <div className="mt-6 md:mt-0 flex items-center gap-4">
          <button className="inline-flex items-center gap-2 bg-[#2c2420] text-white px-5 py-2.5 rounded-full text-sm hover:bg-[#3d332d] transition-colors">
            View All
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-[#8a7a72] text-xs max-w-[200px] hidden lg:block">
            Tuftoria's full showcase of curated contemporary collections featuring design trends and innovative
            textures.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {collections.map((item, index) => (
          <div key={index} className="group relative h-[280px] rounded-2xl overflow-hidden cursor-pointer">
            <Image
              src={item.image || "/placeholder.svg"}
              alt={`${item.name} tufted rug collection`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-4 left-4 flex items-center justify-between w-[calc(100%-2rem)]">
              <span className="text-white text-lg font-light">{item.name}</span>
              <button className="bg-white/20 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
