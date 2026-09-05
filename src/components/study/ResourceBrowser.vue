<template>
  <!-- Tone A. The whole point of this section is that it is the first thing
       under the hero: search, level, subject, type, results — in that order,
       top to bottom, with nothing to scroll past. -->
  <section class="section tone-a rs" id="resource-browser">
    <div class="container">
      <!-- ── 1. SEARCH ─────────────────────────────────────────────── -->
      <div class="rb-search">
        <label class="rb-search-label" for="rb-search-input">Search resources</label>
        <div class="rb-search-field">
          <Search class="rb-search-icon" :size="17" :stroke-width="1.9" aria-hidden="true" />
          <input
            id="rb-search-input"
            v-model="search"
            type="search"
            class="form-input rb-search-input"
            placeholder="Search subjects, notes, PYQs…"
            autocomplete="off"
          />
          <button
            v-if="search"
            type="button"
            class="rb-search-clear"
            aria-label="Clear search"
            @click="search = ''"
          >
            <X :size="15" :stroke-width="2" />
          </button>
        </div>
        <p class="rb-search-hint">
          Searches every subject, note and past paper across all three levels.
        </p>
      </div>

      <!-- ── 2. LEVEL ──────────────────────────────────────────────── -->
      <div class="rb-block">
        <h2 class="rb-block-title" id="rb-level-label">Choose a level</h2>
        <div class="rb-chips" role="group" aria-labelledby="rb-level-label">
          <button
            v-for="level in levelMeta"
            :key="level.key"
            type="button"
            class="sel rb-level"
            :aria-pressed="currentLevel === level.key"
            @click="toggleLevel(level.key)"
          >
            <component :is="level.icon" :size="16" :stroke-width="1.8" aria-hidden="true" />
            {{ level.title }}
            <span class="rb-chip-count">{{ (scData[level.key] || []).length }}</span>
          </button>
        </div>
      </div>

      <!-- ── 3. SUBJECT ────────────────────────────────────────────── -->
      <div class="rb-block">
        <div class="rb-block-head">
          <h2 class="rb-block-title" id="rb-subject-label">
            {{ currentLevel ? `${currentLevelLabel} subjects` : 'Subjects' }}
          </h2>
          <p class="rb-block-meta" role="status" aria-live="polite">{{ subjectSummary }}</p>
        </div>

        <div
          v-if="visibleSubjects.length"
          class="rb-subject-grid"
          role="group"
          aria-labelledby="rb-subject-label"
        >
          <button
            v-for="subject in visibleSubjects"
            :key="subject.levelKey + subject.code"
            type="button"
            class="rb-subject"
            :aria-pressed="isCurrentSubject(subject)"
            @click="selectSubject(subject)"
          >
            <span class="rb-subject-code">{{ subject.code }}</span>
            <span class="rb-subject-name">{{ subject.subject }}</span>
            <span v-if="!currentLevel" class="rb-subject-level">{{
              levelLabel(subject.levelKey)
            }}</span>
          </button>
        </div>

        <p v-else-if="query" class="rb-note">
          No subject matches “{{ query }}”.
          <button type="button" class="btn btn--text" @click="clearAll">Clear search</button>
        </p>

        <p v-else class="rb-note rb-note--rest">
          Pick Foundation, Diploma or BS Degree above, or type in the search box to look across all
          three at once.
        </p>
      </div>

      <!-- ── 4. TYPE + 5. RESULTS ──────────────────────────────────── -->
      <div class="rb-block">
        <template v-if="currentSubject">
          <!-- "What am I looking at?" — level, subject and total, with the type
               nav under it. Sticky, so the answer stays on screen however far
               down the archive the reader gets. -->
          <div class="rb-context">
            <div class="rb-context-head">
              <div class="rb-context-copy">
                <p class="rb-crumb">
                  <span class="rb-crumb-level">{{ levelLabel(currentSubject.levelKey) }}</span>
                  <span class="rb-crumb-sep" aria-hidden="true">›</span>
                  <span class="rb-crumb-code">{{ currentSubject.code }}</span>
                </p>
                <h2 class="rb-block-title">{{ currentSubject.subject }}</h2>
                <p class="rb-context-count">
                  <strong>{{ typeCounts.all }}</strong>
                  {{ typeCounts.all === 1 ? 'resource' : 'resources' }}
                  <template v-if="resourceType !== 'all'">
                    · {{ typeCounts[resourceType] }} {{ activeTypeLabel.toLowerCase() }}
                  </template>
                </p>
              </div>
              <button type="button" class="btn btn--text" @click="clearSubject">
                Clear selection
              </button>
            </div>

            <div class="rb-chips rb-types" role="group" aria-label="Resource type">
              <button
                v-for="type in typeMeta"
                :key="type.key"
                type="button"
                class="sel"
                :aria-pressed="resourceType === type.key"
                @click="setResourceType(type.key)"
              >
                <component :is="type.icon" :size="15" :stroke-width="1.9" aria-hidden="true" />
                {{ type.label }}
                <span class="rb-chip-count">{{ typeCounts[type.key] }}</span>
              </button>
            </div>
          </div>

          <p class="rb-subject-desc">{{ currentSubject.description }}</p>

          <div class="rb-results">
            <template v-if="resultGroups.length">
              <section
                v-for="group in resultGroups"
                :key="group.label"
                class="rb-group"
                :class="{ 'rb-group--featured': group.featured }"
              >
                <h3 v-if="group.label" class="rb-group-label">
                  <component
                    :is="group.icon"
                    v-if="group.icon"
                    :size="14"
                    :stroke-width="1.9"
                    aria-hidden="true"
                  />
                  {{ group.label }}
                  <span class="rb-group-count">{{ group.items.length }}</span>
                </h3>
                <ul class="rb-list">
                  <li
                    v-for="(item, i) in shownItems(group)"
                    :key="item.key"
                    :class="{ 'rb-row--new': i >= PREVIEW_COUNT }"
                  >
                    <a class="rb-item" :href="item.link" target="_blank" rel="noopener noreferrer">
                      <span class="rb-item-main">
                        <span class="rb-item-title">{{ item.title }}</span>
                        <span class="rb-item-meta">
                          <span class="rb-item-type">{{ item.typeLabel }}</span>
                          <span v-if="item.badge" class="rb-item-badge">{{ item.badge }}</span>
                        </span>
                      </span>
                      <span class="rb-item-cta">
                        {{ item.cta }}
                        <ArrowRight :size="14" :stroke-width="2" aria-hidden="true" />
                      </span>
                    </a>
                  </li>
                </ul>
                <div v-if="group.items.length > PREVIEW_COUNT" class="rb-more-row">
                  <button
                    v-if="remaining(group) > 0"
                    type="button"
                    class="btn btn--text rb-more"
                    @click="showMore(group)"
                  >
                    Show {{ Math.min(remaining(group), STEP_COUNT) }} more
                    <ChevronDown
                      class="rb-more-chevron"
                      :size="14"
                      :stroke-width="2"
                      aria-hidden="true"
                    />
                  </button>
                  <button
                    v-if="shownCount(group) > PREVIEW_COUNT"
                    type="button"
                    class="btn btn--text rb-more"
                    @click="collapseGroup(group)"
                  >
                    Show fewer
                    <ChevronDown
                      class="rb-more-chevron rb-more-chevron--up"
                      :size="14"
                      :stroke-width="2"
                      aria-hidden="true"
                    />
                  </button>
                  <span class="rb-more-count">
                    {{ shownCount(group) }} of {{ group.items.length }}
                  </span>
                </div>
              </section>
            </template>

            <p v-else class="rb-empty">
              <FileSearch :size="26" :stroke-width="1.6" aria-hidden="true" />
              <span>
                No {{ resourceType === 'all' ? 'resources' : activeTypeLabel.toLowerCase() }} here
                yet<template v-if="search"> for “{{ search }}”</template>.
              </span>
              <button
                v-if="resourceType !== 'all'"
                type="button"
                class="btn btn--outline btn--sm"
                @click="setResourceType('all')"
              >
                Show everything for this subject
              </button>
            </p>
          </div>
        </template>

        <!-- Concise empty state — a sentence and a way forward, not a
             580px-tall bordered box with an icon in the middle of it. -->
        <p v-else class="rb-empty rb-empty--start">
          <BookOpen :size="26" :stroke-width="1.6" aria-hidden="true" />
          <span>Pick a level above — or search — to browse notes, lectures and past papers.</span>
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import {
  Sprout,
  Ruler,
  GraduationCap,
  BookOpen,
  PlayCircle,
  NotebookPen,
  FileText,
  FolderOpen,
  Calendar,
  Layers,
  User,
  Search,
  FileSearch,
  ArrowRight,
  ChevronDown,
  X,
} from 'lucide-vue-next';

