import { test, expect } from '@playwright/test'

const BASE_URL = process.env.TEST_BASE_URL ?? 'http://localhost:3001'
const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD

test.describe('Login Page', () => {
  test('should display email/password form and Google button', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`)
    
    // Check email form fields exist
    const emailInput = page.locator('input[type="email"]')
    await expect(emailInput).toBeVisible()
    
    const passwordInput = page.locator('input[type="password"]')
    await expect(passwordInput).toBeVisible()
    
    // Check email submit button
    const emailButton = page.getByRole('button', { name: /sign in with email|masuk dengan email/i })
    await expect(emailButton).toBeVisible()
    
    // Check Google button still exists
    const googleButton = page.getByRole('button', { name: /sign in with google|masuk dengan google/i })
    await expect(googleButton).toBeVisible()
  })

  test('should show error for invalid email/password', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`)
    
    await page.locator('input[type="email"]').fill('fake@nonexistent.com')
    await page.locator('input[type="password"]').fill('wrongpassword')
    await page.getByRole('button', { name: /sign in with email|masuk dengan email/i }).click()
    
    // Wait for error message
    const errorMsg = page.locator('p.text-red-400')
    await expect(errorMsg).toBeVisible({ timeout: 10000 })
  })

  test('should login with valid email/password and redirect to admin', async ({ page }) => {
    test.skip(
      !ADMIN_EMAIL || !ADMIN_PASSWORD,
      'Skipping admin login test: E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD must be set.'
    )

    await page.goto(`${BASE_URL}/login`)
    
    await page.locator('input[type="email"]').fill(ADMIN_EMAIL!)
    await page.locator('input[type="password"]').fill(ADMIN_PASSWORD!)
    await page.getByRole('button', { name: /sign in with email|masuk dengan email/i }).click()
    
    // Should redirect to /admin after middleware processes the session
    await page.waitForURL((url) => {
      const path = url.pathname
      return path === '/admin' || path.startsWith('/admin/')
    }, { timeout: 20000 })
    const url = page.url()
    console.log('Redirected to:', url)
    const pathname = new URL(url).pathname

    // Admin user should never land on onboarding
    expect(url).not.toContain('/onboarding')
    expect(pathname === '/admin' || pathname.startsWith('/admin/')).toBeTruthy()
  })

  test('should toggle password visibility', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`)
    
    const passwordField = page.locator('input[autocomplete="current-password"]')
    await expect(passwordField).toBeVisible()
    await expect(passwordField).toHaveAttribute('type', 'password')
    
    // Click the eye toggle button (inside the relative wrapper)
    const eyeButton = passwordField.locator('..').locator('button')
    await eyeButton.click()
    
    // After toggle, same element should have type="text"
    await expect(passwordField).toHaveAttribute('type', 'text')
  })
})
