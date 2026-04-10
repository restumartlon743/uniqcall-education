import { test, expect, type Page } from '@playwright/test'

// ─── Helpers ───────────────────────────────────────────────────

/** Collect uncaught JS errors (filtering out benign dev-mode noise). */
function trackPageErrors(page: Page): string[] {
  const errors: string[] = []
  page.on('pageerror', (err) => {
    const msg = err.message
    // Skip React hydration warnings and some common dev-mode noise
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

/** Assert no horizontal overflow at 1280×720 viewport. */
async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth
  })
  expect(overflow, 'Page should not have horizontal scrollbar').toBe(false)
}

/** Assert all <img> elements loaded (naturalWidth > 0 or SVG). */
async function expectNoBrokenImages(page: Page) {
  const brokenImages = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img'))
    return imgs
      .filter((img) => {
        // Skip lazy / hidden images and inline SVG data URIs
        if (!img.src || img.src.startsWith('data:')) return false
        // Not yet loaded – still broken if naturalWidth is 0
        return img.complete && img.naturalWidth === 0
      })
      .map((img) => img.src)
  })
  expect(brokenImages, `Broken images found: ${brokenImages.join(', ')}`).toHaveLength(0)
}

/** Assert the main content area is not completely empty. */
async function expectMainContentNotEmpty(page: Page) {
  const bodyText = await page.locator('body').innerText()
  expect(bodyText.trim().length).toBeGreaterThan(0)
}

// ─── Page Definitions ──────────────────────────────────────────

interface PageDef {
  /** Display name for the test suite */
  name: string
  /** URL path */
  path: string
  /** Strings that should be visible on the page */
  expectedTexts: string[]
  /** Optional: CSS selectors that should exist */
  expectedSelectors?: string[]
}

const PAGES: PageDef[] = [
  // ── Public ──
  {
    name: 'Landing Page',
    path: '/',
    expectedTexts: ['Uniqcall', 'Education', 'Enter Your Dashboard'],
    expectedSelectors: ['a[href="/login"]'],
  },

  // ── Student Dashboard ──
  {
    name: 'Student Dashboard',
    path: '/student',
    expectedTexts: ['LVL'],
    expectedSelectors: ['.recharts-wrapper, svg.recharts-surface, [class*="radar"], canvas'],
  },
  {
    name: 'Student Profile',
    path: '/student/profile',
    expectedTexts: ['Analytical', 'Creative'],
  },
  {
    name: 'Student Games (Game Hub)',
    path: '/student/games',
    expectedTexts: [],
  },
  {
    name: 'Student Quests',
    path: '/student/quests',
    expectedTexts: ['Quests', 'XP'],
  },

  // ── Teacher Dashboard ──
  {
    name: 'Teacher Dashboard',
    path: '/teacher',
    expectedTexts: ['Total Students', 'Average Mastery'],
  },
  {
    name: 'Teacher Students',
    path: '/teacher/students',
    expectedTexts: [],
  },
  {
    name: 'Teacher Groups',
    path: '/teacher/groups',
    expectedTexts: [],
  },
  {
    name: 'Teacher Tasks',
    path: '/teacher/tasks',
    expectedTexts: [],
  },
  {
    name: 'Teacher Reports',
    path: '/teacher/reports',
    expectedTexts: [],
  },
  {
    name: 'Teacher Settings',
    path: '/teacher/settings',
    expectedTexts: [],
  },

  // ── Parent Dashboard ──
  {
    name: 'Parent Dashboard',
    path: '/parent',
    expectedTexts: [],
  },

  // ── Admin Dashboard ──
  {
    name: 'Admin Dashboard',
    path: '/admin',
    expectedTexts: ['Total Schools', 'Total Teachers', 'Total Students'],
  },
]

// ─── Parametrized Tests ────────────────────────────────────────

