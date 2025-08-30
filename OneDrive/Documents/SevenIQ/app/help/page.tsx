'use client'

import { motion } from 'framer-motion'
import { 
  HelpCircle, 
  MessageCircle, 
  BookOpen, 
  Video, 
  FileText, 
  Mail, 
  Clock,
  Search,
  Lightbulb,
  Zap,
  Users,
  Shield,
  Brain
} from 'lucide-react'
import Link from 'next/link'

export default function HelpPage() {
  const faqs = [
    {
      question: "How does SevenIQ work?",
      answer: "SevenIQ uses advanced AI to transform complex topics into clear explanations. Simply paste your text, choose an explanation mode (Child, Grandma, CEO, or Technical), and get instant results."
    },
    {
      question: "What explanation modes are available?",
      answer: "We offer four modes: Child (simple and fun), Grandma (warm and relatable), CEO (concise and business-focused), and Technical (detailed and professional)."
    },
    {
      question: "Is there a limit on explanations?",
      answer: "Free users get 15 explanations per day. Pro users enjoy unlimited explanations with priority processing and advanced features."
    },
    {
      question: "How accurate are the explanations?",
      answer: "Our AI provides high-quality explanations, but they should be used as learning aids, not as definitive sources. Always verify important information from authoritative sources."
    },
    {
      question: "Can I save my explanations?",
      answer: "Yes! All explanations are automatically saved to your account and can be accessed from your dashboard anytime."
    }
  ]

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Get explanations in seconds, not minutes"
    },
    {
      icon: Brain,
      title: "AI-Powered",
      description: "Advanced language models for quality results"
    },
    {
      icon: Users,
      title: "Multiple Modes",
      description: "Choose the style that fits your audience"
    },
    {
      icon: Shield,
      title: "Secure",
      description: "Your data is protected and private"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-10 h-10 text-primary-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text mb-6">
            How can we{' '}
            <span className="text-gradient">help you</span>?
          </h1>
          <p className="text-xl text-text-muted max-w-3xl mx-auto">
            Get answers to your questions, learn how to use SevenIQ effectively, and discover tips for the best results.
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Link href="/how-it-works" className="card p-6 text-center hover:shadow-elevation-2 transition-all group">
            <BookOpen className="w-12 h-12 text-primary-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-text mb-2">How It Works</h3>
            <p className="text-text-muted text-sm">Learn about our AI technology and process</p>
          </Link>

          <Link href="/pricing" className="card p-6 text-center hover:shadow-elevation-2 transition-all group">
            <Users className="w-12 h-12 text-accent-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-text mb-2">Pricing Plans</h3>
            <p className="text-text-muted text-sm">Compare features and choose your plan</p>
          </Link>

          <Link href="/changelog" className="card p-6 text-center hover:shadow-elevation-2 transition-all group">
            <Clock className="w-12 h-12 text-success-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-text mb-2">What's New</h3>
            <p className="text-text-muted text-sm">Stay updated with latest features</p>
          </Link>
        </motion.div>

        {/* Features Grid */}
        <motion.section 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-text text-center mb-12">
            Why choose{' '}
            <span className="text-gradient">SevenIQ</span>?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="card text-center p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-text mb-2">{feature.title}</h3>
                <p className="text-text-muted text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-text text-center mb-12">
            Frequently Asked{' '}
            <span className="text-gradient">Questions</span>
          </h2>
          
          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="card p-6"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <h3 className="text-lg font-semibold text-text mb-3 flex items-center gap-3">
                  <Lightbulb className="w-5 h-5 text-primary-600" />
                  {faq.question}
                </h3>
                <p className="text-text-muted">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="card p-12 max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-3xl font-bold text-text mb-4">
              Still need{' '}
              <span className="text-gradient">help</span>?
            </h2>
            <p className="text-text-muted mb-8">
              Can't find what you're looking for? Our support team is here to help you get the most out of SevenIQ.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="mailto:support@seveniq.com" className="btn-primary">
                <Mail className="w-4 h-4 mr-2" />
                Email Support
              </Link>
              <Link href="/app" className="btn-secondary">
                <Zap className="w-4 h-4 mr-2" />
                Try SevenIQ
              </Link>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
