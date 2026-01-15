'use client';

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { UserPlus, Mail, Lock, User, Phone, ChevronRight, ChevronLeft, Check, ArrowLeft, Home, Loader2 } from "lucide-react"
import { useAppDispatch } from "@/store/hooks"
import { registerClient } from "@/store/slices/authSlice"
import { signupSchema } from "@/lib/validation"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { authApi } from "@/lib/api/auth"
import Image from "next/image"
import { toast } from "sonner"
import { FaGoogle } from "react-icons/fa"

export default function SignupPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [step, setStep] = useState(1);

  const [serverError, setServerError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<{
    full_name: string;
    email?: string | null;
    phone: string;
    password: string;
    password_confirmation: string;
  }>({
    resolver: yupResolver(signupSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      password: "",
      password_confirmation: "",
    },
  });

  const handleNext = async () => {
    setServerError(null);
    const ok = await trigger(['full_name', 'email', 'phone']);
    if (ok) setStep(2);
  };

  const onSubmit = async (values: {
    full_name: string;
    email?: string | null;
    phone: string;
    password: string;
    password_confirmation: string;
  }) => {
    setServerError(null);
    try {
      await dispatch(
        registerClient({
          full_name: values.full_name,
          phone: values.phone,
          email: values.email || undefined,
          password: values.password,
          password_confirmation: values.password_confirmation,
        })
      ).unwrap();

      toast.success("Registration successful")

      router.push('/profile');
    } catch (err: any) {
      if (err?.errors && typeof err.errors === 'object') {
        Object.entries(err.errors as Record<string, string[]>).forEach(([field, messages]) => {
          const message = Array.isArray(messages) ? messages[0] : undefined;
          if (!message) return;

          if (field === 'full_name') setError('full_name', { type: 'server', message });
          if (field === 'email') setError('email', { type: 'server', message });
          if (field === 'phone') setError('phone', { type: 'server', message });
          if (field === 'password') setError('password', { type: 'server', message });
          if (field === 'password_confirmation') setError('password_confirmation', { type: 'server', message });
        });
      }
      const message = err?.message || 'Registration failed. Please try again.';
      setServerError(message);
      toast.error(message);
    }
  };

  const handleGoogleSignup = async () => {
    setServerError(null);
    setIsGoogleLoading(true);
    try {
      const res = await authApi.getGoogleRedirectUrl();
      window.location.href = res.data.url;
    } catch (err: any) {
      const message = err?.message || 'Failed to start Google signup';
      setServerError(message);
      toast.error(message);
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf9f7] via-[#f5f1ed] to-[#faf9f7] relative overflow-hidden flex items-center justify-center py-8 px-4">
      {/* Decorative Shapes */}
      <div className="absolute top-20 -right-20 w-72 h-72 bg-[var(--orange)]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 -left-20 w-96 h-96 bg-[var(--orange)]/10 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-[var(--orange)]/5 rounded-full blur-2xl" />

      {/* Animated Watermark */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        className="absolute bottom-0 left-0 pointer-events-none select-none overflow-hidden hidden md:block"
      >
        <div className="text-[20vw] font-bold text-[var(--orange)]/[0.10] leading-none whitespace-nowrap rotate-[-15deg]">
          Stitch't
        </div>
      </motion.div>

      {/* Pattern Background */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, var(--orange) 35px, var(--orange) 36px),
                         repeating-linear-gradient(-45deg, transparent, transparent 35px, var(--orange) 35px, var(--orange) 36px)`
      }} />

      {/* Navigation Buttons */}
      <div className="absolute top-4 left-4 flex gap-2 z-20">
        <Button asChild variant="outline" className="rounded-full" size="sm">
          <Link href="/">
            <Home className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">Home</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full" size="sm" onClick={() => router.back()}>
          <button>
            <ArrowLeft className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">Back</span>
          </button>
        </Button>
      </div>

      <main className="w-full relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Side - Branding */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="hidden lg:block"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-4 text-sm text-[#8a7a72]">
                  <span>Join</span>
                  <span className="w-8 h-px bg-[#8a7a72]" />
                  <span>Stitch't</span>
                </div>
                <h1 className="text-5xl font-light text-[#2c2420] leading-tight">
                  Create Your
                  <br />
                  <span className="text-[var(--orange)] italic font-serif">Account</span>
                </h1>
                <p className="text-[#5a4a42] leading-relaxed max-w-md">
                  Join our community of rug enthusiasts and start your journey to creating beautiful, custom tufted rugs for your space.
                </p>
                <div className="pt-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-[#5a4a42]">
                    <span className="w-2 h-2 bg-[var(--orange)] rounded-full" />
                    Design your custom rugs
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#5a4a42]">
                    <span className="w-2 h-2 bg-[var(--orange)] rounded-full" />
                    Track orders & delivery
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#5a4a42]">
                    <span className="w-2 h-2 bg-[var(--orange)] rounded-full" />
                    Exclusive collections access
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full"
            >
              <Card className="p-6 md:p-10 shadow-xl border-0 bg-white/80 backdrop-blur-sm w-full max-w-md mx-auto lg:max-w-none">
                <div className="text-center mb-4">
                  {/* <div className="w-14 h-14 bg-[var(--orange)]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <UserPlus className="w-7 h-7 text-[var(--orange)]" />
                  </div> */}
                  <h1 className="text-xl md:text-2xl font-light text-[#2c2420] mb-1">
                    Create <span className="text-[var(--orange)] italic font-serif">Account</span>
                  </h1>
                  <p className="text-sm text-muted-foreground">Step {step} of 2</p>
                </div>

                {/* Progress Indicator */}
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className={`flex items-center justify-center w-9 h-9 rounded-full text-sm ${step >= 1 ? 'bg-[var(--orange)] text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {step > 1 ? <Check className="w-4 h-4" /> : '1'}
                  </div>
                  <div className={`w-12 h-1 ${step >= 2 ? 'bg-[var(--orange)]' : 'bg-gray-200'}`} />
                  <div className={`flex items-center justify-center w-9 h-9 rounded-full text-sm ${step >= 2 ? 'bg-[var(--orange)] text-white' : 'bg-gray-200 text-gray-500'}`}>
                    2
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div>
                        <Label htmlFor="full_name" className="flex items-center gap-2 mb-2">
                          <User className="w-4 h-4 text-[var(--orange)]" />
                          Full Name
                        </Label>
                        <Input
                          id="full_name"
                          {...register('full_name')}
                          placeholder="John Doe"
                          className={`rounded-full h-12 px-4 ${errors.full_name ? "border-red-500" : ""}`}
                        />
                        {errors.full_name && <p className="text-red-500 text-sm mt-2">{errors.full_name.message}</p>}
                      </div>

                      <div>
                        <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                          <Mail className="w-4 h-4 text-[var(--orange)]" />
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          {...register('email')}
                          placeholder="john@example.com"
                          className={`rounded-full h-12 px-4 ${errors.email ? "border-red-500" : ""}`}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email.message}</p>}
                      </div>

                      <div>
                        <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
                          <Phone className="w-4 h-4 text-[var(--orange)]" />
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          {...register('phone')}
                          placeholder="+263 788 959 677"
                          className={`rounded-full h-12 px-4 ${errors.phone ? "border-red-500" : ""}`}
                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-2">{errors.phone.message}</p>}
                      </div>

                      <Button
                        type="button"
                        onClick={handleNext}
                        className="w-full bg-[var(--orange)] hover:bg-[var(--orange-dark)] text-white rounded-full h-12"
                        size="lg"
                      >
                        Next Step
                        <ChevronRight className="w-5 h-5 ml-2" />
                      </Button>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div>
                        <Label htmlFor="password" className="flex items-center gap-2 mb-2">
                          <Lock className="w-4 h-4 text-[var(--orange)]" />
                          Password
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          {...register('password')}
                          placeholder="••••••••"
                          className={`rounded-full h-12 px-4 ${errors.password ? "border-red-500" : ""}`}
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-2">{errors.password.message}</p>}
                      </div>

                      <div>
                        <Label htmlFor="password_confirmation" className="flex items-center gap-2 mb-2">
                          <Lock className="w-4 h-4 text-[var(--orange)]" />
                          Confirm Password
                        </Label>
                        <Input
                          id="password_confirmation"
                          type="password"
                          {...register('password_confirmation')}
                          placeholder="••••••••"
                          className={`rounded-full h-12 px-4 ${errors.password_confirmation ? "border-red-500" : ""}`}
                        />
                        {errors.password_confirmation && (
                          <p className="text-red-500 text-sm mt-2">{errors.password_confirmation.message}</p>
                        )}
                      </div>

                      <div className="flex gap-3">
                        <Button
                          type="button"
                          onClick={() => setStep(1)}
                          variant="outline"
                          className="rounded-full h-12 px-6"
                        >
                          <ChevronLeft className="w-5 h-5 mr-2" />
                          Back
                        </Button>
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex-1 bg-[var(--orange)] hover:bg-[var(--orange-dark)] text-white rounded-full h-12"
                          size="lg"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Creating account...
                            </>
                          ) : (
                            "Create Account"
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </form>

                {serverError && (
                  <p className="text-red-600 text-sm text-center mt-2">{serverError}</p>
                )}

                <Separator className="my-2" />

                <Button
                  type="button"
                  onClick={handleGoogleSignup}
                  disabled={isGoogleLoading}
                  variant="outline"
                  className="w-full rounded-full h-12"
                >
                  {isGoogleLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <FaGoogle className="mr-2 h-4 w-4" />
                      Continue with Google
                    </>
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground mt-6">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="text-[var(--orange)] font-semibold hover:underline">
                    Sign in
                  </Link>
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
