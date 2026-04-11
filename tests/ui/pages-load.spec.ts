import { test, expect, type Page } from '@playwright/test'

const BASE_URL = process.env.TEST_BASE_URL ?? 'http://localhost:3000'
const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL ?? ''
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? ''

// ─── Helpers ───────────────────────────────────────────────────

function collectConsoleErrors(page: Page): string[] {
  const errors: string[] = []
  page.on('pageerror', (err) => {
    const msg = err.message
    if (
      msg.includes('hydrat') ||
      msg.includes('Minified React error') ||
      msg.includes('NEXT_REDIRECT') ||
      msg.includes('ResizeObserver')
    ) {
      return
    }
    errors.push(msg)
  })
  return errors
}

async function adminLogin(page: Page) {
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' })

  const emailInput = page.locator('input[type="email"]')
  await expect(emailInput).toBeVisible({ timeout: 10000 })
  await emailInput.fill(ADMIN_EMAIL)

  const passwordInput = page.locator('input[type="password"]')
  await expect(passwordInput).toBeVisible()
  await passwordInput.fill(ADMIN_PASSWORD)

  // Wait for button to be enabled after filling fields
  const submitButton = page.getByRole('button', { name: /sign in with email|masuk dengan email/i })
  await expect(submitButton).toBeEnabled({ timeout: 5000 })
  await submitButton.click()

  await page.waitForURL((url) => {
    return url.pathname === '/admin' || url.pathname.startsWith('/admin/')
  }, { timeout: 20000 })
}

// ─── Public Pages ──────────────────────────────────────────────

test.describe('Public Pages', () => {
  test('Landing page renders correctly', async ({ page }) => {
    const errors = collectConsoleErrors(page)
    const response = await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' })

    expect(response).not.toBeNull()
    expect(response!.status()).toBeLessThan(500)

    await expect(page.getByText('Uniqcall').first()).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('Education').first()).toBeVisible({ timeout: 10000 })

    const cta = page.getByText(/Enter Your Dashboard|Masuk/i).first()
    await expect(cta).toBeVisible({ timeout: 10000 })

    const body = await page.locator('body').textContent()
    expect(body).not.toContain('Internal Server Error')
    expect(body).not.toContain('Application error')

    expect(errors, `JS errors on landing: ${errors.join(' | ')}`).toHaveLength(0)
  })

  test('Login page renders email input and Google sign-in button', async ({ page }) => {
    const errors = collectConsoleErrors(page)
    const response = await page.goto(`${BASE_URL}/login`, { waitUntil: 'domcontentloaded' })

    expect(response).not.toBeNull()
    expect(response!.status()).toBeLessThan(500)

    await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('input[type="password"]')).toBeVisible()

    const googleButton = page.getByRole('button', { name: /google/i })
    await expect(googleButton).toBeVisible()

    const emailButton = page.getByRole('button', { name: /sign in with email|masuk dengan email/i })
    await expect(emailButton).toBeVisible()

    const body = await page.locator('body').textContent()
    expect(body).not.toContain('Internal Server Error')
    expect(body).not.toContain('Application error')

    expect(errors, `JS errors on login: ${errors.join(' | ')}`).toHaveLength(0)
  })
})

// ─── Admin Pages (Authenticated) ──────────────────────────────