import scData from '../../data/scData_generated.js';

// Shared with the doubts board, so the view owns it.
const search = defineModel('search', { type: String, default: '' });

/** Trimmed, lower-cased query — every filter below reads this, not `search`. */
const query = computed(() => search.value.trim().toLowerCase());

const levelMeta = [
  { key: 'foundation', icon: Sprout, title: 'Foundation' },
  { key: 'diploma', icon: Ruler, title: 'Diploma' },
  { key: 'bs', icon: GraduationCap, title: 'BS Degree' },
];

// The three types the data actually carries. There is deliberately no
// "Assignments" or "Practice" filter: no subject in scData has either, and an
// always-empty filter is worse than no filter.
const typeMeta = [
  { key: 'all', icon: Layers, label: 'All', cta: 'Open' },
  { key: 'lectures', icon: PlayCircle, label: 'Lectures', cta: 'Watch' },
  { key: 'notes', icon: NotebookPen, label: 'Notes', cta: 'View notes' },
  { key: 'pyq', icon: FileText, label: 'PYQs', cta: 'Open paper' },
];

const RESOURCE_TYPES = ['lectures', 'notes', 'pyq'];

/**
 * A group shows this many rows before it offers to open.
 *
 * Without a cap, "All" on Maths 1 is 121 rows — roughly eight screens that the
 * reader has to scroll past before the doubts board even starts. Six is enough
 * to show what a group holds and judge whether it is the right one.
 */
