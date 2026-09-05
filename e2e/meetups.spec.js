import { test, expect } from '@playwright/test';

/**
 * Meetups + Leaderboard behaviour, beyond the route smoke suite.
 *
 * These guard the rules the redesign is built on and that a data edit could
 * silently break: the region grid stays alphabetical, the archive pages five
 * at a time, nested region routes keep Meetups lit in the rail, and the
 * leaderboard shows the *current* coordinators on zero points — never the
 * retired names it used to carry.
 */

test('meetups → region → back/forward, pagination, nav', async ({ page }) => {
  await page.goto('/#/', { waitUntil: 'load' });

  // Rail link → Meetups
  await page.locator('.vnav__list a[href="#/meetups"]').click();
  await expect(page.locator('#regions-heading')).toBeVisible();

  // Regions alphabetical
  const names = await page.locator('.mvr-name').allInnerTexts();
  expect(names).toEqual([
    'Bangalore',
    'Chandigarh',
    'Chennai',
    'Delhi-NCR',
    'Hyderabad',
    'Kolkata',
    'Lucknow',
    'Mumbai',
    'Patna',
  ]);

  // Five cards, paginated
  await expect(page.locator('.mc')).toHaveCount(5);
  const before = await page.locator('.mc-title').first().innerText();
  await page.locator('.ar-page', { hasText: '2' }).first().click();
  await expect(page.locator('.mc')).toHaveCount(5);
  expect(await page.locator('.mc-title').first().innerText()).not.toBe(before);
  await expect(page.locator('.ar-count')).toContainText('6–10');

  // Into a region page
  await page.locator('a[href="#/meetups/patna"]').click();
  await expect(page.locator('.rm-title')).toContainText('Patna');
  await expect(page.locator('.mc')).toHaveCount(5);
  // Meetups stays lit for a nested route
  await expect(page.locator('.vnav__list a[href="#/meetups"]')).toHaveAttribute(
    'aria-current',
    'page'
  );

  // Back / forward
  await page.goBack();
  await expect(page.locator('#regions-heading')).toBeVisible();
  await page.goForward();
  await expect(page.locator('.rm-title')).toContainText('Patna');

  // Leaderboard from the rail
  await page.locator('.vnav__list a[href="#/leaderboard"]').click();
  await expect(page.locator('#standings-heading')).toBeVisible();
  await expect(page.locator('.vnav__list a[href="#/leaderboard"]')).toHaveAttribute(
    'aria-current',
    'page'
  );
  const pts = await page.locator('.lb-score-value, .lb-row-points').allInnerTexts();
  expect(new Set(pts)).toEqual(new Set(['0']));
  expect(pts).toHaveLength(9);
  // No old RC names anywhere
  const body = await page.locator('body').innerText();
  for (const stale of [
    'Nivash',
    'Rushabh Kapse',
    'Aakash Rawal',
    'Chandan Saw',
    'Dishi Gupta',
    'Kartik Singh',
    'Sahanaa',
  ]) {
    expect(body, `stale RC "${stale}" still on the leaderboard`).not.toContain(stale);
  }
});

test('no horizontal overflow on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const path of ['/meetups', '/leaderboard', '/meetups/delhi-ncr', '/meetups/mumbai']) {
    await page.goto(`/#${path}`, { waitUntil: 'load' });
    const over = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(over, `${path} overflows at 375px`).toBe(false);
  }
});
