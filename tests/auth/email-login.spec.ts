import { test, expect } from '@playwright/test'

const BASE_URL = process.env.TEST_BASE_URL ?? 'http://localhost:3001'

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
    await page.goto(`${BASE_URL}/login`)
    
    await page.locator('input[type="email"]').fill('ristyadirestu@gmail.com')
    await page.locator('input[type="password"]').fill('Admin@Uniqcall2026')
    await page.getByRole('button', { name: /sign in with email|masuk dengan email/i }).click()
    
    // Should redirect to /admin after middleware processes the session
    await page.waitForURL(/\/(admin|onboarding|teacher)/, { timeout: 20000 })
    const url = page.url()
    console.log('Redirected to:', url)
    
    // Admin user should go to /admin
    expect(url).toContain('/admin')
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