test.describe('Admin Pages (authenticated)', () => {
  test.skip(!ADMIN_EMAIL || !ADMIN_PASSWORD, 'Admin credentials not set')

  test('GET /admin - renders admin overview stats', async ({ page }) => {
    const errors = collectConsoleErrors(page)
    await adminLogin(page)
    await page.goto(`${BASE_URL}/admin`, { waitUntil: 'networkidle' })

    const body = await page.locator('body').textContent()
    expect(body).not.toContain('Internal Server Error')
    expect(body).not.toContain('Application error')

    await expect(page.getByText('Total Schools').first()).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('Total Teachers').first()).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('Total Students').first()).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('Total Parents').first()).toBeVisible({ timeout: 10000 })

    expect(errors, `JS errors on /admin: ${errors.join(' | ')}`).toHaveLength(0)
  })

  test('GET /admin/users - renders users section', async ({ page }) => {
    const errors = collectConsoleErrors(page)
    await adminLogin(page)
    await page.goto(`${BASE_URL}/admin/users`, { waitUntil: 'networkidle' })

    const body = await page.locator('body').textContent()
    expect(body).not.toContain('Internal Server Error')
    expect(body).not.toContain('Application error')

    // Wait for loading to complete by checking for tabs or search input
    await expect(page.getByPlaceholder(/search/i).first()).toBeVisible({ timeout: 15000 })

    // Users page has custom Teachers/Students/Parents tab triggers
    const tabTriggers = page.locator('[data-slot="tabs-trigger"]')
    await expect(tabTriggers.first()).toBeVisible({ timeout: 10000 })
    const tabCount = await tabTriggers.count()
    expect(tabCount, 'Should have tab triggers for user categories').toBeGreaterThanOrEqual(2)

    expect(errors, `JS errors on /admin/users: ${errors.join(' | ')}`).toHaveLength(0)
  })

  test('GET /admin/schools - renders schools section', async ({ page }) => {
    const errors = collectConsoleErrors(page)
    await adminLogin(page)
    await page.goto(`${BASE_URL}/admin/schools`, { waitUntil: 'networkidle' })

    const body = await page.locator('body').textContent()
    expect(body).not.toContain('Internal Server Error')
    expect(body).not.toContain('Application error')

    // Wait for loading spinner to disappear and search field to appear
    await expect(page.getByPlaceholder(/search schools/i).first()).toBeVisible({ timeout: 15000 })

    // Should have Add School button
    const addButton = page.getByRole('button', { name: /add school/i })
    await expect(addButton).toBeVisible({ timeout: 5000 })

    expect(errors, `JS errors on /admin/schools: ${errors.join(' | ')}`).toHaveLength(0)
  })

  test('GET /admin/classes - renders classes section', async ({ page }) => {
    const errors = collectConsoleErrors(page)
    await adminLogin(page)
    await page.goto(`${BASE_URL}/admin/classes`, { waitUntil: 'networkidle' })

    const body = await page.locator('body').textContent()
    expect(body).not.toContain('Internal Server Error')
    expect(body).not.toContain('Application error')

    // Wait for loading spinner to disappear and content to load
    await expect(page.getByPlaceholder(/search/i).first()).toBeVisible({ timeout: 15000 })

    // Should have Add Class button or table or search input
    const addButton = page.getByRole('button', { name: /add class/i })
    const hasAddButton = await addButton.count()
    const hasSearch = await page.getByPlaceholder(/search/i).count()
    expect(hasAddButton + hasSearch, 'Should have Add Class button or search field').toBeGreaterThan(0)

    expect(errors, `JS errors on /admin/classes: ${errors.join(' | ')}`).toHaveLength(0)
  })

  test('GET /admin/settings - renders settings toggles', async ({ page }) => {
    const errors = collectConsoleErrors(page)
    await adminLogin(page)
    await page.goto(`${BASE_URL}/admin/settings`, { waitUntil: 'networkidle' })

    const body = await page.locator('body').textContent()
    expect(body).not.toContain('Internal Server Error')
    expect(body).not.toContain('Application error')

    await expect(page.getByText('Assessment Configuration').first()).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('Cognitive Assessment Module').first()).toBeVisible()
    await expect(page.getByText('VARK Learning Style Module').first()).toBeVisible()
    await expect(page.getByText(/Gamification/i).first()).toBeVisible()

    expect(errors, `JS errors on /admin/settings: ${errors.join(' | ')}`).toHaveLength(0)
  })

  test('CRUD: Schools - Add School dialog opens and renders form', async ({ page }) => {
    await adminLogin(page)
    await page.goto(`${BASE_URL}/admin/schools`, { waitUntil: 'networkidle' })

    const addButton = page.getByRole('button', { name: /add school/i })
    await expect(addButton).toBeVisible({ timeout: 10000 })
    await addButton.click()

    // Dialog should appear with form
    await expect(page.getByText(/Add School|Add New School/i).first()).toBeVisible({ timeout: 5000 })

    // Should have at least one input (school name)
    const dialogInputs = page.locator('[role="dialog"] input, .fixed input')
    const inputCount = await dialogInputs.count()
    expect(inputCount, 'Dialog should have form inputs').toBeGreaterThan(0)
  })

  test('CRUD: Users - page renders with user data', async ({ page }) => {
    await adminLogin(page)
    await page.goto(`${BASE_URL}/admin/users`, { waitUntil: 'networkidle' })

    // Wait for tabs to be visible (data has loaded)
    await expect(page.locator('[data-slot="tabs-trigger"]').first()).toBeVisible({ timeout: 15000 })

    // Check page has substantive content
    const body = await page.locator('body').textContent()
    expect(body!.length).toBeGreaterThan(50)

    // Should show Teachers tab with count
    await expect(page.getByText(/Teachers/i).first()).toBeVisible()
    // Should show Students tab with count
    await expect(page.getByText(/Students/i).first()).toBeVisible()
  })
})
