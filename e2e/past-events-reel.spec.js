import { test, expect } from '@playwright/test';

test('homepage reel idles off-screen and runs when scrolled to', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/#/');
  await page.waitForSelector('.reel-track');
  await page.waitForTimeout(600);

  const track = page.locator('.reel-track');
  await expect(page.locator('.reel')).toHaveClass(/reel--idle/);
  await expect(track).toHaveCSS('animation-play-state', 'paused');

  await page.locator('.reel-stage').scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await expect(page.locator('.reel')).not.toHaveClass(/reel--idle/);
  await expect(track).toHaveCSS('animation-play-state', 'running');

  // and it is actually moving
  const a = await track.evaluate((el) => getComputedStyle(el).transform);
  await page.waitForTimeout(900);
  const b = await track.evaluate((el) => getComputedStyle(el).transform);
  expect(a).not.toBe(b);
});

test('reel hover pauses and reveals on both routes', async ({ page }) => {
  for (const route of ['/#/', '/#/events']) {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(route);
    // Hash routing swaps the view in place, so wait for this route's own reel
    // to mount before locating anything inside it.
    await page.waitForSelector('.reel-track');
    await page.waitForTimeout(500);
    await page.locator('.reel-stage').scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);

    // The reel is in motion, so Playwright's stability check can never settle
    // on a frame. Read a poster's box and put the cursor on it, the way a
    // visitor does; retry if the strip carried it away before the mouse
    // arrived.
    const target = page.locator('.reel-frame:not(.is-clone) .reel-poster-img').nth(4);
    for (let i = 0; i < 5; i++) {
      const box = await target.boundingBox();
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.waitForTimeout(250);
      if (await page.locator('.reel--held').count()) break;
    }
    await page.waitForTimeout(800);

    await expect(page.locator('.reel')).toHaveClass(/reel--held/);
    await expect(page.locator('.reel-track')).toHaveCSS('animation-play-state', 'paused');
    const detail = page.locator('.reel-frame.is-active .reel-detail');
    await expect(detail).toHaveCSS('opacity', '1');

    await page.mouse.move(5, 5);
    await page.waitForTimeout(400);
    await expect(page.locator('.reel')).not.toHaveClass(/reel--held/);
    await expect(page.locator('.reel-track')).toHaveCSS('animation-play-state', 'running');
  }
});

test('keyboard focus pauses the reel and exposes details', async ({ page }) => {
  await page.goto('/#/events');
  await page.locator('.reel-stage').scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await page.locator('.reel-frame:not(.is-clone) .reel-poster').first().focus();
  await page.waitForTimeout(700);
  await expect(page.locator('.reel')).toHaveClass(/reel--held/);
  await expect(page.locator('.reel-frame.is-active .reel-detail')).toHaveCSS('opacity', '1');
});

test('reduced motion stops travel and keeps every poster reachable', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('/#/events');
  await page.locator('.reel-stage').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await expect(page.locator('.reel-track')).toHaveCSS('animation-name', 'none');
  await expect(page.locator('.reel-frame:not(.is-clone)')).toHaveCount(21);
  await expect(page.locator('.reel-frame.is-clone').first()).toBeHidden();
  const scrollable = await page
    .locator('.reel-stage')
    .evaluate((el) => el.scrollWidth > el.clientWidth);
  expect(scrollable).toBe(true);
  await ctx.close();
});

test('both routes render the same archive from one data source', async ({ page }) => {
  const titlesOn = async (route) => {
    await page.goto(route);
    await page.waitForSelector('.reel-frame');
    return page.locator('.reel-frame:not(.is-clone) .reel-poster-title').allInnerTexts();
  };
  const home = await titlesOn('/#/');
  const events = await titlesOn('/#/events');
  expect(home).toEqual(events);
  expect(home.length).toBe(21);
});
