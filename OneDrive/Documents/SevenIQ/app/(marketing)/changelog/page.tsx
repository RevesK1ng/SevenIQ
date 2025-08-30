'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Bug, Zap, Shield, Users, Star } from 'lucide-react'
import Link from 'next/link'

type ChangeType = 'feature' | 'improvement' | 'fix' | 'security' | 'major'

interface Change {
  type: ChangeType
  text: string
}

interface Release {
  version: string
  date: string
  title: string
  type: ChangeType
  description: string
  changes: Change[]
}

const releases: Release[] = [
  {
    version: '1.2.0',
    date: '2024-01-15',
    title: 'Performance & Privacy Improvements',
    type: 'feature',
    description: 'Major performance improvements and enhanced privacy controls.',
    changes: [
      { type: 'feature', text: 'Added new CEO explanation mode for professional contexts' },
      { type: 'feature', text: 'Improved response time by 40%' },
      { type: 'feature', text: 'Enhanced privacy controls with data retention settings' },
      { type: 'improvement', text: 'Better error handling and user feedback' },
      { type: 'fix', text: 'Fixed issue with long text processing' }
    ]
  },
  {
    version: '1.1.0',
    date: '2024-01-01',
    title: 'New Features & UI Improvements',
    type: 'feature',
    description: 'Introducing new explanation modes and a refreshed user interface.',
    changes: [
      { type: 'feature', text: 'Added Grandma explanation mode' },
      { type: 'feature', text: 'New dark mode theme' },
      { type: 'feature', text: 'Improved mobile responsiveness' },
      { type: 'improvement', text: 'Better typography and spacing' },
      { type: 'fix', text: 'Resolved authentication edge cases' }
    ]
  },
  {
    version: '1.0.0',
    date: '2023-12-15',
    title: 'Initial Release',
    type: 'major',
    description: 'The first public release of SevenIQ with core functionality.',
    changes: [
      { type: 'feature', text: 'AI-powered text explanations' },
      { type: 'feature', text: 'Child explanation mode' },
      { type: 'feature', text: 'User authentication and profiles' },
      { type: 'feature', text: 'Basic usage tracking' },
      { type: 'feature', text: 'Responsive web interface' }
    ]
  }
]

const changeTypeIcons = {
  feature: Sparkles,
  improvement: Zap,
  fix: Bug,
  security: Shield,
  major: Star
}

const changeTypeColors = {
  feature: 'text-blue-600 bg-blue-100',
  improvement: 'text-green-600 bg-green-100',
  fix: 'text-orange-600 bg-orange-100',
  security: 'text-red-600 bg-red-100',
  major: 'text-purple-600 bg-purple-100'
}

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="section-padding text-center">
        <div className="max-content container-padding">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-text mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            What's new in{' '}
            <span className="text-gradient">SevenIQ</span>
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-text-muted mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Stay up to date with the latest features, improvements, and fixes.
          </motion.p>
        </div>
      </section>

      {/* Changelog Section */}
      <section className="section-padding">
        <div className="max-content container-padding">
          <div className="max-w-4xl mx-auto">
            {releases.map((release, index) => (
              <motion.div
                key={release.version}
                className="mb-16 last:mb-0"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {/* Release Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                  <div className="flex items-center gap-4 mb-4 sm:mb-0">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-text">
                        v{release.version}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${changeTypeColors[release.type]}`}>
                        {release.type}
                      </span>
                    </div>
                  </div>
                  <div className="text-text-muted text-sm">
                    {new Date(release.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>

                {/* Release Content */}
                <div className="card">
                  <h3 className="text-xl font-semibold text-text mb-3">
                    {release.title}
                  </h3>
                  <p className="text-text-muted mb-6 leading-relaxed">
                    {release.description}
                  </p>

                  {/* Changes List */}
                  <div className="space-y-3">
                    {release.changes.map((change, changeIndex) => {
                      const Icon = changeTypeIcons[change.type]
                      return (
                        <div key={changeIndex} className="flex items-start gap-3">
                          <div className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0">
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="text-text">
                            {change.text}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="section-padding bg-surface">
        <div className="max-content container-padding">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-text mb-6">
              What's coming{' '}
              <span className="text-gradient">next</span>
            </h2>
            <p className="text-xl text-text-muted max-w-2xl mx-auto">
              Here's a sneak peek at the features we're working on.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: 'Advanced Modes',
                description: 'More explanation styles including Academic, Technical, and Creative modes.',
                icon: Sparkles,
                eta: 'Q1 2024'
              },
              {
                title: 'Team Collaboration',
                description: 'Share explanations with your team and collaborate on complex topics.',
                icon: Users,
                eta: 'Q2 2024'
              },
              {
                title: 'API Access',
                description: 'Integrate SevenIQ explanations directly into your applications.',
                icon: Zap,
                eta: 'Q2 2024'
              },
              {
                title: 'Offline Mode',
                description: 'Download explanations for offline reading and learning.',
                icon: Shield,
                eta: 'Q3 2024'
              },
              {
                title: 'Multi-language Support',
                description: 'Generate explanations in multiple languages automatically.',
                icon: Star,
                eta: 'Q3 2024'
              },
              {
                title: 'Advanced Analytics',
                description: 'Track your learning progress and get personalized insights.',
                icon: Users,
                eta: 'Q4 2024'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="card text-center group hover:shadow-elevation-4 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-200 transition-colors">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-text mb-3">
                  {feature.title}
                </h3>
                <p className="text-text-muted leading-relaxed mb-4">
                  {feature.description}
                </p>
                <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                  {feature.eta}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="section-padding">
        <div className="max-content container-padding text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-text mb-6">
              Have a feature request?
            </h2>
            <p className="text-xl text-text-muted mb-8 max-w-2xl mx-auto">
              We'd love to hear your ideas for making SevenIQ even better.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="mailto:feedback@seveniq.com" 
                className="btn-primary btn-lg"
              >
                Send feedback
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link 
                href="/app" 
                className="btn-secondary btn-lg"
              >
                Try the latest features
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
