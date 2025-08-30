'use client'

import { motion } from 'framer-motion'
import { Shield, Lock, Eye, Database } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <Shield className="w-16 h-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-text mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-text-muted max-w-2xl mx-auto">
            Your privacy is important to us. Learn how we protect and handle your information.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="prose prose-lg max-w-none"
        >
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold text-text mb-6">Information We Collect</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Eye className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-text mb-2">Usage Information</h3>
                  <p className="text-text-muted">
                    We collect information about how you use our service, including the text you submit for explanation, 
                    your preferred explanation modes, and usage patterns to improve our AI models.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Database className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-text mb-2">Account Information</h3>
                  <p className="text-text-muted">
                    When you create an account, we collect your email address and basic profile information 
                    to provide personalized services and manage your subscription.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Lock className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-text mb-2">Technical Data</h3>
                  <p className="text-text-muted">
                    We automatically collect technical information such as IP addresses, browser type, 
                    and device information for security and analytics purposes.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-text mb-6 mt-12">How We Use Your Information</h2>
            
            <ul className="space-y-3 text-text-muted">
              <li>• Provide and improve our AI explanation services</li>
              <li>• Personalize your experience and recommendations</li>
              <li>• Process payments and manage subscriptions</li>
              <li>• Send important service updates and notifications</li>
              <li>• Ensure security and prevent fraud</li>
              <li>• Comply with legal obligations</li>
            </ul>

            <h2 className="text-2xl font-bold text-text mb-6 mt-12">Data Protection</h2>
            
            <div className="space-y-4 text-text-muted">
              <p>
                We implement industry-standard security measures to protect your data, including:
              </p>
              <ul className="space-y-2 ml-6">
                <li>• End-to-end encryption for data transmission</li>
                <li>• Secure data storage with access controls</li>
                <li>• Regular security audits and updates</li>
                <li>• Limited access to personal information</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-text mb-6 mt-12">Data Sharing</h2>
            
            <p className="text-text-muted mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
            </p>
            
            <ul className="space-y-2 text-text-muted ml-6">
              <li>• With your explicit consent</li>
              <li>• To comply with legal requirements</li>
              <li>• To protect our rights and safety</li>
              <li>• With trusted service providers who assist in operating our service</li>
            </ul>

            <h2 className="text-2xl font-bold text-text mb-6 mt-12">Your Rights</h2>
            
            <p className="text-text-muted mb-4">
              You have the right to:
            </p>
            
            <ul className="space-y-2 text-text-muted ml-6">
              <li>• Access and review your personal information</li>
              <li>• Update or correct inaccurate information</li>
              <li>• Request deletion of your data</li>
              <li>• Opt out of marketing communications</li>
              <li>• Export your data in a portable format</li>
            </ul>

            <h2 className="text-2xl font-bold text-text mb-6 mt-12">Data Retention</h2>
            
            <p className="text-text-muted">
              We retain your information for as long as necessary to provide our services and comply with legal obligations. 
              You can request deletion of your account and associated data at any time.
            </p>

            <h2 className="text-2xl font-bold text-text mb-6 mt-12">Contact Us</h2>
            
            <p className="text-text-muted">
              If you have any questions about this Privacy Policy or our data practices, 
              please contact us at privacy@seveniq.com.
            </p>

            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-sm text-text-muted">
                <strong>Last updated:</strong> {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
