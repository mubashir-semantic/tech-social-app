import { auth } from "@/auth"
import Link from "next/link"

export default async function Home() {
  const session = await auth()

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {session?.user ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Welcome to the Feed, <span className="text-indigo-600">{session.user.name || 'Techie'}</span>!
          </h1>
          <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
            Discover the latest tech trends, share your setup, and connect with fellow enthusiasts.
          </p>
          <button className="px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors">
            Create First Post
          </button>
        </div>
      ) : (
        <div className="text-center py-24">
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
            Share Your <span className="text-indigo-600">Tech Setup</span> <br /> With The World
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
            Join the community to discover new gadgets, read honest reviews, and connect with other tech enthusiasts.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/register" className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">
              Get Started
            </Link>
            <Link href="/login" className="px-8 py-3 bg-white text-gray-900 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              Log In
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}