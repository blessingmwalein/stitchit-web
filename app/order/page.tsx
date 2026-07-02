'use client';

import type { ReactNode } from 'react';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'sonner';
import {
  ArrowRight, ArrowLeft, Check, Upload, X, Loader2,
  Minus, Plus, Sparkles, Palette, FileImage,
} from 'lucide-react';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { orderApi, ComplexityLevel, ShapeType } from '@/lib/api/order';
import { useAppSelector } from '@/store/hooks';

// ── Constants ────────────────────────────────────────────────────────────────

const SHAPES: { value: ShapeType; label: string; description: string; svg: ReactNode }[] = [
  {
    value: 'RECTANGLE',
    label: 'Rectangle',
    description: 'Classic, versatile',
    svg: (
      <svg viewBox="0 0 100 70" className="w-full h-full">
        <rect x="5" y="10" width="90" height="50" rx="4" fill="currentColor" />
      </svg>
    ),
  },
  {
    value: 'RUNNER',
    label: 'Runner',
    description: 'Long & narrow',
    svg: (
      <svg viewBox="0 0 100 40" className="w-full h-full">
        <rect x="2" y="12" width="96" height="16" rx="4" fill="currentColor" />
      </svg>
    ),
  },
  {
    value: 'ROUND',
    label: 'Circle',
    description: 'Soft & elegant',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="44" fill="currentColor" />
      </svg>
    ),
  },
  {
    value: 'OVAL',
    label: 'Oval',
    description: 'Graceful ellipse',
    svg: (
      <svg viewBox="0 0 120 80" className="w-full h-full">
        <ellipse cx="60" cy="40" rx="56" ry="34" fill="currentColor" />
      </svg>
    ),
  },
  {
    value: 'CUSTOM',
    label: 'Custom',
    description: 'Your unique shape',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path d="M50,8 L80,20 L92,50 L80,80 L50,92 L20,80 L8,50 L20,20 Z" fill="currentColor" />
      </svg>
    ),
  },
];

const COMPLEXITIES: {
  value: ComplexityLevel;
  label: string;
  description: string;
  badge: string;
  dots: number;
}[] = [
  { value: 'SIMPLE', label: 'Simple', description: 'Solid colors, basic geometry', badge: 'Most affordable', dots: 1 },
  { value: 'MEDIUM', label: 'Standard', description: '2–4 colors, moderate patterns', badge: 'Popular choice', dots: 2 },
  { value: 'COMPLEX', label: 'Complex', description: 'Rich detail, multiple colors', badge: 'Premium', dots: 3 },
  { value: 'VERY_COMPLEX', label: 'Masterpiece', description: 'Intricate art, custom imagery', badge: 'Bespoke luxury', dots: 4 },
];

const COLOR_PALETTE = [
  { name: 'Ivory', hex: '#f5f0e8' },
  { name: 'Cream', hex: '#f0e6d0' },
  { name: 'Sand', hex: '#d4b896' },
  { name: 'Blush', hex: '#e8c5b2' },
  { name: 'Terracotta', hex: '#c07950' },
  { name: 'Rust', hex: '#8b3e25' },
  { name: 'Amber', hex: '#d97706' },
  { name: 'Orange', hex: '#f97316' },
  { name: 'Gold', hex: '#d4a017' },
  { name: 'Chocolate', hex: '#5c3318' },
  { name: 'Sage', hex: '#9cad8e' },
  { name: 'Forest', hex: '#4a6741' },
  { name: 'Sky', hex: '#7fb4cc' },
  { name: 'Navy', hex: '#2d4a6e' },
  { name: 'Warm White', hex: '#fffaf4' },
  { name: 'Charcoal', hex: '#3d3d3d' },
  { name: 'Ebony', hex: '#1a1a1a' },
  { name: 'Silver', hex: '#b8b8b8' },
];

const STEP_LABELS = ['Start', 'Design', 'Style', 'You'];

