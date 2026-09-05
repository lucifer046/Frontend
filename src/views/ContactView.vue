<template>
  <div>
    <PageHero
      compact
      bg-image="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&q=80&auto=format&fit=crop"
      breadcrumb-title="Contact"
      title="Get in"
      accent-title="Touch"
      subtitle="Have a question about Sundarbans House? Reach out directly to the team responsible for your query."
    />

    <!-- ══ UHC CONTACT DESK ══════════════════════════════════════════
         Three offices, as a short list of rows rather than three profile
         cards — this is a directory entry, not a introduction. -->
    <section class="ct-section tone-b rs" aria-labelledby="uhc-desk-heading">
      <div class="container container--measure">
        <header class="ct-hdr">
          <p class="section-tag">House leadership</p>
          <h2 id="uhc-desk-heading" class="section-title-xl">
            UHC <span class="tg">contact desk</span>
          </h2>
          <p class="ct-sub">
            Questions about the House as a whole — events, partnerships, the site — go to the office
            that owns them.
          </p>
        </header>

        <ul class="ct-desk">
          <li v-for="office in leadership" :key="office.id">
            <a
              class="ct-row"
              :class="{ 'ct-row--lead': office.lead }"
              :href="`mailto:${office.email}`"
            >
              <span class="ct-row-mark" aria-hidden="true">
                <Mail :size="18" :stroke-width="1.7" />
              </span>

              <span class="ct-row-main">
                <span class="ct-row-post">{{ office.role }}</span>
                <span class="ct-row-name">{{ office.name }}</span>
                <span class="ct-row-mail">{{ office.email }}</span>
              </span>

              <span class="ct-row-cta">
                Email
                <ArrowRight :size="15" :stroke-width="2" aria-hidden="true" />
              </span>
            </a>
          </li>
        </ul>
      </div>
    </section>

    <!-- ══ REGIONAL CONTACTS ═════════════════════════════════════════
         The coordinators, by region. Ordered by region name, so a reader
         scans down the left edge to find their own city. -->
    <section class="ct-section tone-a rs" aria-labelledby="regional-heading">
      <div class="container container--measure">
        <header class="ct-hdr">
          <p class="section-tag">Regional contacts</p>
          <h2 id="regional-heading" class="section-title-xl">
            Your <span class="tg">coordinator</span>
          </h2>
          <p class="ct-sub">
            Anything local — meetups, your chapter, getting involved where you are — reaches your
            region faster than it reaches the House.
          </p>
        </header>

        <ul class="ct-directory">
          <li v-for="rc in coordinators" :key="rc.id">
            <a class="ct-row ct-row--compact" :href="`mailto:${rc.email}`">
              <span class="ct-row-region">{{ rc.region }}</span>

              <span class="ct-row-main">
                <span class="ct-row-name">{{ rc.name }}</span>
                <span class="ct-row-post ct-row-post--after">{{ rc.role }}</span>
                <span class="ct-row-mail">{{ rc.email }}</span>
              </span>

              <span class="ct-row-cta">
                Email
                <ArrowRight :size="15" :stroke-width="2" aria-hidden="true" />
              </span>
            </a>
          </li>
        </ul>
      </div>
    </section>

    <!-- ══ COMMUNITY CHANNELS ════════════════════════════════════════ -->
    <section class="ct-section ct-section--social tone-b rs" aria-labelledby="social-heading">
      <div class="container container--measure">
        <header class="ct-hdr">
          <p class="section-tag">Elsewhere</p>
          <h2 id="social-heading" class="ct-social-title">Follow the House</h2>
        </header>

        <ul class="ct-social">
          <li v-for="channel in socials" :key="channel.label">
            <a :href="channel.href" target="_blank" rel="noopener noreferrer">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                width="16"
                height="16"
                aria-hidden="true"
              >
                <path :d="channel.path" />
              </svg>
              <span class="ct-social-label">{{ channel.label }}</span>
              <span class="ct-social-handle">{{ channel.handle }}</span>
            </a>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Mail, ArrowRight } from 'lucide-vue-next';
import PageHero from '../components/PageHero.vue';
import { useScrollReveal } from '../composables/useAnimations.js';
import { upperHouse, lowerHouse, sortByRegion, SOCIAL_ICONS } from '../data/council.js';

useScrollReveal();

/**
 * Both lists come from the council roster the Teams page renders, so an
 * address is corrected in one file and both pages follow. The desk keeps the
 * roster's authored order — Secretary first — because that is the order a
 * reader should try the offices in.
 */
const leadership = upperHouse;

/** Ordered by region, never by name; Mumbai's two coordinators both appear. */
const coordinators = computed(() => sortByRegion(lowerHouse));

/* The same three channels and marks the footer carries. */
const socials = [
  {
    label: 'LinkedIn',
    handle: 'sundarbans-iitm',
    href: 'https://www.linkedin.com/company/sundarbans-iitm/',
    path: SOCIAL_ICONS.LinkedIn,
  },
  {
    label: 'Instagram',
    handle: '@sundarbansiitm',
    href: 'https://www.instagram.com/sundarbansiitm/',
    path: SOCIAL_ICONS.Instagram,
  },
  {
    label: 'YouTube',
    handle: '@sundarbansiitm',
    href: 'https://www.youtube.com/@sundarbansiitm',
    path: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  },
];
</script>

<style scoped>
/* ═══ SECTIONS ══════════════════════════════════════════════════════ */
.ct-section {
  padding: clamp(3.5rem, 6vw, 5.5rem) 0;
}

.ct-section--social {
  padding-bottom: clamp(4.5rem, 7vw, 6.5rem);
}

.ct-hdr {
  margin-bottom: clamp(2rem, 3.5vw, 2.75rem);
}

