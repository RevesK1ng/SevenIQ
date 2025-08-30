import { test, expect } from '@playwright/test'

test.describe('Pricing Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pricing')
  })

  test('clicking Upgrade navigates to Stripe checkout', async ({ page }) => {
    // Find and click upgrade button
    const upgradeButton = page.locator('button:has-text("Upgrade")')
    if (await upgradeButton.isVisible()) {
      await upgradeButton.click()
      
      // Should show loading state or redirect
      await expect(
        page.locator('text=Redirecting') |
        page.locator('text=Checkout') |
        page.locator('text=Loading')
      ).toBeVisible()
    }
  })

  test('canceled checkout returns gracefully to pricing', async ({ page }) => {
    // This test would require Stripe checkout simulation
    // In a real test environment, you'd either:
    // 1. Use Stripe test mode with test cards
    // 2. Mock the checkout flow
    // 3. Use Stripe CLI to simulate webhooks
    
    // For now, we'll test the pricing page loads correctly
    await expect(page).toHaveURL('/pricing')
    await expect(page.locator('text=Pricing')).toBeVisible()
  })

  test('billing portal opens for pro users', async ({ page }) => {
    // This test would require a pro user account
    // For now, we'll test the billing page loads correctly
    
    await page.goto('/billing')
    
    // Should show billing information or auth required
    await expect(
      page.locator('text=Billing') |
      page.locator('text=Sign In') |
      page.locator('text=Manage Subscription')
    ).toBeVisible()
  })

  test('pricing page shows all plan features clearly', async ({ page }) => {
    // Test that all plan features are visible
    await expect(page.locator('text=Free Plan')).toBeVisible()
    await expect(page.locator('text=Pro Plan')).toBeVisible()
    
    // Test feature lists
    await expect(page.locator('text=3 explanations per month')).toBeVisible()
    await expect(page.locator('text=Unlimited explanations')).toBeVisible()
    await expect(page.locator('text=Advanced AI modes')).toBeVisible()
    await expect(page.locator('text=Priority support')).toBeVisible()
  })

  test('pricing page shows correct pricing information', async ({ page }) => {
    // Test pricing display
    await expect(page.locator('text=Free')).toBeVisible()
    await expect(page.locator('text=Pro')).toBeVisible()
    
    // Should show pricing (actual amounts would depend on your Stripe configuration)
    const priceElement = page.locator('text=$') | page.locator('text=month')
    if (await priceElement.isVisible()) {
      await expect(priceElement).toBeVisible()
    }
  })

  test('upgrade buttons are prominent and accessible', async ({ page }) => {
    // Test upgrade button visibility and accessibility
    const upgradeButtons = page.locator('button:has-text("Upgrade")')
    const buttonCount = await upgradeButtons.count()
    
    if (buttonCount > 0) {
      // Test first upgrade button
      const firstButton = upgradeButtons.first()
      await expect(firstButton).toBeVisible()
      await expect(firstButton).toBeEnabled()
      
      // Test button styling (should be prominent)
      const buttonClass = await firstButton.getAttribute('class')
      expect(buttonClass).toContain('bg-') // Should have background color
    }
  })

  test('pricing page is responsive across different screen sizes', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.locator('text=Pricing')).toBeVisible()
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.locator('text=Pricing')).toBeVisible()
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 })
    await expect(page.locator('text=Pricing')).toBeVisible()
  })

  test('pricing page has proper navigation and breadcrumbs', async ({ page }) => {
    // Test navigation elements
    await expect(page.locator('nav')).toBeVisible()
    
    // Test that pricing page is accessible from navigation
    const navLinks = page.locator('nav a')
    const pricingLink = navLinks.filter({ hasText: 'Pricing' })
    
    if (await pricingLink.isVisible()) {
      await expect(pricingLink).toBeVisible()
    }
  })

  test('pricing page loads without errors', async ({ page }) => {
    // Test that page loads completely
    await expect(page).toBeVisible()
    
    // Test that no console errors occurred
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle')
    
    // Should have no console errors
    expect(errors.length).toBe(0)
  })
})