for (const pageDef of PAGES) {
  test.describe(`Page: ${pageDef.name} (${pageDef.path})`, () => {
    test.describe.configure({ mode: 'serial' })

    test('page loads with HTTP 200 and no crash', async ({ page }) => {
      const response = await page.goto(pageDef.path, { waitUntil: 'domcontentloaded' })
      expect(response).not.toBeNull()
      expect(response!.status()).toBeLessThan(400)

      // Should not show Next.js error overlay
      const body = await page.locator('body').textContent()
      expect(body).not.toContain('Application error')
      expect(body).not.toContain('Internal Server Error')
    })

    test('no critical JavaScript errors on load', async ({ page }) => {
      const errors = trackPageErrors(page)
      await page.goto(pageDef.path, { waitUntil: 'networkidle' })
      // Allow short settle time for client-side rendering
      await page.waitForTimeout(500)
      expect(errors, `JS errors: ${errors.join(' | ')}`).toHaveLength(0)
    })

    test('no horizontal overflow at 1280x720', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 })
      await page.goto(pageDef.path, { waitUntil: 'domcontentloaded' })
      await page.waitForTimeout(300)
      await expectNoHorizontalOverflow(page)
    })

    test('no broken images', async ({ page }) => {
      await page.goto(pageDef.path, { waitUntil: 'networkidle' })
      await expectNoBrokenImages(page)
    })

    test('main content area is not empty', async ({ page }) => {
      await page.goto(pageDef.path, { waitUntil: 'domcontentloaded' })
      await expectMainContentNotEmpty(page)
    })

    // Key content text checks
    if (pageDef.expectedTexts.length > 0) {
      test('key content is visible', async ({ page }) => {
        await page.goto(pageDef.path, { waitUntil: 'domcontentloaded' })
        for (const text of pageDef.expectedTexts) {
          await expect(
            page.getByText(text, { exact: false }).first()
          ).toBeVisible({ timeout: 10000 })
        }
      })
    }

    // Selector checks
    if (pageDef.expectedSelectors && pageDef.expectedSelectors.length > 0) {
      test('expected UI elements are present', async ({ page }) => {
        await page.goto(pageDef.path, { waitUntil: 'networkidle' })
        for (const selector of pageDef.expectedSelectors!) {
          const count = await page.locator(selector).count()
          expect(count, `Expected selector "${selector}" to match at least 1 element`).toBeGreaterThan(0)
        }
      })
    }
  })
}

// ─── Specific Feature Tests ────────────────────────────────────

test.describe('Landing Page — specific UI', () => {
  test('hero section has title and subtitle', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await expect(page.getByText('Uniqcall').first()).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('Education').first()).toBeVisible()
    await expect(page.getByText('Empowering Every Unique Mind').first()).toBeVisible()
  })

  test('CTA button links to login', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    const cta = page.getByText('Enter Your Dashboard')
    await expect(cta).toBeVisible({ timeout: 10000 })
    const href = await cta.evaluate((el) => {
      const anchor = el.closest('a')
      return anchor ? anchor.getAttribute('href') : null
    })
    expect(href).toBe('/login')
  })

  test('three feature cards are visible', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await expect(page.getByText('Cognitive Assessment').first()).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('VARK Profiling').first()).toBeVisible()
    await expect(page.getByText('Knowledge Navigator').first()).toBeVisible()
  })

  test('archetype avatars are displayed', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    // The landing page shows Thinker, Explorer, Creator labels
    await expect(page.getByText('Thinker').first()).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('Explorer').first()).toBeVisible()
    await expect(page.getByText('Creator').first()).toBeVisible()
  })
})

test.describe('Student Dashboard — specific UI', () => {
  test('avatar and level display are present', async ({ page }) => {
    await page.goto('/student', { waitUntil: 'domcontentloaded' })
    await expect(page.getByText('LVL', { exact: false }).first()).toBeVisible({ timeout: 10000 })
  })

  test('radar chart area is rendered', async ({ page }) => {
    await page.goto('/student', { waitUntil: 'networkidle' })
    // Recharts renders an SVG with class recharts-wrapper or similar
    const chartArea = page.locator('.recharts-wrapper, .recharts-surface, svg.recharts-surface')
    await expect(chartArea.first()).toBeVisible({ timeout: 10000 })
  })

  test('XP progress is shown', async ({ page }) => {
    await page.goto('/student', { waitUntil: 'domcontentloaded' })
    await expect(page.getByText('XP', { exact: false }).first()).toBeVisible({ timeout: 10000 })
  })

  test('badges section exists', async ({ page }) => {
    await page.goto('/student', { waitUntil: 'domcontentloaded' })
    // The badges section shows unlocked count
    const badgeText = page.getByText(/badge/i).first()
    await expect(badgeText).toBeVisible({ timeout: 10000 })
  })

  test('daily missions are listed', async ({ page }) => {
    await page.goto('/student', { waitUntil: 'domcontentloaded' })
    const missionText = page.getByText(/mission/i).first()
    await expect(missionText).toBeVisible({ timeout: 10000 })
  })
})