.ct-hdr .section-tag {
  margin-bottom: 0.9rem;
}

.ct-hdr .section-title-xl {
  margin-bottom: 0;
}

.ct-sub {
  margin-top: 1rem;
  font-size: 0.94rem;
  line-height: 1.75;
  color: var(--color-cream-muted);
  max-width: 52ch;
}

.ct-desk,
.ct-directory,
.ct-social {
  margin: 0;
  padding: 0;
  list-style: none;
}

/* ═══ CONTACT ROW ═══════════════════════════════════════════════════
   One rule for both lists. A row, not a card: a hairline between entries,
   the whole row is the mailto target, and the only decoration is the mark
   on the left and the action on the right. */
.ct-row {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: clamp(0.9rem, 2vw, 1.5rem);
  padding: clamp(1rem, 2vw, 1.35rem) clamp(0.75rem, 1.5vw, 1.15rem);
  border: 1px solid transparent;
  border-bottom-color: var(--border-subtle);
  border-radius: var(--rad);
  text-decoration: none;
  transition:
    background-color var(--duration-card) var(--ease-editorial),
    border-color var(--duration-card) var(--ease-editorial),
    transform var(--duration-card) var(--ease-editorial);
}

.ct-desk li:last-child .ct-row,
.ct-directory li:last-child .ct-row {
  border-bottom-color: transparent;
}

.ct-row:hover,
.ct-row:focus-visible {
  background: var(--color-card);
  border-color: var(--border-card);
  transform: translateX(3px);
}

.ct-row:focus-visible {
  outline: 2px solid var(--color-gold);
  outline-offset: 2px;
}

/* The Secretary's row is the one to try first: a gold edge on the leading
   side, and nothing else — the three rows stay the same shape. */
.ct-row--lead {
  border-left-color: var(--color-gold-muted);
  border-left-width: 2px;
}

.ct-row-mark {
  display: inline-flex;
  flex: none;
  color: var(--color-gold-muted);
  transition: color var(--duration-card) var(--ease-editorial);
}

.ct-row:hover .ct-row-mark {
  color: var(--color-gold);
}

.ct-row-main {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
}

.ct-row-post {
  font-size: 0.66rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-gold-muted);
}

.ct-row--lead .ct-row-post {
  color: var(--color-gold);
}

/* On a coordinator row the office is the same for everyone, so it reads
   under the name as a quiet qualifier rather than over it as a heading. */
.ct-row-post--after {
  order: 2;
  color: var(--color-cream-faint);
  letter-spacing: 0.14em;
}

.ct-row-name {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 700;
  line-height: 1.25;
  color: var(--color-cream);
}

.ct-row--lead .ct-row-name {
  font-size: 1.3rem;
}

.ct-row-mail {
  order: 3;
  margin-top: 0.15rem;
  font-size: 0.82rem;
  color: var(--color-cream-muted);
  overflow-wrap: anywhere;
}

/* The region is the scanning column of the directory — fixed width so the
   names line up down the page. */
.ct-row-region {
  flex: none;
  width: 7.5rem;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-gold-muted);
}

.ct-row-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  flex: none;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-cream-muted);
  transition:
    color var(--duration-link) var(--ease-editorial),
    transform var(--duration-link) var(--ease-editorial);
}

.ct-row:hover .ct-row-cta {
  color: var(--color-gold);
}

.ct-row:hover .ct-row-cta svg {
  transform: translateX(3px);
}

.ct-row-cta svg {
  transition: transform var(--duration-link) var(--ease-editorial);
}

/* ═══ SOCIAL ════════════════════════════════════════════════════════
   The footer's Connect treatment: the mark is the bullet on a text link,
   no card and no fill. */
.ct-social-title {
  font-family: var(--font-display);
  font-size: clamp(1.35rem, 2.4vw, 1.75rem);
  font-weight: 700;
  color: var(--color-cream);
}

.ct-social {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem clamp(2rem, 5vw, 3.5rem);
}

.ct-social a {
  display: inline-flex;
  align-items: baseline;
  gap: 0.55rem;
  color: var(--color-cream-muted);
  text-decoration: none;
  transition:
    color var(--duration-link) var(--ease-editorial),
    transform var(--duration-link) var(--ease-editorial);
}

.ct-social svg {
  align-self: center;
  flex: none;
  opacity: 0.75;
  transition: opacity var(--duration-link) var(--ease-editorial);
}

.ct-social a:hover {
  color: var(--color-gold);
  transform: translateX(3px);
}

.ct-social a:hover svg {
  opacity: 1;
}

.ct-social a:focus-visible {
  outline: 2px solid var(--color-gold);
  outline-offset: 3px;
  border-radius: 3px;
}

.ct-social-label {
  font-weight: 500;
  color: var(--color-cream);
}

.ct-social-handle {
  font-size: 0.82rem;
  color: var(--color-cream-faint);
}

/* ═══ NARROW ════════════════════════════════════════════════════════
   The row folds rather than shrinks: the action drops under the details,
   and the region becomes a label above the name instead of a column. */
@media (max-width: 640px) {
  .ct-row {
    grid-template-columns: auto minmax(0, 1fr);
    row-gap: 0.75rem;
  }

  .ct-row-cta {
    grid-column: 2;
  }

  .ct-row-region {
    width: auto;
    grid-column: 1 / -1;
  }

  .ct-row--compact {
    grid-template-columns: minmax(0, 1fr);
  }

  .ct-row--compact .ct-row-cta {
    grid-column: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ct-row:hover,
  .ct-row:focus-visible,
  .ct-row:hover .ct-row-cta svg,
  .ct-social a:hover {
    transform: none;
  }
}
</style>
