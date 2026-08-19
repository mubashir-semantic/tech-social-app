"use client"

import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { setNewPassword } from "@/actions/auth"

// Form Component
function NewPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token") // Extracting token from the URL
  const router = useRouter()

  const [password, setPassword] = useState("")
  const [status, setStatus] = useState<{ error?: string; success?: string } | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!token) return

    setLoading(true)
    setStatus(null)
    
    const result = await setNewPassword(password, token)
    
    if (result?.error) {
      setStatus({ error: result.error })
      setLoading(false)
    } else if (result?.success) {
      setStatus({ success: result.success })
      // Redirect user to login page after 2 seconds
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    }
  }

  if (!token) {
    return (
      <div className="text-center p-8">
        <h1 className="text-red-500 font-bold text-xl mb-2">Invalid Link</h1>
        <p className="text-gray-600 mb-4">This password reset link is invalid.</p>
        <Link href="/login" className="text-indigo-600 hover:underline">Go to Login</Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Set New Password</h1>
        <p className="text-sm text-gray-500 mt-2">Please enter your new password.</p>
      </div>
      
      {status?.error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded">{status.error}</p>}
      {status?.success && <p className="text-sm text-green-600 bg-green-50 p-3 rounded">{status.success}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input 
          label="New Password" 
          type="password" 
          placeholder="••••••••" 
          required 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <Button type="submit" isLoading={loading} className="w-full bg-indigo-600 hover:bg-indigo-700">
          Update Password
        </Button>
      </form>
    </div>
  )
}

// Main Page Component
export default function NewPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Suspense is needed when using useSearchParams in Next.js */}
      <Suspense fallback={<div>Loading...</div>}>
        <NewPasswordForm />
      </Suspense>
    </div>
  )
}