const PREVIEW_COUNT = 6;

/**
 * How many more rows one press of "Show more" reveals.
 *
 * The old control was all-or-nothing: "Show all 85" turned a six-row preview
 * into eighty-five rows in one frame, which is the wall this is meant to
 * avoid. Revealing a dozen at a time keeps the reader in control and means no
 * press ever changes the page height by more than a screen.
 */
const STEP_COUNT = 12;

/** Rows currently revealed per group label; absent means the PREVIEW_COUNT. */
const groupShown = ref({});

const currentLevel = ref(null);
const currentSubjectCode = ref(null);
const resourceType = ref('all');

// Curated Drive folders that sit alongside the per-item links. Unchanged.
const driveLinks = {
  foundationPyq: 'https://drive.google.com/drive/folders/1Fq3vpXmmN3moEFa9TdBqkBfkMfjaPyh-',
  diplomaPyq: 'https://drive.google.com/drive/folders/1FnI9uXbnSGqMBRLWyWPD5839R9xXjS5I',
  notes: {
    BSMA1001: 'https://drive.google.com/drive/folders/1SuT80Mt_1mhgeDb8_PF5nE2f626wI-5C',
    BSMA1002: 'https://drive.google.com/drive/folders/1TVvNKumzi1tD5rRPR4B_SHfR6KyHXgkv',
    BSHS1001: 'https://drive.google.com/drive/folders/1TJ_i7aNmcKBk_DAA7EmzCKTJ5fEBYWOD',
    BSCS1001: 'https://drive.google.com/drive/folders/15BrCrZ0cBxcOOhDFwavZX9WJnwXu149O',
    BSMA1003: 'https://drive.google.com/drive/folders/1T0Vk5wWuGlhKhCv1qGYnS7T5_mmceeFy',
    BSMA1004: 'https://drive.google.com/drive/folders/1TNS9WHBWUKInU2Jey23DRwzNySeRjB3O',
    BSHS1002: 'https://drive.google.com/drive/folders/1z68X9eGokOfrzlaCKV3v16bSpgInneKd',
    BSCS1002: 'https://drive.google.com/drive/folders/1O7w1hXO6d0uptWs1U4BCMGVEdfSDxNWo',
    BSCS2001: 'https://drive.google.com/drive/folders/1PtqrInqJV0ZcZbis2hFndmOM08lMmoS_',
    BSCS2005: 'https://drive.google.com/drive/folders/1Q-FPcyrurSml35qHizU6An3_c7f8_xie',
    BSCS2003: 'https://drive.google.com/drive/folders/1MbGGvTyRM0-27le2He5TKdhw8HSPfC0j',
    BSCS2006: 'https://drive.google.com/drive/folders/1Pl7g4i6e9HRR5ZQLYaJlbj6BQ-16ZtDK',
    BSCS2002: 'https://drive.google.com/drive/folders/1Pn7Zaa8tfXbXIBbiX9WYg_WcfIVMHCdG',
    BSSE2001: 'https://drive.google.com/drive/folders/1PsMUC0fAMCNVB5HVgZ_TZQC3CWhT5K3g',
    BSMS2002: 'https://drive.google.com/drive/folders/1UTximp3FWwJV6_5nBmJlISPIbzvMu8s0',
    BSMS2001: 'https://drive.google.com/drive/folders/1UIjX4MUeJBQnSJqRnO5XI8SFm50XDPml',
    BSCS2004: 'https://drive.google.com/drive/folders/1ODZY3E2PcsaFrzIHPo5lUhQZaBszZxxS',
    BSCS2008: 'https://drive.google.com/drive/folders/1UIVGGZYEldx98djyOI6aR18ec-07Qies',
    BSCS2007: 'https://drive.google.com/drive/folders/1UFpj7Lauj4l_YvA8U6tR0dqubv4K0gwy',
    BSSE2002: 'https://drive.google.com/drive/folders/1UK3pOkccniwBm1-YfpQgjrEfXFMrOtVy',
  },
};

