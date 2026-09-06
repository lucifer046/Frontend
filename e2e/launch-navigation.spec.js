import { test, expect } from '@playwright/test';

/**
 * Navigation regression suite for the member launch.
 *
 * The reported failure is a blank destination: the URL changes, the outgoing
 * view disappears, and nothing takes its place until the browser is refreshed.
 * These tests walk the exact journeys a member makes and assert that the
 * destination is actually on screen, so the failure cannot come back silently.
 *
 * Nothing here reloads the page except where a reload is the thing being
 * tested: a passing run means navigation worked without one.
 */

const hash = (path) => (path === '/' ? '/#/' : `/#${path}`);

/** Every assertion goes through this: a route is "rendered" or it is a bug. */
const MARKERS = {
  login: '.entry__title',
  lounge: '.lounge .hero__title',
  dashboard: '.dash__title',
  publicHome: '#home-hero',
  publicAbout: '#who-heading',
};

async function expectRendered(page, key) {
  await expect(page.locator(MARKERS[key]).first()).toBeVisible({ timeout: 4000 });
}

/** The dev bypass on /login signs in without contacting Google. */
async function signIn(page) {
  await page.goto(hash('/login'), { waitUntil: 'load' });
  await expectRendered(page, 'login');
  await page.locator('.entry__google').click();
  await expectRendered(page, 'lounge');
}

async function logout(page) {
  await page.locator('.pnav__account-btn').click();
  await page.locator('.pnav__logout').click();
  await expectRendered(page, 'login');
}

/** Console errors and unhandled rejections are failures, not noise. */
function watchForErrors(page) {
  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    const t = m.text();
    if (/Failed to load resource/i.test(t)) return; // CDN/hotlink noise
    errors.push(`console: ${t}`);
  });
  return errors;
}

test.describe('member launch navigation', () => {
  test('A: sign in, then walk every launch section without refreshing', async ({ page }) => {
    const errors = watchForErrors(page);
    await signIn(page);

    // The in-page sections are hash targets on the lounge route itself.
    for (const id of ['events', 'reading', 'community', 'recognition']) {
      await page.locator(`.pnav__link[href$="#${id}"]`).click();
      await expectRendered(page, 'lounge');
      await expect(page.locator(`#${id}`)).toBeVisible();
    }

    // Dashboard is a separate route: this is the transition that goes blank.
    await page.locator('.pnav__link[href$="/dashboard"]').click();
    await expectRendered(page, 'dashboard');

    // And back again.
    await page.locator('.pnav__link[href$="/lounge"]').first().click();
    await expectRendered(page, 'lounge');

    expect(errors, errors.join(' | ')).toEqual([]);
  });

  test('B: launch, dashboard, logout, public home', async ({ page }) => {
    const errors = watchForErrors(page);
    await signIn(page);
    await page.locator('.pnav__link[href$="/dashboard"]').click();
    await expectRendered(page, 'dashboard');
    await logout(page);

    await page.locator('.entry__back').click();
    await expectRendered(page, 'publicHome');
    expect(errors, errors.join(' | ')).toEqual([]);
  });

  test('C: public, login, launch, logout, public about', async ({ page }) => {
    const errors = watchForErrors(page);
    await page.goto(hash('/'), { waitUntil: 'load' });
    await expectRendered(page, 'publicHome');

    await signIn(page);
    await page.locator('.pnav__link[href$="#events"]').click();
    await expectRendered(page, 'lounge');
    await logout(page);

    await page.goto(hash('/about'));
    await expectRendered(page, 'publicAbout');
    expect(errors, errors.join(' | ')).toEqual([]);
  });

  test('D: browser back and forward inside the launch', async ({ page }) => {
    const errors = watchForErrors(page);
    await signIn(page);
    await page.locator('.pnav__link[href$="/dashboard"]').click();
    await expectRendered(page, 'dashboard');

    await page.goBack();
    await expectRendered(page, 'lounge');

    await page.goForward();
    await expectRendered(page, 'dashboard');
    expect(errors, errors.join(' | ')).toEqual([]);
  });

  test('E: open a launch route directly while already signed in', async ({ page }) => {
    const errors = watchForErrors(page);
    await signIn(page);
    await page.goto(hash('/dashboard'), { waitUntil: 'load' });
    await expectRendered(page, 'dashboard');
    expect(errors, errors.join(' | ')).toEqual([]);
  });

  test('F: refreshing a launch route keeps it rendered', async ({ page }) => {
    const errors = watchForErrors(page);
    await signIn(page);
    await page.reload({ waitUntil: 'load' });
    await expectRendered(page, 'lounge');
    expect(errors, errors.join(' | ')).toEqual([]);
  });

  test('G: after logout, a public page renders immediately', async ({ page }) => {
    const errors = watchForErrors(page);
    await signIn(page);
    await logout(page);
    await page.goto(hash('/about'));
    await expectRendered(page, 'publicAbout');

    // And the launch can be re-entered straight away.
    await signIn(page);
    await expectRendered(page, 'lounge');
    expect(errors, errors.join(' | ')).toEqual([]);
  });

  /**
   * The regression this suite exists for.
   *
   * A tab that is backgrounded, occluded or badly janked stops receiving
   * animation frames. Vue drives both halves of a <transition> from
   * requestAnimationFrame, so pairing one with `mode="out-in"` made mounting
   * the destination wait on an animation that could never finish: the URL
   * changed, nothing rendered, and only a reload recovered it. Starving rAF
   * reproduces that deterministically.
   */
  test('H: a launch route still renders when no animation frames are delivered', async ({
    page,
  }) => {
    const errors = watchForErrors(page);
    await signIn(page);

    await page.evaluate(() => {
      window.requestAnimationFrame = () => 0;
    });

    await page.locator('.pnav__link[href$="/dashboard"]').click();
    await expectRendered(page, 'dashboard');

    // And the reverse direction, which is where the leave animation ran.
    await page.locator('.pnav__link[href$="/lounge"]').first().click();
    await expectRendered(page, 'lounge');

    expect(errors, errors.join(' | ')).toEqual([]);
  });

  test('I: leaving the launch for a public page survives the same starvation', async ({ page }) => {
    const errors = watchForErrors(page);
    await signIn(page);
    await page.evaluate(() => {
      window.requestAnimationFrame = () => 0;
    });
    await logout(page);
    await page.locator('.entry__back').click();
    await expectRendered(page, 'publicHome');
    expect(errors, errors.join(' | ')).toEqual([]);
  });
});
