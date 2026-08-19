"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, LoginInput } from "@/lib/schemas"
import { loginUser } from "@/actions/auth"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"

export default function LoginPage() {
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginInput) {
    setServerError(null)
    const result = await loginUser(data)
    if (result?.error) {
      setServerError(result.error)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      
      {/* Soft decorative background blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-200/40 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Container Card */}
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl shadow-emerald-950/5 overflow-hidden flex flex-col lg:flex-row relative z-10 border border-emerald-900/10">
        
        {/* Left Side: Login Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-between bg-white">
          <div>
            {/* Logo */}
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-emerald-700/20">
                T
              </div>
              <span className="text-xl font-extrabold tracking-tight text-gray-900">TechSocial</span>
            </div>

            {/* Title */}
            <div className="mb-6">
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
                Welcome Back!
              </h1>
              <p className="text-gray-500 text-sm">
                Please log in to your account.
              </p>
            </div>

            {serverError && (
              <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="tuheirana@gmail.com"
                {...register("email")}
                error={errors.email?.message}
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                error={errors.password?.message}
              />

              <div className="flex items-center justify-between text-sm pt-1">
                <label className="flex items-center text-gray-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="w-4 h-4 mr-2 rounded border-gray-300 text-emerald-700 focus:ring-emerald-600 accent-emerald-700"
                  />
                  Remember me
                </label>
                <Link
                  href="/forgot-password"
                  className="text-rose-500 hover:text-rose-600 font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="w-full sm:w-1/2 bg-emerald-800 hover:bg-emerald-900 text-white py-3 rounded-xl shadow-lg shadow-emerald-800/20 font-medium transition-all"
                >
                  Login
                </Button>
                
                <Link
                  href="/register"
                  className="w-full sm:w-1/2 text-center py-3 px-4 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium transition-all text-sm"
                >
                  Create account
                </Link>
              </div>
            </form>
          </div>

          <div className="mt-8 text-xs text-gray-400">
            By logging in you agree to our terms and data policy.
          </div>
        </div>

        {/* Center Floating Yellow Action Button */}
        <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 items-center justify-center w-12 h-12 bg-amber-400 rounded-full shadow-xl border-4 border-white cursor-pointer hover:scale-110 transition-transform">
          <svg className="w-5 h-5 text-emerald-950 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
          </svg>
        </div>

        {/* Right Side: Emerald Nature/Tech Graphic Side */}
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-emerald-800 to-emerald-950 relative min-h-[350px] lg:min-h-[550px] flex items-center justify-center p-8 overflow-hidden">
          
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:20px_20px] opacity-15"></div>

          {/* Glassmorphism Badge Box inside Right Panel */}
          <div className="bg-emerald-950/50 backdrop-blur-md border border-emerald-500/20 p-8 rounded-3xl shadow-2xl max-w-sm text-white text-center relative z-20">
            <span className="inline-block px-3 py-1 bg-amber-400 text-emerald-950 font-extrabold text-xs rounded-full mb-3 shadow">
              TECH COMMUNITY
            </span>
            <h3 className="text-2xl font-bold mb-2">Explore & Share</h3>
            <p className="text-emerald-100/80 text-sm leading-relaxed">
              Connect with passionate developers and gadget lovers in an ecosystem built for performance.
            </p>
          </div>

        </div>

      </div>
    </div>
  )
}