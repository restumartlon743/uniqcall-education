import { test, expect } from '@playwright/test'

test.describe('Game Hub — /student/games', () => {
  test('page loads and displays Game Hub heading', async ({ page }) => {
    await page.goto('/student/games')
    await expect(page.getByText('Game Hub')).toBeVisible()
  })

  test('displays all 37 game cards', async ({ page }) => {
    await page.goto('/student/games')
    // The hub shows "37 mini-games" in the subtitle
    await expect(page.getByText('37 mini-games')).toBeVisible()

    // All 3 cluster sections should be visible
    await expect(page.getByText('Logical-Systemic')).toBeVisible()
    await expect(page.getByText('Creative-Expressive')).toBeVisible()
    await expect(page.getByText('Social-Humanitarian')).toBeVisible()

    // Count game card links — each card links to /student/games/<slug>
    const gameLinks = page.locator('a[href^="/student/games/"]')
    await expect(gameLinks).toHaveCount(37)
  })

  test('archetype filter buttons are present and clickable', async ({ page }) => {
    await page.goto('/student/games')

    // "All" filter button should be visible
    const allButton = page.getByRole('button', { name: 'All' })
    await expect(allButton).toBeVisible()

    // Verify multiple archetype filter buttons exist
    const filterButtons = page.locator('button').filter({ hasText: /^(THINKER|ENGINEER|CREATOR|HEALER|STRATEGIST)$/ })
    const count = await filterButtons.count()
    expect(count).toBeGreaterThanOrEqual(4)

    // Click a filter button and verify no crash
    await filterButtons.first().click()
    // Page should still be functional
    await expect(page.getByText('Game Hub')).toBeVisible()

    // Click "All" to reset
    await allButton.click()
    await expect(page.getByText('Game Hub')).toBeVisible()
  })

  test('game card link navigates to game page', async ({ page }) => {
    await page.goto('/student/games')

    // Click the first game card
    const firstGameLink = page.locator('a[href^="/student/games/"]').first()
    const href = await firstGameLink.getAttribute('href')
    expect(href).toBeTruthy()

    await firstGameLink.click()
    await page.waitForURL(`**${href}`)

    // Should be on the game page now — game shell should render
    await expect(page.locator('body')).not.toBeEmpty()
  })
})