const LEVEL_LABELS = { foundation: 'Foundation', diploma: 'Diploma', bs: 'BS Degree' };
const levelLabel = (key) => LEVEL_LABELS[key] || '';
const currentLevelLabel = computed(() => levelLabel(currentLevel.value));

// ── Title parsing (unchanged) ───────────────────────────────────────────
function parseAuthor(title) {
  const match = String(title).match(/\(by\s+(.+?)\)\s*$/i);
  return match ? match[1].trim() : 'Unknown';
}

function cleanTitle(title) {
  let cleaned = String(title || '')
    .replace(/\s*\(by\s+.+?\)\s*$/i, '')
    .trim();
  cleaned = cleaned.replace(/^[\s\-–:]+/, '');
  return cleaned || String(title || 'Untitled');
}

function parsePYQYear(title) {
  const monthYear = String(title).match(
    /(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})/i
  );
  if (monthYear) return monthYear[2];
  const yearOnly = String(title).match(/\b(20\d{2})\b/);
  return yearOnly ? yearOnly[1] : 'Other';
}

// ── Subjects ────────────────────────────────────────────────────────────
function subjectMatchesSearch(subject, q) {
  if (subject.subject.toLowerCase().includes(q)) return true;
  if (
    String(subject.code || '')
      .toLowerCase()
      .includes(q)
  )
    return true;
  const resources = subject.resources || {};
  return RESOURCE_TYPES.some((type) =>
    (resources[type] || []).some((item) =>
      String(item.title || '')
        .toLowerCase()
        .includes(q)
    )
  );
}

const allSubjects = computed(() =>
  Object.keys(LEVEL_LABELS).flatMap((lvl) =>
    (scData[lvl] || []).map((sub) => ({ ...sub, levelKey: lvl }))
  )
);

// A query with no level chosen searches the whole catalogue; once a level is
// chosen it scopes to that level. Either way the subject grid is the answer.
const visibleSubjects = computed(() => {
  const q = query.value;
  const base = currentLevel.value
    ? allSubjects.value.filter((s) => s.levelKey === currentLevel.value)
    : q
      ? allSubjects.value
      : [];
  if (!q) return base;
  return base.filter((subject) => subjectMatchesSearch(subject, q));
});

const subjectSummary = computed(() => {
  const n = visibleSubjects.value.length;
  if (!currentLevel.value && !query.value) return 'Choose a level, or search';
  return `${n} ${n === 1 ? 'subject' : 'subjects'}`;
});

const currentSubject = computed(
  () => allSubjects.value.find((s) => s.code === currentSubjectCode.value) || null
);

const isCurrentSubject = (subject) => subject.code === currentSubjectCode.value;

