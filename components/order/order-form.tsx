"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useDispatch } from "react-redux"
import { addToCart } from "@/redux/slices/cartSlice"
import { useToast } from "@/hooks/use-toast"
import { X } from "lucide-react"

interface OrderFormProps {
  currentStep: number
  setCurrentStep: (step: number) => void
}

export default function OrderForm({ currentStep, setCurrentStep }: OrderFormProps) {
  const dispatch = useDispatch()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    rugType: "",
    length: "",
    width: "",
    colors: "",
    useLocation: "",
    designNotes: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "ecocash",
  })

  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Add to cart
    dispatch(
      addToCart({
        id: Date.now().toString(),
        name: `Custom ${formData.rugType} Rug`,
        price: calculatePrice(),
        image: imagePreview || "/placeholder.svg?height=300&width=300",
        quantity: 1,
        options: {
          type: formData.rugType,
          dimensions: `${formData.length}cm x ${formData.width}cm`,
          useLocation: formData.useLocation,
        },
      }),
    )

    toast({
      title: "Order added to cart",
      description: "Your custom rug has been added to your cart.",
    })

    // Reset form
    setFormData({
      rugType: "",
      length: "",
      width: "",
      colors: "",
      useLocation: "",
      designNotes: "",
      name: "",
      email: "",
      phone: "",
      address: "",
      paymentMethod: "ecocash",
    })
    setImagePreview(null)
    setCurrentStep(1)
  }

  const calculatePrice = () => {
    if (!formData.length || !formData.width) return 0

    const area = Number.parseInt(formData.length) * Number.parseInt(formData.width)

    if (area <= 2500) return 20 // Small
    if (area <= 8000) return 40 // Medium
    return 60 // Large
  }

  const calculateDeliveryTime = () => {
    if (!formData.length || !formData.width) return "2-5 days"

    const area = Number.parseInt(formData.length) * Number.parseInt(formData.width)

    if (area <= 2500) return "2-3 days" // Small
    if (area <= 8000) return "3-4 days" // Medium
    return "4-5 days" // Large
  }

  const getSizeCategory = () => {
    if (!formData.length || !formData.width) return ""

    const area = Number.parseInt(formData.length) * Number.parseInt(formData.width)

    if (area <= 2500) return "Small"
    if (area <= 8000) return "Medium"
    return "Large"
  }

  const nextStep = () => {
    setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border bg-card p-6 shadow-sm">
      <AnimatePresence mode="wait">
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-semibold">Rug Details</h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="rugType">Rug Type</Label>
                <Select
                  value={formData.rugType}
                  onValueChange={(value) => handleSelectChange("rugType", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select rug type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="circle">Circle</SelectItem>
                    <SelectItem value="rectangle">Rectangle</SelectItem>
                    <SelectItem value="custom">Custom Shape</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="image">Upload Design Reference</Label>
                <div className="mt-1 grid gap-4">
                  <Input id="image" type="file" accept="image/*" onChange={handleImageUpload} />

                  {imagePreview && (
                    <div className="relative h-40 w-full overflow-hidden rounded-md border">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Design preview"
                        className="h-full w-full object-contain"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute right-2 top-2"
                        onClick={() => setImagePreview(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="length">Length (cm)</Label>
                  <Input
                    id="length"
                    name="length"
                    type="number"
                    value={formData.length}
                    onChange={handleInputChange}
                    placeholder="e.g., 80"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="width">Width (cm)</Label>
                  <Input
                    id="width"
                    name="width"
                    type="number"
                    value={formData.width}
                    onChange={handleInputChange}
                    placeholder="e.g., 120"
                    required
                  />
                </div>
              </div>

              {formData.length && formData.width && (
                <div className="rounded-md bg-muted p-3 text-sm">
                  Size Category: <span className="font-medium">{getSizeCategory()}</span>
                </div>
              )}

              <div>
                <Label htmlFor="colors">Color Preferences</Label>
                <Input
                  id="colors"
                  name="colors"
                  value={formData.colors}
                  onChange={handleInputChange}
                  placeholder="e.g., Blue, Gray, White"
                />
              </div>

              <div>
                <Label htmlFor="useLocation">Use Location</Label>
                <Select
                  value={formData.useLocation}
                  onValueChange={(value) => handleSelectChange("useLocation", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bedroom">Bedroom</SelectItem>
                    <SelectItem value="livingroom">Living Room</SelectItem>
                    <SelectItem value="bathroom">Bathroom</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="carmat">Car Mat</SelectItem>
                    <SelectItem value="wall">Wall Hanging</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="designNotes">Design Notes</Label>
                <Textarea
                  id="designNotes"
                  name="designNotes"
                  value={formData.designNotes}
                  onChange={handleInputChange}
                  placeholder="Any specific design requirements or preferences..."
                  rows={4}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="button" onClick={nextStep}>
                Continue to Delivery
              </Button>
            </div>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-semibold">Delivery Information</h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Delivery Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={prevStep}>
                Back
              </Button>
              <Button type="button" onClick={nextStep}>
                Continue to Payment
              </Button>
            </div>
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-semibold">Payment Method</h2>

            <RadioGroup
              value={formData.paymentMethod}
              onValueChange={(value) => handleSelectChange("paymentMethod", value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2 rounded-md border p-3 transition-colors hover:bg-muted/50">
                <RadioGroupItem value="ecocash" id="ecocash" />
                <Label htmlFor="ecocash" className="flex-1 cursor-pointer">
                  <div className="font-medium">Ecocash</div>
                  <div className="text-sm text-muted-foreground">Pay using your Ecocash mobile wallet</div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 rounded-md border p-3 transition-colors hover:bg-muted/50">
                <RadioGroupItem value="bank" id="bank" />
                <Label htmlFor="bank" className="flex-1 cursor-pointer">
                  <div className="font-medium">Bank Transfer</div>
                  <div className="text-sm text-muted-foreground">Pay directly to our bank account</div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 rounded-md border p-3 transition-colors hover:bg-muted/50">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash" className="flex-1 cursor-pointer">
                  <div className="font-medium">USD Cash on Delivery</div>
                  <div className="text-sm text-muted-foreground">Pay when your rug is delivered</div>
                </Label>
              </div>
            </RadioGroup>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={prevStep}>
                Back
              </Button>
              <Button type="button" onClick={nextStep}>
                Review Order
              </Button>
            </div>
          </motion.div>
        )}

        {currentStep === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-semibold">Review Your Order</h2>

            <div className="space-y-4 rounded-md bg-muted p-4">
              <div className="grid gap-1">
                <span className="text-sm font-medium">Rug Type</span>
                <span className="capitalize">{formData.rugType || "Not specified"}</span>
              </div>

              <div className="grid gap-1">
                <span className="text-sm font-medium">Dimensions</span>
                <span>
                  {formData.length && formData.width
                    ? `${formData.length}cm x ${formData.width}cm (${getSizeCategory()})`
                    : "Not specified"}
                </span>
              </div>

              <div className="grid gap-1">
                <span className="text-sm font-medium">Use Location</span>
                <span className="capitalize">{formData.useLocation || "Not specified"}</span>
              </div>

              <div className="grid gap-1">
                <span className="text-sm font-medium">Color Preferences</span>
                <span>{formData.colors || "Not specified"}</span>
              </div>

              <div className="grid gap-1">
                <span className="text-sm font-medium">Design Notes</span>
                <span>{formData.designNotes || "None"}</span>
              </div>

              <div className="grid gap-1">
                <span className="text-sm font-medium">Delivery Address</span>
                <span>{formData.address || "Not specified"}</span>
              </div>

              <div className="grid gap-1">
                <span className="text-sm font-medium">Payment Method</span>
                <span className="capitalize">{formData.paymentMethod || "Not specified"}</span>
              </div>

              <div className="grid gap-1">
                <span className="text-sm font-medium">Estimated Delivery Time</span>
                <span>{calculateDeliveryTime()}</span>
              </div>

              <div className="grid gap-1">
                <span className="text-sm font-medium">Total Price</span>
                <span className="text-xl font-bold">${calculatePrice()}</span>
              </div>
            </div>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={prevStep}>
                Back
              </Button>
              <Button type="submit">Add to Cart</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  )
}
