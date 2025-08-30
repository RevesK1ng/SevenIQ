'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { 
  Menu, 
  X, 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  CreditCard,
  HelpCircle
} from 'lucide-react'

export default function Nav() {
  const { user, signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
      setIsAccountMenuOpen(false)
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-700 transition-colors">
              <span className="text-white font-bold text-lg">7</span>
            </div>
            <span className="text-xl font-bold text-gray-900">SevenIQ</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Home
            </Link>
            <Link href="/how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              How it works
            </Link>
            <Link href="/what-it-does" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              What it does
            </Link>
            <Link href="/try-now" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Try now
            </Link>
            <Link href="/pricing" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Pricing
            </Link>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* User menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium">
                      {user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${
                    isAccountMenuOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                <AnimatePresence>
                  {isAccountMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
                    >
                      <div className="p-2">
                        <div className="px-3 py-2 border-b border-gray-200">
                          <p className="text-sm font-medium text-gray-900">{user.email}</p>
                          <p className="text-xs text-gray-500">Demo Mode</p>
                        </div>
                        
                        <div className="py-1">
                          <Link
                            href="/try-now"
                            className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            onClick={() => setIsAccountMenuOpen(false)}
                          >
                            <User className="w-4 h-4" />
                            <span>Dashboard</span>
                          </Link>
                          
                          <Link
                            href="/pricing"
                            className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            onClick={() => setIsAccountMenuOpen(false)}
                          >
                            <CreditCard className="w-4 h-4" />
                            <span>Upgrade</span>
                          </Link>
                          
                          <Link
                            href="/try-now"
                            className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            onClick={() => setIsAccountMenuOpen(false)}
                          >
                            <HelpCircle className="w-4 h-4" />
                            <span>Help</span>
                          </Link>
                          
                          <Link
                            href="/try-now"
                            className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            onClick={() => setIsAccountMenuOpen(false)}
                          >
                            <Settings className="w-4 h-4" />
                            <span>Settings</span>
                          </Link>
                        </div>
                        
                        <div className="border-t border-gray-200 pt-1">
                          <button
                            onClick={handleSignOut}
                            className="flex items-center space-x-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full rounded-lg transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign out</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link href="/try-now" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                  Sign in
                </Link>
                <Link href="/try-now" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Try now
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-gray-200"
            >
              <div className="py-4 space-y-2">
                <Link
                  href="/"
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/how-it-works"
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  How it works
                </Link>
                <Link
                  href="/what-it-does"
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  What it does
                </Link>
                <Link
                  href="/try-now"
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Try now
                </Link>
                <Link
                  href="/pricing"
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pricing
                </Link>

                {!user && (
                  <div className="pt-2 border-t border-gray-200">
                    <Link
                      href="/try-now"
                      className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/try-now"
                      className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Try now
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
