import { test, expect } from '@playwright/test';

/**
 * The eleven URLs, exactly as supplied. Kept here as a literal copy on purpose:
 * if someone edits a link in src/data/documents.js, this list is what notices.
 */
const SUPPLIED = {
  'student-ds-handbook': {
    title: 'Student DS Handbook',
    url: 'https://docs.google.com/document/u/1/d/e/2PACX-1vRxGnnDCVAO3KX2CGtMIcJQuDrAasVk2JHbDxkjsGrTP5ShhZK8N6ZSPX89lexKx86QPAUswSzGLsOA/pub',
    action: 'Open Original',
    viewer: 'embed',
  },
  'academic-non-academic-guidelines': {
    title: 'Academic and Non-Academic Guidelines',
    url: 'https://docs.google.com/document/u/1/d/1N5ZmPJZUDHznjt6G_ZiRS1baG_WpOfJM-oFnvWve76Y/pub',
    action: 'Open Original',
    viewer: 'embed',
  },
  'student-interaction-guidelines': {
    title: 'Student Interaction Guidelines',
    url: 'https://docs.google.com/document/u/1/d/1eSfJLWW-SChkbMkxMWnmWILx0bUY7PfRChwaAw0KJbE/pub',
    action: 'Open Original',
    viewer: 'embed',
  },
  'bs-region-reference': {
    title: 'BS Region Reference',
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQB0J-AZCo9UT2BR76Q8h_gPsqDZmz2XR7iAAXGSyc5s2EQ-pqve270nitkFrcFSaW5DH8d8j0uVHrf/pubhtml',
    action: 'Open Original',
    viewer: 'embed',
  },
  'grading-ds-handbook': {
    title: 'Grading DS Handbook',
    url: 'https://docs.google.com/document/d/e/2PACX-1vT5PBOz4OH663W0IJPVGVjG_nfmYZGfFI7W1j-6wTLcex13O_7BZmf6a96Q6liO0W-mLZB5hOGZeNNl/pub',
    action: 'Open Original',
    viewer: 'embed',
  },
  'term-calendar': {
    title: 'Term Calendar',
    url: 'https://drive.usercontent.google.com/download?id=1_vslwUdBNFCH6DSTLeVlqvX5Rtw57gSD&authuser=0',
    action: 'Download',
    viewer: 'fallback',
  },
  'iitm-bs-students-constitution': {
    title: "IITM BS Students' Constitution",
    url: 'https://docs.google.com/document/d/e/2PACX-1vRg7fBOFdQ6H0V-iqXSGa7lSZAaZeRZujPBKZe0UY2QzKB9yWQ7zR1PElBlzTZCp-Dt3kr7JAvNFpHM/pub',
    action: 'Open Original',
    viewer: 'embed',
  },
  'ta-placement-internship': {
    title: 'Teaching Assistantship & Placement Team Internship Details',
    url: 'https://drive.google.com/file/d/1yfznBrNROOd8uV_MYgmjEdyMagagRti3/view',
    action: 'Open Original',
    viewer: 'embed',
  },
  'course-mentorship': {
    title: 'Course Mentorship',
    url: 'https://drive.google.com/file/d/1G4WtcFV2IvBPjd_y86yoonVwlnI3c_qg/view',
    action: 'Open Original',
    viewer: 'embed',
  },
  'placement-activity-points': {
    title: 'Placement Activity Points',
    url: 'https://docs.google.com/document/d/e/2PACX-1vTNmtT16crBJwERX-RKiC9wBr25FhIe5qq9pSYv0Z08oq96UxPZL0IL_EKlLlmWlp8ZBGJeinLY5z8A/pub',
    action: 'Open Original',
    viewer: 'embed',
  },
  paradox: {
    title: 'Paradox',
    url: 'https://docs.google.com/document/d/1RzkXftE0x07uMX1QUxm9D0sGfa0uoIson2SCKlHxy1c',
    action: 'Open Original',
    viewer: 'fallback',
  },
};

const ENTRIES = Object.entries(SUPPLIED);

// ── THE INDEX ──────────────────────────────────────────────────────────────

