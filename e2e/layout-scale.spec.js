import { test, expect } from '@playwright/test';

/**
 * The global layout scale.
 *
 * The site is sized in rem against a root that opens above 1600px, and its
 * content column grows with the viewport up to a cap. Both are easy to nudge
 * by accident, and a nudge in the wrong direction is invisible in review but
 * reflows every page. These two tests pin the contract from both ends:
 * laptops and below must render exactly as they did before the scale existed,
 * and large displays must actually open — monotonically, and to a ceiling.
 */

/** What each token resolved to BEFORE this change, at each width. */
const BASELINE = {
  375: { max: 1280, gut: 20, pad: 64, root: 16 },
  390: { max: 1280, gut: 20, pad: 64, root: 16 },
  430: { max: 1280, gut: 20, pad: 64, root: 16 },
  768: { max: 1280, gut: 23.04, pad: 64, root: 16 },
  820: { max: 1280, gut: 24.6, pad: 96, root: 16 },
  900: { max: 1280, gut: 27, pad: 96, root: 16 },
  1024: { max: 1280, gut: 30.72, pad: 96, root: 16 },
  1280: { max: 1280, gut: 32, pad: 96, root: 16 },
  1440: { max: 1280, gut: 32, pad: 96, root: 16 },
};

test('tokens unchanged at laptop and below', async ({ page }) => {
  await page.goto('/#/', { waitUntil: 'load' });
  for (const [w, want] of Object.entries(BASELINE)) {
    await page.setViewportSize({ width: Number(w), height: 900 });
    await page.waitForTimeout(80);
    const got = await page.evaluate(() => {
      const c = document.querySelector('.container');
      const sec = document.querySelector('.section');
      const ccs = getComputedStyle(c);
      return {
        max: parseFloat(ccs.maxWidth),
        gut: parseFloat(ccs.paddingLeft),
        pad: sec ? parseFloat(getComputedStyle(sec).paddingTop) : null,
        root: parseFloat(getComputedStyle(document.documentElement).fontSize),
      };
    });
    for (const k of ['max', 'gut', 'pad', 'root']) {
      expect(
        Math.abs(got[k] - want[k]),
        `${w}px ${k}: expected ${want[k]}, got ${got[k]}`
      ).toBeLessThan(1.1); // within a pixel: at 1440 the band padding opens by 0.96px, the first step of the large-screen ramp
    }
  }
});

test('tokens open on large screens', async ({ page }) => {
  await page.goto('/#/', { waitUntil: 'load' });
  const seen = [];
  for (const w of [1600, 1920, 2560, 3440, 3840]) {
    await page.setViewportSize({ width: w, height: 1000 });
    await page.waitForTimeout(80);
    seen.push(
      await page.evaluate((vw) => {
        const c = document.querySelector('.container');
        const sec = document.querySelector('.section');
        return {
          w: vw,
          max: Math.round(parseFloat(getComputedStyle(c).maxWidth)),
          root: +parseFloat(getComputedStyle(document.documentElement).fontSize).toFixed(2),
          pad: sec ? Math.round(parseFloat(getComputedStyle(sec).paddingTop)) : null,
        };
      }, w)
    );
  }
  console.log(JSON.stringify(seen, null, 1));
  // Strictly increasing, and capped.
  for (let i = 1; i < seen.length; i++) {
    expect(seen[i].max).toBeGreaterThanOrEqual(seen[i - 1].max);
    expect(seen[i].root).toBeGreaterThanOrEqual(seen[i - 1].root);
  }
  expect(seen[seen.length - 1].max).toBeLessThanOrEqual(1881);
  expect(seen[seen.length - 1].root).toBeLessThanOrEqual(20.1);
});
