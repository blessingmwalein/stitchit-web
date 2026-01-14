export function StatsSection() {
  const stats = [
    { value: "500+", label: "Designs" },
    { value: "20+", label: "Artisans" },
    { value: "50+", label: "Happy Clients" },
    { value: "1st", label: "Quality Assured" },
  ]

  return (
    <section className="container mx-auto px-6 py-12">
      <div className="flex flex-wrap justify-center gap-8 md:gap-16">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-3xl md:text-4xl font-light text-[#2c2420]">{stat.value}</div>
            <div className="text-sm text-[#8a7a72] mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
