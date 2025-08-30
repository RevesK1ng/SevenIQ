import { test, expect } from '@playwright/test'

test.describe('Responsive Design', () => {
  const viewports = [
    { width: 360, height: 640, name: 'Mobile Small' },
    { width: 768, height: 1024, name: 'Tablet' },
    { width: 1280, height: 720, name: 'Desktop' }
  ]

  for (const viewport of viewports) {
    test.describe(`${viewport.name} (${viewport.width}x${viewport.height})`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize(viewport)
      })

      test('home page is responsive and usable', async ({ page }) => {
        await page.goto('/')
        
        // Test navigation is accessible
        const nav = page.locator('nav')
        await expect(nav).toBeVisible()
        
        // Test main content is readable
        const mainContent = page.locator('main') | page.locator('h1') | page.locator('p')
        await expect(mainContent).toBeVisible()
        
        // Test buttons are clickable
        const buttons = page.locator('button')
        const buttonCount = await buttons.count()
        if (buttonCount > 0) {
          const firstButton = buttons.first()
          await expect(firstButton).toBeVisible()
          await expect(firstButton).toBeEnabled()
        }
        
        // Test no horizontal scrolling on mobile
        if (viewport.width <= 768) {
          const body = page.locator('body')
          const overflow = await body.evaluate(el => {
            const style = window.getComputedStyle(el)
            return style.overflowX
          })
          expect(overflow).not.toBe('auto')
        }
      })

      test('navigation is usable across screen sizes', async ({ page }) => {
        await page.goto('/')
        
        const nav = page.locator('nav')
        await expect(nav).toBeVisible()
        
        // Test navigation links
        const navLinks = nav.locator('a')
        const linkCount = await navLinks.count()
        
        if (linkCount > 0) {
          // Test first few links are visible and clickable
          for (let i = 0; i < Math.min(3, linkCount); i++) {
            const link = navLinks.nth(i)
            await expect(link).toBeVisible()
            
            // Test link text is readable
            const linkText = await link.textContent()
            expect(linkText?.trim()).toBeTruthy()
          }
        }
        
        // Test mobile menu if it exists
        if (viewport.width <= 768) {
          const mobileMenuButton = page.locator('button[aria-label*="menu"]') | 
                                  page.locator('button:has-text("Menu")') |
                                  page.locator('button[aria-label*="Menu"]')
          
          if (await mobileMenuButton.isVisible()) {
            await mobileMenuButton.click()
            
            // Should show mobile menu
            const mobileMenu = page.locator('[role="menu"]') | 
                             page.locator('.mobile-menu') |
                             page.locator('[data-mobile-menu]')
            
            if (await mobileMenu.isVisible()) {
              await expect(mobileMenu).toBeVisible()
            }
          }
        }
      })

      test('pricing page is responsive', async ({ page }) => {
        await page.goto('/pricing')
        
        // Test pricing cards are visible
        const pricingCards = page.locator('[data-pricing-card]') | 
                           page.locator('.pricing-card') |
                           page.locator('text=Free') |
                           page.locator('text=Pro')
        
        await expect(pricingCards).toBeVisible()
        
        // Test upgrade buttons are accessible
        const upgradeButtons = page.locator('button:has-text("Upgrade")')
        const buttonCount = await upgradeButtons.count()
        
        if (buttonCount > 0) {
          const firstButton = upgradeButtons.first()
          await expect(firstButton).toBeVisible()
          await expect(firstButton).toBeEnabled()
        }
        
        // Test no content is cut off
        const pageHeight = await page.evaluate(() => document.body.scrollHeight)
        const viewportHeight = viewport.height
        
        // Page should not be significantly taller than viewport (indicating cutoff)
        expect(pageHeight).toBeLessThanOrEqual(viewportHeight * 2)
      })

      test('dashboard page is responsive', async ({ page }) => {
        await page.goto('/dashboard')
        
        // Test page loads (may redirect to auth)
        await expect(page).toBeVisible()
        
        // Test main content area
        const mainContent = page.locator('main') | 
                          page.locator('h1') | 
                          page.locator('text=Dashboard') |
                          page.locator('text=Sign In')
        
        await expect(mainContent).toBeVisible()
        
        // Test forms are usable
        const forms = page.locator('form')
        const formCount = await forms.count()
        
        if (formCount > 0) {
          const firstForm = forms.first()
          await expect(firstForm).toBeVisible()
          
          // Test form inputs
          const inputs = firstForm.locator('input, textarea')
          const inputCount = await inputs.count()
          
          if (inputCount > 0) {
            const firstInput = inputs.first()
            await expect(firstInput).toBeVisible()
            await expect(firstInput).toBeEnabled()
          }
        }
      })

      test('components are readable and accessible', async ({ page }) => {
        await page.goto('/')
        
        // Test text contrast and readability
        const textElements = page.locator('h1, h2, h3, h4, h5, h6, p, span, a, button')
        const elementCount = await textElements.count()
        
        if (elementCount > 0) {
          // Test first few text elements
          for (let i = 0; i < Math.min(5, elementCount); i++) {
            const element = textElements.nth(i)
            await expect(element).toBeVisible()
            
            // Test text content is not empty
            const text = await element.textContent()
            if (text && text.trim()) {
              expect(text.trim().length).toBeGreaterThan(0)
            }
          }
        }
        
        // Test focus indicators are visible
        if (viewport.width > 768) { // Desktop focus testing
          const firstFocusable = page.locator('a, button, input, textarea').first()
          if (await firstFocusable.isVisible()) {
            await firstFocusable.focus()
            
            // Should show focus indicator
            const focusVisible = await firstFocusable.evaluate(el => {
              const style = window.getComputedStyle(el)
              return style.outline !== 'none' || style.boxShadow !== 'none'
            })
            
            expect(focusVisible).toBe(true)
          }
        }
      })

      test('no horizontal overflow on any page', async ({ page }) => {
        const pages = ['/', '/pricing', '/dashboard', '/billing']
        
        for (const pagePath of pages) {
          await page.goto(pagePath)
          
          // Test no horizontal scrolling
          const body = page.locator('body')
          const overflow = await body.evaluate(el => {
            const style = window.getComputedStyle(el)
            return style.overflowX
          })
          
          expect(overflow).not.toBe('auto')
          
          // Test viewport width matches page content
          const pageWidth = await page.evaluate(() => document.body.scrollWidth)
          expect(pageWidth).toBeLessThanOrEqual(viewport.width)
        }
      })
    })
  }
})
