"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema, RegisterInput } from "@/lib/schemas"
import { registerUser } from "@/actions/auth"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"

export default function RegisterPage() {
  const [serverError, setServerError] = useState<string | null>(null)
  const router = useRouter()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema)
  })

  async function onSubmit(data: RegisterInput) {
    setServerError(null)
    const result = await registerUser(data)

    if (result?.error) {
      setServerError(result.error)
    } else if (result?.success) {
      router.push("/login")
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      
      {/* Soft decorative background blobs */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-amber-200/40 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Container Card */}
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl shadow-emerald-950/5 overflow-hidden flex flex-col-reverse lg:flex-row relative z-10 border border-emerald-900/10">
        
        {/* Left Side: Emerald Nature/Tech Graphic Side (Flipped for Register page) */}
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-emerald-800 to-emerald-950 relative min-h-[300px] lg:min-h-[550px] flex items-center justify-center p-8 overflow-hidden">
          
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:20px_20px] opacity-15"></div>

          {/* Glassmorphism Badge Box inside Left Panel */}
          <div className="bg-emerald-950/50 backdrop-blur-md border border-emerald-500/20 p-8 rounded-3xl shadow-2xl max-w-sm text-white text-center relative z-20">
            <span className="inline-block px-3 py-1 bg-amber-400 text-emerald-950 font-extrabold text-xs rounded-full mb-3 shadow">
              JOIN THE CLUB
            </span>
            <h3 className="text-2xl font-bold mb-2">Start Your Journey</h3>
            <p className="text-emerald-100/80 text-sm leading-relaxed">
              Create an account to connect with peers, share your setup, and dive into the latest tech discussions.
            </p>
          </div>

        </div>

        {/* Center Floating Yellow Action Button */}
        <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 items-center justify-center w-12 h-12 bg-amber-400 rounded-full shadow-xl border-4 border-white cursor-pointer hover:scale-110 transition-transform">
          <svg className="w-5 h-5 text-emerald-950 font-bold rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
          </svg>
        </div>

        {/* Right Side: Register Form */}
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
                Create Account
              </h1>
              <p className="text-gray-500 text-sm">
                Sign up to get started with your new account.
              </p>
            </div>

            {serverError && (
              <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input 
                label="Full Name" 
                placeholder="John Doe" 
                {...register("name")} 
                error={errors.name?.message} 
              />
              
              <Input 
                label="Email Address" 
                type="email" 
                placeholder="john@example.com" 
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
              
              <div className="pt-2">
                <Button 
                  type="submit" 
                  isLoading={isSubmitting} 
                  className="w-full bg-emerald-800 hover:bg-emerald-900 text-white py-3 rounded-xl shadow-lg shadow-emerald-800/20 font-medium transition-all"
                >
                  Sign Up
                </Button>
              </div>
            </form>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600 pt-4 border-t border-gray-100">
            <span>Already have an account?</span>
            <Link href="/login" className="text-emerald-700 font-bold hover:underline mt-1 sm:mt-0">
              Log in here
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}