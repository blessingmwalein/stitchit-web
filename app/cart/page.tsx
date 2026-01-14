'use client';

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { removeFromCart, updateQuantity, clearCart } from "@/store/slices/cartSlice"

export default function CartPage() {
  const { items, total } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const [promoCode, setPromoCode] = useState("");

  const shipping = total > 500 ? 0 : 25;
  const tax = total * 0.15; // 15% tax
  const grandTotal = total + shipping + tax;

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    dispatch(updateQuantity({ id, quantity: newQuantity }));
  };

  const handleRemove = (id: string) => {
    dispatch(removeFromCart(id));
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#faf9f7]">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-6">
            <Card className="max-w-md mx-auto p-12 text-center">
              <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Your Cart is Empty</h2>
              <p className="text-muted-foreground mb-6">
                Looks like you haven't added any rugs yet
              </p>
              <Button asChild className="bg-[var(--orange)] hover:bg-[var(--orange-dark)]">
                <Link href="/collections">Browse Collections</Link>
              </Button>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-light text-[#2c2420] mb-2">
              Shopping <span className="text-[var(--orange)] italic font-serif">Cart</span>
            </h1>
            <p className="text-muted-foreground">{items.length} {items.length === 1 ? 'item' : 'items'} in your cart</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="p-6">
                    <div className="flex gap-4">
                      <div className="relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                            <p className="text-sm text-muted-foreground">Design: {item.design}</p>
                            <div className="flex gap-1 mt-1 flex-wrap">
                              {item.color.slice(0, 3).map((color) => (
                                <span key={color} className="text-xs px-2 py-0.5 bg-secondary rounded-full">
                                  {color}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-xl font-bold text-[var(--orange)]">${item.price}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemove(item.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}

              <Button
                variant="outline"
                onClick={() => dispatch(clearCart())}
                className="w-full"
              >
                Clear Cart
              </Button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">
                        {shipping === 0 ? (
                          <span className="text-green-600">FREE</span>
                        ) : (
                          `$${shipping.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax (15%)</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between text-lg font-bold mb-6">
                    <span>Total</span>
                    <span className="text-[var(--orange)]">${grandTotal.toFixed(2)}</span>
                  </div>

                  {shipping > 0 && (
                    <p className="text-xs text-muted-foreground mb-4 bg-secondary p-3 rounded">
                      Add ${(500 - total).toFixed(2)} more for free shipping!
                    </p>
                  )}

                  <div className="mb-4">
                    <Label className="text-sm mb-2 block">Promo Code</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                      />
                      <Button variant="outline">Apply</Button>
                    </div>
                  </div>

                  <Button asChild className="w-full bg-[var(--orange)] hover:bg-[var(--orange-dark)] text-white" size="lg">
                    <Link href="/checkout">
                      Proceed to Checkout
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>

                  <Button asChild variant="outline" className="w-full mt-3">
                    <Link href="/collections">Continue Shopping</Link>
                  </Button>
                </Card>

                <Card className="p-4 mt-4 bg-[var(--orange)]/5 border-[var(--orange)]/20">
                  <p className="text-sm text-foreground">
                    <strong>🎨 Custom Design?</strong>
                    <br />
                    <Link href="/design" className="text-[var(--orange)] hover:underline">
                      Design your own rug
                    </Link> and add it to your cart
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