test('the index lists every document, each one a direct link to it', async ({ page }) => {
  await page.goto('/#/documents');
  await page.waitForSelector('.dl-card');

  await expect(page.locator('.dl-card')).toHaveCount(11);

  const rows = await page.$$eval('.dl-card', (els) =>
    els.map((el) => ({
      title: el.querySelector('.dl-card-title').textContent.trim(),
      href: el.getAttribute('href'),
      ref: el.querySelector('.dl-card-ref').textContent.trim(),
      meta: el.querySelector('.dl-card-meta').textContent.replace(/\s+/g, ' ').trim(),
    }))
  );

  for (const [id, doc] of ENTRIES) {
    const row = rows.find((r) => r.title === doc.title);
    expect(row, `missing document: ${doc.title}`).toBeTruthy();
    expect(row.href, `${id} must link straight to its reader`).toBe(`#/documents/${id}`);
    expect(row.ref, `${id} keeps its archive number`).toMatch(/^\d{2}$/);
    expect(row.meta.length, `${id} shows its category and source`).toBeGreaterThan(0);
  }
});

const ORDER = [
  'Student DS Handbook',
  'Academic and Non-Academic Guidelines',
  'Student Interaction Guidelines',
  'Grading DS Handbook',
  'BS Region Reference',
  'Term Calendar',
  "IITM BS Students' Constitution",
  'Placement Activity Points',
  'Course Mentorship',
  'Teaching Assistantship & Placement Team Internship Details',
  'Paradox',
];

test('the archive reads in priority order, numbered by position', async ({ page }) => {
  await page.goto('/#/documents');
  await page.waitForSelector('.dl-card');

  const cards = await page.$$eval('.dl-card', (els) =>
    els.map((el) => ({
      title: el.querySelector('.dl-card-title').textContent.trim(),
      ref: el.querySelector('.dl-card-ref').textContent.trim(),
    }))
  );

  expect(cards.map((c) => c.title)).toEqual(ORDER);
  // Numbers follow the order rather than surviving from an older one.
  expect(cards.map((c) => c.ref)).toEqual(ORDER.map((_, i) => String(i + 1).padStart(2, '0')));
});

test('the reader archive list uses the same order as the index', async ({ page }) => {
  await page.goto('/#/documents/student-ds-handbook');
  await page.waitForSelector('.dr-rail-link');

  const titles = await page.$$eval('.dr-rail-link', (els) =>
    els.map((el) => el.textContent.replace(/^\s*\d\d\s*/, '').trim())
  );
  expect(titles).toEqual(ORDER);
});

test('the index is a three column grid that reflows down to one', async ({ page }) => {
  const columnsAt = async (width) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/#/documents');
    await page.waitForSelector('.dl-card');
    return page
      .locator('.dl-grid')
      .evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);
  };

  expect(await columnsAt(1440), 'desktop').toBe(3);
  expect(await columnsAt(1024), 'tablet').toBe(2);
  expect(await columnsAt(390), 'mobile').toBe(1);
});

test('cards in a row share a height and none of them clips', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/#/documents');
  await page.waitForSelector('.dl-card');

  const boxes = await page.$$eval('.dl-card', (els) =>
    els.map((el) => {
      const r = el.getBoundingClientRect();
      return {
        top: Math.round(r.top),
        height: Math.round(r.height),
        clipped: el.scrollHeight > el.clientHeight + 1,
      };
    })
  );

  expect(
    boxes.some((b) => b.clipped),
    'a card clips its own content'
  ).toBe(false);

  // Group by row and check every card in a row ends level.
  const rows = new Map();
  for (const b of boxes) {
    const key = [...rows.keys()].find((k) => Math.abs(k - b.top) < 4) ?? b.top;
    rows.set(key, [...(rows.get(key) ?? []), b.height]);
  }
  expect(rows.size, 'eleven cards over four rows').toBe(4);
  for (const [top, heights] of rows) {
    expect(Math.max(...heights) - Math.min(...heights)).toBeLessThanOrEqual(1);
  }
});

test('the index carries no filter rail, no picker and no detail panel', async ({ page }) => {
  await page.goto('/#/documents');
  await page.waitForSelector('.dl-card');

  // The three pieces the simplification removed. Their absence is the point.
  await expect(page.locator('.dl-index-btn')).toHaveCount(0);
  await expect(page.locator('#dl-category-select')).toHaveCount(0);
  await expect(page.locator('.dl-record, .dl-record-inner')).toHaveCount(0);

  // And exactly one search field, not a filter system.
  await expect(page.locator('#dl-search-input')).toHaveCount(1);
});

test('search filters the index and clearing restores it', async ({ page }) => {
  await page.goto('/#/documents');
  const search = page.locator('#dl-search-input');
  const rows = page.locator('.dl-card');

  await search.fill('grading');
  await expect(rows).toHaveCount(1);
  await expect(page.locator('.dl-card-title')).toHaveText('Grading DS Handbook');

  // Category and type are searchable even without a filter interface.
  await search.fill('CALENDARS');
  await expect(page.locator('.dl-card-title')).toHaveText('Term Calendar');
  await search.fill('google sheets');
  await expect(page.locator('.dl-card-title')).toHaveText('BS Region Reference');

  await search.fill('zzzznothing');
  await expect(rows).toHaveCount(0);
  await expect(page.locator('.dl-empty-title')).toHaveText('No documents found');

  await page.locator('.dl-search-clear').click();
  await expect(rows).toHaveCount(11);
});

