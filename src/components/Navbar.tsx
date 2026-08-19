import Link from "next/link"
import { auth } from "@/auth"
import { logoutUser } from "@/actions/auth"

export default async function Navbar() {
  const session = await auth()

  return (
    <nav className="bg-white backdrop-blur-md border-b border-emerald-900/10 sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo with matching Emerald Icon */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 rounded-xl bg-emerald-700 flex items-center justify-center text-white font-bold text-base shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
                T
              </div>
              <span className="text-xl font-extrabold text-gray-900 tracking-tight">
                Tech<span className="text-emerald-700">Social</span>
              </span>
            </Link>
          </div>

          {/* Right Side Links / User Status */}
          <div className="flex items-center space-x-4">
            {session?.user ? (
              // Logged In State
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-2 bg-emerald-50 border border-emerald-900/10 px-3 py-1.5 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></div>
                  <span className="text-xs font-semibold text-emerald-900">
                    {session.user.name || session.user.email?.split('@')[0]}
                  </span>
                </div>
                
                <form action={logoutUser}>
                  <button 
                    type="submit" 
                    className="text-sm px-4 py-2 bg-gray-100 hover:bg-rose-50 hover:text-rose-600 text-gray-700 rounded-xl transition-all font-medium border border-gray-200/60"
                  >
                    Logout
                  </button>
                </form>
              </div>
            ) : (
              // Logged Out State
              <div className="flex items-center space-x-3">
                <Link 
                  href="/login" 
                  className="text-sm font-medium text-gray-600 hover:text-emerald-700 transition-colors px-3 py-2"
                >
                  Log in
                </Link>
                <Link 
                  href="/register" 
                  className="text-sm px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl shadow-md shadow-emerald-800/20 transition-all font-medium"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  )
}