'use client'

import { motion } from 'framer-motion'
import { BookOpen, GraduationCap, Briefcase, Users, Lightbulb, Target, ArrowRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import Nav from '@/components/nav'
import Footer from '@/components/footer'

const useCases = [
  {
    icon: BookOpen,
    title: 'Student Learning',
    description: 'Break down complex academic concepts into simple, understandable explanations.',
    examples: ['Math problems', 'Scientific concepts', 'Historical events', 'Literature analysis']
  },
  {
    icon: GraduationCap,
    title: 'Professional Development',
    description: 'Understand industry jargon and technical concepts quickly.',
    examples: ['Business terms', 'Technical documentation', 'Legal concepts', 'Medical terminology']
  },
  {
    icon: Briefcase,
    title: 'Work Communication',
    description: 'Explain complex ideas to colleagues and clients in their preferred style.',
    examples: ['Project explanations', 'Technical reports', 'Client presentations', 'Team training']
  },
  {
    icon: Users,
    title: 'Personal Growth',
    description: 'Learn new skills and understand topics that interest you.',
    examples: ['DIY projects', 'Cooking techniques', 'Financial concepts', 'Health information']
  }
]

const capabilities = [
  {
    title: 'Multiple Explanation Styles',
    description: 'Choose from four different explanation modes to match your audience and learning style.',
    features: [
      'Child Mode: Simple, friendly explanations',
      'Grandma Mode: Patient, step-by-step guidance',
      'CEO Mode: Concise, strategic insights',
      'Technical Mode: Detailed, professional analysis'
    ]
  },
  {
    title: 'Versatile Input Support',
    description: 'Input text directly or paste URLs to explain web content automatically.',
    features: [
      'Direct text input',
      'URL processing',
      'Long-form content',
      'Technical documents'
    ]
  },
  {
    title: 'Instant Results',
    description: 'Get explanations in seconds with our optimized AI processing.',
    features: [
      'Fast response times',
      'Real-time processing',
      'Efficient algorithms',
      'Scalable architecture'
    ]
  }
]

const benefits = [
  'Save hours of research time',
  'Improve understanding and retention',
  'Communicate complex ideas clearly',
  'Learn at your own pace',
  'Access explanations anytime, anywhere',
  'Professional-quality insights'
]

export default function WhatItDoesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Nav />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            What{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">SevenIQ</span>{' '}
            Does
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            SevenIQ transforms complex topics into crystal-clear explanations using advanced AI technology. 
            Whether you're a student, professional, or curious mind, we make learning accessible and enjoyable.
          </motion.p>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Who Can Benefit from SevenIQ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform serves diverse needs across education, business, and personal development.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-xl shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <useCase.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{useCase.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{useCase.description}</p>
                <div className="space-y-2">
                  {useCase.examples.map((example, exampleIndex) => (
                    <div key={exampleIndex} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-sm text-gray-600">{example}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
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
              Core Capabilities
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover what makes SevenIQ the ultimate learning and explanation platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {capabilities.map((capability, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-xl shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{capability.title}</h3>
                <p className="text-gray-600 mb-6">{capability.description}</p>
                <ul className="space-y-2">
                  {capability.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why Choose SevenIQ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the benefits of AI-powered learning and explanation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span className="text-gray-700">{benefit}</span>
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
              Ready to Experience the Power?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Try SevenIQ now and see how it can transform your learning experience.
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
