import { Suspense } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { OrderSuccessContent } from "@/components/order-success-content"
// import { OrderSuccessContent } from "@/components/order-success-content"

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-2xl">
          <Suspense fallback={<OrderSuccessLoading />}>
            <OrderSuccessContent />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  )
}

function OrderSuccessLoading() {
  return (
    <div className="p-12 text-center animate-pulse">
      <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-6" />
      <div className="h-10 bg-muted rounded w-64 mx-auto mb-4" />
      <div className="h-6 bg-muted rounded w-48 mx-auto" />
    </div>
  )
}