// ── Resources ───────────────────────────────────────────────────────────
function matchingItems(type) {
  const source = currentSubject.value?.resources?.[type] || [];
  const q = query.value;
  if (!q) return source;
  return source.filter((item) =>
    String(item.title || '')
      .toLowerCase()
      .includes(q)
  );
}

const typeCounts = computed(() => {
  const counts = { all: 0 };
  RESOURCE_TYPES.forEach((type) => {
    counts[type] = matchingItems(type).length;
    counts.all += counts[type];
  });
  return counts;
});

const activeTypeLabel = computed(
  () => typeMeta.find((t) => t.key === resourceType.value)?.label || 'Resources'
);

function decorate(item, type, index) {
  const meta = typeMeta.find((t) => t.key === type);
  return {
    key: `${type}-${index}-${item.link}`,
    title: cleanTitle(item.title),
    link: item.link,
    badge: item.badge,
    typeLabel: meta.label,
    cta: meta.cta,
  };
}

/**
 * One flat, grouped list — no accordions and no cards inside cards.
 *
 * Notes stay grouped by contributor and PYQs by year, because that grouping is
 * information rather than decoration, but a group is now a labelled run of
 * rows rather than a collapsible panel the reader has to open before they can
 * see whether it holds anything. The curated Drive folders lead, flagged, as
 * they did before.
 */
const resultGroups = computed(() => {
  if (!currentSubject.value) return [];
  const type = resourceType.value;
  const groups = [];

  if (type === 'all') {
    RESOURCE_TYPES.forEach((t) => {
      const items = matchingItems(t);
      if (!items.length) return;
      const meta = typeMeta.find((m) => m.key === t);
      groups.push({
        label: meta.label,
        icon: meta.icon,
        items: items.map((item, i) => decorate(item, t, i)),
      });
    });
    return withDriveFolders(groups);
  }

  const items = matchingItems(type);

  if (type === 'notes') {
    const byAuthor = new Map();
    items.forEach((item, i) => {
      const author = parseAuthor(item.title);
      if (!byAuthor.has(author)) byAuthor.set(author, []);
      byAuthor.get(author).push(decorate(item, type, i));
    });
    Array.from(byAuthor.entries())
      .sort(([a], [b]) => (a === 'Unknown' ? 1 : b === 'Unknown' ? -1 : a.localeCompare(b)))
      .forEach(([author, list]) => groups.push({ label: author, icon: User, items: list }));
    return withDriveFolders(groups);
  }

  if (type === 'pyq') {
    const byYear = new Map();
    items.forEach((item, i) => {
      const year = parsePYQYear(item.title);
      if (!byYear.has(year)) byYear.set(year, []);
      byYear.get(year).push(decorate(item, type, i));
    });
    Array.from(byYear.entries())
      .sort(([a], [b]) => (a === 'Other' ? 1 : b === 'Other' ? -1 : Number(b) - Number(a)))
      .forEach(([year, list]) => groups.push({ label: year, icon: Calendar, items: list }));
    return withDriveFolders(groups);
  }

  if (items.length) {
    groups.push({ label: '', items: items.map((item, i) => decorate(item, type, i)) });
  }
  return groups;
});

/** Prepends the curated Drive folder for the current subject, where one exists. */
function withDriveFolders(groups) {
  const subject = currentSubject.value;
  if (!subject) return groups;
  const type = resourceType.value;
  const items = [];

  if (type === 'all' || type === 'notes') {
    let link = driveLinks.notes[subject.code];
    if (!link && subject.subject?.toLowerCase().includes('analytics')) {
      link = driveLinks.notes.BSMS2002;
    }
    if (link) {
      items.push({
        key: `drive-notes-${subject.code}`,
        title: `Subject-wise notes — ${subject.subject}`,
        link,
        typeLabel: 'Drive folder',
        cta: 'Open folder',
      });
    }
  }

  if (type === 'all' || type === 'pyq') {
    const code = String(subject.code);
    const isFoundation =
      subject.levelKey === 'foundation' || (code.startsWith('BS') && code.includes('10'));
    const isDiploma =
      subject.levelKey === 'diploma' || (code.startsWith('BS') && code.includes('20'));
    if (isFoundation) {
      items.push({
        key: `drive-pyq-${code}`,
        title: 'Foundation end-term PYQs',
        link: driveLinks.foundationPyq,
        typeLabel: 'Drive folder',
        cta: 'Open folder',
      });
    } else if (isDiploma) {
      items.push({
        key: `drive-pyq-${code}`,
        title: 'Diploma end-term PYQs',
        link: driveLinks.diplomaPyq,
        typeLabel: 'Drive folder',
        cta: 'Open folder',
      });
    }
  }

  if (!items.length) return groups;
  return [{ label: 'Curated folders', icon: FolderOpen, featured: true, items }, ...groups];
}

