'use client';

import { useState } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Palette, Ruler, Sparkles, Upload, ShoppingCart } from "lucide-react"
import { useAppDispatch } from "@/store/hooks"
import { addToCart } from "@/store/slices/cartSlice"
import { useRouter } from "next/navigation"

const shapes = ["Rectangle", "Square", "Round", "Oval", "Runner", "Custom"];
const patterns = ["Solid", "Geometric", "Abstract", "Floral", "Striped", "Custom Design"];
const materials = ["Wool", "Cotton", "Acrylic", "Mixed"];
const pileHeights = ["Low (0.5\")", "Medium (1\")", "High (1.5\")", "Plush (2\")"];

const colorPalette = [
  { name: "Orange", hex: "#f97316" },
  { name: "Beige", hex: "#d4c4b5" },
  { name: "Brown", hex: "#6b4423" },
  { name: "Navy", hex: "#1e3a8a" },
  { name: "Gray", hex: "#6b7280" },
  { name: "White", hex: "#ffffff" },
  { name: "Black", hex: "#000000" },
  { name: "Cream", hex: "#faf9f7" },
  { name: "Gold", hex: "#fbbf24" },
  { name: "Green", hex: "#16a34a" },
  { name: "Blue", hex: "#3b82f6" },
  { name: "Red", hex: "#dc2626" },
];

