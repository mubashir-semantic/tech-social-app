"use client"

import { useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { resetPasswordRequest } from "@/actions/auth"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<{ error?: string; success?: string } | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault() // Prevent page reload
    setLoading(true)
    setStatus(null)
    
    const result = await resetPasswordRequest(email)
    
    if (result) {
      setStatus(result)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      
      {/* Soft decorative background blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-200/40 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Container Card */}
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl shadow-emerald-950/5 overflow-hidden flex flex-col lg:flex-row relative z-10 border border-emerald-900/10">
        
        {/* Left Side: Form */}
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
                Forgot Password?
              </h1>
              <p className="text-gray-500 text-sm">
                Enter your email and we will send you a password reset link.
              </p>
            </div>
            
            {status?.error && (
              <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
                {status.error}
              </div>
            )}
            
            {status?.success && (
              <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-700">
                {status.success}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input 
                label="Email Address" 
                type="email" 
                placeholder="john@example.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              
              <div className="pt-2">
                <Button type="submit" isLoading={loading} className="w-full bg-emerald-800 hover:bg-emerald-900 text-white py-3 rounded-xl shadow-lg shadow-emerald-800/20 font-medium transition-all">
                  Send Reset Link
                </Button>
              </div>
            </form>
          </div>
          
          <div className="mt-8 flex items-center justify-center text-sm text-gray-600 pt-4 border-t border-gray-100">
            <span>Remembered your password?</span>{" "}
            <Link href="/login" className="text-emerald-700 font-bold hover:underline ml-1.5">
              Log in
            </Link>
          </div>
        </div>

        {/* Right Side: Emerald Nature/Tech Graphic Side */}
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-emerald-800 to-emerald-950 relative min-h-[300px] lg:min-h-[400px] flex items-center justify-center p-8 overflow-hidden">
          
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:20px_20px] opacity-15"></div>

          {/* Glassmorphism Badge Box inside Right Panel */}
          <div className="bg-emerald-950/50 backdrop-blur-md border border-emerald-500/20 p-8 rounded-3xl shadow-2xl max-w-sm text-white text-center relative z-20">
            <span className="inline-block px-3 py-1 bg-amber-400 text-emerald-950 font-extrabold text-xs rounded-full mb-3 shadow">
              SECURITY RECOVERY
            </span>
            <h3 className="text-2xl font-bold mb-2">Account Recovery</h3>
            <p className="text-emerald-100/80 text-sm leading-relaxed">
              Don&apos;t worry, we&apos;ve got you covered. Follow the secure link sent to your email to regain access.
            </p>
          </div>

        </div>

      </div>
    </div>
  )
}