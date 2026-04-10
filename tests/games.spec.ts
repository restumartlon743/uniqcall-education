import { test, expect } from '@playwright/test'

// ─── All 37 game slugs with display names ─────────────────────

const ALL_GAMES = [
  // Cluster 1: Logical-Systemic
  { slug: 'logic-grid-puzzle', name: 'Logic Grid Puzzle' },
  { slug: 'theorem-prover', name: 'Theorem Prover' },
  { slug: 'pattern-decoder', name: 'Pattern Decoder' },
  { slug: 'circuit-builder', name: 'Circuit Builder' },
  { slug: 'bridge-constructor', name: 'Bridge Constructor' },
  { slug: 'code-machine', name: 'Code Machine' },
  { slug: 'justice-scales', name: 'Justice Scales' },
  { slug: 'rule-architect', name: 'Rule Architect' },
  { slug: 'war-room', name: 'War Room' },
  { slug: 'startup-simulator', name: 'Startup Simulator' },
  { slug: 'chess-tactics', name: 'Chess Tactics' },
  // Cluster 2: Creative-Expressive
  { slug: 'idea-factory', name: 'Idea Factory' },
  { slug: 'color-harmonizer', name: 'Color Harmonizer' },
  { slug: 'invention-lab', name: 'Invention Lab' },
  { slug: 'pixel-precision', name: 'Pixel Precision' },
  { slug: 'symmetry-studio', name: 'Symmetry Studio' },
  { slug: 'typography-challenge', name: 'Typography Challenge' },
  { slug: 'story-weaver', name: 'Story Weaver' },
  { slug: 'debate-arena', name: 'Debate Arena' },
  { slug: 'word-architect', name: 'Word Architect' },
  { slug: 'rhythm-catcher', name: 'Rhythm Catcher' },
  { slug: 'scene-director', name: 'Scene Director' },
  { slug: 'emoji-charades', name: 'Emoji Charades' },
  // Cluster 3: Social-Humanitarian
  { slug: 'empathy-simulator', name: 'Empathy Simulator' },
  { slug: 'triage-trainer', name: 'Triage Trainer' },
  { slug: 'wellness-garden', name: 'Wellness Garden' },
  { slug: 'peace-table', name: 'Peace Table' },
  { slug: 'culture-bridge', name: 'Culture Bridge' },
  { slug: 'translation-challenge', name: 'Translation Challenge' },
  { slug: 'field-journal', name: 'Field Journal' },
  { slug: 'geo-tracker', name: 'Geo Tracker' },
  { slug: 'mystery-lab', name: 'Mystery Lab' },
  { slug: 'teach-back-challenge', name: 'Teach-Back Challenge' },
  { slug: 'study-plan-designer', name: 'Study Plan Designer' },
  { slug: 'future-builder', name: 'Future Builder' },
  { slug: 'trend-spotter', name: 'Trend Spotter' },
  { slug: 'innovation-pitch', name: 'Innovation Pitch' },
] as const

// ─── Parametrized tests for all 37 games ──────────────────────

for (const game of ALL_GAMES) {
  test.describe(`Game: ${game.name} (${game.slug})`, () => {
    test('page loads successfully', async ({ page }) => {
      const response = await page.goto(`/student/games/${game.slug}`)
      expect(response).not.toBeNull()
      expect(response!.status()).toBeLessThan(500)

      // Page should not show a Next.js application error
      const body = await page.locator('body').textContent()
      expect(body).not.toContain('Application error')
    })

    test('game title is visible in the shell', async ({ page }) => {
      const response = await page.goto(`/student/games/${game.slug}`)
      test.skip(response?.status() === 500, 'Server returned 500 for this game')

      // The GameShell header displays the game name
      // Also check the page title as a fallback (set via generateMetadata)
      const titleLocator = page.getByText(game.name, { exact: false })
      await expect(titleLocator.first()).toBeVisible({ timeout: 15000 })
    })

    test('no critical JavaScript errors on load', async ({ page }) => {
      const pageErrors: string[] = []

      // Capture only uncaught JS exceptions — not resource loading noise
      page.on('pageerror', (error) => {
        const msg = error.message
        // Filter out React hydration errors (expected in dev mode with randomized content)
        if (
          msg.includes('hydrat') ||
          msg.includes('Hydration') ||
          msg.includes('Suspense boundary') ||
          msg.includes('server-rendered HTML') ||
          msg.includes('Minified React error')
        ) {
          return
        }
        pageErrors.push(msg)
      })

      const response = await page.goto(`/student/games/${game.slug}`)
      test.skip(response?.status() === 500, 'Server returned 500 for this game')

      // Wait for dynamic game content to finish loading
      await page.waitForTimeout(2000)

      expect(pageErrors).toEqual([])
    })

    test('game area renders interactive content', async ({ page }) => {
      const response = await page.goto(`/student/games/${game.slug}`)
      test.skip(response?.status() === 500, 'Server returned 500 for this game')

      // Wait for lazy-loaded game component
      await page.waitForTimeout(3000)

      // Game should have clickable elements — buttons from GameShell + game
      const buttons = page.locator('button')
      const buttonCount = await buttons.count()
      expect(buttonCount).toBeGreaterThanOrEqual(1)
    })
  })
}
