'use client'

import { motion } from 'framer-motion'
import { FileText, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <FileText className="w-16 h-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-text mb-6">
            Terms of Service
          </h1>
          <p className="text-xl text-text-muted max-w-2xl mx-auto">
            Please read these terms carefully before using our service.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="prose prose-lg max-w-none"
        >
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold text-text mb-6">Acceptance of Terms</h2>
            
            <p className="text-text-muted mb-6">
              By accessing and using SevenIQ, you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to abide by the above, please do not use this service.
            </p>

            <h2 className="text-2xl font-bold text-text mb-6">Description of Service</h2>
            
            <p className="text-text-muted mb-6">
              SevenIQ is an AI-powered platform that provides explanations of complex topics in simple terms. 
              Our service includes multiple explanation modes, text and URL processing, and personalized learning experiences.
            </p>

            <h2 className="text-2xl font-bold text-text mb-6">User Accounts</h2>
            
            <div className="space-y-4 text-text-muted">
              <p>When you create an account with us, you must provide accurate and complete information. You are responsible for:</p>
              <ul className="space-y-2 ml-6">
                <li>• Maintaining the security of your account and password</li>
                <li>• All activities that occur under your account</li>
                <li>• Notifying us immediately of any unauthorized use</li>
                <li>• Ensuring your account information is up to date</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-text mb-6 mt-12">Acceptable Use</h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-success-500 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-text mb-2">You may use our service to:</h3>
                  <ul className="space-y-2 text-text-muted ml-6">
                    <li>• Explain educational content and concepts</li>
                    <li>• Simplify complex topics for learning</li>
                    <li>• Generate explanations for personal use</li>
                    <li>• Improve understanding of various subjects</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <XCircle className="w-6 h-6 text-error-500 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-text mb-2">You may NOT use our service to:</h3>
                  <ul className="space-y-2 text-text-muted ml-6">
                    <li>• Generate harmful, offensive, or inappropriate content</li>
                    <li>• Violate intellectual property rights</li>
                    <li>• Attempt to reverse engineer our AI models</li>
                    <li>• Use for commercial purposes without proper licensing</li>
                    <li>• Submit content that violates laws or regulations</li>
                  </ul>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-text mb-6 mt-12">Free Trial and Subscriptions</h2>
            
            <div className="space-y-4 text-text-muted">
              <p>Our service offers:</p>
              <ul className="space-y-2 ml-6">
                <li>• 3 free explanations for new users</li>
                <li>• Various subscription plans for continued use</li>
                <li>• Automatic renewal unless cancelled</li>
                <li>• Pro-rated refunds for annual plans cancelled mid-term</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-text mb-6 mt-12">Content and Intellectual Property</h2>
            
            <div className="space-y-4 text-text-muted">
              <p>Regarding content and intellectual property:</p>
              <ul className="space-y-2 ml-6">
                <li>• You retain ownership of content you submit</li>
                <li>• We own the AI-generated explanations</li>
                <li>• Our platform and technology are protected by copyright</li>
                <li>• You grant us license to process your content for explanations</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-text mb-6 mt-12">Privacy and Data</h2>
            
            <p className="text-text-muted mb-4">
              Your privacy is important to us. Please review our Privacy Policy to understand how we collect, 
              use, and protect your information.
            </p>

            <h2 className="text-2xl font-bold text-text mb-6 mt-12">Limitation of Liability</h2>
            
            <div className="space-y-4 text-text-muted">
              <p>SevenIQ is provided "as is" without warranties of any kind. We are not liable for:</p>
              <ul className="space-y-2 ml-6">
                <li>• Accuracy of AI-generated explanations</li>
                <li>• Service interruptions or technical issues</li>
                <li>• Indirect or consequential damages</li>
                <li>• Loss of data or content</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-text mb-6 mt-12">Service Availability</h2>
            
            <p className="text-text-muted">
              We strive to maintain high service availability but cannot guarantee uninterrupted access. 
              We may perform maintenance, updates, or modifications that temporarily affect service availability.
            </p>

            <h2 className="text-2xl font-bold text-text mb-6 mt-12">Termination</h2>
            
            <p className="text-text-muted mb-4">
              We may terminate or suspend your account at any time for violations of these terms. 
              You may cancel your account at any time through your account settings.
            </p>

            <h2 className="text-2xl font-bold text-text mb-6 mt-12">Changes to Terms</h2>
            
            <p className="text-text-muted">
              We reserve the right to modify these terms at any time. We will notify users of significant changes 
              via email or through our service. Continued use constitutes acceptance of modified terms.
            </p>

            <h2 className="text-2xl font-bold text-text mb-6 mt-12">Contact Information</h2>
            
            <p className="text-text-muted">
              If you have questions about these Terms of Service, please contact us at legal@seveniq.com.
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