// ── Actions ─────────────────────────────────────────────────────────────
function shownCount(group) {
  return Math.min(groupShown.value[group.label] ?? PREVIEW_COUNT, group.items.length);
}

function shownItems(group) {
  return group.items.slice(0, shownCount(group));
}

function remaining(group) {
  return group.items.length - shownCount(group);
}

function showMore(group) {
  groupShown.value = {
    ...groupShown.value,
    [group.label]: shownCount(group) + STEP_COUNT,
  };
}

function collapseGroup(group) {
  groupShown.value = { ...groupShown.value, [group.label]: PREVIEW_COUNT };
}

function selectFirstSubjectOf(level) {
  const first = (scData[level] || [])[0];
  currentSubjectCode.value = first ? first.code : null;
}

// Clicking the chosen level again clears it — the chip is the control and its
// own undo, so there is no separate "Clear" button next to a set of three.
function toggleLevel(level) {
  if (currentLevel.value === level) {
    currentLevel.value = null;
    currentSubjectCode.value = null;
  } else {
    currentLevel.value = level;
    resourceType.value = 'all';
    groupShown.value = {};
    selectFirstSubjectOf(level);
  }
}

function selectSubject(subject) {
  if (subject.levelKey !== currentLevel.value) currentLevel.value = subject.levelKey;
  currentSubjectCode.value = subject.code;
  resourceType.value = 'all';
  groupShown.value = {};
}

function setResourceType(type) {
  resourceType.value = type;
  groupShown.value = {};
}

function clearSubject() {
  currentSubjectCode.value = null;
}

function clearAll() {
  search.value = '';
  currentLevel.value = null;
  currentSubjectCode.value = null;
  resourceType.value = 'all';
}

// Keep the selection valid as the query narrows the grid under it, rather than
// leaving a results panel describing a subject that is no longer listed.
watch(visibleSubjects, (subjects) => {
  if (!currentSubjectCode.value || !subjects.length) return;
  if (!subjects.some((s) => s.code === currentSubjectCode.value)) {
    currentSubjectCode.value = subjects[0].code;
    currentLevel.value = currentLevel.value || subjects[0].levelKey;
  }
});
</script>

<style scoped>
/* ── 1. Search — the single most prominent control on the page ────── */
/* The section's own top padding is trimmed here rather than in the global
   .section rule: this is the one section on the site that must start as close
   to the hero as it can, because it is what the visitor came for. */
.section.tone-a {
  padding-top: 3.5rem;
}

.rb-search {
  max-width: 640px;
  margin: 0 auto 3rem;
}

.rb-search-label {
  display: block;
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 0.7rem;
  text-align: center;
}

.rb-search-field {
  position: relative;
}

.rb-search-input {
  height: 3.4rem;
  padding-left: 2.9rem;
  padding-right: 2.6rem;
  font-size: 1rem;
}

.rb-search-input::-webkit-search-cancel-button {
  display: none;
}

.rb-search-icon {
  position: absolute;
  left: 1.05rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--accent);
  pointer-events: none;
}

.rb-search-clear {
  position: absolute;
  right: 0.7rem;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  padding: 0.35rem;
  border: 0;
  border-radius: 50%;
  background: none;
  color: var(--text2);
  cursor: pointer;
  transition: color var(--duration-micro) var(--ease-editorial);
}

.rb-search-clear:hover {
  color: var(--text);
}

.rb-search-hint {
  margin-top: 0.7rem;
  text-align: center;
  font-size: 0.76rem;
  color: var(--text3);
}

