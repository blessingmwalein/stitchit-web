"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useDispatch, useSelector } from "react-redux"
import { loginAsync } from "@/redux/slices/authSlice"
import type { AppDispatch, RootState } from "@/redux/store"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { useState } from "react"
import { showSnackbar } from "@/redux/slices/snackbarSlice"

const loginSchema = yup.object({
  email: yup.string().email("Invalid email address").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
})

type LoginFormData = yup.InferType<typeof loginSchema>

export default function LoginForm() {
  const dispatch = useDispatch<AppDispatch>()
  const { loading, error } = useSelector((state: RootState) => state.auth)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await dispatch(loginAsync(data))
      if (loginAsync.fulfilled.match(result)) {
        dispatch(showSnackbar({ message: "Login successful! Welcome back.", severity: "success" }))
      }
    } catch (error) {
      // Error handling is done in the slice
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
              {...register("email")}
            />
          </div>
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <Button variant="link" className="h-auto p-0 text-xs text-blue-600 hover:text-blue-500">
              Forgot password?
            </Button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className={`pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
              {...register("password")}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </div>

        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3" disabled={loading}>
          {loading ? "Signing in..." : "Continue"}
        </Button>
      </form>
    </motion.div>
  )
}
