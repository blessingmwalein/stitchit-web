'use client';

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, Smartphone, Building2, Check, Lock } from "lucide-react"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { clearCart } from "@/store/slices/cartSlice"
import { checkoutSchema } from "@/lib/validation"

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total } = useAppSelector((state) => state.cart);
  const { client } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [billingInfo, setBillingInfo] = useState({
    name: client?.full_name || "",
    email: client?.email || "",
    phone: client?.phone || "",
    address: client?.address || "",
    city: ""
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: ""
  });

  const shipping = total > 500 ? 0 : 25;
  const tax = total * 0.15;
  const grandTotal = total + shipping + tax;

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      if (paymentMethod === "card") {
        await checkoutSchema.validate(paymentInfo, { abortEarly: false });
      }

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create order (mock - not using backend)
      const orderId = `ORD-${Date.now()}`;

      // Clear cart
      dispatch(clearCart());

      // Redirect to success page
      router.push(`/order-success?orderId=${orderId}`);
    } catch (err: any) {
      const validationErrors: Record<string, string> = {};
      err.inner?.forEach((error: any) => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-light text-[#2c2420] mb-2">
              Secure <span className="text-[var(--orange)] italic font-serif">Checkout</span>
            </h1>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                {/* Billing Information */}
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Billing Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={billingInfo.name}
                        onChange={(e) => setBillingInfo({ ...billingInfo, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={billingInfo.email}
                        onChange={(e) => setBillingInfo({ ...billingInfo, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={billingInfo.phone}
                        onChange={(e) => setBillingInfo({ ...billingInfo, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={billingInfo.city}
                        onChange={(e) => setBillingInfo({ ...billingInfo, city: e.target.value })}
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={billingInfo.address}
                        onChange={(e) => setBillingInfo({ ...billingInfo, address: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </Card>

                {/* Payment Method */}
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Payment Method</h3>

                  <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                      <TabsTrigger value="card">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Card
                      </TabsTrigger>
                      <TabsTrigger value="mobile">
                        <Smartphone className="w-4 h-4 mr-2" />
                        Mobile Money
                      </TabsTrigger>
                      <TabsTrigger value="bank">
                        <Building2 className="w-4 h-4 mr-2" />
                        Bank Transfer
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="card" className="space-y-4">
                      <div>
                        <Label htmlFor="cardName">Cardholder Name</Label>
                        <Input
                          id="cardName"
                          value={paymentInfo.cardName}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, cardName: e.target.value })}
                          placeholder="John Doe"
                          className={errors.cardName ? "border-red-500" : ""}
                        />
                        {errors.cardName && <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>}
                      </div>
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          value={paymentInfo.cardNumber}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value.replace(/\s/g, '') })}
                          placeholder="1234 5678 9012 3456"
                          maxLength={16}
                          className={errors.cardNumber ? "border-red-500" : ""}
                        />
                        {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input
                            id="expiryDate"
                            value={paymentInfo.expiryDate}
                            onChange={(e) => setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })}
                            placeholder="MM/YY"
                            maxLength={5}
                            className={errors.expiryDate ? "border-red-500" : ""}
                          />
                          {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            type="password"
                            value={paymentInfo.cvv}
                            onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                            placeholder="123"
                            maxLength={4}
                            className={errors.cvv ? "border-red-500" : ""}
                          />
                          {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="mobile" className="space-y-4">
                      <div className="text-center py-8">
                        <Smartphone className="w-16 h-16 mx-auto text-[var(--orange)] mb-4" />
                        <h4 className="font-semibold mb-2">EcoCash / OneMoney</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          You'll receive payment instructions via SMS
                        </p>
                        <div>
                          <Label htmlFor="mobileNumber">Mobile Number</Label>
                          <Input
                            id="mobileNumber"
                            placeholder="+263 788 959 677 / +263 772 440 088"
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="bank" className="space-y-4">
                      <div className="bg-secondary p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Bank Transfer Details</h4>
                        <div className="space-y-1 text-sm">
                          <p><strong>Bank:</strong> ZB Bank</p>
                          <p><strong>Account Name:</strong> Stitch't Ltd</p>
                          <p><strong>Account Number:</strong> 1234567890</p>
                          <p><strong>Reference:</strong> Your Order ID</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-3">
                          Please transfer the exact amount and use your order ID as reference
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </Card>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[var(--orange)] hover:bg-[var(--orange-dark)] text-white"
                  size="lg"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  {loading ? "Processing Payment..." : `Pay $${grandTotal.toFixed(2)}`}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Your payment information is secure and encrypted
                </p>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

                  <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.size}</p>
                          <p className="text-sm font-semibold text-[var(--orange)]">
                            ${item.price} × {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-[var(--orange)]">${grandTotal.toFixed(2)}</span>
                  </div>
                </Card>

                <Card className="p-4 bg-green-50 border-green-200">
                  <div className="flex gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-green-800">
                      <p className="font-semibold">Secure Payment</p>
                      <p className="text-xs">256-bit SSL encryption</p>
                    </div>
                  </div>
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