/* ── Blocks ───────────────────────────────────────────────────────── */
.rb-block + .rb-block {
  margin-top: 2.75rem;
  padding-top: 2.75rem;
  border-top: 1px solid var(--border-subtle);
}

.rb-block-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.1rem;
}

.rb-block-title {
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  margin-bottom: 1rem;
}

.rb-block-head .rb-block-title {
  margin-bottom: 0;
}

.rb-block-meta {
  font-size: 0.78rem;
  color: var(--text2);
  letter-spacing: 0.04em;
}

.rb-subject-desc {
  margin: 0.9rem 0 1.5rem;
  font-size: 0.85rem;
  color: var(--text2);
  max-width: 46rem;
}

/* ── 4. Context bar ───────────────────────────────────────────────────
   Level › code, the subject, the total, and the type nav — the answer to
   "what am I looking at?" in one block. It sticks to the top of the
   viewport so that answer survives a scroll through eighty-five papers.
   The page is still the only scroll context; nothing here scrolls itself. */
.rb-context {
  position: sticky;
  top: 0;
  z-index: 3;
  padding: 1.1rem 0 0.9rem;
  margin-bottom: 0.25rem;
  /* Opaque, because rows scroll underneath it — Tone A, the section's own
     ground, so the bar is invisible until something passes behind it. */
  background: var(--color-bg-black);
  border-bottom: 1px solid var(--border-subtle);
}

.rb-context-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 0.9rem;
}

.rb-crumb {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin-bottom: 0.3rem;
  font-size: 0.66rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-gold-muted);
}

.rb-crumb-sep {
  color: var(--text3);
}

.rb-crumb-code {
  color: var(--text3);
}

.rb-context-count {
  margin-top: 0.3rem;
  font-size: 0.82rem;
  color: var(--text2);
}

.rb-context-count strong {
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text);
  font-variant-numeric: tabular-nums;
}

/* The type nav is the one row of selectors on screen while results are open,
   so it carries the strong active state without competing with the level and
   subject controls further up the page. */
.rb-types {
  margin-bottom: 0;
}

.rb-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.rb-chip-count {
  font-size: 0.7rem;
  color: var(--text3);
  font-variant-numeric: tabular-nums;
}

.sel[aria-pressed='true'] .rb-chip-count {
  color: var(--accent);
}

.rb-note {
  font-size: 0.88rem;
  color: var(--text2);
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.rb-note--rest {
  color: var(--text3);
  max-width: 44rem;
  line-height: 1.7;
}

/* ── 3. Subject grid ──────────────────────────────────────────────── */
.rb-subject-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 0.75rem;
}

/* Not a card: a dense, scannable row. Border and a 1px lift on hover, gold
   rule and gold code on selection — the same selector language as .sel, laid
   out as a grid because there are up to nineteen of them. */
.rb-subject {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  text-align: left;
  padding: 0.85rem 1rem 0.85rem 1.1rem;
  background: var(--color-card);
  border: 1px solid var(--border-card);
  border-radius: var(--rad);
  color: var(--text2);
  font-family: var(--font-body);
  cursor: pointer;
  transition:
    background-color var(--duration-selector) var(--ease-editorial),
    border-color var(--duration-selector) var(--ease-editorial),
    color var(--duration-selector) var(--ease-editorial),
    transform var(--duration-selector) var(--ease-editorial);
}

.rb-subject::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.85rem;
  bottom: 0.85rem;
  width: 2px;
  border-radius: 0 2px 2px 0;
  background: transparent;
  transition: background-color var(--duration-selector) var(--ease-editorial);
}

.rb-subject:hover {
  border-color: var(--border-card-hover);
  color: var(--text);
  transform: translateY(-1px);
}

.rb-subject:active {
  transform: translateY(0) scale(0.99);
}

.rb-subject:focus-visible {
  outline: 2px solid var(--color-gold);
  outline-offset: 3px;
}

.rb-subject[aria-pressed='true'] {
  border-color: var(--color-gold);
  background: rgba(213, 166, 58, 0.08);
  color: var(--text);
}

/* The non-colour half of the selected state. */
.rb-subject[aria-pressed='true']::before {
  background: var(--color-gold);
}

.rb-subject-code {
  font-size: 0.66rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text3);
}

.rb-subject[aria-pressed='true'] .rb-subject-code {
  color: var(--accent);
}

