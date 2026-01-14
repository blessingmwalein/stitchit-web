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
import { LogIn, Mail, Lock, ArrowLeft, Home } from "lucide-react"
import { useAppDispatch } from "@/store/hooks"
import { loginClient } from "@/store/slices/authSlice"
import { loginSchema } from "@/lib/validation"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { authApi } from "@/lib/api/auth"
import { toast } from "sonner"
import { FaGoogle } from "react-icons/fa"

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<{ login: string; password: string }>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const onSubmit = async (values: { login: string; password: string }) => {
    setServerError(null);
    try {
      await dispatch(loginClient(values)).unwrap();
      toast.success("Login successful")
      router.push('/profile');
    } catch (err: any) {
      if (err?.errors && typeof err.errors === 'object') {
        Object.entries(err.errors as Record<string, string[]>).forEach(([field, messages]) => {
          const message = Array.isArray(messages) ? messages[0] : undefined;
          if (!message) return;
          if (field === 'login') setError('login', { type: 'server', message });
          if (field === 'password') setError('password', { type: 'server', message });
        });
      }
      const message = err?.message || 'Login failed. Please try again.';
      setServerError(message);
      toast.error(message);
    }
  };

  const handleGoogleLogin = async () => {
    setServerError(null);
    try {
      const res = await authApi.getGoogleRedirectUrl();
      window.location.href = res.data.url;
    } catch (err: any) {
      const message = err?.message || 'Failed to start Google login';
      setServerError(message);
      toast.error(message);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-[#faf9f7] via-[#f5f1ed] to-[#faf9f7] relative overflow-hidden flex items-center justify-center">
      {/* Decorative Shapes */}
      <div className="absolute top-20 -left-20 w-72 h-72 bg-[var(--orange)]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 -right-20 w-96 h-96 bg-[var(--orange)]/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-[var(--orange)]/5 rounded-full blur-2xl" />
      
      {/* Animated Watermark */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        className="absolute bottom-0 left-0 pointer-events-none select-none overflow-hidden"
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
      <div className="absolute top-6 left-6 flex gap-3 z-20">
        <Button asChild variant="outline" className="rounded-full" size="sm">
          <Link href="/">
            <Home className="w-4 h-4 mr-2" />
            Home
          </Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full" size="sm" onClick={() => router.back()}>
          <button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
        </Button>
      </div>
      
      <main className="w-full px-6 relative z-10">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Branding */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="hidden lg:block"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-4 text-sm text-[#8a7a72]">
                  <span>Welcome</span>
                  <span className="w-8 h-px bg-[#8a7a72]" />
                  <span>Back</span>
                </div>
                <h1 className="text-5xl font-light text-[#2c2420] leading-tight">
                  Sign in to
                  <br />
                  <span className="text-[var(--orange)] italic font-serif">Stitch't</span>
                </h1>
                <p className="text-[#5a4a42] leading-relaxed max-w-md">
                  Access your account to manage orders, track your custom rug designs, and explore our premium collections.
                </p>
                <div className="pt-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-[#5a4a42]">
                    <span className="w-2 h-2 bg-[var(--orange)] rounded-full" />
                    Track your orders in real-time
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#5a4a42]">
                    <span className="w-2 h-2 bg-[var(--orange)] rounded-full" />
                    Save your favorite designs
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#5a4a42]">
                    <span className="w-2 h-2 bg-[var(--orange)] rounded-full" />
                    Exclusive member benefits
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Form */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="p-8 md:p-10 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-[var(--orange)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LogIn className="w-8 h-8 text-[var(--orange)]" />
                </div>
                <h1 className="text-3xl font-light text-[#2c2420] mb-2">
                  Welcome <span className="text-[var(--orange)] italic font-serif">Back</span>
                </h1>
                <p className="text-muted-foreground">Sign in to your account</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Label htmlFor="login" className="flex items-center gap-2 mb-3">
                    <Mail className="w-4 h-4 text-[var(--orange)]" />
                    Phone or Email
                  </Label>
                  <Input
                    id="login"
                    {...register('login')}
                    placeholder="+263771234567 or john@example.com"
                    className={`rounded-full h-12 px-4 ${errors.login ? "border-red-500" : ""}`}
                  />
                  {errors.login && <p className="text-red-500 text-sm mt-2">{errors.login.message}</p>}
                </div>

                <div>
                  <Label htmlFor="password" className="flex items-center gap-2 mb-3">
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

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-muted-foreground">Remember me</span>
                  </label>
                  <Link href="/auth/forgot-password" className="text-[var(--orange)] hover:underline">
                    Forgot password?
                  </Link>
                </div>

                {serverError && (
                  <p className="text-red-600 text-sm text-center">{serverError}</p>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[var(--orange)] hover:bg-[var(--orange-dark)] text-white rounded-full h-12"
                  size="lg"
                >
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <Separator className="my-6" />

              <Button
                type="button"
                onClick={handleGoogleLogin}
                variant="outline"
                className="w-full rounded-full h-12"
              >
                <FaGoogle className="mr-2 h-4 w-4" />
                Continue with Google
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/auth/signup" className="text-[var(--orange)] font-semibold hover:underline">
                  Sign up
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