test('the count is derived from what is on the index', async ({ page }) => {
  await page.goto('/#/documents');
  await expect(page.locator('.dl-count')).toHaveText(/^11 documents$/);
  await page.locator('#dl-search-input').fill('paradox');
  await expect(page.locator('.dl-count')).toHaveText(/^1 document$/);
});

test('the index loads no document frames at all', async ({ page }) => {
  await page.goto('/#/documents');
  await page.waitForSelector('.dl-card');
  await expect(page.locator('iframe')).toHaveCount(0);
});

// ── ONE CLICK TO THE DOCUMENT ──────────────────────────────────────────────

test('one click on an entry opens the reader, with no step in between', async ({ page }) => {
  await page.goto('/#/documents');

  await page.locator('.dl-card', { hasText: 'Student DS Handbook' }).click();

  await expect(page).toHaveURL(/#\/documents\/student-ds-handbook$/);
  await expect(page.locator('.dr-title')).toHaveText('Student DS Handbook');
  await expect(page.locator('.dv-frame')).toBeVisible();
});

test('the reader mounts the right strategy for every document', async ({ page }) => {
  for (const [id, doc] of ENTRIES) {
    await page.goto(`/#/documents/${id}`);
    await expect(page.locator('.dr-title')).toHaveText(doc.title);

    const frames = page.locator('.dv-iframe');
    if (doc.viewer === 'embed') {
      await expect(frames, `${id} should be embedded`).toHaveCount(1);
      const src = await frames.getAttribute('src');
      expect(src, `${id} embed URL`).toMatch(/embedded=true|widget=true|\/preview$/);
    } else {
      // Never a blank frame: a document that cannot be embedded says so.
      await expect(frames, `${id} must not mount an iframe`).toHaveCount(0);
      await expect(page.locator('.dv-state-title')).toBeVisible();
      await expect(page.locator('.dv-state a')).toHaveAttribute('href', doc.url);
    }

    // The header always offers the original, whatever the viewer did.
    const header = page.locator('.dr-actions a');
    await expect(header, `wrong URL for ${id}`).toHaveAttribute('href', doc.url);
    await expect(header).toHaveAttribute('target', '_blank');
    await expect(header).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(header).toContainText(doc.action);
  }
});

test('only one document viewer is ever mounted', async ({ page }) => {
  await page.goto('/#/documents/student-ds-handbook');
  await expect(page.locator('.dv-iframe')).toHaveCount(1);

  await page.locator('.dr-rail-link', { hasText: 'Grading DS Handbook' }).click();
  await expect(page.locator('.dr-title')).toHaveText('Grading DS Handbook');
  await expect(page.locator('.dv-iframe')).toHaveCount(1);
});

test('the reader swaps documents in place from its archive list', async ({ page }) => {
  await page.goto('/#/documents/student-ds-handbook');
  await expect(page.locator('.dr-title')).toHaveText('Student DS Handbook');

  await page.locator('.dr-rail-link', { hasText: 'Academic and Non-Academic Guidelines' }).click();
  await expect(page).toHaveURL(/#\/documents\/academic-non-academic-guidelines$/);
  await expect(page.locator('.dr-title')).toHaveText('Academic and Non-Academic Guidelines');

  // Still the reader: it never bounced through the index to get here.
  await expect(page.locator('.dl-card')).toHaveCount(0);
  await expect(page.locator('.dv-frame')).toBeVisible();
});

// ── HISTORY ────────────────────────────────────────────────────────────────

test('the back button walks the reading history and returns to the index', async ({ page }) => {
  await page.goto('/#/documents');

  await page.locator('.dl-card', { hasText: 'Student DS Handbook' }).click();
  await expect(page.locator('.dr-title')).toHaveText('Student DS Handbook');

  await page.locator('.dr-rail-link', { hasText: 'Academic and Non-Academic Guidelines' }).click();
  await expect(page.locator('.dr-title')).toHaveText('Academic and Non-Academic Guidelines');

  // Back through the document just read, then back to the index.
  await page.goBack();
  await expect(page.locator('.dr-title')).toHaveText('Student DS Handbook');
  await page.goBack();
  await expect(page.locator('.dl-card')).toHaveCount(11);

  await page.goForward();
  await expect(page.locator('.dr-title')).toHaveText('Student DS Handbook');
});

test('Back to Documents returns to the index with the search intact', async ({ page }) => {
  await page.goto('/#/documents');
  await page.locator('#dl-search-input').fill('grading');
  await expect(page.locator('.dl-card')).toHaveCount(1);

  await page.locator('.dl-card').click();
  await expect(page.locator('.dr-title')).toHaveText('Grading DS Handbook');

  await page.locator('.dr-back').click();
  await expect(page.locator('#dl-search-input')).toHaveValue('grading');
  await expect(page.locator('.dl-card')).toHaveCount(1);
});

test('an id that names no document falls back to the index', async ({ page }) => {
  await page.goto('/#/documents/not-a-real-document');
  await expect(page.locator('.dl-card')).toHaveCount(11);
  await expect(page).toHaveURL(/#\/documents$/);
});

// ── NAVIGATION, LAYOUT AND KEYBOARD ────────────────────────────────────────

test('navigating in and out of Documents never blanks the page', async ({ page }) => {
  const errors = [];
  page.on('console', (m) => {
    if (m.type() === 'error' && !m.text().includes('WebSocket')) errors.push(m.text());
  });

  const hasContent = async (selector) => {
    await expect(page.locator(selector).first()).toBeVisible();
    const height = await page.evaluate(() => document.body.scrollHeight);
    expect(height).toBeGreaterThan(500);
  };

  await page.goto('/#/');
  await hasContent('.hero-section');

  await page.getByRole('link', { name: 'Documents', exact: true }).first().click();
  await hasContent('.dl-card');

  await page.locator('.dl-card', { hasText: 'Paradox' }).click();
  await hasContent('.dr-title');

  await page.goto('/#/');
  await hasContent('.hero-section');
  await page.goto('/#/events');
  await hasContent('.page-hero');
  await page.goto('/#/documents');
  await hasContent('.dl-card');
  await page.goto('/#/study');
  await hasContent('.page-hero');
  await page.goto('/#/about');
  await hasContent('.page-hero');
  await page.goto('/#/teams');
  await hasContent('.page-hero');
  await page.goto('/#/contact');
  await hasContent('.page-hero');

  expect(errors).toEqual([]);
});

test('nothing on either page is clipped or overflows', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/#/documents');
  await page.waitForSelector('.dl-card');

  // The longest title in the archive is the one most likely to burst its row.
  const row = page.locator('.dl-card', {
    hasText: 'Teaching Assistantship & Placement Team Internship Details',
  });
  const box = await row.boundingBox();
  const inner = await row.evaluate((el) => ({
    scrollHeight: el.scrollHeight,
    clientHeight: el.clientHeight,
    scrollWidth: el.scrollWidth,
    clientWidth: el.clientWidth,
  }));
  expect(inner.scrollHeight).toBeLessThanOrEqual(inner.clientHeight + 1);
  expect(inner.scrollWidth).toBeLessThanOrEqual(inner.clientWidth + 1);
  expect(box.height).toBeGreaterThan(60);

  let overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow, 'index overflow').toBeLessThanOrEqual(0);

  await page.goto('/#/documents/student-ds-handbook');
  await page.waitForSelector('.dv-frame');
  overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow, 'reader overflow').toBeLessThanOrEqual(0);
});

test('the narrow layout stays readable and gives the document real height', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/#/documents');
  await page.waitForSelector('.dl-card');
  await expect(page.locator('.dl-card')).toHaveCount(11);

  let overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow).toBeLessThanOrEqual(0);

  await page.locator('.dl-card').first().click();
  await expect(page.locator('.dr-title')).toBeVisible();

  // The archive list is a disclosure, so it can be folded away on a phone
  // rather than occupying the screen the document needs.
  const rail = page.locator('.dr-rail');
  await expect(rail).toHaveAttribute('open', '');
  await rail.locator('summary').click();
  await expect(rail).not.toHaveAttribute('open', '');

  const frame = await page.locator('.dv-frame').boundingBox();
  expect(frame.height).toBeGreaterThan(380);

  overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow).toBeLessThanOrEqual(0);
});

test('keyboard alone can search and open a document', async ({ page }) => {
  await page.goto('/#/documents');

  await page.locator('#dl-search-input').focus();
  await page.keyboard.type('interaction');
  await expect(page.locator('.dl-card')).toHaveCount(1);

  // The entry is the next tab stop, and Enter opens it.
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(page.locator('.dr-title')).toHaveText('Student Interaction Guidelines');
});