.rb-subject-name {
  font-size: 0.88rem;
  font-weight: 500;
  line-height: 1.4;
}

.rb-subject-level {
  margin-top: 0.15rem;
  font-size: 0.66rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text3);
}

/* ── 5. Results ───────────────────────────────────────────────────── */
.rb-results {
  min-height: 320px;
}

.rb-group + .rb-group {
  margin-top: 1.75rem;
}

.rb-group-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text3);
  padding-bottom: 0.6rem;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-subtle);
}

.rb-group--featured .rb-group-label {
  color: var(--accent);
}

.rb-group-count {
  font-variant-numeric: tabular-nums;
  opacity: 0.7;
}

.rb-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* "Show 12 more", "Show fewer", and a running count — the reader can always
   see how much of the group is on screen before deciding to open more. */
.rb-more-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.25rem 1.25rem;
  margin-top: 0.6rem;
}

.rb-more-count {
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  color: var(--text3);
  font-variant-numeric: tabular-nums;
}

/* Rows past the initial preview arrive rather than appear. Opacity and a
   short rise only — no height animation, which would need the list measured
   on every press and would stutter on a group of eighty-five. */
.rb-row--new {
  animation: rb-row-in 420ms var(--ease-reveal) backwards;
}

@keyframes rb-row-in {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .rb-row--new {
    animation: none;
  }
}

/* This control's trailing glyph means "expand", not "go", so it rotates
   instead of taking the global trailing-arrow slide. The .btn.rb-more prefix
   is what outranks `.btn:hover svg:last-child`. */
.btn.rb-more .rb-more-chevron {
  transition: transform var(--duration-link) var(--ease-editorial);
}

.btn.rb-more:hover .rb-more-chevron {
  transform: none;
}

.btn.rb-more .rb-more-chevron--up,
.btn.rb-more:hover .rb-more-chevron--up {
  transform: rotate(180deg);
}

/* A row, not a card — one hairline between entries and nothing nested. */
.rb-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  padding: 0.85rem 0.75rem;
  border-bottom: 1px solid var(--border-subtle);
  border-radius: var(--rad);
  color: var(--text);
  text-decoration: none;
  transition:
    background-color var(--duration-card) var(--ease-editorial),
    color var(--duration-card) var(--ease-editorial);
}

.rb-item:hover {
  background: var(--color-card);
  color: #fff;
}

.rb-item:focus-visible {
  outline: 2px solid var(--color-gold);
  outline-offset: 2px;
}

.rb-item-main {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  min-width: 0;
}

.rb-item-title {
  font-size: 0.9rem;
  line-height: 1.45;
}

.rb-item-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.rb-item-type,
.rb-item-badge {
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.rb-item-type {
  color: var(--text3);
}

.rb-item-badge {
  color: var(--accent);
  border: 1px solid var(--border-subtle);
  border-radius: 99px;
  padding: 0.1rem 0.5rem;
}

.rb-item-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  flex: none;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  color: var(--accent);
}

.rb-item-cta svg {
  transition: transform var(--duration-link) var(--ease-editorial);
}

.rb-item:hover .rb-item-cta svg {
  transform: translateX(4px);
}

/* ── Empty states ─────────────────────────────────────────────────── */
.rb-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  min-height: 320px;
  color: var(--text3);
  text-align: center;
  font-size: 0.92rem;
  line-height: 1.7;
}

.rb-empty span {
  max-width: 34rem;
}

.rb-empty--start {
  min-height: 200px;
}

/* ── Responsive ───────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .rb-search {
    margin-bottom: 2.5rem;
  }

  .rb-block + .rb-block {
    margin-top: 2.25rem;
    padding-top: 2.25rem;
  }

  .rb-subject-grid {
    grid-template-columns: 1fr;
  }

  /* Stacked, not a scroller: three level chips and four type chips wrap into
     two tidy rows at 375px, so a horizontal scroller would hide controls for
     no gain. */
  .rb-chips {
    gap: 0.5rem;
  }

  .rb-item {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.6rem;
    padding: 0.9rem 0.5rem;
  }

  .rb-item-cta {
    font-size: 0.75rem;
  }

  .rb-results,
  .rb-empty {
    min-height: 240px;
  }
}
</style>
