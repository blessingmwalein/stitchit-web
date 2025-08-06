"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useDispatch, useSelector } from "react-redux"
import { registerAsync } from "@/redux/slices/authSlice"
import type { AppDispatch, RootState } from "@/redux/store"
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, ArrowRight, ArrowLeft, CheckCircle, Check } from "lucide-react"
import { useState } from "react"
import { showSnackbar } from "@/redux/slices/snackbarSlice"
import { useRouter } from "next/navigation"

const step1Schema = yup.object({
  name: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email address").required("Email is required"),
  phone_number: yup.string().required("Phone number is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password must be no more than 20 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      "Password must contain uppercase, lowercase, numbers, and symbols")
    .required("Password is required"),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
})

const step2Schema = yup.object({
  gender: yup.string().required("Gender is required"),
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
})

const fullSchema = step1Schema.concat(step2Schema)

type Step1Data = yup.InferType<typeof step1Schema>
type Step2Data = yup.InferType<typeof step2Schema>
type RegisterFormData = yup.InferType<typeof fullSchema> & { role: string }

export default function RegisterForm() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { loading } = useSelector((state: RootState) => state.auth)
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null)
  const [username, setUsername] = useState("")
  const [isUsernameValid, setIsUsernameValid] = useState(false)

  const step1Form = useForm<Step1Data>({
    resolver: yupResolver(step1Schema),
  })

  const step2Form = useForm<Step2Data>({
    resolver: yupResolver(step2Schema),
  })

  const onStep1Submit = (data: Step1Data) => {
    setStep1Data(data)
    setCurrentStep(2)
  }

  const onStep2Submit = async (data: Step2Data) => {
    if (!step1Data) return

    const fullData: RegisterFormData = { ...step1Data, ...data, role: "client" }
    try {
      const result = await dispatch(registerAsync(fullData))
      if (registerAsync.fulfilled.match(result)) {
        dispatch(showSnackbar({ message: "Account created successfully! Redirecting to profile...", severity: "success" }))
        setTimeout(() => {
          router.push("/profile")
        }, 2000)
      }
    } catch (error) {
      // Error handling is done in the slice
    }
  }

  const goBack = () => {
    setCurrentStep(1)
  }

  const handleUsernameChange = (value: string) => {
    setUsername(value)
    // Simple validation - you can add more complex validation here
    setIsUsernameValid(value.length >= 3 && /^[a-zA-Z0-9_]+$/.test(value))
  }

  const getPasswordStrength = (password: string) => {
    const hasLower = /[a-z]/.test(password)
    const hasUpper = /[A-Z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSymbol = /[@$!%*?&]/.test(password)
    const hasLength = password.length >= 8 && password.length <= 20

    return { hasLower, hasUpper, hasNumber, hasSymbol, hasLength }
  }

  const password = step1Form.watch("password") || ""

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Progress Indicator */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        <div className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            {currentStep > 1 ? <CheckCircle className="h-4 w-4" /> : "1"}
          </div>
          <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">Account Info</span>
        </div>
        <div className={`w-8 h-0.5 ${currentStep >= 2 ? "bg-blue-600" : "bg-gray-200"}`} />
        <div className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            2
          </div>
          <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">Profile Details</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <form onSubmit={step1Form.handleSubmit(onStep1Submit)} className="space-y-4">
              {/* Row 1: Phone Number and Full Name */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone_number" className="text-sm font-medium">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center">
                      <span className="text-sm text-gray-500 mr-2">🇦🇲</span>
                      <span className="text-sm text-gray-500">+374</span>
                    </div>
                    <Input
                      id="phone_number"
                      placeholder="0000 00 00"
                      className={`pl-16 ${step1Form.formState.errors.phone_number ? "border-red-500" : ""}`}
                      {...step1Form.register("phone_number")}
                    />
                  </div>
                  {step1Form.formState.errors.phone_number && (
                    <p className="text-sm text-red-500">{step1Form.formState.errors.phone_number.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      placeholder="Juliette Karapetyan"
                      className={`pl-10 ${step1Form.formState.errors.name ? "border-red-500" : ""}`}
                      {...step1Form.register("name")}
                    />
                  </div>
                  {step1Form.formState.errors.name && (
                    <p className="text-sm text-red-500">{step1Form.formState.errors.name.message}</p>
                  )}
                </div>
              </div>

              {/* Row 2: Username and Email */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">
                    Username
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="username"
                      placeholder="julietux"
                      value={username}
                      onChange={(e) => handleUsernameChange(e.target.value)}
                      className={`pl-10 pr-10 ${isUsernameValid ? "border-green-500" : ""}`}
                    />
                    {isUsernameValid && (
                      <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="user@example.com"
                      className={`pl-10 ${step1Form.formState.errors.email ? "border-red-500" : ""}`}
                      {...step1Form.register("email")}
                    />
                  </div>
                  {step1Form.formState.errors.email && (
                    <p className="text-sm text-red-500">{step1Form.formState.errors.email.message}</p>
                  )}
                </div>
              </div>

              {/* Row 3: Password and Confirm Password */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="***************"
                      className={`pl-10 pr-10 ${step1Form.formState.errors.password ? "border-red-500" : ""}`}
                      {...step1Form.register("password")}
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
                  {step1Form.formState.errors.password && (
                    <p className="text-sm text-red-500">{step1Form.formState.errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password_confirmation" className="text-sm font-medium">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password_confirmation"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="***************"
                      className={`pl-10 pr-10 ${step1Form.formState.errors.password_confirmation ? "border-red-500" : ""}`}
                      {...step1Form.register("password_confirmation")}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {step1Form.formState.errors.password_confirmation && (
                    <p className="text-sm text-red-500">{step1Form.formState.errors.password_confirmation.message}</p>
                  )}
                </div>
              </div>

                             {/* Password Requirements */}
               <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                 <p>At least 8 characters, no more than 20 characters. Uppercase letters, lowercase letters, numbers, and symbols.</p>
                 <div className="grid grid-cols-2 gap-1">
                   {(() => {
                     const strength = getPasswordStrength(password)
                     return [
                       { key: 'length', label: '8-20 characters', valid: strength.hasLength },
                      { key: 'lower', label: 'Lowercase', valid: strength.hasLower },
                      { key: 'upper', label: 'Uppercase', valid: strength.hasUpper },
                      { key: 'number', label: 'Number', valid: strength.hasNumber },
                      { key: 'symbol', label: 'Symbol', valid: strength.hasSymbol },
                    ].map(req => (
                      <div key={req.key} className={`flex items-center ${req.valid ? 'text-green-600' : 'text-gray-400'}`}>
                        <Check className={`h-3 w-3 mr-1 ${req.valid ? 'text-green-600' : 'text-gray-400'}`} />
                        {req.label}
                      </div>
                    ))
                  })()}
                </div>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3">
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <form onSubmit={step2Form.handleSubmit(onStep2Submit)} className="space-y-4">
              {/* Row 1: Gender and City */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-sm font-medium">
                    Gender
                  </Label>
                  <Controller
                    name="gender"
                    control={step2Form.control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className={step2Form.formState.errors.gender ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {step2Form.formState.errors.gender && (
                    <p className="text-sm text-red-500">{step2Form.formState.errors.gender.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-medium">
                    City
                  </Label>
                  <Input
                    id="city"
                    placeholder="Your city"
                    className={step2Form.formState.errors.city ? "border-red-500" : ""}
                    {...step2Form.register("city")}
                  />
                  {step2Form.formState.errors.city && (
                    <p className="text-sm text-red-500">{step2Form.formState.errors.city.message}</p>
                  )}
                </div>
              </div>

              {/* Row 2: Address */}
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium">
                  Address
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="address"
                    placeholder="Your full address"
                    className={`pl-10 ${step2Form.formState.errors.address ? "border-red-500" : ""}`}
                    {...step2Form.register("address")}
                  />
                </div>
                {step2Form.formState.errors.address && (
                  <p className="text-sm text-red-500">{step2Form.formState.errors.address.message}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-2">
                <Button type="button" variant="outline" onClick={goBack} className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3"
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
