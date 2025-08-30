'use client'

import { motion } from 'framer-motion'
import { Brain, Sparkles, Zap, Shield, ArrowRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import Nav from '@/components/nav'
import Footer from '@/components/footer'

const steps = [
  {
    number: '01',
    title: 'Input Your Question',
    description: 'Simply type or paste any text, question, or concept you want explained. You can also paste URLs to explain web content.',
    icon: Brain
  },
  {
    number: '02',
    title: 'Choose Your Style',
    description: 'Select from our four explanation modes: Child (simple), Grandma (patient), CEO (concise), or Technical (detailed).',
    icon: Sparkles
  },
  {
    number: '03',
    title: 'Get Instant Results',
    description: 'Our AI processes your input and delivers a clear, tailored explanation in seconds, not minutes.',
    icon: Zap
  },
  {
    number: '04',
    title: 'Learn & Understand',
    description: 'Gain clarity on complex topics with explanations that match your learning style and comprehension level.',
    icon: Shield
  }
]

const features = [
  {
    title: 'Multiple Explanation Modes',
    description: 'Choose the perfect explanation style for your audience and context.',
    benefits: ['Child Mode for beginners', 'Grandma Mode for patience', 'CEO Mode for executives', 'Technical Mode for depth']
  },
  {
    title: 'Lightning Fast Processing',
    description: 'Get explanations in seconds, not minutes. Perfect for quick learning and understanding.',
    benefits: ['Instant results', 'No waiting time', 'Efficient learning', 'Quick reference']
  },
  {
    title: 'Privacy First Approach',
    description: 'Your data stays private and secure. We don\'t store or share your personal information.',
    benefits: ['Data privacy', 'Secure processing', 'No tracking', 'Confidential learning']
  }
]

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white">
      <Nav />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            How{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">SevenIQ</span>{' '}
            Works
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Transform complex topics into crystal-clear explanations in just four simple steps. 
            Our AI-powered platform makes learning accessible, fast, and enjoyable.
          </motion.p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="flex space-x-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-blue-600 mb-2">{step.number}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              SevenIQ combines cutting-edge AI technology with intuitive design to deliver 
              the best learning experience possible.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-xl shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Experience It Yourself?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Try SevenIQ now and see how easy it is to understand complex topics.
            </p>
            <Link 
              href="/try-now" 
              className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 rounded-lg font-semibold text-lg inline-flex items-center"
            >
              Try it now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