export default function DesignPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const [design, setDesign] = useState({
    shape: "",
    width: 6,
    length: 4,
    pattern: "",
    material: "",
    pileHeight: "",
    colors: [] as string[],
    customNotes: "",
    designFile: null as File | null,
  });

  const [estimatedPrice, setEstimatedPrice] = useState(0);

  const calculatePrice = () => {
    const basePrice = 50;
    const sizeMultiplier = design.width * design.length;
    const materialCosts = {
      "Wool": 30,
      "Cotton": 20,
      "Acrylic": 15,
      "Mixed": 25
    };
    const patternCosts = {
      "Solid": 0,
      "Geometric": 50,
      "Abstract": 75,
      "Floral": 100,
      "Striped": 40,
      "Custom Design": 150
    };

    const materialCost = materialCosts[design.material as keyof typeof materialCosts] || 0;
    const patternCost = patternCosts[design.pattern as keyof typeof patternCosts] || 0;
    const total = (basePrice + materialCost + patternCost) * sizeMultiplier;
    
    setEstimatedPrice(Math.round(total));
  };

  const handleColorSelect = (colorName: string) => {
    if (design.colors.includes(colorName)) {
      setDesign({ ...design, colors: design.colors.filter(c => c !== colorName) });
    } else if (design.colors.length < 5) {
      setDesign({ ...design, colors: [...design.colors, colorName] });
    }
  };

  const handleAddToCart = () => {
    if (!design.shape || !design.pattern || !design.material || design.colors.length === 0) {
      alert("Please complete all required fields");
      return;
    }

    calculatePrice();
    
    dispatch(addToCart({
      id: `custom-${Date.now()}`,
      name: `Custom ${design.shape} Rug`,
      size: `${design.width}x${design.length} ft`,
      color: design.colors,
      design: design.pattern,
      price: estimatedPrice,
      image: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=800&q=80",
      quantity: 1,
      customDesign: design
    }));

    router.push('/cart');
  };

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-light text-[#2c2420] mb-4">
              Design <span className="text-[var(--orange)] italic font-serif">Your Dream Rug</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Create a one-of-a-kind tufted rug tailored to your exact specifications
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Designer Panel */}
            <div className="lg:col-span-2">
              <Card className="p-8">
                <Tabs defaultValue="basics" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 mb-8">
                    <TabsTrigger value="basics">Basics</TabsTrigger>
                    <TabsTrigger value="size">Size</TabsTrigger>
                    <TabsTrigger value="colors">Colors</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basics" className="space-y-6">
                    <div>
                      <Label className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-4 h-4 text-[var(--orange)]" />
                        Shape *
                      </Label>
                      <div className="grid grid-cols-3 gap-3">
                        {shapes.map((shape) => (
                          <Button
                            key={shape}
                            type="button"
                            variant={design.shape === shape ? "default" : "outline"}
                            className={design.shape === shape ? "bg-[var(--orange)] hover:bg-[var(--orange-dark)]" : ""}
                            onClick={() => setDesign({ ...design, shape })}
                          >
                            {shape}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="mb-3 block">Pattern *</Label>
                      <Select value={design.pattern} onValueChange={(value) => setDesign({ ...design, pattern: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select pattern" />
                        </SelectTrigger>
                        <SelectContent>
                          {patterns.map((pattern) => (
                            <SelectItem key={pattern} value={pattern}>{pattern}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="mb-3 block">Material *</Label>
                      <Select value={design.material} onValueChange={(value) => setDesign({ ...design, material: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select material" />
                        </SelectTrigger>
                        <SelectContent>
                          {materials.map((material) => (
                            <SelectItem key={material} value={material}>{material}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="mb-3 block">Pile Height</Label>
                      <Select value={design.pileHeight} onValueChange={(value) => setDesign({ ...design, pileHeight: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select pile height" />
                        </SelectTrigger>
                        <SelectContent>
                          {pileHeights.map((height) => (
                            <SelectItem key={height} value={height}>{height}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>

                  <TabsContent value="size" className="space-y-6">
                    <div>
                      <Label className="flex items-center gap-2 mb-3">
                        <Ruler className="w-4 h-4 text-[var(--orange)]" />
                        Width: {design.width} feet
                      </Label>
                      <Slider
                        value={[design.width]}
                        onValueChange={([value]) => setDesign({ ...design, width: value })}
                        min={2}
                        max={12}
                        step={0.5}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <Label className="mb-3 block">Length: {design.length} feet</Label>
                      <Slider
                        value={[design.length]}
                        onValueChange={([value]) => setDesign({ ...design, length: value })}
                        min={2}
                        max={15}
                        step={0.5}
                        className="w-full"
                      />
                    </div>

                    <div className="bg-secondary/50 p-6 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">Total Area</p>
                      <p className="text-3xl font-bold text-foreground">
                        {design.width} × {design.length} = {(design.width * design.length).toFixed(1)} sq ft
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="colors" className="space-y-6">
                    <div>
                      <Label className="flex items-center gap-2 mb-3">
                        <Palette className="w-4 h-4 text-[var(--orange)]" />
                        Select Colors (Max 5) *
                      </Label>
                      <p className="text-sm text-muted-foreground mb-4">
                        Selected: {design.colors.length}/5
                      </p>
                      <div className="grid grid-cols-4 gap-3">
                        {colorPalette.map((color) => (
                          <button
                            key={color.name}
                            type="button"
                            onClick={() => handleColorSelect(color.name)}
                            className={`relative p-4 rounded-lg border-2 transition-all ${
                              design.colors.includes(color.name)
                                ? "border-[var(--orange)] ring-2 ring-[var(--orange)]/20"
                                : "border-border hover:border-[var(--orange)]/50"
                            }`}
                          >
                            <div
                              className="w-full h-12 rounded"
                              style={{ backgroundColor: color.hex, border: color.name === "White" ? "1px solid #e5e7eb" : "none" }}
                            />
                            <p className="text-xs mt-2 font-medium">{color.name}</p>
                            {design.colors.includes(color.name) && (
                              <Badge className="absolute top-2 right-2 bg-[var(--orange)]">
                                {design.colors.indexOf(color.name) + 1}
                              </Badge>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="details" className="space-y-6">
                    <div>
                      <Label className="mb-3 block">Custom Notes</Label>
                      <Textarea
                        placeholder="Add any specific requirements or design ideas..."
                        value={design.customNotes}
                        onChange={(e) => setDesign({ ...design, customNotes: e.target.value })}
                        rows={6}
                      />
                    </div>

                    <div>
                      <Label className="flex items-center gap-2 mb-3">
                        <Upload className="w-4 h-4 text-[var(--orange)]" />
                        Upload Design Reference (Optional)
                      </Label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setDesign({ ...design, designFile: e.target.files?.[0] || null })}
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Upload any inspiration images or design sketches
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            </div>

            {/* Summary Panel */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Design Summary</h3>
                  
                  <div className="space-y-3 mb-6">
                    {design.shape && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shape:</span>
                        <span className="font-medium">{design.shape}</span>
                      </div>
                    )}
                    {design.width && design.length && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Size:</span>
                        <span className="font-medium">{design.width} × {design.length} ft</span>
                      </div>
                    )}
                    {design.pattern && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Pattern:</span>
                        <span className="font-medium">{design.pattern}</span>
                      </div>
                    )}
                    {design.material && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Material:</span>
                        <span className="font-medium">{design.material}</span>
                      </div>
                    )}
                    {design.colors.length > 0 && (
                      <div>
                        <span className="text-sm text-muted-foreground block mb-2">Colors:</span>
                        <div className="flex flex-wrap gap-2">
                          {design.colors.map((colorName) => (
                            <Badge key={colorName} variant="secondary">
                              {colorName}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-4 mb-6">
                    <Button 
                      onClick={calculatePrice}
                      variant="outline"
                      className="w-full mb-3"
                      disabled={!design.shape || !design.pattern || !design.material}
                    >
                      Calculate Price
                    </Button>
                    {estimatedPrice > 0 && (
                      <div className="bg-[var(--orange)]/10 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Estimated Price</p>
                        <p className="text-3xl font-bold text-[var(--orange)]">${estimatedPrice}</p>
                        <p className="text-xs text-muted-foreground mt-1">Final price confirmed after review</p>
                      </div>
                    )}
                  </div>

                  <Button 
                    onClick={handleAddToCart}
                    className="w-full bg-[var(--orange)] hover:bg-[var(--orange-dark)] text-white"
                    size="lg"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>

                  <p className="text-xs text-center text-muted-foreground mt-4">
                    Our team will review your design and contact you within 24 hours
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
