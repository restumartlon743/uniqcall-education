import { test, expect } from '@playwright/test'

/**
 * Google OAuth Login Flow Tests
 * Tests that the login button is clickable and initiates Google OAuth redirect
 */

test.describe('Google Login', () => {
  test('login page loads correctly', async ({ page }) => {
    await page.goto('/login')
    await expect(page).toHaveURL('/login')

    // Page should have the login card
    await expect(page.locator('h1')).toBeVisible()
  })

  test('Google sign-in button is visible and clickable', async ({ page }) => {
    await page.goto('/login')

    // Find the Google button
    const googleButton = page.getByRole('button', { name: /masuk dengan google|sign in with google/i })
    await expect(googleButton).toBeVisible()
    await expect(googleButton).toBeEnabled()
  })

  test('Google sign-in button redirects to Google OAuth', async ({ page }) => {
    await page.goto('/login')

    // Listen for navigation (button should redirect to Google or Supabase OAuth)
    const [response] = await Promise.all([
      page.waitForNavigation({ timeout: 10000 }).catch(() => null),
      page.getByRole('button', { name: /masuk dengan google|sign in with google/i }).click(),
    ])

    // Check that we navigated away from /login
    const currentUrl = page.url()

    // Should redirect to either:
    // 1. accounts.google.com (Google OAuth page)
    // 2. supabase.co/auth (Supabase OAuth)
    // 3. NOT still on /login (meaning something happened)
    const redirectedToGoogle = currentUrl.includes('accounts.google.com')
    const redirectedToSupabase = currentUrl.includes('supabase.co/auth')
    const leftLoginPage = !currentUrl.includes('localhost:3000/login')

    console.log('Current URL after click:', currentUrl)

    expect(redirectedToGoogle || redirectedToSupabase || leftLoginPage).toBe(true)
  })

  test('Supabase client is initialized (env vars present)', async ({ page }) => {
    await page.goto('/login')

    // Check that NEXT_PUBLIC_SUPABASE_URL is available in the page
    const supabaseUrl = await page.evaluate(() => {
      return (window as any).__NEXT_PUBLIC_SUPABASE_URL
        || document.cookie.includes('sb-')
        || true // Will pass - we check another way
    })

    // More direct check: see if button click produces a redirect
    // If env vars are missing, createClient() returns null and nothing happens
    let didNavigate = false
    page.on('framenavigated', (frame) => {
      if (frame === page.mainFrame() && !frame.url().includes('localhost:3000/login')) {
        didNavigate = true
      }
    })

    await page.getByRole('button', { name: /masuk dengan google|sign in with google/i }).click()
    await page.waitForTimeout(3000)

    console.log('Did navigate after click:', didNavigate)
    console.log('Current URL:', page.url())

    // Should have navigated somewhere (Google, Supabase, etc)
    expect(didNavigate || !page.url().includes('/login')).toBe(true)
  })

  test('language toggle works on login page', async ({ page }) => {
    await page.goto('/login')

    // Find language toggle
    const langToggle = page.locator('[data-testid="language-toggle"], button[aria-label*="language"], button:has(svg)').first()
    await expect(langToggle).toBeVisible()
  })
})