test.describe('Student Profile — specific UI', () => {
  test('cognitive parameters are listed', async ({ page }) => {
    await page.goto('/student/profile', { waitUntil: 'domcontentloaded' })
    const params = ['Analytical', 'Creative', 'Linguistic', 'Kinesthetic', 'Social', 'Observation', 'Intuition']
    for (const param of params) {
      await expect(page.getByText(param, { exact: false }).first()).toBeVisible({ timeout: 10000 })
    }
  })

  test('radar chart is rendered in profile', async ({ page }) => {
    await page.goto('/student/profile', { waitUntil: 'networkidle' })
    const chartArea = page.locator('.recharts-wrapper, .recharts-surface, svg.recharts-surface')
    await expect(chartArea.first()).toBeVisible({ timeout: 10000 })
  })
})

test.describe('Student Quests — specific UI', () => {
  test('quest count and XP earned are displayed', async ({ page }) => {
    await page.goto('/student/quests', { waitUntil: 'domcontentloaded' })
    await expect(page.getByText('Quests', { exact: false }).first()).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('XP', { exact: false }).first()).toBeVisible({ timeout: 10000 })
  })

  test('level indicator is shown', async ({ page }) => {
    await page.goto('/student/quests', { waitUntil: 'domcontentloaded' })
    await expect(page.getByText('Level', { exact: false }).first()).toBeVisible({ timeout: 10000 })
  })
})

test.describe('Teacher Dashboard — specific UI', () => {
  test('stats cards are visible', async ({ page }) => {
    await page.goto('/teacher', { waitUntil: 'domcontentloaded' })
    await expect(page.getByText('Total Students').first()).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('Average Mastery').first()).toBeVisible()
    await expect(page.getByText('Active Groups').first()).toBeVisible()
  })

  test('needs attention indicator is shown', async ({ page }) => {
    await page.goto('/teacher', { waitUntil: 'domcontentloaded' })
    await expect(page.getByText('Needs Attention', { exact: false }).first()).toBeVisible({ timeout: 10000 })
  })
})

test.describe('Admin Dashboard — specific UI', () => {
  test('admin stats cards are visible', async ({ page }) => {
    await page.goto('/admin', { waitUntil: 'domcontentloaded' })
    await expect(page.getByText('Total Schools').first()).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('Total Teachers').first()).toBeVisible()
    await expect(page.getByText('Total Students').first()).toBeVisible()
    await expect(page.getByText('Total Parents').first()).toBeVisible()
  })

  test('quick action buttons are present', async ({ page }) => {
    await page.goto('/admin', { waitUntil: 'domcontentloaded' })
    await expect(page.getByText('Add School', { exact: false }).first()).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('Add Class', { exact: false }).first()).toBeVisible()
  })
})

test.describe('Parent Dashboard — specific UI', () => {
  test('child overview content is visible', async ({ page }) => {
    await page.goto('/parent', { waitUntil: 'domcontentloaded' })
    // The parent page shows child data with archetype and progress
    const body = await page.locator('body').innerText()
    // Just confirm meaningful content is rendered (not blank)
    expect(body.trim().length).toBeGreaterThan(50)
  })
})

// ─── Cross-page: Dashboard sidebar/navigation ─────────────────

test.describe('Dashboard layout — sidebar navigation', () => {
  const dashboardPages = ['/student', '/teacher', '/parent', '/admin']

  for (const path of dashboardPages) {
    test(`${path} has sidebar or navigation`, async ({ page }) => {
      await page.goto(path, { waitUntil: 'domcontentloaded' })
      // The DashboardShell renders a Sidebar component with nav elements
      const nav = page.locator('nav, aside, [role="navigation"], [data-sidebar]')
      const count = await nav.count()
      expect(count, `Expected navigation element on ${path}`).toBeGreaterThan(0)
    })
  }
})
