'use client'

import Link from 'next/link'
import { Heart, Github, Twitter, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">7</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">SevenIQ</span>
            </Link>
            <p className="text-gray-600 mb-4 max-w-md">
              Transform complex topics into crystal-clear explanations using AI. 
              Perfect for students, professionals, and curious minds.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/RevesK1ng/SevenIQ" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="GitHub Repository"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="mailto:reverscodes@gmail.com"
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Email Contact"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/try-now" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Try Now
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="/what-it-does" className="text-gray-600 hover:text-gray-900 transition-colors">
                  What it does
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/try-now" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <a 
                  href="mailto:reverscodes@gmail.com" 
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-500">
              © 2024 SevenIQ. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                Made with <Heart className="w-4 h-4 text-red-500 mx-1" /> for learning
              </span>
              <span>•</span>
              <a 
                href="https://github.com/RevesK1ng/SevenIQ" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-gray-700 transition-colors"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
