'use client'

import { motion } from 'framer-motion'
import { Check, Star, Users, Zap, Shield, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Nav from '@/components/nav'
import Footer from '@/components/footer'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started and trying out SevenIQ',
    features: [
      '5 explanations per day',
      'Basic explanation modes',
      'Up to 500 characters per input',
      'Standard response quality',
      'Community support',
      'Basic analytics'
    ],
    limitations: [
      'Limited to 5 daily explanations',
      'No advanced modes',
      'Character limit restrictions',
      'Basic support only'
    ],
    cta: 'Get Started Free',
    ctaLink: '/try-now',
    popular: false,
    color: 'from-gray-500 to-gray-600'
  },
  {
    name: 'Premium',
    price: '$19',
    period: 'per month',
    description: 'For professionals and power users who need more',
    features: [
      'Unlimited explanations',
      'All explanation modes',
      'Up to 5,000 characters per input',
      'Enhanced response quality',
      'Priority support',
      'Advanced analytics',
      'Export explanations',
      'Custom explanations',
      'API access (100 calls/month)',
      'No daily limits'
    ],
    limitations: [
      'Monthly subscription required',
      'API calls limited to 100/month'
    ],
    cta: 'Start Premium Trial',
    ctaLink: '/try-now',
    popular: true,
    color: 'from-blue-500 to-purple-600'
  },
  {
    name: 'Team',
    price: '$99',
    period: 'per month',
    description: 'For teams and organizations with multiple users',
    features: [
      'Everything in Premium',
      'Up to 10 team members',
      'Unlimited API calls',
      'Team collaboration tools',
      'Admin dashboard',
      'Usage analytics',
      'Custom branding',
      'Dedicated support',
      'SSO integration',
      'Advanced security',
      'Custom integrations',
      'Training sessions'
    ],
    limitations: [
      'Requires annual commitment',
      'Minimum 5 team members'
    ],
    cta: 'Contact Sales',
    ctaLink: '/try-now',
    popular: false,
    color: 'from-green-500 to-emerald-600'
  }
]

const comparisonFeatures = [
  {
    feature: 'Daily Explanations',
    free: '5',
    premium: 'Unlimited',
    team: 'Unlimited'
  },
  {
    feature: 'Input Characters',
    free: '500',
    premium: '5,000',
    team: 'Unlimited'
  },
  {
    feature: 'Explanation Modes',
    free: 'Basic',
    premium: 'All',
    team: 'All + Custom'
  },
  {
    feature: 'API Access',
    free: 'No',
    premium: '100 calls/month',
    team: 'Unlimited'
  },
  {
    feature: 'Export Options',
    free: 'No',
    premium: 'Yes',
    team: 'Advanced'
  },
  {
    feature: 'Support',
    free: 'Community',
    premium: 'Priority',
    team: 'Dedicated'
  },
  {
    feature: 'Analytics',
    free: 'Basic',
    premium: 'Advanced',
    team: 'Enterprise'
  }
]

export default function PricingPage() {
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
            Simple,{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Transparent</span>{' '}
            Pricing
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Choose the plan that fits your needs. Start free and upgrade as you grow.
          </motion.p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                className={`relative bg-white p-8 rounded-2xl shadow-sm border-2 transition-all duration-300 hover:shadow-lg ${
                  plan.popular 
                    ? 'border-blue-500 scale-105' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                      <Star className="w-4 h-4" />
                      <span>Most Popular</span>
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {plan.limitations.length > 0 && (
                  <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Limitations:</h4>
                    <ul className="space-y-1">
                      {plan.limitations.map((limitation, limitationIndex) => (
                        <li key={limitationIndex} className="text-sm text-gray-600 flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                          <span>{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Link
                  href={plan.ctaLink}
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-center transition-colors ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
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
              Feature Comparison
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See exactly what each plan offers to make the best choice for your needs.
            </p>
          </motion.div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-6 font-semibold text-gray-900">Feature</th>
                    <th className="text-center p-6 font-semibold text-gray-900">Free</th>
                    <th className="text-center p-6 font-semibold text-gray-900">Premium</th>
                    <th className="text-center p-6 font-semibold text-gray-900">Team</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((row, index) => (
                    <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                      <td className="p-6 font-medium text-gray-900">{row.feature}</td>
                      <td className="p-6 text-center text-gray-600">{row.free}</td>
                      <td className="p-6 text-center text-gray-600">{row.premium}</td>
                      <td className="p-6 text-center text-gray-600">{row.team}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Get answers to common questions about our pricing and plans.
            </p>
          </motion.div>

          <div className="space-y-8">
            <motion.div
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I change plans anytime?</h3>
              <p className="text-gray-600">Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Is there a free trial?</h3>
              <p className="text-gray-600">Yes! All plans start with a 7-day free trial. No credit card required to start.</p>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What happens if I exceed my plan limits?</h3>
              <p className="text-gray-600">We'll notify you when you're close to your limits. You can upgrade anytime or wait until your next billing cycle.</p>
            </motion.div>
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
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Start with our free plan and upgrade as you need more features and capacity.
            </p>
            <Link 
              href="/try-now" 
              className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 rounded-lg font-semibold text-lg inline-flex items-center"
            >
              Start free trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