// ── Schema ───────────────────────────────────────────────────────────────────

const schema = yup.object({
  startingPoint: yup.string().required('Please choose a starting point'),
  shape: yup.string().required('Please select a shape'),
  widthCm: yup
    .number()
    .typeError('Enter a number')
    .min(30, 'Minimum 30 cm')
    .max(1000, 'Maximum 1000 cm')
    .required('Width is required'),
  heightCm: yup
    .number()
    .typeError('Enter a number')
    .min(30, 'Minimum 30 cm')
    .max(1000, 'Maximum 1000 cm')
    .required('Height is required'),
  complexity: yup.string().required('Please select a complexity level'),
  colors: yup.array().of(yup.string().required()).default([]),
  otherColors: yup.string().optional(),
  quantity: yup.number().min(1).max(20).required().default(1),
  notes: yup.string().max(1000).optional(),
  clientName: yup.string().required('Your name is required'),
  clientPhone: yup.string().required('WhatsApp number is required'),
  clientEmail: yup.string().email('Enter a valid email').optional().nullable(),
  deliveryAddress: yup.string().optional(),
}).required();

type FormValues = yup.InferType<typeof schema>;

// ── Wizard ────────────────────────────────────────────────────────────────────

function OrderWizardInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { client } = useAppSelector((state) => state.auth);

  const galleryFrom = searchParams.get('from');
  const galleryName = searchParams.get('name');
  const galleryWidthCm = searchParams.get('widthCm');
  const galleryHeightCm = searchParams.get('heightCm');

  const TOTAL_STEPS = 4;
  const minStep = galleryFrom ? 2 : 1;
  const [step, setStep] = useState(minStep);
  const [direction, setDirection] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [price, setPrice] = useState<number | null>(null);
  const [priceLoading, setPriceLoading] = useState(false);
  const [designFile, setDesignFile] = useState<File | null>(null);
  const [designPreview, setDesignPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      startingPoint: galleryFrom ? 'gallery' : (undefined as any),
      shape: 'RECTANGLE',
      widthCm: galleryWidthCm ? Number(galleryWidthCm) : (undefined as any),
      heightCm: galleryHeightCm ? Number(galleryHeightCm) : (undefined as any),
      complexity: 'MEDIUM',
      colors: [],
      quantity: 1,
      clientName: [client?.firstName, client?.lastName].filter(Boolean).join(' '),
      clientEmail: client?.email ?? '',
      clientPhone: client?.phone ?? '',
    },
  });

  const widthCm = watch('widthCm');
  const heightCm = watch('heightCm');
  const shape = watch('shape');
  const complexity = watch('complexity');
  const colors = watch('colors') ?? [];
  const quantity = watch('quantity') ?? 1;
  const startingPoint = watch('startingPoint');

  // Live price estimate
  useEffect(() => {
    if (!widthCm || !heightCm || Number(widthCm) < 30 || Number(heightCm) < 30) return;
    const timer = setTimeout(async () => {
      setPriceLoading(true);
      try {
        const res = await orderApi.calculateRugPrice({
          widthCm: Number(widthCm),
          heightCm: Number(heightCm),
          complexity: complexity as ComplexityLevel,
          shape: shape as ShapeType,
        });
        setPrice(res.data.pricing.finalPrice);
      } catch {
        // silent
      } finally {
        setPriceLoading(false);
      }
    }, 700);
    return () => clearTimeout(timer);
  }, [widthCm, heightCm, shape, complexity]);

  const handleFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File must be under 5 MB');
      return;
    }
    setDesignFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setDesignPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const getStepFields = (s: number): (keyof FormValues)[] => {
    switch (s) {
      case 1: return ['startingPoint'];
      case 2: return ['shape', 'widthCm', 'heightCm', 'complexity'];
      case 3: return ['quantity'];
      case 4: return ['clientName', 'clientPhone'];
      default: return [];
    }
  };

  const goNext = async () => {
    const valid = await trigger(getStepFields(step) as any);
    if (!valid) return;
    setDirection(1);
    setStep((s) => Math.min(TOTAL_STEPS, s + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(minStep, s - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleColor = (colorName: string) => {
    const current = colors ?? [];
    const next = current.includes(colorName)
      ? current.filter((c) => c !== colorName)
      : [...current, colorName];
    setValue('colors', next);
  };

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    try {
      // Upload design file to Supabase via server route, then include URL in message
      let designUrl: string | null = null;
      if (designFile) {
        const uploadForm = new FormData();
        uploadForm.append('file', designFile);
        const res = await fetch('/api/upload-design', { method: 'POST', body: uploadForm });
        if (res.ok) {
          const json = await res.json();
          designUrl = json.url ?? null;
        }
      }

      const shapeLabel = SHAPES.find((s) => s.value === data.shape)?.label ?? data.shape;
      const complexLabel = COMPLEXITIES.find((c) => c.value === data.complexity)?.label ?? data.complexity;

      const lines = [
        galleryFrom && galleryName ? `Inspired by: ${galleryName}` : null,
        `Shape: ${shapeLabel}`,
        `Size: ${data.widthCm} × ${data.heightCm} cm`,
        `Detail level: ${complexLabel}`,
        (data.colors?.length ?? 0) > 0 ? `Colors: ${data.colors!.join(', ')}` : null,
        data.otherColors ? `Other colors: ${data.otherColors}` : null,
        `Quantity: ${data.quantity}`,
        price ? `Price estimate: $${Math.round(price * data.quantity).toLocaleString()}` : null,
        data.notes ? `Special requests: ${data.notes}` : null,
        data.deliveryAddress ? `Delivery address: ${data.deliveryAddress}` : null,
        designUrl ? `Design file: ${designUrl}` : null,
      ].filter(Boolean);

      await orderApi.submitPublicEnquiry({
        name: data.clientName,
        ...(data.clientEmail && { email: data.clientEmail }),
        whatsappNumber: data.clientPhone,
        source: 'WEBSITE',
        message: lines.join('\n'),
      });
      toast.success("Order request submitted! We'll reach out on WhatsApp within 24 hours.");
      router.push('/');
    } catch {
      toast.error('Something went wrong. Please try again or WhatsApp us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  // Proportion preview dimensions
  const w = Number(widthCm) || 120;
  const h = Number(heightCm) || 80;
  const maxPW = 180;
  const maxPH = 110;
  const ratio = w / h;
  const previewW = ratio > maxPW / maxPH ? maxPW : maxPH * ratio;
  const previewH = ratio > maxPW / maxPH ? maxPW / ratio : maxPH;

  const estimatedTotal = price ? Math.round(price * Number(quantity)) : null;

  const slideVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
  };

  const visibleSteps = Array.from({ length: TOTAL_STEPS - minStep + 1 }, (_, i) => minStep + i);

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <Header />

      <main className="pt-24 pb-20">
        <div className="container mx-auto max-w-4xl px-4">

          {/* Step progress */}
          <div className="mb-10 mt-4 max-w-xs mx-auto">
            <div className="flex justify-between mb-3">
              {visibleSteps.map((s) => (
                <span
                  key={s}
                  className={`text-xs font-medium transition-colors ${step >= s ? 'text-[#2c2420]' : 'text-gray-300'}`}
                >
                  {STEP_LABELS[s - 1]}
                </span>
              ))}
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--orange)] rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${((step - minStep) / (TOTAL_STEPS - minStep)) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Gallery inspiration banner */}
          {galleryFrom && galleryName && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex justify-center"
            >
              <div className="inline-flex items-center gap-2 bg-[var(--orange)]/10 border border-[var(--orange)]/30 text-[var(--orange)] px-5 py-2 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Inspired by <span className="font-semibold">{galleryName}</span>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: 'easeInOut' }}
              >
                {/* ── Step 1: Starting point ────────────────────────────────── */}
                {step === 1 && (
                  <div>
                    <div className="text-center mb-10">
                      <h1 className="text-4xl md:text-5xl font-light text-[#2c2420]">
                        How would you like to{' '}
                        <span className="font-serif italic text-[var(--orange)]">start?</span>
                      </h1>
                      <p className="mt-3 text-muted-foreground">Choose your journey</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
                      {/* Gallery option */}
                      <button
                        type="button"
                        onClick={() => {
                          setValue('startingPoint', 'gallery');
                          setDirection(1);
                          setStep(2);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="group relative p-8 rounded-2xl border-2 border-border bg-white text-left hover:border-[var(--orange)]/60 hover:shadow-lg transition-all duration-200"
                      >
                        <div className="mb-5 w-14 h-14 rounded-2xl bg-[var(--orange)]/10 flex items-center justify-center">
                          <svg viewBox="0 0 32 32" className="w-7 h-7 text-[var(--orange)] fill-current">
                            <rect x="4" y="4" width="24" height="24" rx="3" opacity="0.2" />
                            <rect x="4" y="4" width="24" height="24" rx="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
                            <path d="M4 18 l8-7 l5 5 l4-4 l7 7" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="10.5" cy="12" r="2" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-[#2c2420] mb-2">From our Gallery</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          You've seen a rug you love — order the exact same design or a variation of it
                        </p>
                        <div className="mt-4 flex items-center gap-2 text-[var(--orange)] text-sm font-medium">
                          Browse gallery first
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </button>

                      {/* Custom option */}
                      <button
                        type="button"
                        onClick={() => {
                          setValue('startingPoint', 'custom');
                          setDirection(1);
                          setStep(2);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="group relative p-8 rounded-2xl border-2 border-border bg-white text-left hover:border-[var(--orange)]/60 hover:shadow-lg transition-all duration-200"
                      >
                        <div className="mb-5 w-14 h-14 rounded-2xl bg-[#2c2420]/8 flex items-center justify-center" style={{ background: 'rgba(44,36,32,0.07)' }}>
                          <svg viewBox="0 0 32 32" className="w-7 h-7">
                            <path d="M8 24 L8 19 L20 7 L25 12 L13 24 Z" fill="#2c2420" opacity="0.85" />
                            <path d="M20 7 L24 3 L29 8 L25 12 Z" fill="#f97316" />
                            <circle cx="9" cy="25" r="2" fill="#2c2420" opacity="0.5" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-[#2c2420] mb-2">Design from Scratch</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          You have something specific in mind — tell us and we'll craft it exactly as you imagine
                        </p>
                        <div className="mt-4 flex items-center gap-2 text-[#2c2420] text-sm font-medium">
                          Start designing
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </button>
                    </div>

                    {errors.startingPoint && (
                      <p className="text-center text-red-500 text-sm mt-4">{errors.startingPoint.message}</p>
                    )}
                  </div>
                )}

                {/* ── Step 2: Rug Design ────────────────────────────────────── */}
                {step === 2 && (
                  <div className="space-y-10">
                    <div className="text-center">
                      <h1 className="text-4xl md:text-5xl font-light text-[#2c2420]">
                        Design your{' '}
                        <span className="font-serif italic text-[var(--orange)]">rug</span>
                      </h1>
                      <p className="mt-3 text-muted-foreground">Shape, size, and detail level</p>
                    </div>

                    {/* Shape */}
                    <div>
                      <h2 className="text-base font-semibold text-[#2c2420] mb-4 uppercase tracking-wide text-sm">
                        Shape
                      </h2>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                        {SHAPES.map((s) => {
                          const selected = shape === s.value;
                          return (
                            <button
                              key={s.value}
                              type="button"
                              onClick={() => setValue('shape', s.value)}
                              className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all duration-150
                                ${selected
                                  ? 'border-[var(--orange)] bg-[var(--orange)]/8 text-[var(--orange)]'
                                  : 'border-border bg-white text-gray-200 hover:border-[var(--orange)]/40 hover:text-[var(--orange)]/40'
                                }`}
                              style={selected ? { background: 'rgba(249,115,22,0.06)' } : {}}
                            >
                              <div className="w-12 h-10">{s.svg}</div>
                              <span className={`text-xs font-medium ${selected ? 'text-[var(--orange)]' : 'text-gray-500'}`}>
                                {s.label}
                              </span>
                              <span className={`text-[10px] ${selected ? 'text-[var(--orange)]/70' : 'text-gray-400'}`}>
                                {s.description}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      {errors.shape && <p className="text-red-500 text-sm mt-2">{errors.shape.message}</p>}
                    </div>

                    {/* Dimensions */}
                    <div>
                      <h2 className="text-sm font-semibold text-[#2c2420] mb-4 uppercase tracking-wide">
                        Dimensions
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm text-gray-600">Width (cm)</Label>
                            <Input
                              type="number"
                              {...register('widthCm')}
                              placeholder="e.g. 200"
                              className="mt-1.5 rounded-full"
                            />
                            {errors.widthCm && <p className="text-red-500 text-xs mt-1">{errors.widthCm.message}</p>}
                          </div>
                          <div>
                            <Label className="text-sm text-gray-600">Height (cm)</Label>
                            <Input
                              type="number"
                              {...register('heightCm')}
                              placeholder="e.g. 150"
                              className="mt-1.5 rounded-full"
                            />
                            {errors.heightCm && <p className="text-red-500 text-xs mt-1">{errors.heightCm.message}</p>}
                          </div>
                        </div>

                        {/* Proportion preview */}
                        <div className="flex flex-col items-center justify-center bg-[#f5f0ea] rounded-2xl p-6 h-44">
                          <div
                            className="border-2 border-[var(--orange)] rounded transition-all duration-500 flex items-center justify-center"
                            style={{
                              width: `${previewW}px`,
                              height: `${previewH}px`,
                              background: 'rgba(249,115,22,0.12)',
                            }}
                          >
                            {widthCm && heightCm && (
                              <span className="text-[10px] text-[var(--orange)] font-semibold px-1">
                                {widthCm} × {heightCm}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-3">Proportion preview</p>
                        </div>
                      </div>
                    </div>

                    {/* Complexity */}
                    <div>
                      <h2 className="text-sm font-semibold text-[#2c2420] mb-4 uppercase tracking-wide">
                        Detail Level
                      </h2>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {COMPLEXITIES.map((c) => {
                          const selected = complexity === c.value;
                          return (
                            <button
                              key={c.value}
                              type="button"
                              onClick={() => setValue('complexity', c.value)}
                              className={`p-4 rounded-xl border-2 text-left transition-all duration-150
                                ${selected
                                  ? 'border-[var(--orange)] bg-[var(--orange)]/5'
                                  : 'border-border bg-white hover:border-[var(--orange)]/40'
                                }`}
                            >
                              <div className="mb-2 flex gap-0.5">
                                {Array.from({ length: c.dots }).map((_, i) => (
                                  <span key={i} className={`w-2 h-2 rounded-full ${selected ? 'bg-[var(--orange)]' : 'bg-gray-300'}`} />
                                ))}
                              </div>
                              <div className={`text-sm font-semibold mb-1 ${selected ? 'text-[var(--orange)]' : 'text-[#2c2420]'}`}>
                                {c.label}
                              </div>
                              <div className="text-xs text-muted-foreground leading-tight">{c.description}</div>
                              <div className={`text-xs mt-2 font-medium ${selected ? 'text-[var(--orange)]' : 'text-gray-400'}`}>
                                {c.badge}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      {errors.complexity && <p className="text-red-500 text-sm mt-2">{errors.complexity.message}</p>}
                    </div>

                    {/* Price estimate */}
                    <div className="bg-[#2c2420] text-white rounded-xl p-5 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Estimated price</p>
                        <p className="text-xs text-white/40">Per rug · Final price confirmed after review</p>
                      </div>
                      <div>
                        {priceLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin text-[var(--orange)]" />
                        ) : price ? (
                          <span className="text-3xl font-serif text-[var(--orange)]">
                            ${Math.round(price).toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-gray-500 text-sm">Enter size above</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Step 3: Style ─────────────────────────────────────────── */}
                {step === 3 && (
                  <div className="space-y-10">
                    <div className="text-center">
                      <h1 className="text-4xl md:text-5xl font-light text-[#2c2420]">
                        Make it{' '}
                        <span className="font-serif italic text-[var(--orange)]">yours</span>
                      </h1>
                      <p className="mt-3 text-muted-foreground">Colors, inspiration, and any special requests</p>
                    </div>

                    {/* Colors */}
                    <div>
                      <h2 className="text-sm font-semibold text-[#2c2420] uppercase tracking-wide mb-1 flex items-center gap-2">
                        <Palette className="w-4 h-4 text-[var(--orange)]" /> Your Colors
                      </h2>
                      <p className="text-sm text-muted-foreground mb-5">
                        Tap to select the colors you'd like — choose as many as you want
                      </p>
                      <div className="grid grid-cols-9 gap-2.5 max-w-sm">
                        {COLOR_PALETTE.map((c) => {
                          const selected = colors.includes(c.name);
                          return (
                            <button
                              key={c.name}
                              type="button"
                              onClick={() => toggleColor(c.name)}
                              title={c.name}
                              className={`relative group w-full aspect-square rounded-full border-2 transition-all duration-150
                                ${selected ? 'border-[#2c2420] scale-110 shadow-md' : 'border-gray-200 hover:scale-105 hover:border-gray-400'}`}
                              style={{ backgroundColor: c.hex }}
                            >
                              {selected && (
                                <span className="absolute inset-0 rounded-full bg-black/15 flex items-center justify-center">
                                  <Check className="w-3 h-3 text-white drop-shadow" />
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                      {colors.length > 0 && (
                        <p className="text-sm mt-6 text-[#2c2420]">
                          <span className="text-[var(--orange)] font-medium">Selected:</span> {colors.join(', ')}
                        </p>
                      )}
                      <div className="mt-4">
                        <Input
                          {...register('otherColors')}
                          placeholder="Any other shades? (e.g. dusty rose, deep burgundy, custom mix)"
                          className="rounded-full text-sm"
                        />
                      </div>
                    </div>

                    {/* Design upload */}
                    <div>
                      <h2 className="text-sm font-semibold text-[#2c2420] uppercase tracking-wide mb-1 flex items-center gap-2">
                        <FileImage className="w-4 h-4 text-[var(--orange)]" /> Design Inspiration
                        <span className="text-xs font-normal text-gray-400 normal-case tracking-normal">(optional)</span>
                      </h2>
                      <p className="text-sm text-muted-foreground mb-4">
                        Upload a photo, sketch, or pattern that captures your vision
                      </p>

                      {designPreview ? (
                        <div className="relative inline-block">
                          <img
                            src={designPreview}
                            alt="Design inspiration"
                            className="w-48 h-36 object-cover rounded-xl border border-border shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={() => { setDesignFile(null); setDesignPreview(null); }}
                            className="absolute -top-2 -right-2 bg-white border border-gray-200 rounded-full p-1.5 shadow-sm hover:bg-red-50 transition-colors"
                          >
                            <X className="w-3 h-3 text-gray-500" />
                          </button>
                          <p className="text-xs text-muted-foreground mt-2">{designFile?.name}</p>
                        </div>
                      ) : (
                        <label
                          className={`flex flex-col items-center justify-center w-full h-36 rounded-xl border-2 border-dashed cursor-pointer transition-all
                            ${dragOver
                              ? 'border-[var(--orange)] bg-[var(--orange)]/5'
                              : 'border-gray-200 hover:border-[var(--orange)]/50 bg-white'
                            }`}
                          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                          onDragLeave={() => setDragOver(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setDragOver(false);
                            const file = e.dataTransfer.files[0];
                            if (file) handleFile(file);
                          }}
                        >
                          <Upload className="w-7 h-7 text-gray-300 mb-2" />
                          <span className="text-sm text-gray-400">Drag & drop or click to upload</span>
                          <span className="text-xs text-gray-300 mt-1">PNG, JPG, PDF — max 5 MB</span>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*,application/pdf"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleFile(f);
                            }}
                          />
                        </label>
                      )}
                    </div>

                    {/* Quantity + Notes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-sm font-semibold text-[#2c2420] uppercase tracking-wide">
                          Quantity
                        </Label>
                        <div className="flex items-center gap-4 mt-3">
                          <button
                            type="button"
                            onClick={() => setValue('quantity', Math.max(1, Number(quantity) - 1))}
                            className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:border-[var(--orange)] hover:text-[var(--orange)] transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-3xl font-light w-10 text-center text-[#2c2420]">{quantity}</span>
                          <button
                            type="button"
                            onClick={() => setValue('quantity', Math.min(20, Number(quantity) + 1))}
                            className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:border-[var(--orange)] hover:text-[var(--orange)] transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-semibold text-[#2c2420] uppercase tracking-wide">
                          Special Requests
                        </Label>
                        <Textarea
                          {...register('notes')}
                          placeholder="Any specific requirements, patterns, or instructions..."
                          className="mt-3 rounded-xl resize-none text-sm"
                          rows={3}
                        />
                      </div>
                    </div>

                    {/* Running total */}
                    {estimatedTotal && (
                      <div
                        className="flex items-center justify-between rounded-xl p-4 border"
                        style={{ background: 'rgba(249,115,22,0.05)', borderColor: 'rgba(249,115,22,0.2)' }}
                      >
                        <span className="text-sm text-[#2c2420]">
                          {quantity} rug{Number(quantity) > 1 ? 's' : ''} × ${price ? Math.round(price).toLocaleString() : 0}
                        </span>
                        <span className="text-2xl font-serif text-[var(--orange)]">
                          ${estimatedTotal.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Step 4: Contact ───────────────────────────────────────── */}
                {step === 4 && (
                  <div className="space-y-8">
                    <div className="text-center">
                      <h1 className="text-4xl md:text-5xl font-light text-[#2c2420]">
                        Almost{' '}
                        <span className="font-serif italic text-[var(--orange)]">there!</span>
                      </h1>
                      <p className="mt-3 text-muted-foreground">
                        We'll reach out on WhatsApp to confirm your order
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Contact form */}
                      <div className="space-y-5">
                        <div>
                          <Label>Your name <span className="text-red-400">*</span></Label>
                          <Input
                            {...register('clientName')}
                            placeholder="Full name"
                            className="mt-1.5 rounded-full"
                          />
                          {errors.clientName && <p className="text-red-500 text-xs mt-1">{errors.clientName.message}</p>}
                        </div>
                        <div>
                          <Label>
                            WhatsApp number <span className="text-red-400">*</span>
                          </Label>
                          <Input
                            {...register('clientPhone')}
                            placeholder="+263 77 123 4567"
                            className="mt-1.5 rounded-full"
                          />
                          {errors.clientPhone && <p className="text-red-500 text-xs mt-1">{errors.clientPhone.message}</p>}
                        </div>
                        <div>
                          <Label>
                            Email{' '}
                            <span className="text-gray-400 font-normal">(optional)</span>
                          </Label>
                          <Input
                            {...register('clientEmail')}
                            type="email"
                            placeholder="you@example.com"
                            className="mt-1.5 rounded-full"
                          />
                          {errors.clientEmail && <p className="text-red-500 text-xs mt-1">{errors.clientEmail.message}</p>}
                        </div>
                        <div>
                          <Label>
                            Delivery address{' '}
                            <span className="text-gray-400 font-normal">(optional)</span>
                          </Label>
                          <Input
                            {...register('deliveryAddress')}
                            placeholder="Street, suburb, city"
                            className="mt-1.5 rounded-full"
                          />
                        </div>
                      </div>

                      {/* Order summary */}
                      <div className="bg-[#2c2420] text-white rounded-2xl p-6">
                        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-5">
                          Your Order
                        </h3>
                        <dl className="space-y-2.5 text-sm">
                          {galleryName && (
                            <div className="flex justify-between gap-4">
                              <dt className="text-white/50 shrink-0">Inspired by</dt>
                              <dd className="text-white text-right truncate">{galleryName}</dd>
                            </div>
                          )}
                          <div className="flex justify-between gap-4">
                            <dt className="text-white/50">Shape</dt>
                            <dd className="text-white">{SHAPES.find((s) => s.value === shape)?.label ?? shape}</dd>
                          </div>
                          <div className="flex justify-between gap-4">
                            <dt className="text-white/50">Size</dt>
                            <dd className="text-white">{widthCm || '—'} × {heightCm || '—'} cm</dd>
                          </div>
                          <div className="flex justify-between gap-4">
                            <dt className="text-white/50">Detail</dt>
                            <dd className="text-white">{COMPLEXITIES.find((c) => c.value === complexity)?.label ?? complexity}</dd>
                          </div>
                          {colors.length > 0 && (
                            <div className="flex justify-between gap-4">
                              <dt className="text-white/50 shrink-0">Colors</dt>
                              <dd className="text-white text-right">
                                {colors.slice(0, 3).join(', ')}{colors.length > 3 ? ` +${colors.length - 3}` : ''}
                              </dd>
                            </div>
                          )}
                          <div className="flex justify-between gap-4">
                            <dt className="text-white/50">Qty</dt>
                            <dd className="text-white">{quantity}</dd>
                          </div>
                          {designFile && (
                            <div className="flex justify-between gap-4">
                              <dt className="text-white/50">Design file</dt>
                              <dd className="text-white text-right truncate max-w-[60%]">{designFile.name}</dd>
                            </div>
                          )}
                        </dl>

                        {estimatedTotal && (
                          <div className="border-t border-white/10 mt-5 pt-5">
                            <div className="flex justify-between items-end">
                              <div>
                                <p className="text-xs text-white/40 mb-0.5">Estimated total</p>
                                <p className="text-xs text-white/30">Confirmed after review</p>
                              </div>
                              <span className="text-3xl font-serif text-[var(--orange)]">
                                ${estimatedTotal.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-[var(--orange)] hover:bg-[var(--orange-dark)] text-white h-14 rounded-full text-base font-normal"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Sending your request...
                        </>
                      ) : (
                        <>
                          Send Order Request
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>

                    <p className="text-center text-xs text-muted-foreground">
                      We'll contact you within 24 hours on WhatsApp to confirm pricing and begin your order
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation (steps 2 and 3) */}
            {step >= 2 && step <= 3 && (
              <div className="flex justify-between mt-10">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={goBack}
                  className="rounded-full text-gray-500"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button
                  type="button"
                  onClick={goNext}
                  className="bg-[#2c2420] hover:bg-[#3d3530] text-white rounded-full px-8"
                >
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {step === 4 && (
              <div className="mt-3 flex justify-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={goBack}
                  className="rounded-full text-gray-400 hover:text-gray-600"
                >
                  <ArrowLeft className="w-3 h-3 mr-1.5" /> Back to style
                </Button>
              </div>
            )}
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense>
      <OrderWizardInner />
    </Suspense>
  );
}
