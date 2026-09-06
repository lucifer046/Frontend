import { test, expect } from '@playwright/test';

/**
 * The dark theme is the site's only theme. These are the invariants that keep
 * it that way: the signals that tell the engine so, the rule that no surface
 * ever states a background without also stating its text, and the guard
 * against a light panel appearing anywhere in the design.
 */

const ROUTES = [
  '/#/',
  '/#/study',
  '/#/documents',
  '/#/events',
  '/#/meetups',
  '/#/leaderboard',
  '/#/community',
  '/#/teams',
  '/#/about',
  '/#/contact',
  '/#/verify-certificate',
];

test('the page declares one colour scheme, three ways', async ({ page }) => {
  await page.goto('/#/');

  // The engine signal: this is what stops a browser's own auto-dark pass and
  // makes native controls and scrollbars render dark.
  const scheme = await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme);
  expect(scheme).toContain('dark');

  await expect(page.locator('meta[name="color-scheme"]')).toHaveAttribute('content', 'dark');
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#050605');
  // Dark Reader's own opt-out for sites that already ship a dark theme.
  await expect(page.locator('meta[name="darkreader-lock"]')).toHaveCount(1);
});

test('the document root paints both a background and a text colour', async ({ page }) => {
  await page.goto('/#/');

  const painted = await page.evaluate(() => {
    const read = (el) => {
      const cs = getComputedStyle(el);
      return { bg: cs.backgroundColor, color: cs.color };
    };
    return { html: read(document.documentElement), body: read(document.body) };
  });

  // Never one without the other: a surface that states only its background is
  // exactly the case a generic darkening pass turns into dark-on-dark.
  for (const [where, v] of Object.entries(painted)) {
    expect(v.bg, `${where} background`).not.toBe('rgba(0, 0, 0, 0)');
    expect(v.bg, `${where} background`).not.toBe('transparent');
    expect(v.color, `${where} text colour`).toBeTruthy();
  }
});

test('no light surface appears anywhere on the public site', async ({ page }) => {
  test.setTimeout(180000);
  await page.setViewportSize({ width: 1440, height: 900 });
  const offenders = [];

  for (const route of ROUTES) {
    await page.goto(route);
    await page.waitForTimeout(600);

    const found = await page.evaluate(() => {
      const lum = (c) => {
        const m = c.match(/rgba?\(([^)]+)\)/);
        if (!m) return null;
        const [r, g, b, a = 1] = m[1].split(',').map((n) => parseFloat(n));
        if (a < 0.9) return null;
        const f = (v) => {
          v /= 255;
          return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        };
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
      };

      const bad = [];
      for (const el of document.querySelectorAll('body *')) {
        // The embedded document is Google's own white paper, by design.
        if (el.closest('.dv-frame')) continue;
        const r = el.getBoundingClientRect();
        if (r.width * r.height < 12000) continue; // ignore chips and badges
        const l = lum(getComputedStyle(el).backgroundColor);
        if (l !== null && l > 0.5) {
          bad.push(`${el.tagName}.${String(el.className || '').split(' ')[0]}`);
        }
      }
      return [...new Set(bad)];
    });

    for (const f of found) offenders.push(`${route}: ${f}`);
  }

  expect(offenders).toEqual([]);
});
