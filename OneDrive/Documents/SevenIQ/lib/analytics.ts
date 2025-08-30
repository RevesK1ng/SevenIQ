// Analytics utility for tracking user events
// In production, this would integrate with PostHog, Plausible, or similar

export interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
  userId?: string
}

export async function trackEvent(event: AnalyticsEvent): Promise<void> {
  try {
    // Skip analytics for demo mode users
    if (event.userId === 'demo-user') {
      return
    }

    // In production, this would send to your analytics provider
    // For now, we'll just log to console
    console.log('Analytics Event:', event)
    
    // Example PostHog integration:
    // if (typeof window !== 'undefined' && window.posthog) {
    //   window.posthog.capture(event.name, {
    //     ...event.properties,
    //     distinct_id: event.userId,
    //   })
    // }
    
    // Example Plausible integration:
    // if (typeof window !== 'undefined' && window.plausible) {
    //   window.plausible(event.name, {
    //     props: event.properties,
    //   })
    // }
  } catch (error) {
    console.error('Analytics tracking error:', error)
  }
}

// Predefined event tracking functions
export const analytics = {
  // User actions
  runExplainer: (mode: string, textLength: number, userId?: string) =>
    trackEvent({
      name: 'run_explainer',
      properties: { mode, text_length: textLength },
      userId,
    }),

  gated: (reason: string, userId?: string) =>
    trackEvent({
      name: 'gated',
      properties: { reason },
      userId,
    }),

  subscribeClicked: (plan: string, userId?: string) =>
    trackEvent({
      name: 'subscribe_clicked',
      properties: { plan },
      userId,
    }),

  checkoutCompleted: (plan: string, userId?: string) =>
    trackEvent({
      name: 'checkout_completed',
      properties: { plan },
      userId,
    }),

  // Page views
  pageView: (page: string, userId?: string) =>
    trackEvent({
      name: 'page_view',
      properties: { page },
      userId,
    }),

  // Feature usage
  modeChanged: (mode: string, userId?: string) =>
    trackEvent({
      name: 'mode_changed',
      properties: { mode },
      userId,
    }),

  explanationCopied: (mode: string, userId?: string) =>
    trackEvent({
      name: 'explanation_copied',
      properties: { mode },
      userId,
    }),

  explanationDownloaded: (mode: string, userId?: string) =>
    trackEvent({
      name: 'explanation_downloaded',
      properties: { mode },
      userId,
    }),
}
